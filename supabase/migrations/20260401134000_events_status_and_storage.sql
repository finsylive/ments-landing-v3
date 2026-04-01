-- Event management hardening: status + poster + storage bucket

alter table public.events
  add column if not exists status text not null default 'draft',
  add column if not exists poster_url text;

alter table public.events
  drop constraint if exists events_status_check;

alter table public.events
  add constraint events_status_check
  check (status in ('draft', 'published', 'completed', 'cancelled', 'archived'));

create index if not exists idx_events_status_date on public.events(status, date desc);

-- Supabase Storage bucket for event posters
insert into storage.buckets (id, name, public)
values ('event-posters', 'event-posters', true)
on conflict (id) do nothing;

-- Public read access for poster images
create policy "Public can read event posters"
on storage.objects
as permissive
for select
to public
using (bucket_id = 'event-posters');

-- Admin write access for poster images
create policy "Admins can upload event posters"
on storage.objects
as permissive
for insert
to authenticated
with check (bucket_id = 'event-posters' and public.is_admin());

create policy "Admins can update event posters"
on storage.objects
as permissive
for update
to authenticated
using (bucket_id = 'event-posters' and public.is_admin())
with check (bucket_id = 'event-posters' and public.is_admin());

create policy "Admins can delete event posters"
on storage.objects
as permissive
for delete
to authenticated
using (bucket_id = 'event-posters' and public.is_admin());

