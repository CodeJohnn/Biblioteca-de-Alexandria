-- BIBLIOTECA DE ALEXANDRIA — configuração inicial do Supabase
-- Execute no SQL Editor do seu projeto Supabase.
-- Este script cria tabelas, políticas de segurança e bucket para capas.

create extension if not exists pgcrypto;

create table if not exists public.alexandria_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.alexandria_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (char_length(name) between 1 and 60),
  description text check (description is null or char_length(description) <= 250),
  created_at timestamptz not null default now()
);

create table if not exists public.alexandria_links (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 120),
  url text not null check (url ~ '^https?://'),
  description text check (description is null or char_length(description) <= 1000),
  image_url text,
  category_id uuid references public.alexandria_categories(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.alexandria_admins enable row level security;
alter table public.alexandria_categories enable row level security;
alter table public.alexandria_links enable row level security;

-- Função SECURITY DEFINER evita recursão de políticas ao consultar a tabela de admins.
create or replace function public.is_alexandria_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.alexandria_admins
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_alexandria_admin() from public;
grant execute on function public.is_alexandria_admin() to anon, authenticated;

-- Visitantes podem ler conteúdo publicado; apenas administradores alteram.
grant select on public.alexandria_categories, public.alexandria_links to anon, authenticated;
grant insert, update, delete on public.alexandria_categories, public.alexandria_links to authenticated;

drop policy if exists "Public can read categories" on public.alexandria_categories;
create policy "Public can read categories"
on public.alexandria_categories for select
to anon, authenticated using (true);

drop policy if exists "Admins can insert categories" on public.alexandria_categories;
create policy "Admins can insert categories"
on public.alexandria_categories for insert to authenticated
with check ((select public.is_alexandria_admin()));

drop policy if exists "Admins can update categories" on public.alexandria_categories;
create policy "Admins can update categories"
on public.alexandria_categories for update to authenticated
using ((select public.is_alexandria_admin()))
with check ((select public.is_alexandria_admin()));

drop policy if exists "Admins can delete categories" on public.alexandria_categories;
create policy "Admins can delete categories"
on public.alexandria_categories for delete to authenticated
using ((select public.is_alexandria_admin()));

drop policy if exists "Public can read links" on public.alexandria_links;
create policy "Public can read links"
on public.alexandria_links for select
to anon, authenticated using (true);

drop policy if exists "Admins can insert links" on public.alexandria_links;
create policy "Admins can insert links"
on public.alexandria_links for insert to authenticated
with check ((select public.is_alexandria_admin()));

drop policy if exists "Admins can update links" on public.alexandria_links;
create policy "Admins can update links"
on public.alexandria_links for update to authenticated
using ((select public.is_alexandria_admin()))
with check ((select public.is_alexandria_admin()));

drop policy if exists "Admins can delete links" on public.alexandria_links;
create policy "Admins can delete links"
on public.alexandria_links for delete to authenticated
using ((select public.is_alexandria_admin()));

-- Bucket público para exibir capas no site; somente administradores podem enviar/remover.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('alexandria-assets', 'alexandria-assets', true, 5242880,
        array['image/png','image/jpeg','image/webp','image/gif'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view Alexandria images" on storage.objects;
create policy "Public can view Alexandria images"
on storage.objects for select
to anon, authenticated using (bucket_id = 'alexandria-assets');

drop policy if exists "Admins can upload Alexandria images" on storage.objects;
create policy "Admins can upload Alexandria images"
on storage.objects for insert
to authenticated with check (
  bucket_id = 'alexandria-assets'
  and (select public.is_alexandria_admin())
);

drop policy if exists "Admins can update Alexandria images" on storage.objects;
create policy "Admins can update Alexandria images"
on storage.objects for update
to authenticated using (
  bucket_id = 'alexandria-assets'
  and (select public.is_alexandria_admin())
) with check (
  bucket_id = 'alexandria-assets'
  and (select public.is_alexandria_admin())
);

drop policy if exists "Admins can delete Alexandria images" on storage.objects;
create policy "Admins can delete Alexandria images"
on storage.objects for delete
to authenticated using (
  bucket_id = 'alexandria-assets'
  and (select public.is_alexandria_admin())
);

-- PRÓXIMOS PASSOS (não execute até substituir o e-mail):
-- 1. Crie sua conta em Authentication → Users → Add user.
-- 2. Copie o UUID dessa conta.
-- 3. Autorize somente essa conta executando:
-- insert into public.alexandria_admins (user_id)
-- values ('COLE-AQUI-O-UUID-DO-USUARIO');
