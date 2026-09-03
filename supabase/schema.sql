-- Execute este arquivo no SQL Editor de um projeto novo do Supabase.
create extension if not exists pgcrypto;

create sequence if not exists public.catalog_product_code_seq start 1;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  code text not null unique default ('RRL-' || lpad(nextval('public.catalog_product_code_seq')::text, 3, '0')),
  name text not null check (char_length(name) between 2 and 120),
  description text not null default '',
  category text not null default 'Outros',
  price numeric(10,2) check (price is null or price >= 0),
  status text not null default 'Disponível sob encomenda',
  stock integer check (stock is null or stock >= 0),
  image_url text not null,
  active boolean not null default true,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;
alter table public.admin_users enable row level security;

grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;
grant usage, select on sequence public.catalog_product_code_seq to authenticated;

create or replace function public.is_catalog_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(select 1 from public.admin_users where user_id = auth.uid());
$$;

revoke all on function public.is_catalog_admin() from public;
grant execute on function public.is_catalog_admin() to anon, authenticated;

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products" on public.products for select using (active or public.is_catalog_admin());
drop policy if exists "Admins can create products" on public.products;
create policy "Admins can create products" on public.products for insert to authenticated with check (public.is_catalog_admin());
drop policy if exists "Admins can update products" on public.products;
create policy "Admins can update products" on public.products for update to authenticated using (public.is_catalog_admin()) with check (public.is_catalog_admin());
drop policy if exists "Admins can delete products" on public.products;
create policy "Admins can delete products" on public.products for delete to authenticated using (public.is_catalog_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 5242880, array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view product images" on storage.objects;
create policy "Public can view product images" on storage.objects for select using (bucket_id = 'product-images');
drop policy if exists "Admins can upload product images" on storage.objects;
create policy "Admins can upload product images" on storage.objects for insert to authenticated with check (bucket_id = 'product-images' and public.is_catalog_admin());
drop policy if exists "Admins can update product images" on storage.objects;
create policy "Admins can update product images" on storage.objects for update to authenticated using (bucket_id = 'product-images' and public.is_catalog_admin());
drop policy if exists "Admins can delete product images" on storage.objects;
create policy "Admins can delete product images" on storage.objects for delete to authenticated using (bucket_id = 'product-images' and public.is_catalog_admin());

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at before update on public.products for each row execute function public.set_updated_at();

-- Depois de criar o usuário em Authentication > Users, torne-o administrador:
-- insert into public.admin_users (user_id) values ('UUID-DO-USUARIO');
