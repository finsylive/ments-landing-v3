'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/auth-context';
import { CheckCircle2, Loader2, ArrowLeft, User } from 'lucide-react';

const designationOptions = [
  'Student',
  'Founder / Co-Founder',
  'Working Professional',
  'Freelancer',
  'Mentor / Advisor',
  'Investor',
  'Other',
];

export default function RegistrationPage() {
  return (
    <Suspense
      fallback={
        <section className="relative w-full min-h-screen bg-gray-50 pt-24 pb-12">
          <div className="container mx-auto max-w-2xl px-4 sm:px-6 flex justify-center pt-20">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        </section>
      }
    >
      <RegistrationContent />
    </Suspense>
  );
}

function RegistrationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const refToken = searchParams.get('ref');
  const { user, loading: authLoading } = useAuth();

  const [phone, setPhone] = useState('');
  const [designation, setDesignation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eventId, setEventId] = useState<string | null>(null);
  const [referrerName, setReferrerName] = useState<string | null>(null);

  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || '';
  const userEmail = user?.email || '';

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      const ref = refToken ? `?ref=${refToken}` : '';
      router.push(`/login?redirect=/events/registration${ref}`);
    }
  }, [authLoading, user, router, refToken]);

  useEffect(() => {
    const fetchCurrentEvent = async () => {
      const { data } = await supabase
        .from('events')
        .select('id')
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true })
        .limit(1);
      setEventId(data?.[0]?.id ?? null);
    };
    fetchCurrentEvent();

    if (refToken) {
      supabase
        .from('event_referrals')
        .select('referrer_name')
        .eq('token', refToken)
        .maybeSingle()
        .then(({ data }) => {
          if (data?.referrer_name) setReferrerName(data.referrer_name);
        });
    }
  }, [refToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userEmail) return;
    setSubmitting(true);
    setError(null);

    const payload: Record<string, string | null> = {
      name: userName,
      email: userEmail,
      phone: phone.trim(),
      designation,
      Event_id: eventId,
    };

    if (refToken) {
      payload.referral_token = refToken;
    }

    const { error: dbError } = await supabase
      .from('registrations')
      .insert([payload]);

    if (dbError) {
      const isDuplicate =
        dbError.code === '23505' ||
        dbError.message.includes('duplicate') ||
        dbError.message.includes('unique');
      setError(
        isDuplicate
          ? 'You have already registered for this event with this email.'
          : dbError.message,
      );
    } else {
      if (refToken) {
        supabase.rpc('increment_referral_count', { p_token: refToken }).then(() => {});
      }
      setSuccess(true);
    }
    setSubmitting(false);
  };

  if (authLoading) {
    return (
      <section className="relative w-full min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="container mx-auto max-w-2xl px-4 sm:px-6 flex justify-center pt-20">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </section>
    );
  }

  if (success) {
    return (
      <section className="relative w-full min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="container mx-auto max-w-xl px-4 sm:px-6">
          <div className="rounded-2xl border bg-white p-10 text-center shadow-lg">
            <CheckCircle2 className="mx-auto h-14 w-14 text-green-500" />
            <h2 className="mt-4 text-2xl font-bold">You're Registered!</h2>
            <p className="mt-2 text-gray-600">
              Thank you for signing up. We'll send event details to your email
              shortly.
            </p>
            <Link
              href="/events"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Events
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto max-w-lg px-4 sm:px-6">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Event Registration
          </h1>
          <p className="text-muted-foreground mt-2">
            Just a couple more details to secure your spot.
          </p>
        </header>

        {referrerName && (
          <div className="mb-6 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-center">
            <p className="text-sm text-emerald-700">
              Referred by <span className="font-semibold">{referrerName}</span>
            </p>
          </div>
        )}

        {/* Auto-filled user info from Google login */}
        <div className="mb-5 rounded-xl bg-gray-50 border p-4 flex items-center gap-3">
          {user?.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt=""
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="h-5 w-5 text-gray-500" />
            </div>
          )}
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 truncate">{userName}</p>
            <p className="text-sm text-gray-500 truncate">{userEmail}</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border bg-white p-6 sm:p-8 shadow-lg"
        >
          {/* Phone */}
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-gray-700">
              Phone Number <span className="text-red-500 ml-0.5">*</span>
            </span>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="input-style"
            />
          </label>

          {/* Designation */}
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-gray-700">
              I am a <span className="text-red-500 ml-0.5">*</span>
            </span>
            <select
              required
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className="input-style"
            >
              <option value="" disabled>
                Select your role
              </option>
              {designationOptions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? 'Registering…' : 'Register'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          By registering you agree to receive event-related communications from
          Ments.
        </p>
      </div>

      <style jsx global>{`
        .input-style {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid #e5e7eb;
          padding: 0.625rem 0.875rem;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.15s;
          background: white;
        }
        .input-style:focus {
          border-color: hsl(var(--primary));
          box-shadow: 0 0 0 2px hsl(var(--primary) / 0.15);
        }
      `}</style>
    </section>
  );
}
