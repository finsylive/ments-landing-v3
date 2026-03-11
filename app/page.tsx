"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { CalendarDays, ChevronRight, X } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import Analytics from "@/components/analytics";
import HeroSection from "@/components/hero-section";
import FeaturesSection from "@/components/features-section";
import HorizontalCarousel from "@/components/horizontal-carousel";
import WhatsAppCTA from "@/components/whatsapp-cta";

export default function Page() {
  const [event, setEvent] = useState<any>(null);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const wasDismissed = sessionStorage.getItem("event-banner-dismissed");
    if (!wasDismissed) setDismissed(false);

    const fetchEvent = async () => {
      const { data } = await supabase
        .from("events")
        .select("id, title, date")
        .gte("date", new Date().toISOString().split("T")[0])
        .order("date", { ascending: true })
        .limit(1);
      if (data?.[0]) setEvent(data[0]);
    };
    fetchEvent();
  }, []);

  const dismissBanner = () => {
    setDismissed(true);
    sessionStorage.setItem("event-banner-dismissed", "1");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      <Analytics />

      {/* Event notification banner */}
      <AnimatePresence>
        {!dismissed && event && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed top-20 left-0 right-0 z-40 flex justify-center px-4"
          >
            <div className="flex items-center gap-3 rounded-full bg-black/90 backdrop-blur-md px-5 py-2.5 shadow-lg text-white text-sm">
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <CalendarDays className="h-4 w-4 flex-shrink-0 text-gray-300" />
              <span className="truncate">
                <strong>{event.title}</strong>
                {event.date && (
                  <span className="text-gray-400 ml-1.5">
                    — {new Date(event.date).toLocaleDateString(undefined, { dateStyle: "medium" })}
                  </span>
                )}
              </span>
              <Link
                href="/events"
                className="inline-flex items-center gap-1 rounded-full bg-white text-black px-3 py-1 text-xs font-semibold hover:bg-gray-200 transition flex-shrink-0"
              >
                Register
                <ChevronRight className="h-3 w-3" />
              </Link>
              <button
                onClick={dismissBanner}
                className="text-gray-400 hover:text-white transition flex-shrink-0 ml-1"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated background stars */}
      <motion.div
        className="absolute top-20 left-20 text-4xl font-light text-gray-300"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      >
        ✱
      </motion.div>
      <motion.div
        className="absolute top-60 left-40 text-3xl font-light text-gray-300"
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      >
        ✱
      </motion.div>
      <motion.div
        className="absolute bottom-40 left-60 text-5xl font-light text-gray-300"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      >
        ✱
      </motion.div>

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Carousel Section */}
      <div className="py-16 bg-white">
        <HorizontalCarousel />
      </div>

      {/* WhatsApp CTA */}
      <WhatsAppCTA />

      {/* Floating Stars */}
      <motion.div
        className="absolute top-1/3 right-20 text-2xl font-light text-gray-300"
        animate={{ rotate: 360, y: [0, -20, 0] }}
        transition={{
          rotate: { duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
          y: { duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
        }}
      >
        ✱
      </motion.div>
      <motion.div
        className="absolute bottom-20 right-40 text-3xl font-light text-gray-300"
        animate={{ rotate: -360, x: [0, 15, 0] }}
        transition={{
          rotate: { duration: 18, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
          x: { duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
        }}
      >
        ✱
      </motion.div>
      <motion.div
        className="absolute top-1/3 right-20 text-2xl font-light text-gray-300"
        animate={{ rotate: 360, y: [0, -20, 0] }}
        transition={{
          rotate: { duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
          y: { duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
        }}
      >
        ✱
      </motion.div>
      <motion.div
        className="absolute bottom-20 right-40 text-3xl font-light text-gray-300"
        animate={{ rotate: -360, x: [0, 15, 0] }}
        transition={{
          rotate: { duration: 18, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
          x: { duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
        }}
      >
        ✱
      </motion.div>
    </div>
  );
}
