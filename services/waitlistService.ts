import { supabase } from '@/lib/supabaseClient';
import { WaitlistEntry, WaitlistResponse } from '@/types/waitlist';

export const waitlistService = {
  async addWaitlistEntry(entry: Omit<WaitlistEntry, 'id' | 'created_at' | 'status' | 'updated_at'>): Promise<WaitlistResponse> {
    try {
      console.log('Submitting to Supabase:', {
        table: 'waitlist',
        email: entry.email,
        name: entry.name
      });

      // First, check if email already exists
      const { data: existingEntry } = await supabase
        .from('waitlist')
        .select('email')
        .eq('email', entry.email)
        .maybeSingle();

      if (existingEntry) {
        // Update existing entry
        const { data, error } = await supabase
          .from('waitlist')
          .update({
            name: entry.name,
            phone: entry.phone || undefined,
            interest: entry.interest || undefined,
            message: entry.message || undefined,
            status: 'pending',
            updated_at: new Date().toISOString()
          })
          .eq('email', entry.email)
          .select()
          .single<WaitlistEntry>();

        if (error) throw error;
        
        return { 
          data, 
          error: null,
          isDuplicate: true 
        };
      } else {
        // Insert new entry
        const { data, error } = await supabase
          .from('waitlist')
          .insert([{ ...entry, status: 'pending' }])
          .select()
          .single<WaitlistEntry>();

        if (error) throw error;
        
        return { data, error: null, isDuplicate: false };
      }
    } catch (error: unknown) {
      // Safely extract error information
      let errorMessage = 'An unknown error occurred';
      let errorName = 'UnknownError';
      
      // Initialize safe error object
      const safeError: {
        name: string;
        message: string;
        code?: string;
        details?: any;
        hint?: string;
        status?: any;
        statusCode?: any;
        stack?: string;
      } = {
        name: errorName,
        message: errorMessage
      };
      
      // Process the error object
      if (error) {
        // Handle standard Error objects
        if (error instanceof Error) {
          safeError.name = error.name || 'Error';
          safeError.message = error.message || 'Unknown error';
          safeError.stack = error.stack;
        } 
        // Handle Supabase/PostgREST errors
        else if (typeof error === 'object') {
          const err = error as Record<string, unknown>;
          
          // Standard error properties
          safeError.name = (err.name as string) || 'DatabaseError';
          safeError.message = (err.message as string) || 'Database operation failed';
          
          // Supabase/PostgREST specific properties
          if ('code' in err) safeError.code = String(err.code);
          if ('details' in err) safeError.details = err.details;
          if ('hint' in err) safeError.hint = String(err.hint || 'No hint provided');
          if ('status' in err) safeError.status = err.status;
          if ('statusCode' in err) safeError.statusCode = err.statusCode;
          
          // Handle specific error codes
          if (safeError.code === 'PGRST204') {
            safeError.message = 'Database table not found or empty result';
            safeError.hint = 'Please verify that the "waitlist" table exists and contains data';
          }
        }
        // Handle string errors
        else if (typeof error === 'string') {
          safeError.message = error;
        }
      }

      // Create a safe error object for logging
      const logError = {
        timestamp: new Date().toISOString(),
        service: 'waitlistService.addWaitlistEntry',
        email: entry.email,
        error: safeError,
        environment: {
          nodeEnv: process.env.NODE_ENV,
          isClient: typeof window !== 'undefined'
        }
      };

      // Log the error in a way that won't throw
      try {
        console.error('Waitlist Service Error:', JSON.stringify(logError, null, 2));
      } catch (loggingError) {
        // Fallback logging if JSON.stringify fails
        console.error('Waitlist Service Error (fallback):', {
          timestamp: new Date().toISOString(),
          message: 'Failed to log error details',
          originalError: safeError.message,
          loggingError: loggingError instanceof Error ? loggingError.message : 'Unknown logging error'
        });
      }
      
      return { 
        data: null, 
        error: new Error(safeError.message || 'Failed to add to waitlist', { 
          cause: error 
        }),
        isDuplicate: safeError.code === '23505' // Check for unique violation
      };
    }
  },

  async getWaitlist() {
    try {
      const { data, error } = await supabase
        .from('waitlist')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching waitlist:', error);
      throw error;
    }
  }
};
