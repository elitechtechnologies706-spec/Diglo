-- Diglo Ventures public quote submissions.
-- Run in the Supabase SQL Editor. Anonymous users can create a "New" quote,
-- but only the server-side service key can read or update quote rows.
create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  phone text not null,
  country text not null,
  currency text not null check (currency in ('UGX', 'KSH', 'USD')),
  service text not null,
  quantity integer not null check (quantity > 0),
  total_text text not null,
  status text not null default 'New' check (status in ('New', 'Done')),
  created_at timestamptz not null default now()
);

create index if not exists quotes_created_at_desc_idx
  on public.quotes (created_at desc);

alter table public.quotes enable row level security;

drop policy if exists quotes_anon_create_new on public.quotes;
create policy quotes_anon_create_new
  on public.quotes
  for insert
  to anon, authenticated
  with check (status = 'New');

grant insert on table public.quotes to anon, authenticated;
grant select, update on table public.quotes to service_role;
