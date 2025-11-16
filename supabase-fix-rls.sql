-- =====================================================
-- Fix Row Level Security for Community Registrations
-- =====================================================

-- First, drop existing policies
DROP POLICY IF EXISTS "Anyone can register" ON community_registrations;
DROP POLICY IF EXISTS "Users can view own registration" ON community_registrations;
DROP POLICY IF EXISTS "Admins can view all registrations" ON community_registrations;
DROP POLICY IF EXISTS "Admins can update registrations" ON community_registrations;

-- Make sure RLS is enabled
ALTER TABLE community_registrations ENABLE ROW LEVEL SECURITY;

-- Create a simple policy that allows anyone to insert
CREATE POLICY "Enable insert for all users"
  ON community_registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create a policy that allows anyone to read (you can restrict this later)
CREATE POLICY "Enable read for all users"
  ON community_registrations
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Optionally: Allow authenticated users to update their own records
CREATE POLICY "Enable update for authenticated users"
  ON community_registrations
  FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'email' = email)
  WITH CHECK (auth.jwt() ->> 'email' = email);
