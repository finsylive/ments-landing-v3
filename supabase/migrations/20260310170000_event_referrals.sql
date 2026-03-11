-- Referral system for events
-- Each authenticated user gets exactly one referral token per event.
-- The registrations table gets a nullable referral_token column so we can
-- track which registrations came through a referral link.

create table "public"."event_referrals" (
  "id"             uuid not null default gen_random_uuid(),
  "user_id"        uuid not null references auth.users(id) on delete cascade,
  "event_id"       uuid not null references public.events(id) on delete cascade,
  "token"          text not null,
  "referrer_name"  text not null,
  "referrer_email" text not null,
  "referral_count" integer not null default 0,
  "created_at"     timestamp with time zone default now()
);

alter table "public"."event_referrals" enable row level security;

-- Primary key
alter table "public"."event_referrals"
  add constraint "event_referrals_pkey" primary key ("id");

-- One token per user per event
create unique index "event_referrals_user_event_idx"
  on public.event_referrals using btree (user_id, event_id);

-- Fast lookup by token (used during registration)
create unique index "event_referrals_token_idx"
  on public.event_referrals using btree (token);

-- RLS policies
create policy "Users can read their own referrals"
  on "public"."event_referrals"
  as permissive for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can create their own referrals"
  on "public"."event_referrals"
  as permissive for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Allow anyone to read a referral by token (needed during registration)
create policy "Anyone can read referral by token"
  on "public"."event_referrals"
  as permissive for select
  to anon, authenticated
  using (true);

-- Allow the system to increment referral_count (via service_role or RPC)
create policy "Allow update referral_count"
  on "public"."event_referrals"
  as permissive for update
  to anon, authenticated
  using (true)
  with check (true);

-- Grant permissions
grant select, insert, update on table "public"."event_referrals" to "anon";
grant select, insert, update on table "public"."event_referrals" to "authenticated";
grant all on table "public"."event_referrals" to "service_role";

-- Add referral_token to registrations so we know which referral drove each signup
alter table "public"."registrations"
  add column if not exists "referral_token" text;

-- Add gender column if missing (used in registration form)
alter table "public"."registrations"
  add column if not exists "gender" text;

-- Function to atomically increment referral count when someone registers with a token
create or replace function public.increment_referral_count(p_token text)
returns void
language plpgsql
security definer
as $$
begin
  update public.event_referrals
  set referral_count = referral_count + 1
  where token = p_token;
end;
$$;
