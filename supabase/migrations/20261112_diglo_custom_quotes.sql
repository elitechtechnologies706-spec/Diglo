-- Adds the current quote form fields without deleting any existing quote data.
create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  phone text not null,
  product text not null,
  category text,
  service text,
  quantity integer not null check (quantity > 0),
  branding_details text,
  delivery_area text,
  message text,
  status text not null default 'New' check (status in ('New', 'Done')),
  created_at timestamptz not null default now()
);

alter table public.quotes add column if not exists product text;
alter table public.quotes add column if not exists category text;
alter table public.quotes add column if not exists service text;
alter table public.quotes add column if not exists branding_details text;
alter table public.quotes add column if not exists delivery_area text;
alter table public.quotes add column if not exists message text;
create index if not exists quotes_created_at_desc_idx on public.quotes (created_at desc);

-- Older quote drafts required fields the current form no longer collects.
do $$
begin
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'quotes' and column_name = 'country') then
    alter table public.quotes alter column country drop not null;
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'quotes' and column_name = 'currency') then
    alter table public.quotes alter column currency drop not null;
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'quotes' and column_name = 'total_text') then
    alter table public.quotes alter column total_text drop not null;
  end if;
end
$$;

alter table public.quotes enable row level security;
drop policy if exists quotes_anon_create_new on public.quotes;
create policy quotes_anon_create_new
  on public.quotes
  for insert
  to anon, authenticated
  with check (status = 'New');

grant insert on table public.quotes to anon, authenticated;
grant select, update on table public.quotes to service_role;
