'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';

const designationOptions = [
  'Student',
  'Founder / Co-Founder',
  'Working Professional',
  'Freelancer',
  'Mentor / Advisor',
  'Investor',
  'Other',
];

const genderOptions = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

type FormData = {
  name: string;
  email: string;
  phone: string;
  gender: string;
  organization: string;
  designation: string;
  other_designation: string;
  linkedin: string;
  city: string;
};

const initialForm: FormData = {
  name: '',
  email: '',
  phone: '',
  gender: '',
  organization: '',
  designation: '',
  other_designation: '',
  linkedin: '',
  city: '',
};

export default function RegistrationPage() {
  return (
    <Suspense fallback={
      <section className="relative w-full min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="container mx-auto max-w-2xl px-4 sm:px-6 flex justify-center pt-20">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </section>
    }>
      <RegistrationContent />
    </Suspense>
  );
}

function RegistrationContent() {
  const searchParams = useSearchParams();
  const refToken = searchParams.get('ref');
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eventId, setEventId] = useState<string | null>(null);
  const [referrerName, setReferrerName] = useState<string | null>(null);

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload: Record<string, string | null> = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      gender: form.gender,
      organization: form.organization.trim(),
      designation: form.designation,
      linkedin: form.linkedin.trim(),
      city: form.city.trim(),
      Event_id: eventId,
    };

    if (form.designation === 'Other') {
      payload.other_designation = form.other_designation.trim();
    }

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
      setForm(initialForm);
    }
    setSubmitting(false);
  };

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
      <div className="container mx-auto max-w-2xl px-4 sm:px-6">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Event Registration
          </h1>
          <p className="text-muted-foreground mt-2">
            Fill in the form below to secure your spot.
          </p>
        </header>

        {referrerName && (
          <div className="mb-6 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-center">
            <p className="text-sm text-emerald-700">
              Referred by <span className="font-semibold">{referrerName}</span>
            </p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border bg-white p-6 sm:p-8 shadow-lg"
        >
          {/* Name */}
          <Field label="Full Name" required>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Jane Doe"
              className="input-style"
            />
          </Field>

          {/* Email */}
          <Field label="Email" required>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="jane@example.com"
              className="input-style"
            />
          </Field>

          {/* Phone */}
          <Field label="Phone Number" required>
            <input
              type="tel"
              name="phone"
              required
              value={form.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className="input-style"
            />
          </Field>

          {/* Gender */}
          <Field label="Gender" required>
            <select
              name="gender"
              required
              value={form.gender}
              onChange={handleChange}
              className="input-style"
            >
              <option value="" disabled>
                Select gender
              </option>
              {genderOptions.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </Field>

          {/* Organization */}
          <Field label="Organization / College">
            <input
              type="text"
              name="organization"
              value={form.organization}
              onChange={handleChange}
              placeholder="Acme Inc. / XYZ University"
              className="input-style"
            />
          </Field>

          {/* Designation */}
          <Field label="Designation" required>
            <select
              name="designation"
              required
              value={form.designation}
              onChange={handleChange}
              className="input-style"
            >
              <option value="" disabled>
                Select designation
              </option>
              {designationOptions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </Field>

          {form.designation === 'Other' && (
            <Field label="Please specify" required>
              <input
                type="text"
                name="other_designation"
                required
                value={form.other_designation}
                onChange={handleChange}
                placeholder="Your role"
                className="input-style"
              />
            </Field>
          )}

          {/* LinkedIn */}
          <Field label="LinkedIn Profile">
            <input
              type="url"
              name="linkedin"
              value={form.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/janedoe"
              className="input-style"
            />
          </Field>

          {/* City */}
          <Field label="City" required>
            <input
              type="text"
              name="city"
              required
              value={form.city}
              onChange={handleChange}
              placeholder="Mumbai"
              className="input-style"
            />
          </Field>

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
            {submitting ? 'Submitting…' : 'Register'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          By registering you agree to receive event-related communications from
          Ments.
        </p>
      </div>

      {/* scoped utility class */}
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

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </span>
      {children}
    </label>
  );
}
