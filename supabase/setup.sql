-- Run once in YOUR Supabase project's SQL Editor. This is not a Replit DB migration.
-- No service-role key belongs in browser code. Only the publishable/anon key is used.
begin;
create table if not exists public.diglo_leads (
  id uuid primary key,
  ref text not null unique check (ref ~ '^DG-[A-Z0-9]{4}$'),
  name text not null check (char_length(name) between 2 and 120),
  phone text not null check (phone ~ '^\+256[1-9][0-9]{8}$'),
  service text not null check (char_length(service) between 1 and 120),
  quantity integer not null check (quantity between 1 and 1000000),
  message text not null default '' check (char_length(message) <= 5000),
  status text not null default 'New' check (status in ('New','Contacted','Quoted','Paid','Delivered')),
  created_at timestamptz not null default now()
);
create table if not exists public.diglo_orders (
  id uuid primary key default gen_random_uuid(),
  ref text not null unique references public.diglo_leads(ref),
  phone text not null check (phone ~ '^\+256[1-9][0-9]{8}$'),
  service text not null,
  status text not null default 'New' check (status in ('New','Contacted','Quoted','Paid','Delivered')),
  stage text not null default 'Received' check (stage in ('Received','Designing','Awaiting Approval','Printing','Ready','Delivered')),
  updated_at timestamptz not null default now()
);
create index if not exists diglo_orders_phone_idx on public.diglo_orders(phone);
alter table public.diglo_leads enable row level security;
alter table public.diglo_orders enable row level security;
revoke all on public.diglo_leads, public.diglo_orders from anon, authenticated;
grant select, insert, update on public.diglo_leads, public.diglo_orders to authenticated;

-- Admin role lives in server-controlled app_metadata, NEVER user_metadata.
drop policy if exists diglo_leads_admin on public.diglo_leads;
create policy diglo_leads_admin on public.diglo_leads for all to authenticated
using ((select auth.jwt()->'app_metadata'->>'role') = 'admin')
with check ((select auth.jwt()->'app_metadata'->>'role') = 'admin');
drop policy if exists diglo_orders_admin on public.diglo_orders;
create policy diglo_orders_admin on public.diglo_orders for all to authenticated
using ((select auth.jwt()->'app_metadata'->>'role') = 'admin')
with check ((select auth.jwt()->'app_metadata'->>'role') = 'admin');

create or replace function public.diglo_submit_lead(
  p_id uuid, p_ref text, p_name text, p_phone text,
  p_service text, p_quantity integer, p_message text
) returns text language plpgsql security definer set search_path = '' as $$
declare
  existing_ref text;
  candidate text := p_ref;
  attempt integer;
begin
  -- An unpredictable UUID is the idempotency key for offline retries.
  select ref into existing_ref from public.diglo_leads where id = p_id;
  if existing_ref is not null then return existing_ref; end if;
  if p_ref !~ '^DG-[A-Z0-9]{4}$' then raise exception 'Invalid reference'; end if;
  if p_name is null or p_phone is null or p_service is null or p_quantity is null then
    raise exception 'Required fields missing';
  end if;
  for attempt in 1..10 loop
    begin
      insert into public.diglo_leads(id,ref,name,phone,service,quantity,message)
      values(p_id,candidate,btrim(p_name),p_phone,btrim(p_service),p_quantity,coalesce(p_message,''));
      return candidate;
    exception when unique_violation then
      select ref into existing_ref from public.diglo_leads where id = p_id;
      if existing_ref is not null then return existing_ref; end if;
      candidate := 'DG-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,4));
    end;
  end loop;
  raise exception 'Could not allocate a reference. Please retry.';
end;
$$;

-- Public tracking returns NO customer names, phone numbers, messages or payment data.
-- It only exposes the progress of an exact reference or phone match.
create or replace function public.diglo_track_orders(p_query text)
returns table(ref text, service text, stage text, updated_at timestamptz)
language sql security definer stable set search_path = '' as $$
  select o.ref,o.service,o.stage,o.updated_at
  from public.diglo_orders o
  where
    (p_query ~ '^DG-[A-Z0-9]{4}$' and o.ref = p_query)
    or (p_query ~ '^\+256[1-9][0-9]{8}$' and o.phone = p_query)
  order by o.updated_at desc limit 20;
$$;
revoke all on function public.diglo_submit_lead(uuid,text,text,text,text,integer,text) from public;
revoke all on function public.diglo_track_orders(text) from public;
grant execute on function public.diglo_submit_lead(uuid,text,text,text,text,integer,text) to anon, authenticated;
grant execute on function public.diglo_track_orders(text) to anon, authenticated;
commit;
