-- Profile type + super admin governance

-- 1) Add profile_type and strict constraint
alter table public.profiles
  add column if not exists profile_type text not null default 'founder';

alter table public.profiles
  drop constraint if exists profiles_profile_type_check;

alter table public.profiles
  add constraint profiles_profile_type_check
  check (profile_type in ('founder', 'investor', 'mentor', 'member', 'admin', 'super_admin'));

-- 2) Keep role and profile_type aligned for admin classes
create or replace function public.enforce_profile_admin_coherence()
returns trigger
language plpgsql
as $$
declare
  v_email text;
  v_is_allowlisted_admin boolean;
begin
  v_email := lower(coalesce(new.email, ''));
  select exists (
    select 1 from public.admin_allowlist a
    where lower(a.email) = v_email
  ) into v_is_allowlisted_admin;

  -- Prevent setting admin/super_admin profile types unless allowlisted
  if new.profile_type in ('admin', 'super_admin') and not v_is_allowlisted_admin then
    raise exception 'profile_type % requires admin_allowlist entry for email %', new.profile_type, new.email;
  end if;

  -- Keep role coherent with profile_type
  if new.profile_type in ('admin', 'super_admin') then
    new.role := new.profile_type;
  elsif new.role in ('admin', 'super_admin') then
    new.role := 'user';
  end if;

  return new;
end;
$$;

drop trigger if exists profiles_enforce_admin_coherence on public.profiles;
create trigger profiles_enforce_admin_coherence
before insert or update on public.profiles
for each row
execute function public.enforce_profile_admin_coherence();

-- 3) Seed requested super admin
insert into public.admin_allowlist (email, role)
values ('abhijeet@ments.app', 'super_admin')
on conflict (email) do update set role = excluded.role;

update public.profiles
set profile_type = 'super_admin',
    role = 'super_admin',
    updated_at = now()
where lower(email) = 'abhijeet@ments.app';

-- 4) Extend auth->profile sync to capture profile_type at signup
create or replace function public.handle_auth_user_profile_sync()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text;
  v_allowlist_role text;
  v_profile_type text;
begin
  v_email := lower(new.email);

  select a.role into v_allowlist_role
  from public.admin_allowlist a
  where lower(a.email) = v_email
  limit 1;

  v_profile_type := coalesce(
    nullif(new.raw_user_meta_data ->> 'profile_type', ''),
    nullif(new.raw_user_meta_data ->> 'profileType', ''),
    'founder'
  );

  if v_profile_type not in ('founder', 'investor', 'mentor', 'member') then
    v_profile_type := 'founder';
  end if;

  if v_allowlist_role in ('admin', 'super_admin') then
    v_profile_type := v_allowlist_role;
  end if;

  insert into public.profiles (id, email, name, full_name, avatar_url, profile_type, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(new.email, '@', 1)
    ),
    new.raw_user_meta_data ->> 'avatar_url',
    v_profile_type,
    case when v_profile_type in ('admin', 'super_admin') then v_profile_type else 'user' end
  )
  on conflict (id) do update set
    email = excluded.email,
    name = coalesce(excluded.name, public.profiles.name),
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url),
    profile_type = case
      when public.profiles.profile_type in ('admin', 'super_admin') then public.profiles.profile_type
      else excluded.profile_type
    end,
    role = case
      when public.profiles.profile_type in ('admin', 'super_admin') then public.profiles.profile_type
      else excluded.role
    end,
    updated_at = now();

  return new;
end;
$$;

-- 5) Super admin policy on allowlist management
drop policy if exists "Allow allowlist management for ments.app" on public.admin_allowlist;

create policy "Only super admins can manage allowlist"
on public.admin_allowlist
as permissive
for all
to authenticated
using (
  exists (
    select 1 from public.admin_allowlist me
    where lower(me.email) = lower(auth.jwt() ->> 'email')
      and me.role = 'super_admin'
  )
)
with check (
  exists (
    select 1 from public.admin_allowlist me
    where lower(me.email) = lower(auth.jwt() ->> 'email')
      and me.role = 'super_admin'
  )
);

