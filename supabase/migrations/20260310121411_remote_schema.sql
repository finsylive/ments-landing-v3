drop extension if exists "pg_net";


  create table "public"."account_deletion_requests" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "user_id" uuid,
    "username" character varying(255) not null,
    "email" character varying(255) not null,
    "reason" character varying(50) not null,
    "feedback" text,
    "is_processed" boolean default false,
    "processed_at" timestamp with time zone,
    "processed_by" uuid,
    "status" character varying(20) default 'pending'::character varying,
    "metadata" jsonb,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."account_deletion_requests" enable row level security;


  create table "public"."client_inquiries" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "email" text not null,
    "phone" text not null,
    "project_name" text not null,
    "services" text[] not null,
    "additional_notes" text,
    "status" text default 'new'::text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "preferred_timing" text
      );


alter table "public"."client_inquiries" enable row level security;


  create table "public"."community_registrations" (
    "id" uuid not null default gen_random_uuid(),
    "full_name" character varying(255) not null,
    "email" character varying(255) not null,
    "role" character varying(50) not null,
    "organization" character varying(255),
    "linkedin_url" character varying(500) not null,
    "startup_stage" character varying(50),
    "biggest_challenge" character varying(50),
    "preferred_support" character varying(50),
    "comfort_sharing_feedback" integer,
    "connection_mode" character varying(50),
    "mentorship_type" character varying(50),
    "founder_feature_suggestion" text,
    "focus_areas" text,
    "preferred_startup_stage" character varying(50),
    "approach_frequency" character varying(50),
    "interaction_mode" character varying(50),
    "interest_in" character varying(50),
    "investor_feature_suggestion" text,
    "unique_feature_suggestion" text not null,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "status" character varying(50) default 'pending'::character varying,
    "verification_notes" text,
    "verified_at" timestamp with time zone,
    "verified_by" uuid
      );


alter table "public"."community_registrations" enable row level security;


  create table "public"."events" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "title" text not null,
    "About" text,
    "date" timestamp without time zone not null,
    "location" text,
    "created_at" timestamp with time zone default timezone('utc'::text, now()),
    "Who_Should_Participate" text,
    "Why_Participate" text,
    "Event_Flow" text,
    "Judging_Criteria" text,
    "Prizes_Benefits" text,
    "description" text,
    "duration" text,
    "mode" text
      );


alter table "public"."events" enable row level security;


  create table "public"."jobs" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "created_at" timestamp with time zone not null default now(),
    "company_name" text not null,
    "role" text not null,
    "about_role" text not null,
    "experience_required" text not null,
    "is_active" boolean not null default true,
    "job_type" text,
    "location" text,
    "salary_range" text,
    "skills_required" text[],
    "responsibilities" text[],
    "benefits" text[]
      );


alter table "public"."jobs" enable row level security;


  create table "public"."profiles" (
    "id" uuid not null,
    "name" text,
    "phone" text,
    "email" text,
    "created_at" timestamp with time zone default timezone('utc'::text, now())
      );


alter table "public"."profiles" enable row level security;


  create table "public"."registrations" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "email" text not null,
    "created_at" timestamp with time zone default timezone('utc'::text, now()),
    "phone" text,
    "organization" text,
    "designation" text,
    "linkedin" text,
    "city" text,
    "other_designation" text,
    "Event_id" uuid
      );


alter table "public"."registrations" enable row level security;


  create table "public"."waitlist" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "name" text not null,
    "email" text not null,
    "phone" text,
    "interest" text,
    "message" text,
    "status" text default 'pending'::text,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now())
      );


alter table "public"."waitlist" enable row level security;

CREATE UNIQUE INDEX account_deletion_requests_email_key ON public.account_deletion_requests USING btree (email);

CREATE UNIQUE INDEX account_deletion_requests_pkey ON public.account_deletion_requests USING btree (id);

CREATE UNIQUE INDEX account_deletion_requests_username_key ON public.account_deletion_requests USING btree (username);

CREATE UNIQUE INDEX client_inquiries_pkey ON public.client_inquiries USING btree (id);

CREATE UNIQUE INDEX community_registrations_email_key ON public.community_registrations USING btree (email);

CREATE UNIQUE INDEX community_registrations_pkey ON public.community_registrations USING btree (id);

CREATE UNIQUE INDEX events_pkey ON public.events USING btree (id);

CREATE INDEX idx_client_inquiries_created_at ON public.client_inquiries USING btree (created_at DESC);

CREATE INDEX idx_client_inquiries_email ON public.client_inquiries USING btree (email);

CREATE INDEX idx_client_inquiries_status ON public.client_inquiries USING btree (status);

CREATE INDEX idx_community_created_at ON public.community_registrations USING btree (created_at DESC);

CREATE INDEX idx_community_email ON public.community_registrations USING btree (email);

CREATE INDEX idx_community_role ON public.community_registrations USING btree (role);

CREATE INDEX idx_community_status ON public.community_registrations USING btree (status);

CREATE INDEX idx_deletion_requests_email ON public.account_deletion_requests USING btree (email);

CREATE INDEX idx_deletion_requests_status ON public.account_deletion_requests USING btree (status);

CREATE INDEX idx_deletion_requests_user_id ON public.account_deletion_requests USING btree (user_id);

CREATE INDEX idx_jobs_is_active ON public.jobs USING btree (is_active);

CREATE UNIQUE INDEX jobs_pkey ON public.jobs USING btree (id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX registrations_pkey ON public.registrations USING btree (id);

CREATE UNIQUE INDEX unique_email ON public.waitlist USING btree (email);

CREATE UNIQUE INDEX waitlist_email_key ON public.waitlist USING btree (email);

CREATE UNIQUE INDEX waitlist_pkey ON public.waitlist USING btree (id);

alter table "public"."account_deletion_requests" add constraint "account_deletion_requests_pkey" PRIMARY KEY using index "account_deletion_requests_pkey";

alter table "public"."client_inquiries" add constraint "client_inquiries_pkey" PRIMARY KEY using index "client_inquiries_pkey";

alter table "public"."community_registrations" add constraint "community_registrations_pkey" PRIMARY KEY using index "community_registrations_pkey";

alter table "public"."events" add constraint "events_pkey" PRIMARY KEY using index "events_pkey";

alter table "public"."jobs" add constraint "jobs_pkey" PRIMARY KEY using index "jobs_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."registrations" add constraint "registrations_pkey" PRIMARY KEY using index "registrations_pkey";

alter table "public"."waitlist" add constraint "waitlist_pkey" PRIMARY KEY using index "waitlist_pkey";

alter table "public"."account_deletion_requests" add constraint "account_deletion_requests_email_key" UNIQUE using index "account_deletion_requests_email_key";

alter table "public"."account_deletion_requests" add constraint "account_deletion_requests_processed_by_fkey" FOREIGN KEY (processed_by) REFERENCES auth.users(id) ON DELETE SET NULL not valid;

alter table "public"."account_deletion_requests" validate constraint "account_deletion_requests_processed_by_fkey";

alter table "public"."account_deletion_requests" add constraint "account_deletion_requests_status_check" CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'processing'::character varying, 'completed'::character varying, 'cancelled'::character varying])::text[]))) not valid;

alter table "public"."account_deletion_requests" validate constraint "account_deletion_requests_status_check";

alter table "public"."account_deletion_requests" add constraint "account_deletion_requests_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."account_deletion_requests" validate constraint "account_deletion_requests_user_id_fkey";

alter table "public"."account_deletion_requests" add constraint "account_deletion_requests_username_key" UNIQUE using index "account_deletion_requests_username_key";

alter table "public"."client_inquiries" add constraint "client_inquiries_status_check" CHECK ((status = ANY (ARRAY['new'::text, 'contacted'::text, 'in_progress'::text, 'completed'::text, 'archived'::text]))) not valid;

alter table "public"."client_inquiries" validate constraint "client_inquiries_status_check";

alter table "public"."community_registrations" add constraint "community_registrations_approach_frequency_check" CHECK ((((approach_frequency)::text = ANY ((ARRAY['rarely'::character varying, 'sometimes'::character varying, 'often'::character varying])::text[])) OR (approach_frequency IS NULL))) not valid;

alter table "public"."community_registrations" validate constraint "community_registrations_approach_frequency_check";

alter table "public"."community_registrations" add constraint "community_registrations_biggest_challenge_check" CHECK ((((biggest_challenge)::text = ANY ((ARRAY['team'::character varying, 'funding'::character varying, 'mentorship'::character varying, 'product'::character varying])::text[])) OR (biggest_challenge IS NULL))) not valid;

alter table "public"."community_registrations" validate constraint "community_registrations_biggest_challenge_check";

alter table "public"."community_registrations" add constraint "community_registrations_comfort_sharing_feedback_check" CHECK ((((comfort_sharing_feedback >= 1) AND (comfort_sharing_feedback <= 5)) OR (comfort_sharing_feedback IS NULL))) not valid;

alter table "public"."community_registrations" validate constraint "community_registrations_comfort_sharing_feedback_check";

alter table "public"."community_registrations" add constraint "community_registrations_connection_mode_check" CHECK ((((connection_mode)::text = ANY ((ARRAY['dm'::character varying, 'matchmaking'::character varying, 'events'::character varying])::text[])) OR (connection_mode IS NULL))) not valid;

alter table "public"."community_registrations" validate constraint "community_registrations_connection_mode_check";

alter table "public"."community_registrations" add constraint "community_registrations_email_key" UNIQUE using index "community_registrations_email_key";

alter table "public"."community_registrations" add constraint "community_registrations_interaction_mode_check" CHECK ((((interaction_mode)::text = ANY ((ARRAY['open-dms'::character varying, 'filtered'::character varying, 'platform-only'::character varying])::text[])) OR (interaction_mode IS NULL))) not valid;

alter table "public"."community_registrations" validate constraint "community_registrations_interaction_mode_check";

alter table "public"."community_registrations" add constraint "community_registrations_interest_in_check" CHECK ((((interest_in)::text = ANY ((ARRAY['mentorship'::character varying, 'investment'::character varying, 'both'::character varying])::text[])) OR (interest_in IS NULL))) not valid;

alter table "public"."community_registrations" validate constraint "community_registrations_interest_in_check";

alter table "public"."community_registrations" add constraint "community_registrations_mentorship_type_check" CHECK ((((mentorship_type)::text = ANY ((ARRAY['founder'::character varying, 'industry'::character varying, 'technical'::character varying, 'business'::character varying])::text[])) OR (mentorship_type IS NULL))) not valid;

alter table "public"."community_registrations" validate constraint "community_registrations_mentorship_type_check";

alter table "public"."community_registrations" add constraint "community_registrations_preferred_startup_stage_check" CHECK ((((preferred_startup_stage)::text = ANY ((ARRAY['idea'::character varying, 'mvp'::character varying, 'scaling'::character varying, 'revenue'::character varying])::text[])) OR (preferred_startup_stage IS NULL))) not valid;

alter table "public"."community_registrations" validate constraint "community_registrations_preferred_startup_stage_check";

alter table "public"."community_registrations" add constraint "community_registrations_preferred_support_check" CHECK ((((preferred_support)::text = ANY ((ARRAY['community'::character varying, 'platform'::character varying, 'both'::character varying])::text[])) OR (preferred_support IS NULL))) not valid;

alter table "public"."community_registrations" validate constraint "community_registrations_preferred_support_check";

alter table "public"."community_registrations" add constraint "community_registrations_role_check" CHECK (((role)::text = ANY ((ARRAY['founder'::character varying, 'investor'::character varying, 'mentor'::character varying])::text[]))) not valid;

alter table "public"."community_registrations" validate constraint "community_registrations_role_check";

alter table "public"."community_registrations" add constraint "community_registrations_startup_stage_check" CHECK ((((startup_stage)::text = ANY ((ARRAY['idea'::character varying, 'early-traction'::character varying, 'scaling'::character varying, 'revenue'::character varying])::text[])) OR (startup_stage IS NULL))) not valid;

alter table "public"."community_registrations" validate constraint "community_registrations_startup_stage_check";

alter table "public"."community_registrations" add constraint "community_registrations_status_check" CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'verified'::character varying, 'approved'::character varying, 'rejected'::character varying])::text[]))) not valid;

alter table "public"."community_registrations" validate constraint "community_registrations_status_check";

alter table "public"."registrations" add constraint "registrations_Event_id_fkey" FOREIGN KEY ("Event_id") REFERENCES public.events(id) not valid;

alter table "public"."registrations" validate constraint "registrations_Event_id_fkey";

alter table "public"."waitlist" add constraint "unique_email" UNIQUE using index "unique_email";

alter table "public"."waitlist" add constraint "waitlist_email_key" UNIQUE using index "waitlist_email_key";

set check_function_bodies = off;

create or replace view "public"."client_inquiries_summary" as  SELECT id,
    name,
    email,
    phone,
    project_name,
    services,
    status,
    created_at,
    updated_at,
        CASE
            WHEN ((additional_notes IS NULL) OR (additional_notes = ''::text)) THEN false
            ELSE true
        END AS has_additional_notes
   FROM public.client_inquiries
  ORDER BY created_at DESC;


CREATE OR REPLACE FUNCTION public.create_ngo_profile(p_user_id uuid, p_email text, p_name text, p_phone_number text, p_organization_name text, p_address text, p_contact_number text, p_registration_number text DEFAULT NULL::text, p_website_url text DEFAULT NULL::text, p_field_of_work text DEFAULT NULL::text, p_description text DEFAULT NULL::text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    -- Insert user profile
    INSERT INTO public.users (id, email, name, role, phone_number)
    VALUES (p_user_id, p_email, p_name, 'ngo', p_phone_number)
    ON CONFLICT (id) DO UPDATE
    SET
        email = EXCLUDED.email,
        name = EXCLUDED.name,
        role = EXCLUDED.role,
        phone_number = EXCLUDED.phone_number;

    -- Insert NGO organization
    INSERT INTO public.ngo_organizations (
        user_id,
        organization_name,
        registration_number,
        website_url,
        field_of_work,
        address,
        contact_number,
        description
    )
    VALUES (
        p_user_id,
        p_organization_name,
        p_registration_number,
        p_website_url,
        p_field_of_work,
        p_address,
        p_contact_number,
        p_description
    )
    ON CONFLICT (user_id) DO UPDATE
    SET
        organization_name = EXCLUDED.organization_name,
        registration_number = EXCLUDED.registration_number,
        website_url = EXCLUDED.website_url,
        field_of_work = EXCLUDED.field_of_work,
        address = EXCLUDED.address,
        contact_number = EXCLUDED.contact_number,
        description = EXCLUDED.description,
        updated_at = now();
END;
$function$
;

create or replace view "public"."founder_registrations" as  SELECT id,
    full_name,
    email,
    organization,
    linkedin_url,
    startup_stage,
    biggest_challenge,
    preferred_support,
    comfort_sharing_feedback,
    connection_mode,
    mentorship_type,
    founder_feature_suggestion,
    unique_feature_suggestion,
    status,
    created_at
   FROM public.community_registrations
  WHERE ((role)::text = 'founder'::text);


CREATE OR REPLACE FUNCTION public.handle_account_deletion_request(p_username text, p_email text, p_reason text, p_feedback text DEFAULT ''::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_existing_requests int;
  result jsonb;
BEGIN
  -- Check for existing pending requests in the last 24 hours
  SELECT COUNT(*) INTO v_existing_requests
  FROM public.account_deletion_requests
  WHERE email = p_email
    AND status = 'pending'
    AND created_at > (NOW() - INTERVAL '24 hours');
  
  IF v_existing_requests > 0 THEN
    RETURN jsonb_build_object(
      'success', false,
      'is_duplicate', true,
      'message', 'A deletion request is already being processed for this email.'
    );
  END IF;
  
  -- Insert new request
  INSERT INTO public.account_deletion_requests (
    username,
    email,
    reason,
    feedback,
    status
  ) VALUES (
    p_username,
    p_email,
    p_reason,
    p_feedback,
    'pending'
  )
  RETURNING to_jsonb(account_deletion_requests.*) INTO result;
  
  RETURN jsonb_build_object('success', true, 'data', result);
END;
$function$
;

create or replace view "public"."investor_registrations" as  SELECT id,
    full_name,
    email,
    organization,
    linkedin_url,
    focus_areas,
    preferred_startup_stage,
    approach_frequency,
    interaction_mode,
    interest_in,
    investor_feature_suggestion,
    unique_feature_suggestion,
    status,
    created_at
   FROM public.community_registrations
  WHERE ((role)::text = 'investor'::text);


create or replace view "public"."mentor_registrations" as  SELECT id,
    full_name,
    email,
    organization,
    linkedin_url,
    focus_areas,
    preferred_startup_stage,
    approach_frequency,
    interaction_mode,
    interest_in,
    investor_feature_suggestion,
    unique_feature_suggestion,
    status,
    created_at
   FROM public.community_registrations
  WHERE ((role)::text = 'mentor'::text);


create or replace view "public"."registration_analytics" as  SELECT role,
    status,
    count(*) AS count,
    date_trunc('day'::text, created_at) AS registration_date
   FROM public.community_registrations
  GROUP BY role, status, (date_trunc('day'::text, created_at))
  ORDER BY (date_trunc('day'::text, created_at)) DESC;


CREATE OR REPLACE FUNCTION public.update_ngo_organizations_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$
;

grant delete on table "public"."account_deletion_requests" to "anon";

grant insert on table "public"."account_deletion_requests" to "anon";

grant references on table "public"."account_deletion_requests" to "anon";

grant select on table "public"."account_deletion_requests" to "anon";

grant trigger on table "public"."account_deletion_requests" to "anon";

grant truncate on table "public"."account_deletion_requests" to "anon";

grant update on table "public"."account_deletion_requests" to "anon";

grant delete on table "public"."account_deletion_requests" to "authenticated";

grant insert on table "public"."account_deletion_requests" to "authenticated";

grant references on table "public"."account_deletion_requests" to "authenticated";

grant select on table "public"."account_deletion_requests" to "authenticated";

grant trigger on table "public"."account_deletion_requests" to "authenticated";

grant truncate on table "public"."account_deletion_requests" to "authenticated";

grant update on table "public"."account_deletion_requests" to "authenticated";

grant delete on table "public"."account_deletion_requests" to "service_role";

grant insert on table "public"."account_deletion_requests" to "service_role";

grant references on table "public"."account_deletion_requests" to "service_role";

grant select on table "public"."account_deletion_requests" to "service_role";

grant trigger on table "public"."account_deletion_requests" to "service_role";

grant truncate on table "public"."account_deletion_requests" to "service_role";

grant update on table "public"."account_deletion_requests" to "service_role";

grant delete on table "public"."client_inquiries" to "anon";

grant insert on table "public"."client_inquiries" to "anon";

grant references on table "public"."client_inquiries" to "anon";

grant select on table "public"."client_inquiries" to "anon";

grant trigger on table "public"."client_inquiries" to "anon";

grant truncate on table "public"."client_inquiries" to "anon";

grant update on table "public"."client_inquiries" to "anon";

grant delete on table "public"."client_inquiries" to "authenticated";

grant insert on table "public"."client_inquiries" to "authenticated";

grant references on table "public"."client_inquiries" to "authenticated";

grant select on table "public"."client_inquiries" to "authenticated";

grant trigger on table "public"."client_inquiries" to "authenticated";

grant truncate on table "public"."client_inquiries" to "authenticated";

grant update on table "public"."client_inquiries" to "authenticated";

grant delete on table "public"."client_inquiries" to "service_role";

grant insert on table "public"."client_inquiries" to "service_role";

grant references on table "public"."client_inquiries" to "service_role";

grant select on table "public"."client_inquiries" to "service_role";

grant trigger on table "public"."client_inquiries" to "service_role";

grant truncate on table "public"."client_inquiries" to "service_role";

grant update on table "public"."client_inquiries" to "service_role";

grant delete on table "public"."community_registrations" to "anon";

grant insert on table "public"."community_registrations" to "anon";

grant references on table "public"."community_registrations" to "anon";

grant select on table "public"."community_registrations" to "anon";

grant trigger on table "public"."community_registrations" to "anon";

grant truncate on table "public"."community_registrations" to "anon";

grant update on table "public"."community_registrations" to "anon";

grant delete on table "public"."community_registrations" to "authenticated";

grant insert on table "public"."community_registrations" to "authenticated";

grant references on table "public"."community_registrations" to "authenticated";

grant select on table "public"."community_registrations" to "authenticated";

grant trigger on table "public"."community_registrations" to "authenticated";

grant truncate on table "public"."community_registrations" to "authenticated";

grant update on table "public"."community_registrations" to "authenticated";

grant delete on table "public"."community_registrations" to "service_role";

grant insert on table "public"."community_registrations" to "service_role";

grant references on table "public"."community_registrations" to "service_role";

grant select on table "public"."community_registrations" to "service_role";

grant trigger on table "public"."community_registrations" to "service_role";

grant truncate on table "public"."community_registrations" to "service_role";

grant update on table "public"."community_registrations" to "service_role";

grant delete on table "public"."events" to "anon";

grant insert on table "public"."events" to "anon";

grant references on table "public"."events" to "anon";

grant select on table "public"."events" to "anon";

grant trigger on table "public"."events" to "anon";

grant truncate on table "public"."events" to "anon";

grant update on table "public"."events" to "anon";

grant delete on table "public"."events" to "authenticated";

grant insert on table "public"."events" to "authenticated";

grant references on table "public"."events" to "authenticated";

grant select on table "public"."events" to "authenticated";

grant trigger on table "public"."events" to "authenticated";

grant truncate on table "public"."events" to "authenticated";

grant update on table "public"."events" to "authenticated";

grant delete on table "public"."events" to "service_role";

grant insert on table "public"."events" to "service_role";

grant references on table "public"."events" to "service_role";

grant select on table "public"."events" to "service_role";

grant trigger on table "public"."events" to "service_role";

grant truncate on table "public"."events" to "service_role";

grant update on table "public"."events" to "service_role";

grant delete on table "public"."jobs" to "anon";

grant insert on table "public"."jobs" to "anon";

grant references on table "public"."jobs" to "anon";

grant select on table "public"."jobs" to "anon";

grant trigger on table "public"."jobs" to "anon";

grant truncate on table "public"."jobs" to "anon";

grant update on table "public"."jobs" to "anon";

grant delete on table "public"."jobs" to "authenticated";

grant insert on table "public"."jobs" to "authenticated";

grant references on table "public"."jobs" to "authenticated";

grant select on table "public"."jobs" to "authenticated";

grant trigger on table "public"."jobs" to "authenticated";

grant truncate on table "public"."jobs" to "authenticated";

grant update on table "public"."jobs" to "authenticated";

grant delete on table "public"."jobs" to "service_role";

grant insert on table "public"."jobs" to "service_role";

grant references on table "public"."jobs" to "service_role";

grant select on table "public"."jobs" to "service_role";

grant trigger on table "public"."jobs" to "service_role";

grant truncate on table "public"."jobs" to "service_role";

grant update on table "public"."jobs" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."registrations" to "anon";

grant insert on table "public"."registrations" to "anon";

grant references on table "public"."registrations" to "anon";

grant select on table "public"."registrations" to "anon";

grant trigger on table "public"."registrations" to "anon";

grant truncate on table "public"."registrations" to "anon";

grant update on table "public"."registrations" to "anon";

grant delete on table "public"."registrations" to "authenticated";

grant insert on table "public"."registrations" to "authenticated";

grant references on table "public"."registrations" to "authenticated";

grant select on table "public"."registrations" to "authenticated";

grant trigger on table "public"."registrations" to "authenticated";

grant truncate on table "public"."registrations" to "authenticated";

grant update on table "public"."registrations" to "authenticated";

grant delete on table "public"."registrations" to "service_role";

grant insert on table "public"."registrations" to "service_role";

grant references on table "public"."registrations" to "service_role";

grant select on table "public"."registrations" to "service_role";

grant trigger on table "public"."registrations" to "service_role";

grant truncate on table "public"."registrations" to "service_role";

grant update on table "public"."registrations" to "service_role";

grant delete on table "public"."waitlist" to "anon";

grant insert on table "public"."waitlist" to "anon";

grant references on table "public"."waitlist" to "anon";

grant select on table "public"."waitlist" to "anon";

grant trigger on table "public"."waitlist" to "anon";

grant truncate on table "public"."waitlist" to "anon";

grant update on table "public"."waitlist" to "anon";

grant delete on table "public"."waitlist" to "authenticated";

grant insert on table "public"."waitlist" to "authenticated";

grant references on table "public"."waitlist" to "authenticated";

grant select on table "public"."waitlist" to "authenticated";

grant trigger on table "public"."waitlist" to "authenticated";

grant truncate on table "public"."waitlist" to "authenticated";

grant update on table "public"."waitlist" to "authenticated";

grant delete on table "public"."waitlist" to "service_role";

grant insert on table "public"."waitlist" to "service_role";

grant references on table "public"."waitlist" to "service_role";

grant select on table "public"."waitlist" to "service_role";

grant trigger on table "public"."waitlist" to "service_role";

grant truncate on table "public"."waitlist" to "service_role";

grant update on table "public"."waitlist" to "service_role";


  create policy "Allow insert for account deletion requests"
  on "public"."account_deletion_requests"
  as permissive
  for insert
  to public
with check (true);



  create policy "Allow public insert on account_deletion_requests"
  on "public"."account_deletion_requests"
  as permissive
  for insert
  to public
with check (true);



  create policy "Allow users to update their own requests"
  on "public"."account_deletion_requests"
  as permissive
  for update
  to public
using (((auth.uid() IS NOT NULL) AND ((email)::text = (auth.jwt() ->> 'email'::text))));



  create policy "Allow users to view their own requests"
  on "public"."account_deletion_requests"
  as permissive
  for select
  to public
using (((auth.uid() IS NOT NULL) AND ((email)::text = (auth.jwt() ->> 'email'::text))));



  create policy "Users can create deletion requests"
  on "public"."account_deletion_requests"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can create their own deletion requests"
  on "public"."account_deletion_requests"
  as permissive
  for insert
  to authenticated
with check ((auth.uid() = user_id));



  create policy "Users can view their own deletion requests"
  on "public"."account_deletion_requests"
  as permissive
  for select
  to authenticated
using ((auth.uid() = user_id));



  create policy "Allow anonymous inserts"
  on "public"."client_inquiries"
  as permissive
  for insert
  to public
with check (true);



  create policy "Allow public reads"
  on "public"."client_inquiries"
  as permissive
  for select
  to public
using (true);



  create policy "Enable insert for all users"
  on "public"."community_registrations"
  as permissive
  for insert
  to anon, authenticated
with check (true);



  create policy "Enable read for all users"
  on "public"."community_registrations"
  as permissive
  for select
  to anon, authenticated
using (true);



  create policy "Enable update for authenticated users"
  on "public"."community_registrations"
  as permissive
  for update
  to authenticated
using (((auth.jwt() ->> 'email'::text) = (email)::text))
with check (((auth.jwt() ->> 'email'::text) = (email)::text));



  create policy "Allow delete for authenticated users"
  on "public"."events"
  as permissive
  for delete
  to public
using ((auth.uid() IS NOT NULL));



  create policy "Allow insert for ments.app admins"
  on "public"."events"
  as permissive
  for insert
  to public
with check (((auth.jwt() ->> 'email'::text) ~~ '%@ments.app'::text));



  create policy "Allow modify for ments.app admins"
  on "public"."events"
  as permissive
  for all
  to public
using (((auth.jwt() ->> 'email'::text) ~~ '%@ments.app'::text));



  create policy "Allow read access to all users"
  on "public"."events"
  as permissive
  for select
  to public
using (true);



  create policy "Allow update for authenticated users"
  on "public"."events"
  as permissive
  for update
  to public
using ((auth.uid() IS NOT NULL));



  create policy "Enable delete for authenticated users only"
  on "public"."jobs"
  as permissive
  for delete
  to authenticated
using (true);



  create policy "Enable insert for authenticated users only"
  on "public"."jobs"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Enable read access for all users"
  on "public"."jobs"
  as permissive
  for select
  to public
using ((is_active = true));



  create policy "Enable update for authenticated users only"
  on "public"."jobs"
  as permissive
  for update
  to authenticated
using (true)
with check (true);



  create policy "Allow insert for all"
  on "public"."profiles"
  as permissive
  for insert
  to public
with check (true);



  create policy "Allow insert for all"
  on "public"."registrations"
  as permissive
  for insert
  to public
with check (true);



  create policy "Allow public inserts to registrations"
  on "public"."registrations"
  as permissive
  for insert
  to public
with check (true);



  create policy "Allow public selects from registrations"
  on "public"."registrations"
  as permissive
  for select
  to public
using (true);



  create policy "Allow admin all access"
  on "public"."waitlist"
  as permissive
  for all
  to public
using ((auth.role() = 'authenticated'::text));



  create policy "Allow public insert access"
  on "public"."waitlist"
  as permissive
  for insert
  to public
with check (true);



  create policy "Allow public inserts"
  on "public"."waitlist"
  as permissive
  for insert
  to public
with check (true);



  create policy "Enable insert for all users"
  on "public"."waitlist"
  as permissive
  for insert
  to public
with check (true);



  create policy "Enable read access for all users"
  on "public"."waitlist"
  as permissive
  for select
  to public
using (true);



  create policy "Enable update for all users"
  on "public"."waitlist"
  as permissive
  for update
  to public
using (true)
with check (true);


CREATE TRIGGER update_account_deletion_requests_updated_at BEFORE UPDATE ON public.account_deletion_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_client_inquiries_updated_at BEFORE UPDATE ON public.client_inquiries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_community_registrations_updated_at BEFORE UPDATE ON public.community_registrations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


