-- =====================================================
-- Ments Community Registration Database Schema
-- =====================================================

-- Drop existing tables if they exist (careful in production!)
-- DROP TABLE IF EXISTS community_registrations CASCADE;

-- =====================================================
-- Main Community Registrations Table
-- =====================================================
CREATE TABLE IF NOT EXISTS community_registrations (
  -- Primary Key
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Basic Details
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(50) NOT NULL CHECK (role IN ('founder', 'investor', 'mentor')),
  organization VARCHAR(255),
  linkedin_url VARCHAR(500) NOT NULL,

  -- Founder Specific Fields
  startup_stage VARCHAR(50) CHECK (startup_stage IN ('idea', 'early-traction', 'scaling', 'revenue') OR startup_stage IS NULL),
  biggest_challenge VARCHAR(50) CHECK (biggest_challenge IN ('team', 'funding', 'mentorship', 'product') OR biggest_challenge IS NULL),
  preferred_support VARCHAR(50) CHECK (preferred_support IN ('community', 'platform', 'both') OR preferred_support IS NULL),
  comfort_sharing_feedback INTEGER CHECK (comfort_sharing_feedback BETWEEN 1 AND 5 OR comfort_sharing_feedback IS NULL),
  connection_mode VARCHAR(50) CHECK (connection_mode IN ('dm', 'matchmaking', 'events') OR connection_mode IS NULL),
  mentorship_type VARCHAR(50) CHECK (mentorship_type IN ('founder', 'industry', 'technical', 'business') OR mentorship_type IS NULL),
  founder_feature_suggestion TEXT,

  -- Investor/Mentor Specific Fields
  focus_areas TEXT,
  preferred_startup_stage VARCHAR(50) CHECK (preferred_startup_stage IN ('idea', 'mvp', 'scaling', 'revenue') OR preferred_startup_stage IS NULL),
  approach_frequency VARCHAR(50) CHECK (approach_frequency IN ('rarely', 'sometimes', 'often') OR approach_frequency IS NULL),
  interaction_mode VARCHAR(50) CHECK (interaction_mode IN ('open-dms', 'filtered', 'platform-only') OR interaction_mode IS NULL),
  interest_in VARCHAR(50) CHECK (interest_in IN ('mentorship', 'investment', 'both') OR interest_in IS NULL),
  investor_feature_suggestion TEXT,

  -- Common Final Fields
  unique_feature_suggestion TEXT NOT NULL,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

  -- Status tracking
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'approved', 'rejected')),
  verification_notes TEXT,
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID
);

-- =====================================================
-- Indexes for Performance
-- =====================================================

-- Index on email for quick lookups
CREATE INDEX IF NOT EXISTS idx_community_email ON community_registrations(email);

-- Index on role for filtering
CREATE INDEX IF NOT EXISTS idx_community_role ON community_registrations(role);

-- Index on status for admin filtering
CREATE INDEX IF NOT EXISTS idx_community_status ON community_registrations(status);

-- Index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_community_created_at ON community_registrations(created_at DESC);

-- =====================================================
-- Function to Update updated_at Timestamp
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- Trigger to Auto-update updated_at
-- =====================================================

DROP TRIGGER IF EXISTS update_community_registrations_updated_at ON community_registrations;

CREATE TRIGGER update_community_registrations_updated_at
  BEFORE UPDATE ON community_registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Row Level Security (RLS) Policies
-- =====================================================

-- Enable RLS
ALTER TABLE community_registrations ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert (register) - both anonymous and authenticated
CREATE POLICY "Anyone can register"
  ON community_registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy: Anyone can view registrations (you can restrict this later)
CREATE POLICY "Anyone can view registrations"
  ON community_registrations
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Policy: Authenticated users can update their own registration
CREATE POLICY "Users can update own registration"
  ON community_registrations
  FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'email' = email)
  WITH CHECK (auth.jwt() ->> 'email' = email);

-- =====================================================
-- Helper Views for Different Roles
-- =====================================================

-- View: Founder Registrations
CREATE OR REPLACE VIEW founder_registrations AS
SELECT
  id,
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
FROM community_registrations
WHERE role = 'founder';

-- View: Investor Registrations
CREATE OR REPLACE VIEW investor_registrations AS
SELECT
  id,
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
FROM community_registrations
WHERE role = 'investor';

-- View: Mentor Registrations
CREATE OR REPLACE VIEW mentor_registrations AS
SELECT
  id,
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
FROM community_registrations
WHERE role = 'mentor';

-- =====================================================
-- Analytics View
-- =====================================================

CREATE OR REPLACE VIEW registration_analytics AS
SELECT
  role,
  status,
  COUNT(*) as count,
  DATE_TRUNC('day', created_at) as registration_date
FROM community_registrations
GROUP BY role, status, DATE_TRUNC('day', created_at)
ORDER BY registration_date DESC;

-- =====================================================
-- Example Queries
-- =====================================================

-- Get all pending founder registrations
-- SELECT * FROM founder_registrations WHERE status = 'pending' ORDER BY created_at DESC;

-- Get all verified investors interested in both mentorship and investment
-- SELECT * FROM investor_registrations WHERE status = 'verified' AND interest_in = 'both';

-- Get registration counts by role
-- SELECT role, COUNT(*) as total FROM community_registrations GROUP BY role;

-- Get recent registrations (last 7 days)
-- SELECT * FROM community_registrations WHERE created_at >= NOW() - INTERVAL '7 days' ORDER BY created_at DESC;

-- =====================================================
-- Grant Permissions (adjust based on your needs)
-- =====================================================

-- Grant access to authenticated users
GRANT SELECT, INSERT ON community_registrations TO authenticated;
GRANT SELECT ON founder_registrations TO authenticated;
GRANT SELECT ON investor_registrations TO authenticated;
GRANT SELECT ON mentor_registrations TO authenticated;
GRANT SELECT ON registration_analytics TO authenticated;

-- Grant access to anonymous users (for public registration)
GRANT INSERT ON community_registrations TO anon;

-- =====================================================
-- Sample Data (Optional - for testing)
-- =====================================================

-- INSERT INTO community_registrations (
--   full_name, email, role, organization, linkedin_url,
--   startup_stage, biggest_challenge, preferred_support,
--   comfort_sharing_feedback, connection_mode, mentorship_type,
--   unique_feature_suggestion
-- ) VALUES (
--   'John Doe',
--   'john.doe@example.com',
--   'founder',
--   'TechStartup Inc',
--   'https://linkedin.com/in/johndoe',
--   'early-traction',
--   'funding',
--   'both',
--   4,
--   'matchmaking',
--   'technical',
--   'AI-powered mentor matching based on startup needs'
-- );
