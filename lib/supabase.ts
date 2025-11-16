import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Validate Supabase configuration
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase configuration missing. Please check your .env.local file.');
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// TypeScript types for the community registration
export interface CommunityRegistration {
  id?: string;
  full_name: string;
  email: string;
  role: 'founder' | 'investor' | 'mentor';
  organization?: string;
  linkedin_url: string;

  // Founder fields
  startup_stage?: 'idea' | 'early-traction' | 'scaling' | 'revenue';
  biggest_challenge?: 'team' | 'funding' | 'mentorship' | 'product';
  preferred_support?: 'community' | 'platform' | 'both';
  comfort_sharing_feedback?: number;
  connection_mode?: 'dm' | 'matchmaking' | 'events';
  mentorship_type?: 'founder' | 'industry' | 'technical' | 'business';
  founder_feature_suggestion?: string;

  // Investor/Mentor fields
  focus_areas?: string;
  preferred_startup_stage?: 'idea' | 'mvp' | 'scaling' | 'revenue';
  approach_frequency?: 'rarely' | 'sometimes' | 'often';
  interaction_mode?: 'open-dms' | 'filtered' | 'platform-only';
  interest_in?: 'mentorship' | 'investment' | 'both';
  investor_feature_suggestion?: string;

  // Common fields
  unique_feature_suggestion: string;
  status?: 'pending' | 'verified' | 'approved' | 'rejected';
  created_at?: string;
  updated_at?: string;
}

// Function to submit community registration
export async function submitCommunityRegistration(data: CommunityRegistration) {
  // Validate Supabase is configured
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase is not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file.');
  }

  console.log('Submitting registration data:', data);

  const { data: result, error } = await supabase
    .from('community_registrations')
    .insert([
      {
        full_name: data.full_name,
        email: data.email,
        role: data.role,
        organization: data.organization,
        linkedin_url: data.linkedin_url,

        // Founder fields
        startup_stage: data.startup_stage,
        biggest_challenge: data.biggest_challenge,
        preferred_support: data.preferred_support,
        comfort_sharing_feedback: data.comfort_sharing_feedback,
        connection_mode: data.connection_mode,
        mentorship_type: data.mentorship_type,
        founder_feature_suggestion: data.founder_feature_suggestion,

        // Investor/Mentor fields
        focus_areas: data.focus_areas,
        preferred_startup_stage: data.preferred_startup_stage,
        approach_frequency: data.approach_frequency,
        interaction_mode: data.interaction_mode,
        interest_in: data.interest_in,
        investor_feature_suggestion: data.investor_feature_suggestion,

        // Common fields
        unique_feature_suggestion: data.unique_feature_suggestion,
      },
    ])
    .select();

  if (error) {
    console.error('Supabase error:', error);

    // Provide more specific error messages
    if (error.code === '42P01') {
      throw new Error('Database table not found. Please run the SQL schema in Supabase.');
    } else if (error.code === '42501' || error.message?.includes('row-level security')) {
      throw new Error('Permission denied. Please check the RLS policies in Supabase. See QUICK_FIX_RLS.md for solution.');
    } else if (error.code === '23505') {
      throw new Error('This email is already registered.');
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error('Failed to submit registration. Please try again.');
    }
  }

  console.log('Registration successful:', result);
  return result;
}

// Function to get all registrations (admin only)
export async function getAllRegistrations() {
  const { data, error } = await supabase
    .from('community_registrations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

// Function to get registrations by role
export async function getRegistrationsByRole(role: 'founder' | 'investor' | 'mentor') {
  const { data, error } = await supabase
    .from('community_registrations')
    .select('*')
    .eq('role', role)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

// Function to get registrations by status
export async function getRegistrationsByStatus(status: 'pending' | 'verified' | 'approved' | 'rejected') {
  const { data, error } = await supabase
    .from('community_registrations')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

// Function to update registration status
export async function updateRegistrationStatus(
  id: string,
  status: 'pending' | 'verified' | 'approved' | 'rejected',
  notes?: string
) {
  const { data, error } = await supabase
    .from('community_registrations')
    .update({
      status,
      verification_notes: notes,
      verified_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select();

  if (error) {
    throw error;
  }

  return data;
}

// Function to get registration analytics
export async function getRegistrationAnalytics() {
  const { data, error } = await supabase
    .from('registration_analytics')
    .select('*');

  if (error) {
    throw error;
  }

  return data;
}
