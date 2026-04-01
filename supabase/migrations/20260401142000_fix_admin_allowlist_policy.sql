-- Fix policy mismatch:
-- API may authorize super admin via profiles.profile_type,
-- but admin_allowlist write policy previously only trusted admin_allowlist.

drop policy if exists "Only super admins can manage allowlist" on public.admin_allowlist;

create policy "Super admins can manage allowlist"
on public.admin_allowlist
as permissive
for all
to authenticated
using (
  exists (
    select 1
    from public.admin_allowlist me
    where lower(me.email) = lower(auth.jwt() ->> 'email')
      and me.role = 'super_admin'
  )
  or exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.profile_type = 'super_admin'
  )
)
with check (
  exists (
    select 1
    from public.admin_allowlist me
    where lower(me.email) = lower(auth.jwt() ->> 'email')
      and me.role = 'super_admin'
  )
  or exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.profile_type = 'super_admin'
  )
);

