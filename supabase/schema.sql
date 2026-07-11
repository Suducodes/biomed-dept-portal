-- ============================================================================
-- Biomedical Department Portal — database schema
-- Run once in the Supabase SQL editor (Project -> SQL -> New query).
-- Model: everything is PUBLIC-READABLE; only signed-in admins can write.
-- ============================================================================

-- ---- Admin allow-list ------------------------------------------------------
-- A row here grants a Supabase Auth user write access. Add your account after
-- signing up once (see seed.sql for how).
create table if not exists public.admins (
  id           uuid primary key references auth.users (id) on delete cascade,
  email        text,
  display_name text,
  created_at   timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where id = auth.uid());
$$;

-- ---- Content tables --------------------------------------------------------
create table if not exists public.notices (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  body           text not null default '',
  category       text not null default 'academic'
                   check (category in ('academic','circular','placement','internship','workshop')),
  attachment_url text,
  is_pinned      boolean not null default false,
  published_at   timestamptz not null default now(),
  created_at     timestamptz not null default now()
);

create table if not exists public.announcements (
  id           uuid primary key default gen_random_uuid(),
  message      text not null,
  severity     text not null default 'info'
                 check (severity in ('info','important','emergency')),
  active       boolean not null default true,
  published_at timestamptz not null default now()
);

create table if not exists public.events (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text not null default '',
  type        text not null default 'workshop'
                check (type in ('symposium','workshop','guest_lecture','conference','competition')),
  event_date  timestamptz not null,
  venue       text,
  poster_url  text
);

create table if not exists public.achievements (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text not null default '',
  type        text not null default 'student'
                check (type in ('student','faculty','placement','award','project')),
  image_url   text,
  date        timestamptz not null default now()
);

create table if not exists public.calendar_events (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  date        timestamptz not null,
  type        text not null default 'academic'
                check (type in ('holiday','internal_exam','academic','college')),
  description text
);

create table if not exists public.downloads (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  category    text not null default 'circular'
                check (category in ('circular','timetable','syllabus','notes','lab_manual','form')),
  file_url    text not null,
  uploaded_at timestamptz not null default now()
);

create table if not exists public.gallery_items (
  id        uuid primary key default gen_random_uuid(),
  title     text not null,
  media_url text not null,
  type      text not null default 'photo' check (type in ('photo','video')),
  event_id  uuid references public.events (id) on delete set null
);

-- ---- Row Level Security ----------------------------------------------------
-- Enable RLS + attach a public-read / admin-write policy pair to each table.
do $$
declare t text;
begin
  foreach t in array array[
    'notices','announcements','events','achievements',
    'calendar_events','downloads','gallery_items'
  ]
  loop
    execute format('alter table public.%I enable row level security;', t);

    execute format('drop policy if exists %I on public.%I;', t||'_read', t);
    execute format(
      'create policy %I on public.%I for select using (true);', t||'_read', t);

    execute format('drop policy if exists %I on public.%I;', t||'_write', t);
    execute format(
      'create policy %I on public.%I for all
         using (public.is_admin()) with check (public.is_admin());',
      t||'_write', t);
  end loop;
end $$;

-- admins table: a user may read their own row (to check admin status); no
-- self-service inserts (add admins manually via seed.sql / dashboard).
alter table public.admins enable row level security;
drop policy if exists admins_self_read on public.admins;
create policy admins_self_read on public.admins
  for select using (id = auth.uid());

-- ---- Storage buckets -------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('posters','posters',true),
       ('attachments','attachments',true),
       ('gallery','gallery',true)
on conflict (id) do nothing;

-- Public read for the three buckets; admin-only writes.
drop policy if exists storage_public_read on storage.objects;
create policy storage_public_read on storage.objects
  for select using (bucket_id in ('posters','attachments','gallery'));

drop policy if exists storage_admin_write on storage.objects;
create policy storage_admin_write on storage.objects
  for all
  using (bucket_id in ('posters','attachments','gallery') and public.is_admin())
  with check (bucket_id in ('posters','attachments','gallery') and public.is_admin());
