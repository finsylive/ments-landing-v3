"use client";

import { motion } from "framer-motion";
import { HeroSection } from "@/components/community/hero-section";
import { AboutSection } from "@/components/community/about-section";
import { HowItWorks } from "@/components/community/how-it-works";
import { RegistrationForm } from "@/components/community/registration-form";
import { CommunityHighlights } from "@/components/community/community-highlights";
import Analytics from "@/components/analytics";

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <Analytics />

      {/* Animated background stars */}
      <motion.div
        className="absolute top-20 left-20 text-4xl font-light text-gray-200 z-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      >
        ✱
      </motion.div>
      <motion.div
        className="absolute top-60 right-40 text-3xl font-light text-gray-200 z-0"
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      >
        ✱
      </motion.div>
      <motion.div
        className="absolute bottom-40 left-60 text-5xl font-light text-gray-200 z-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      >
        ✱
      </motion.div>

      {/* Page Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <HeroSection />

        {/* About the Community */}
        <AboutSection />

        {/* How It Works */}
        <HowItWorks />

        {/* Community Highlights */}
        <CommunityHighlights />

        {/* Registration Form */}
        <RegistrationForm />
      </div>

      {/* More Floating Stars */}
      <motion.div
        className="absolute top-1/3 right-20 text-2xl font-light text-gray-200 z-0"
        animate={{ rotate: 360, y: [0, -20, 0] }}
        transition={{
          rotate: { duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
          y: { duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
        }}
      >
        ✱
      </motion.div>
      <motion.div
        className="absolute bottom-20 right-40 text-3xl font-light text-gray-200 z-0"
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
