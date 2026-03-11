"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CalendarDays, ArrowRight } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

interface UpcomingEvent {
  title: string;
  date?: string;
  venue?: string;
}

export default function EventPopup() {
  const [event, setEvent] = useState<UpcomingEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("event-popup-dismissed")) {
      setDismissed(true);
      return;
    }

    const fetchEvent = async () => {
      try {
        const { data, error } = await supabase
          .from("events")
          .select("id, title, date, venue")
          .gte("date", new Date().toISOString().split("T")[0])
          .order("date", { ascending: true })
          .limit(1);

        if (error) {
          console.warn("EventPopup: Supabase query error", error.message);
        }

        if (data && data.length > 0) {
          setEvent(data[0]);
        } else {
          // Fallback: hardcoded upcoming event details
          setEvent({
            title: "Women in Entrepreneurship",
            date: "2026-03-13",
            venue: "Online",
          });
        }
      } catch {
        setEvent({
          title: "Women in Entrepreneurship",
          date: "2026-03-13",
          venue: "Online",
        });
      }
      setTimeout(() => setVisible(true), 1500);
    };

    fetchEvent();
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    sessionStorage.setItem("event-popup-dismissed", "true");
    setTimeout(() => setDismissed(true), 300);
  };

  if (dismissed || !event) return null;

  const formattedDate = event.date
    ? new Date(event.date).toLocaleDateString("en-IN", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-6 left-6 z-50 max-w-sm w-full sm:w-auto"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-primary/80 px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <CalendarDays className="h-4 w-4" />
                <span className="text-sm font-semibold">Upcoming Event</span>
              </div>
              <button
                onClick={handleDismiss}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-5 py-4">
              <h3 className="font-bold text-gray-900 text-lg leading-tight">
                {event.title}
              </h3>
              {(formattedDate || event.venue) && (
                <p className="text-sm text-gray-500 mt-1">
                  {formattedDate}
                  {event.venue && ` · ${event.venue}`}
                </p>
              )}

              <Link
                href="/events"
                onClick={handleDismiss}
                className="mt-4 inline-flex items-center gap-2 bg-primary text-primary-foreground
                           px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90
                           transition-colors w-full justify-center"
              >
                Register Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
