# Quick Fix: Row Level Security Error

You're getting an RLS (Row Level Security) error because Supabase is blocking anonymous inserts.

## Option 1: Fix RLS Policies (Recommended for Production)

Run this SQL in your Supabase SQL Editor:

```sql
-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can register" ON community_registrations;
DROP POLICY IF EXISTS "Users can view own registration" ON community_registrations;
DROP POLICY IF EXISTS "Admins can view all registrations" ON community_registrations;
DROP POLICY IF EXISTS "Admins can update registrations" ON community_registrations;

-- Enable RLS
ALTER TABLE community_registrations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (register)
CREATE POLICY "Enable insert for all users"
  ON community_registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow anyone to read (you can restrict this later)
CREATE POLICY "Enable read for all users"
  ON community_registrations
  FOR SELECT
  TO anon, authenticated
  USING (true);
```

## Option 2: Disable RLS Temporarily (Quick Test Only)

**⚠️ Warning: Only use this for testing! Not secure for production.**

Run this SQL in your Supabase SQL Editor:

```sql
ALTER TABLE community_registrations DISABLE ROW LEVEL SECURITY;
```

## Steps to Apply:

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste **Option 1** SQL above
6. Click **Run** (or press Ctrl+Enter)
7. Refresh your app and try submitting the form again

## After Fixing:

If you used **Option 2** (disabled RLS), remember to re-enable it later:

```sql
ALTER TABLE community_registrations ENABLE ROW LEVEL SECURITY;
```

Then apply the policies from **Option 1**.

## Verify It Worked:

After running the SQL:
1. Go back to your community page
2. Fill out and submit the registration form
3. Check the **Table Editor** in Supabase to see your new record
