import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// Helper function to send JSON responses
function jsonResponse(status: number, data: any) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function POST(request: Request) {
  try {
    const { username, email, reason, feedback } = await request.json();

    // Basic validation
    if (!email || !username) {
      return jsonResponse(400, {
        error: 'Validation failed',
        details: 'Email and username are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return jsonResponse(400, {
        error: 'Validation failed',
        details: 'Please enter a valid email address'
      });
    }

    // Call the database function to handle the deletion request
    const { data, error } = await supabase.rpc('handle_account_deletion_request', {
      p_username: username,
      p_email: email,
      p_reason: reason,
      p_feedback: feedback || ''
    });

    if (error) {
      console.error('Error processing deletion request:', error);
      throw new Error('Failed to process deletion request');
    }

    // Check if this was a duplicate request
    if (data?.is_duplicate) {
      return jsonResponse(200, {
        success: true,
        isDuplicate: true,
        message: data.message || 'A deletion request is already being processed for this email.'
      });
    }

    return jsonResponse(200, {
      success: true,
      message: 'Your account deletion request has been received and is being processed.',
      data: newRequest
    });

  } catch (error) {
    console.error('Error processing deletion request:', error);
    
    // Handle different types of errors
    if (error instanceof Error) {
      return jsonResponse(500, {
        error: 'Internal Server Error',
        details: error.message,
        name: error.name
      });
    }
    
    return jsonResponse(500, {
      error: 'Internal Server Error',
      details: 'An unexpected error occurred while processing your request.'
    });
  }
}

export async function GET() {
  return new Response(
    JSON.stringify({ error: 'Method not allowed' }),
    {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}
