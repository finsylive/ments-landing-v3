"use client";

import { motion } from "framer-motion";
import Analytics from "@/components/analytics";
import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero-section";
import FeaturesSection from "@/components/features-section";
import HorizontalCarousel from "@/components/horizontal-carousel";
import WhatsAppCTA from "@/components/whatsapp-cta";
import Footer from "@/components/footer";
import EventsCareersCTA from "@/components/events-careers-cta";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      <Analytics />

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

      {/* Events and Careers CTA */}
      <EventsCareersCTA />

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
