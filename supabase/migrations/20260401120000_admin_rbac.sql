-- Admin RBAC for /admin and /api/admin/*
-- This is intentionally additive (doesn't remove existing policies).

-- 1) Admin allowlist table
create table if not exists public.admin_allowlist (
  email text primary key,
  role text not null default 'admin' check (role in ('admin', 'super_admin')),
  created_at timestamptz not null default now()
);

alter table public.admin_allowlist enable row level security;

-- Allow service_role full access (recommended operational path).
-- Note: service_role bypasses RLS by default when using the service key, but explicit grants/policies help clarity.
grant select, insert, update, delete on table public.admin_allowlist to service_role;

-- Bootstrap: allow @ments.app authenticated users to manage allowlist.
-- If you prefer stricter bootstrap, replace this with a specific email check.
create policy "Allow allowlist management for ments.app"
on public.admin_allowlist
as permissive
for all
to authenticated
using ((auth.jwt() ->> 'email') ilike '%@ments.app')
with check ((auth.jwt() ->> 'email') ilike '%@ments.app');

-- 2) Helper function to use in policies
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_allowlist a
    where lower(a.email) = lower(auth.jwt() ->> 'email')
  );
$$;

-- 3) RBAC policies for admin-managed tables (additive)
-- Events
create policy "Admin can manage events"
on public.events
as permissive
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Jobs
create policy "Admin can manage jobs"
on public.jobs
as permissive
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Community registrations
create policy "Admin can manage community registrations"
on public.community_registrations
as permissive
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Waitlist
create policy "Admin can manage waitlist"
on public.waitlist
as permissive
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Client inquiries
create policy "Admin can manage client inquiries"
on public.client_inquiries
as permissive
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Account deletion requests
create policy "Admin can manage account deletion requests"
on public.account_deletion_requests
as permissive
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

