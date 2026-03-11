'use client';

import Image from 'next/image';
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import {
  Info,
  Download,
  CalendarDays,
  MapPin,
  Clock,
  History,
  Trophy,
  Copy,
  Check,
  Share2,
  Users,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ments.app';

const pastEvents = [
  {
    title: 'Pitch & Dev Summit',
    description:
      'A high-energy day of startup pitches, hands-on dev sessions, and real networking.',
    date: new Date(2025, 8, 20),
    duration: '2 hours',
    format: 'Virtual',
    location: 'Online',
    poster: '/postersept.jpeg',
  },
];

interface LeaderboardEntry {
  name: string;
  referral_count: number;
}

export default function EventsPage() {
  const { toast } = useToast();

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openInfo, setOpenInfo] = useState(false);

  // Registration form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Referral state
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const [referralToken, setReferralToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Leaderboard
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);

  // Get referral token from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) setReferralToken(ref);
  }, []);

  // Check stored registration
  useEffect(() => {
    const stored = localStorage.getItem('ments_registration_id');
    if (stored) setRegistrationId(stored);
  }, []);

  // Fetch upcoming event
  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true })
        .limit(1);

      if (error) {
        setError('Failed to fetch event. Please try again later.');
        setEvent(null);
      } else {
        setEvent(data?.[0] ?? null);
      }
      setLoading(false);
    };
    fetchEvent();
  }, []);

  // Fetch leaderboard
  const fetchLeaderboard = useCallback(async () => {
    try {
      const params = event?.id ? `?event_id=${event.id}` : '';
      const res = await fetch(`/api/leaderboard${params}`);
      const json = await res.json();
      if (json.leaderboard) setLeaderboard(json.leaderboard);
    } catch {
      // silently fail
    }
    setLeaderboardLoading(false);
  }, [event?.id]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const referralLink = registrationId
    ? `${SITE_URL}/events?ref=${registrationId}`
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || null,
          event_id: event?.id || null,
          referral_token: referralToken,
        }),
      });

      const json = await res.json();

      if (res.status === 409) {
        setRegistrationId(json.registration_id);
        localStorage.setItem('ments_registration_id', json.registration_id);
        toast({
          title: "Already registered!",
          description:
            "You're already signed up. Share your referral link to climb the leaderboard!",
        });
      } else if (res.ok) {
        setRegistrationId(json.registration_id);
        localStorage.setItem('ments_registration_id', json.registration_id);
        toast({
          title: "You're in!",
          description:
            'Registration successful. Share your referral link to win rewards!',
        });
        fetchLeaderboard();
      } else {
        toast({
          title: 'Registration failed',
          description: json.error || 'Please try again.',
          variant: 'destructive',
        });
      }
    } catch {
      toast({
        title: 'Something went wrong',
        description: 'Check your connection and try again.',
        variant: 'destructive',
      });
    }
    setSubmitting(false);
  };

  const copyLink = async () => {
    if (!referralLink) return;
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast({ title: 'Link copied!', description: 'Share it with friends.' });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: 'Copy failed',
        description: 'Please copy manually.',
        variant: 'destructive',
      });
    }
  };

  const shareLink = async () => {
    if (!referralLink) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join me at the Ments event!',
          text: 'Register for the upcoming Ments event using my referral link:',
          url: referralLink,
        });
      } catch {
        // user cancelled
      }
    } else {
      copyLink();
    }
  };

  const computedDate = event?.date ? new Date(event.date) : new Date(2026, 2, 13);
  const computedDuration = event?.duration || '1.5 hours';
  const computedFormat = event?.mode || 'Virtual';
  const computedLocation = event?.location || 'Online';

  const formatDayMonth = (d: Date) => {
    const day = d.getDate();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    return `${day} ${months[d.getMonth()]}`;
  };

  const normalizeEventFlow = (text?: string) => {
    if (!text) return text;
    const label = formatDayMonth(computedDate);
    const patterns = [/\b9(?:th)?\s*(?:of\s*)?aug(?:ust)?\b/gi, /\baug(?:ust)?\s*9(?:th)?\b/gi];
    let res = text;
    for (const re of patterns) res = res.replace(re, label);
    return res;
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* ambient blobs */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-emerald-300/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 pt-32 md:pt-36 pb-20">
        {/* Header */}
        <header className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border bg-white/70 px-4 py-1 text-sm text-gray-700 shadow-sm backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Upcoming Event
          </div>
          <h1 className="mt-4 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">
            Register. Refer. <span className="text-primary">Win.</span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Sign up for the event, share your unique referral link, and compete on the leaderboard for exclusive rewards.
          </p>
        </header>

        {/* Main grid: Event poster + details / Registration */}
        <div className="grid items-start gap-8 lg:grid-cols-[1.1fr,1fr]">
          {/* Left: Event poster + info */}
          <div className="space-y-6">
            {/* Poster */}
            <div className="group relative flex justify-center">
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-primary/20 via-fuchsia-300/20 to-emerald-300/20 blur-xl opacity-70 group-hover:opacity-100 transition" />
              <div className="relative overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5">
                <Image
                  src={event?.poster || '/placeholder.jpg'}
                  alt={event?.title || 'Upcoming Event'}
                  width={700}
                  height={1000}
                  priority
                  className="w-full max-w-sm md:max-w-md h-auto object-contain"
                />
              </div>
            </div>

            {/* Event details card */}
            <div className="rounded-2xl border bg-white/85 p-6 shadow-xl backdrop-blur ring-1 ring-gray-100">
              {loading ? (
                <SkeletonTitle />
              ) : error ? (
                <p className="text-red-600 font-semibold">{error}</p>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-primary">
                    {event?.title || 'Upcoming Event'}
                  </h2>
                  <p className="mt-3 text-gray-600 text-sm">
                    {event?.description ||
                      'Join an inspiring session with trailblazing entrepreneurs sharing their journeys, challenges, and strategies for building impactful businesses.'}
                  </p>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <Chip
                      icon={<CalendarDays className="h-4 w-4" />}
                      label="Date"
                      value={computedDate.toLocaleDateString(undefined, { dateStyle: 'long' })}
                    />
                    <Chip icon={<Clock className="h-4 w-4" />} label="Duration" value={computedDuration} />
                    <Chip icon={<MapPin className="h-4 w-4" />} label="Location" value={computedLocation} />
                    <Chip icon={<Info className="h-4 w-4" />} label="Format" value={computedFormat} />
                  </div>
                </>
              )}

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => setOpenInfo(true)}
                  className="w-full rounded-xl border px-6 py-3 font-semibold text-gray-800 hover:bg-gray-50 text-sm"
                >
                  <span className="inline-flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    More Info
                  </span>
                </button>
                <a
                  href="Ments (7).pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full rounded-xl border px-6 py-3 font-semibold text-gray-800 hover:bg-gray-50 text-sm text-center"
                >
                  <span className="inline-flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Download Brochure
                  </span>
                </a>
              </div>
            </div>

            {/* Beta hint */}
            <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Ments Beta is live</p>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    The full Ments platform is in beta testing. Top referrers get priority access.
                  </p>
                  <a
                    href="https://www.ments.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 mt-2 hover:text-emerald-900 transition-colors"
                  >
                    Try the Beta
                    <ChevronRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Registration form / referral + Leaderboard */}
          <div className="space-y-6">
            {/* Registration / Referral card */}
            {!registrationId ? (
              <div className="rounded-2xl border bg-white p-6 sm:p-8 shadow-xl">
                <h2 className="text-2xl font-bold mb-1">Register for the Event</h2>
                <p className="text-gray-500 text-sm mb-6">Get your spot and a unique referral link</p>

                {referralToken && (
                  <div className="mb-5 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-800">
                    <Users className="inline h-4 w-4 mr-1.5 -mt-0.5" />
                    You were invited! Register to help your friend climb the leaderboard.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone <span className="text-gray-400">(optional)</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-xl bg-primary px-6 py-3.5 font-semibold text-primary-foreground text-sm shadow hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {submitting ? 'Registering...' : 'Register & Get Referral Link'}
                  </button>
                </form>
              </div>
            ) : (
              <div className="rounded-2xl border bg-white p-6 sm:p-8 shadow-xl">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 mb-3">
                    <Check className="h-7 w-7 text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-bold">You're Registered!</h2>
                  <p className="text-gray-500 text-sm mt-1">Share your referral link to climb the leaderboard</p>
                </div>

                <div className="rounded-xl bg-gray-50 border p-4 mb-4">
                  <label className="block text-xs font-medium text-gray-500 mb-2">Your Referral Link</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={referralLink || ''}
                      className="flex-1 rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-700 font-mono truncate"
                    />
                    <button
                      onClick={copyLink}
                      className="rounded-lg border bg-white px-3 py-2.5 hover:bg-gray-50 transition"
                      title="Copy link"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <Copy className="h-4 w-4 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={shareLink}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground py-3 font-semibold text-sm hover:bg-primary/90 transition"
                  >
                    <Share2 className="h-4 w-4" />
                    Share Link
                  </button>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `Join me at the Ments event! Register here: ${referralLink}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl bg-green-600 text-white px-5 py-3 font-semibold text-sm hover:bg-green-700 transition"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.386" />
                    </svg>
                    WhatsApp
                  </a>
                </div>

                <p className="text-center text-xs text-gray-400 mt-4">
                  Every registration through your link counts toward your leaderboard rank
                </p>
              </div>
            )}

            {/* Leaderboard */}
            <div className="rounded-2xl border bg-white p-6 sm:p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Referral Leaderboard</h2>
                  <p className="text-sm text-gray-500">Top referrers win exclusive rewards</p>
                </div>
              </div>

              {leaderboardLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 animate-pulse">
                      <div className="h-8 w-8 rounded-full bg-gray-100" />
                      <div className="flex-1 h-4 rounded bg-gray-100" />
                      <div className="h-4 w-12 rounded bg-gray-100" />
                    </div>
                  ))}
                </div>
              ) : leaderboard.length > 0 ? (
                <div className="space-y-2">
                  {leaderboard.map((entry, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-4 rounded-xl px-4 py-3 transition ${
                        i === 0
                          ? 'bg-yellow-50 border border-yellow-200'
                          : i === 1
                          ? 'bg-gray-50 border border-gray-200'
                          : i === 2
                          ? 'bg-orange-50 border border-orange-200'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                          i === 0
                            ? 'bg-yellow-400 text-yellow-900'
                            : i === 1
                            ? 'bg-gray-300 text-gray-700'
                            : i === 2
                            ? 'bg-orange-300 text-orange-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {i + 1}
                      </div>
                      <div className="flex-1 font-medium text-gray-900 truncate">{entry.name}</div>
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-600">
                        <Users className="h-3.5 w-3.5" />
                        {entry.referral_count}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <Trophy className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No referrals yet — be the first!</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Register and share your link to top the leaderboard
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Past Events */}
        <section className="mt-16">
          <div className="mb-6 flex items-center gap-2">
            <History className="h-5 w-5 text-gray-500" />
            <h3 className="text-xl font-semibold">Past Events</h3>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pastEvents.map((pe, i) => (
              <div
                key={i}
                className="group relative rounded-2xl border bg-white/70 p-5 shadow-sm backdrop-blur ring-1 ring-gray-100 transition hover:shadow-md"
              >
                <div className="relative mb-4 overflow-hidden rounded-xl">
                  <Image
                    src={pe.poster}
                    alt={pe.title}
                    width={400}
                    height={240}
                    className="h-44 w-full object-cover"
                  />
                  <span className="absolute top-2 right-2 rounded-full bg-gray-800/80 px-3 py-0.5 text-xs font-medium text-white">
                    Completed
                  </span>
                </div>
                <h4 className="text-lg font-bold">{pe.title}</h4>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">{pe.description}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500">
                  <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1">
                    <CalendarDays className="h-3 w-3" />
                    {pe.date.toLocaleDateString(undefined, { dateStyle: 'long' })}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1">
                    <MapPin className="h-3 w-3" />
                    {pe.location}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1">
                    {pe.format}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* INFO MODAL */}
      {openInfo && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/50 px-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpenInfo(false)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <h4 className="text-xl font-bold text-primary">Event Information</h4>
              <button
                onClick={() => setOpenInfo(false)}
                className="rounded-md px-3 py-1.5 border hover:bg-gray-50"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 max-h-[60vh] space-y-5 overflow-y-auto text-gray-700">
              {event?.About && (
                <section>
                  <div className="font-semibold mb-1">About</div>
                  <p className="text-muted-foreground">{event.About}</p>
                </section>
              )}
              {event?.Who_Should_Participate && (
                <section>
                  <div className="font-semibold mb-1">Who Should Participate</div>
                  <p className="text-muted-foreground">{event.Who_Should_Participate}</p>
                </section>
              )}
              {event?.Why_Participate && (
                <section>
                  <div className="font-semibold mb-1">Why Participate</div>
                  <p className="text-muted-foreground">{event.Why_Participate}</p>
                </section>
              )}
              {event?.Event_Flow && (
                <section>
                  <div className="font-semibold mb-1">Event Flow</div>
                  <pre className="whitespace-pre-wrap text-muted-foreground">
                    {normalizeEventFlow(event.Event_Flow)}
                  </pre>
                </section>
              )}
              {!event && (
                <p className="text-sm text-gray-600">
                  Full schedule and judging criteria will appear here soon.
                </p>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setOpenInfo(false)}
                className="rounded-md bg-primary px-6 py-2.5 font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* --- tiny UI helpers --- */
function Chip({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border bg-white px-3 py-3 shadow-sm">
      <div className="mt-0.5">{icon}</div>
      <div>
        <div className="text-xs text-gray-500">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );
}

function SkeletonTitle() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-2/3 rounded bg-gray-200" />
      <div className="mt-3 h-4 w-full rounded bg-gray-100" />
      <div className="mt-2 h-4 w-5/6 rounded bg-gray-100" />
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 rounded-xl bg-gray-100" />
        ))}
      </div>
    </div>
  );
}
