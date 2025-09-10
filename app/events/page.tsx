'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Info, Download, CalendarDays, MapPin, Clock } from 'lucide-react';

export default function EventsPage() {
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openInfo, setOpenInfo] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('events')
        .select('*')
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

  // If Supabase has no data, use sensible fallbacks
  const computedDate = event?.date ? new Date(event.date) : new Date(2025, 8, 20); // 20 September 2025
  const computedDuration = event?.duration || '2 hours';
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
                src="/postersept.jpeg"
                alt={event?.title || 'Event poster'}
                width={700}       // keep natural width
                height={1000}     // taller portrait
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
                      {event?.title || 'Pitch & Dev Summit'}
                    </h2>
                    <p className="mt-3 text-gray-600">
                      {event?.description ||
                        'Join us for a high-energy day of startup pitches, hands-on dev sessions, and real networking.'}
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
                  onClick={() => setOpenInfo(true)}
                  className="w-full rounded-xl border px-6 py-3 font-semibold text-gray-800 hover:bg-gray-50"
                >
                  <span className="inline-flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Info
                  </span>
                </button>

                <a
                  href="Ments (7).pdf" // replace with GDrive link
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

              <p className="mt-4 text-center text-sm text-gray-500">
                More events & meetups are on the way. Watch this space.
              </p>
            </div>
          </div>
        </div>

        {/* Teaser grid – keep this */}
        <section className="mt-16">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold">More events are coming soon</h3>
            <div className="text-sm text-gray-500">Stay tuned ✨</div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border bg-white/70 p-5 shadow-sm backdrop-blur ring-1 ring-gray-100"
              >
                <div className="mb-3 h-36 w-full rounded-xl bg-gray-100" />
                <div className="h-4 w-3/4 rounded bg-gray-200" />
                <div className="mt-2 h-3 w-1/2 rounded bg-gray-100" />
              </div>
            ))}
          </div>
        </section>
      </div>

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
