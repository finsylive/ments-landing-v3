-- Allow super admins to update other users' profiles (for role management)

create policy "Super admins can update all profiles"
on public.profiles
as permissive
for update
to authenticated
using (
  exists (
    select 1
    from public.admin_allowlist me
    where lower(me.email) = lower(auth.jwt() ->> 'email')
      and me.role = 'super_admin'
  )
  or (
    auth.uid() is not null
    and exists (
      select 1
      from public.profiles self
      where self.id = auth.uid()
        and self.profile_type = 'super_admin'
    )
  )
)
with check (
  exists (
    select 1
    from public.admin_allowlist me
    where lower(me.email) = lower(auth.jwt() ->> 'email')
      and me.role = 'super_admin'
  )
  or (
    auth.uid() is not null
    and exists (
      select 1
      from public.profiles self
      where self.id = auth.uid()
        and self.profile_type = 'super_admin'
    )
  )
);

