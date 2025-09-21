'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useToast } from './ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { waitlistService } from '@/services/waitlistService';
import { WaitlistEntry } from '@/types/waitlist';

interface FormData {
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
}

export default function WaitlistForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    interest: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      interest: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.name) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Form submission started with data:', {
        ...formData,
        email: formData.email,
        phone: formData.phone ? '*****' : 'not provided'
      });
      
      const { data, error, isDuplicate }: { 
        data: WaitlistEntry | null; 
        error: Error | null; 
        isDuplicate?: boolean 
      } = await waitlistService.addWaitlistEntry({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone?.trim(),
        interest: formData.interest,
        message: formData.message?.trim(),
      });

      if (error || !data) {
        throw error || new Error('Failed to submit form');
      }

      toast({
        title: isDuplicate ? 'Updated!' : 'Success!',
        description: isDuplicate 
          ? 'Your information has been updated on our waitlist.'
          : 'Thank you for joining our waitlist!',
      });
      
      // Only reset form if it's a new entry
      if (!isDuplicate) {
        setFormData({
          name: '',
          email: '',
          phone: '',
          interest: '',
          message: ''
        });
      }
    } catch (error) {
      // Log detailed error information
      const errorInfo: {
        timestamp: string;
        error: any;
        formData: {
          email: string;
          name: string;
          hasPhone: boolean;
          interest: string;
          hasMessage: boolean;
        };
        environment: {
          isClient: boolean;
          supabaseConfigured: boolean;
          nodeEnv: string | undefined;
        };
      } = {
        timestamp: new Date().toISOString(),
        error: {},
        formData: {
          email: formData.email ? '*****@****' : 'not provided',
          name: formData.name ? '*****' : 'not provided',
          hasPhone: !!formData.phone,
          interest: formData.interest || 'not provided',
          hasMessage: !!formData.message
        },
        environment: {
          isClient: typeof window !== 'undefined',
          supabaseConfigured: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          nodeEnv: process.env.NODE_ENV
        }
      };

      // Process the error object
      if (error) {
        if (error instanceof Error) {
          errorInfo.error = {
            name: error.name,
            message: error.message,
            ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
          };
        } else if (typeof error === 'object') {
          // Handle Supabase/PostgREST errors
          const err = error as Record<string, unknown>;
          errorInfo.error = {
            name: (err.name as string) || 'DatabaseError',
            message: (err.message as string) || 'Database operation failed',
            code: err.code ? String(err.code) : undefined,
            details: err.details,
            hint: err.hint ? String(err.hint) : undefined
          };
        } else {
          errorInfo.error = { message: String(error) };
        }
      }

      // Log the error
      console.error('Form submission failed:', JSON.stringify(errorInfo, null, 2));

      // User-friendly error messages
      let userMessage = 'Failed to submit form. Please try again later.';
      let errorTitle = 'Error';
      
      const errorCode = errorInfo.error?.code;
      const errorMessage = String(errorInfo.error?.message || '').toLowerCase();
      
      if (errorCode === 'PGRST204' || errorMessage.includes('relation') || errorMessage.includes('table')) {
        errorTitle = 'Database Error';
        userMessage = 'We\'re having trouble connecting to our database. Our team has been notified. Please try again later.';
      } 
      else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        errorTitle = 'Connection Error';
        userMessage = 'Unable to connect to our servers. Please check your internet connection and try again.';
      } 
      else if (errorMessage.includes('unique') || errorMessage.includes('duplicate')) {
        errorTitle = 'Already Registered';
        userMessage = 'This email is already on our waitlist. Thank you for your interest!';
      } 
      else if (errorMessage.includes('row-level security') || errorMessage.includes('permission')) {
        errorTitle = 'Permission Denied';
        userMessage = 'We encountered a permissions issue. Please refresh the page and try again.';
      }
      
      // Log the user-friendly error for debugging
      console.error(`[${errorTitle}] ${userMessage}`, { errorCode, originalError: errorInfo.error });

      toast({
        title: errorTitle,
        description: userMessage,
        variant: 'destructive',
        duration: 5000
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-gray-300">Full Name *</label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-white/50"
            disabled={isLoading}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-300">Email *</label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-white/50"
            disabled={isLoading}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium text-gray-300">Phone Number</label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={formData.phone}
            onChange={handleChange}
            className="w-full bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-white/50"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="interest" className="text-sm font-medium text-gray-300">I'm interested in</label>
          <Select onValueChange={handleSelectChange} value={formData.interest}>
            <SelectTrigger className="w-full bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-white/50">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700 text-white">
              <SelectItem value="entrepreneur">Starting a Business</SelectItem>
              <SelectItem value="investor">Investment Opportunities</SelectItem>
              <SelectItem value="partner">Partnership</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium text-gray-300">Tell us more about your interest</label>
        <Textarea
          id="message"
          name="message"
          placeholder="What are you looking to achieve with us?"
          value={formData.message}
          onChange={handleChange}
          className="w-full bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-white/50 min-h-[100px]"
          disabled={isLoading}
        />
      </div>

      <div className="pt-2">
        <Button 
          type="submit" 
          className="w-full bg-white text-black hover:bg-gray-100 text-base py-2 h-auto"
          disabled={isLoading}
        >
          {isLoading ? 'Submitting...' : 'Join Waitlist'}
        </Button>
      </div>
      
      <p className="text-xs text-gray-400 text-center">
        We respect your privacy. Your information will not be shared with third parties.
      </p>
    </form>
  );
}
