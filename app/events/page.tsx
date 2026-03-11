'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Info, Download, CalendarDays, MapPin, Clock, History, Share2, Copy, Check, Loader2, X } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';

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

export default function EventsPage() {
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openInfo, setOpenInfo] = useState(false);
  const [referralOpen, setReferralOpen] = useState(false);
  const [referralData, setReferralData] = useState<any>(null);
  const [referralLoading, setReferralLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

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

  const computedDate = event?.date ? new Date(event.date) : new Date(2026, 2, 13); // 13 March 2026
  const computedDuration = event?.duration || '1.5 hours';
  const computedFormat = event?.mode || 'Virtual';
  const computedLocation = event?.location || 'Online';

  // Normalize any hard-coded/wrong dates in Event_Flow text to the computed event date (e.g., "20 Sept")
  const formatDayMonth = (d: Date) => {
    const day = d.getDate();
    const monthIdx = d.getMonth();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    return `${day} ${months[monthIdx]}`;
  };

  const normalizeEventFlow = (text?: string) => {
    if (!text) return text;
    const label = formatDayMonth(computedDate);
    const patterns = [
      /\b9(?:th)?\s*(?:of\s*)?aug(?:ust)?\b/gi,
      /\baug(?:ust)?\s*9(?:th)?\b/gi,
    ];
    let res = text;
    for (const re of patterns) res = res.replace(re, label);
    return res;
  };

  const handleRefer = async () => {
    if (!user) {
      router.push('/login?redirect=/events');
      return;
    }
    if (!event?.id) return;

    setReferralOpen(true);
    setReferralLoading(true);
    setCopied(false);

    try {
      const res = await fetch(`/api/referral?event_id=${event.id}`);
      const json = await res.json();
      if (res.ok && json.referral) {
        setReferralData(json.referral);
      }
    } catch {
      // silently fail — dialog will show empty state
    } finally {
      setReferralLoading(false);
    }
  };

  const referralUrl = referralData?.token
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/events/registration?ref=${referralData.token}`
    : '';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = referralUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* ambient blobs */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-emerald-300/20 blur-3xl" />

      {/* ↑ extra space from navbar */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 pt-32 md:pt-36 pb-20">
        {/* Header */}
        <header className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border bg-white/70 px-4 py-1 text-sm text-gray-700 shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Upcoming Event • More events are coming soon
          </div>
          <h1 className="mt-4 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">
            Don’t just attend. <span className="text-primary">Belong.</span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Meet founders, builders, and investors. Learn, showcase, and ship—together.
          </p>
        </header>

        {/* Main card (poster left, details right) */}
        <div className="grid items-stretch gap-8 md:grid-cols-[1.1fr,1fr]">
          {/* Poster (portrait-friendly) */}
          <div className="group relative flex justify-center">
            <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-primary/20 via-fuchsia-300/20 to-emerald-300/20 blur-xl opacity-70 group-hover:opacity-100 transition" />
            <div className="relative overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5">
              <Image
                src={event?.poster || '/womanevent2.jpeg'}
                alt={event?.title || 'Women in Entrepreneurship'}
                width={700}
                height={1000}
                priority
                className="w-full max-w-sm md:max-w-md h-auto object-contain"
              />
            </div>
          </div>

          {/* Info / actions */}
          <div className="flex">
            <div className="relative flex w-full flex-col justify-between rounded-3xl border bg-white/85 p-7 shadow-xl backdrop-blur ring-1 ring-gray-100">
              <div>
                {loading ? (
                  <SkeletonTitle />
                ) : error ? (
                  <p className="text-red-600 font-semibold">{error}</p>
                ) : (
                  <>
                    <h2 className="text-3xl font-bold text-primary">
                      {event?.title || 'Women in Entrepreneurship'}
                    </h2>
                    <p className="mt-3 text-gray-600">
                      {event?.description ||
                        'Celebrate the power of women-led ventures! Join an inspiring virtual session featuring trailblazing women entrepreneurs sharing their journeys, challenges, and strategies for building impactful businesses.'}
                    </p>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <Chip
                        icon={<CalendarDays className="h-4 w-4" />}
                        label="Date"
                        value={computedDate.toLocaleDateString(undefined, { dateStyle: 'long' })}
                      />
                      <Chip
                        icon={<Clock className="h-4 w-4" />}
                        label="Duration"
                        value={computedDuration}
                      />
                      <Chip
                        icon={<MapPin className="h-4 w-4" />}
                        label="Location"
                        value={computedLocation}
                      />
                      <Chip
                        icon={<Info className="h-4 w-4" />}
                        label="Format"
                        value={computedFormat}
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link href="/events/registration" className="sm:flex-1">
                  <button className="w-full rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground shadow hover:bg-primary/90">
                    Register Now
                  </button>
                </Link>

                <button
                  onClick={handleRefer}
                  className="w-full rounded-xl border border-emerald-200 bg-emerald-50 px-6 py-3 font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
                >
                  <span className="inline-flex items-center gap-2">
                    <Share2 className="h-5 w-5" />
                    Refer a Friend
                  </span>
                </button>
              </div>

              <div className="mt-3 flex gap-3 sm:flex-row flex-col">
                <button
                  onClick={() => setOpenInfo(true)}
                  className="w-full rounded-xl border px-6 py-3 font-semibold text-gray-800 hover:bg-gray-50"
                >
                  <span className="inline-flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Info
                  </span>
                </button>

                <a
                  href="Women in Entrepreneurship.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full rounded-xl border px-6 py-3 font-semibold text-gray-800 hover:bg-gray-50"
                >
                  <span className="inline-flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Download Brochure
                  </span>
                </a>
              </div>

              <div className="mt-3">
                <a
                  href="https://calendar.google.com/calendar/event?action=TEMPLATE&tmeid=Nm1xbmdybTg1b3I3anQxM2V1OWQ0MjUzZDEgYXl1c2htYW5AbWVudHMuYXBw&tmsrc=ayushman%40ments.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-6 py-3 font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  <CalendarDays className="h-5 w-5" />
                  Add to Google Calendar
                </a>
              </div>

              <p className="mt-4 text-center text-sm text-gray-500">
                More events & meetups are on the way. Watch this space.
              </p>
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

      {/* REFERRAL DIALOG */}
      {referralOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/50 px-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setReferralOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-emerald-600" />
                <h4 className="text-xl font-bold text-gray-900">Refer a Friend</h4>
              </div>
              <button
                onClick={() => setReferralOpen(false)}
                className="rounded-md p-1.5 hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {referralLoading ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                <p className="text-sm text-gray-500">Generating your referral link...</p>
              </div>
            ) : referralData ? (
              <div className="space-y-5">
                <div className="rounded-xl bg-gray-50 border p-4 space-y-2">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Your Details</div>
                  <div className="flex items-center gap-3">
                    {user?.user_metadata?.avatar_url && (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt=""
                        className="w-10 h-10 rounded-full"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-gray-900">{referralData.referrer_name}</p>
                      <p className="text-sm text-gray-500">{referralData.referrer_email}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Your Referral Link</div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={referralUrl}
                      className="flex-1 rounded-lg border bg-gray-50 px-3 py-2.5 text-sm text-gray-700 outline-none select-all"
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                    />
                    <button
                      onClick={copyToClipboard}
                      className={`shrink-0 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                        copied
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-primary text-primary-foreground hover:bg-primary/90'
                      }`}
                    >
                      {copied ? (
                        <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4" /> Copied</span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5"><Copy className="h-4 w-4" /> Copy</span>
                      )}
                    </button>
                  </div>
                </div>

                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-emerald-700 font-medium">Registrations via your link</span>
                    <span className="text-2xl font-bold text-emerald-700">{referralData.referral_count}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-400 text-center">
                  Share this link with friends. Each registration through your link will be tracked.
                </p>
              </div>
            ) : (
              <p className="py-8 text-center text-gray-500">
                Could not generate referral link. Please try again.
              </p>
            )}
          </div>
        </div>
      )}

      {/* INFO MODAL */}
      {openInfo && (event || true) && (
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
          <pre className="whitespace-pre-wrap text-muted-foreground">{normalizeEventFlow(event.Event_Flow)}</pre>
                </section>
              )}
              {!event && (
                <p className="text-sm text-gray-600">
                  Full schedule and judging criteria will appear here soon.
                </p>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <Link href="/events/registration">
                <button className="rounded-md bg-primary px-6 py-2.5 font-semibold text-primary-foreground hover:bg-primary/90">
                  Register Now
                </button>
              </Link>
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
