-- Canonical profile layer for authenticated users
-- Links profiles to auth.users, auto-syncs on auth user creation,
-- and tightens RLS/policies for safer and more efficient user modeling.

-- 1) Ensure required structure on public.profiles
alter table public.profiles
  alter column id set not null;

-- Keep id aligned with auth.users lifecycle
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_id_fkey'
  ) then
    alter table public.profiles
      add constraint profiles_id_fkey
      foreign key (id) references auth.users(id) on delete cascade;
  end if;
end $$;

alter table public.profiles
  add column if not exists full_name text,
  add column if not exists avatar_url text,
  add column if not exists role text not null default 'user' check (role in ('user', 'admin', 'super_admin')),
  add column if not exists updated_at timestamptz not null default now();

-- Backfill email and full_name from auth.users where possible
update public.profiles p
set
  email = coalesce(p.email, u.email),
  full_name = coalesce(
    p.full_name,
    p.name,
    u.raw_user_meta_data ->> 'full_name',
    u.raw_user_meta_data ->> 'name'
  ),
  avatar_url = coalesce(p.avatar_url, u.raw_user_meta_data ->> 'avatar_url')
from auth.users u
where p.id = u.id;

-- Backfill missing profiles for existing auth users
insert into public.profiles (id, email, name, full_name, avatar_url)
select
  u.id,
  u.email,
  coalesce(u.raw_user_meta_data ->> 'name', split_part(u.email, '@', 1)),
  coalesce(
    u.raw_user_meta_data ->> 'full_name',
    u.raw_user_meta_data ->> 'name',
    split_part(u.email, '@', 1)
  ),
  u.raw_user_meta_data ->> 'avatar_url'
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;

-- Ensure email uniqueness/index for fast joins/lookups
create unique index if not exists profiles_email_unique_idx on public.profiles (lower(email));

-- Keep updated_at maintained
create or replace function public.set_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_profiles_updated_at();

-- 2) Auto-create/update profile whenever auth.users changes
create or replace function public.handle_auth_user_profile_sync()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(new.email, '@', 1)
    ),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do update set
    email = excluded.email,
    name = coalesce(excluded.name, public.profiles.name),
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url),
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile_sync on auth.users;
create trigger on_auth_user_created_profile_sync
after insert or update on auth.users
for each row
execute function public.handle_auth_user_profile_sync();

-- 3) Tighten and normalize policies for profiles
alter table public.profiles enable row level security;

drop policy if exists "Allow insert for all" on public.profiles;

create policy "Users can read own profile"
on public.profiles
as permissive
for select
to authenticated
using (auth.uid() = id);

create policy "Users can update own profile"
on public.profiles
as permissive
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Users can insert own profile"
on public.profiles
as permissive
for insert
to authenticated
with check (auth.uid() = id);

-- If admin helper exists (added in admin RBAC migration), allow admin reads.
do $$
begin
  if exists (
    select 1
    from pg_proc
    where proname = 'is_admin'
      and pg_function_is_visible(oid)
  ) then
    execute $p$
      create policy "Admin can read all profiles"
      on public.profiles
      as permissive
      for select
      to authenticated
      using (public.is_admin())
    $p$;
  end if;
exception
  when duplicate_object then
    null;
end $$;

-- 4) Optional efficiency indexes for user-linked workflow tables
create index if not exists idx_event_referrals_user_id on public.event_referrals(user_id);
create index if not exists idx_account_deletion_requests_user_id on public.account_deletion_requests(user_id);
create index if not exists idx_community_registrations_verified_by on public.community_registrations(verified_by);
create index if not exists idx_account_deletion_requests_processed_by on public.account_deletion_requests(processed_by);

