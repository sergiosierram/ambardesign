-- Ambar Design — Supabase schema
-- Run this in the Supabase SQL editor after creating your project.

-- profiles (extends auth.users)
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text not null default '',
  role        text not null default 'customer' check (role in ('customer', 'admin')),
  created_at  timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "Users read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Admins read all profiles" on public.profiles for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- trigger: auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)));
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- products
create table if not exists public.products (
  id           text primary key,
  name         text not null,
  category     text not null,
  price        numeric(10,2) not null,
  stock        integer not null default 0,
  tags         text[] default '{}',
  description  text,
  materials    text,
  palette_name text,
  palette      jsonb,
  pattern      jsonb,
  created_at   timestamptz default now()
);
alter table public.products enable row level security;
create policy "Anyone reads products" on public.products for select using (true);
create policy "Admins manage products" on public.products for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- orders
create table if not exists public.orders (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete set null,
  status      text not null default 'pending' check (status in ('pending','paid','packed','shipped','delivered','cancelled')),
  total       numeric(10,2) not null,
  created_at  timestamptz default now()
);
alter table public.orders enable row level security;
create policy "Users read own orders" on public.orders for select using (auth.uid() = user_id);
create policy "Users create orders" on public.orders for insert with check (auth.uid() = user_id);
create policy "Admins manage orders" on public.orders for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- order_items
create table if not exists public.order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid references public.orders(id) on delete cascade,
  product_id  text references public.products(id),
  qty         integer not null,
  unit_price  numeric(10,2) not null
);
alter table public.order_items enable row level security;
create policy "Users read own order items" on public.order_items for select using (
  exists (select 1 from public.orders where id = order_id and user_id = auth.uid())
);
create policy "Users create order items" on public.order_items for insert with check (
  exists (select 1 from public.orders where id = order_id and user_id = auth.uid())
);
create policy "Admins manage order items" on public.order_items for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- custom_requests
create table if not exists public.custom_requests (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete set null,
  shape         text not null,
  size_id       text not null,
  type          text not null,
  pattern_data  jsonb,
  palette       jsonb,
  est_low       numeric(10,2),
  est_high      numeric(10,2),
  notes         text,
  status        text not null default 'review' check (status in ('review','quoted','in-progress','shipped','cancelled')),
  created_at    timestamptz default now()
);
alter table public.custom_requests enable row level security;
create policy "Users read own requests" on public.custom_requests for select using (auth.uid() = user_id);
create policy "Users create requests" on public.custom_requests for insert with check (auth.uid() = user_id);
create policy "Admins manage requests" on public.custom_requests for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
