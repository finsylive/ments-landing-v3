# Supabase Setup Guide for Community Registration

This guide will help you set up Supabase to store community registration data.

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Node.js and npm installed
- Access to your `.env.local` file

## Step 1: Install Supabase Client

```bash
npm install @supabase/supabase-js
```

## Step 2: Create Supabase Project

1. Go to https://app.supabase.com
2. Click "New Project"
3. Fill in:
   - **Name**: Ments Community (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to your users
4. Click "Create new project" and wait for setup to complete

## Step 3: Get Your API Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. You'll find two important values:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon/public key**: A long JWT token

## Step 4: Add Credentials to .env.local

Add or update these variables in your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace with your actual values from Step 3.

## Step 5: Run the SQL Schema

1. In your Supabase project dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase-community-schema.sql`
4. Paste it into the SQL editor
5. Click "Run" to execute the schema

This will create:
- `community_registrations` table with all required fields
- Indexes for performance
- Row Level Security (RLS) policies
- Helper views for different roles
- Analytics view
- Auto-update triggers

## Step 6: Verify the Setup

1. Go to **Table Editor** in Supabase
2. You should see the `community_registrations` table
3. Check the columns match the form fields

## Step 7: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/community`

3. Fill out and submit the registration form

4. Check your Supabase dashboard:
   - Go to **Table Editor**
   - Select `community_registrations`
   - You should see your test entry

## Database Schema Overview

### Main Table: `community_registrations`

**Basic Fields:**
- `id` - UUID primary key
- `full_name` - User's full name
- `email` - Email address (unique)
- `role` - founder | investor | mentor
- `organization` - Optional company/startup name
- `linkedin_url` - LinkedIn profile URL

**Founder-Specific Fields:**
- `startup_stage` - idea | early-traction | scaling | revenue
- `biggest_challenge` - team | funding | mentorship | product
- `preferred_support` - community | platform | both
- `comfort_sharing_feedback` - 1-5 scale
- `connection_mode` - dm | matchmaking | events
- `mentorship_type` - founder | industry | technical | business
- `founder_feature_suggestion` - Optional text

**Investor/Mentor-Specific Fields:**
- `focus_areas` - Text field for areas of interest
- `preferred_startup_stage` - idea | mvp | scaling | revenue
- `approach_frequency` - rarely | sometimes | often
- `interaction_mode` - open-dms | filtered | platform-only
- `interest_in` - mentorship | investment | both
- `investor_feature_suggestion` - Optional text

**Common Fields:**
- `unique_feature_suggestion` - Required text
- `status` - pending | verified | approved | rejected
- `created_at` - Timestamp
- `updated_at` - Auto-updated timestamp

## Useful SQL Queries

### Get all pending registrations
```sql
SELECT * FROM community_registrations
WHERE status = 'pending'
ORDER BY created_at DESC;
```

### Get founder registrations only
```sql
SELECT * FROM founder_registrations;
```

### Get registration statistics
```sql
SELECT role, COUNT(*) as total
FROM community_registrations
GROUP BY role;
```

### Get registrations from last 7 days
```sql
SELECT * FROM community_registrations
WHERE created_at >= NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;
```

## Security Notes

### Row Level Security (RLS)

The schema includes RLS policies:

1. **Public Insert**: Anyone can register (anonymous users can INSERT)
2. **Own Data**: Users can view their own registration
3. **Admin Access**: Admins can view/update all registrations

### To Add Admin Access:

You'll need to set up authentication and add an admin role. For now, you can:

1. Disable RLS temporarily for testing:
   ```sql
   ALTER TABLE community_registrations DISABLE ROW LEVEL SECURITY;
   ```

2. Or query directly from the Supabase dashboard (which bypasses RLS)

## API Functions Available

The `lib/supabase.ts` file provides these functions:

- `submitCommunityRegistration(data)` - Submit new registration
- `getAllRegistrations()` - Get all registrations (admin)
- `getRegistrationsByRole(role)` - Filter by role
- `getRegistrationsByStatus(status)` - Filter by status
- `updateRegistrationStatus(id, status, notes)` - Update registration
- `getRegistrationAnalytics()` - Get analytics data

## Troubleshooting

### Error: "relation 'community_registrations' does not exist"
- Make sure you ran the SQL schema in Step 5
- Check you're connected to the right Supabase project

### Error: "invalid API key"
- Verify your `.env.local` credentials
- Make sure you're using the `anon` key, not the `service_role` key
- Restart your dev server after changing `.env.local`

### Form submits but no data appears
- Check browser console for errors
- Verify RLS policies aren't blocking inserts
- Check Supabase logs in the dashboard

### "Failed to submit registration"
- Open browser DevTools → Network tab
- Look for failed requests to Supabase
- Check the error message for details

## Next Steps

1. Set up email notifications when someone registers
2. Create an admin dashboard to view/manage registrations
3. Add email verification flow
4. Set up WhatsApp community link integration
5. Create automated welcome emails

## Support

- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- Next.js + Supabase: https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs
