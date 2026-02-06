"use client";

import { motion } from "framer-motion";
import { UserPlus, CheckCircle, Users, TrendingUp } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      number: "1",
      icon: UserPlus,
      title: "Register Your Role",
      description: "Choose whether you're a Founder, Mentor, or Investor.",
    },
    {
      number: "2",
      icon: CheckCircle,
      title: "Get Verified",
      description: "Basic review to ensure real, intent-based profiles.",
    },
    {
      number: "3",
      icon: Users,
      title: "Connect & Collaborate",
      description: "Access curated groups, events, and mentorship channels.",
    },
    {
      number: "4",
      icon: TrendingUp,
      title: "Grow Together",
      description: "Get matched with investors or startups aligned to your interests.",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            How It Works
          </h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
            Join our community in four simple steps and start your journey towards growth
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gray-300 transform -translate-y-1/2 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all h-full flex flex-col items-center text-center">
                  {/* Step number badge */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-black flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="mt-8 mb-4 w-16 h-16 rounded-2xl bg-green-100 text-green-600 ring-1 ring-green-200 flex items-center justify-center">
                    <step.icon className="w-8 h-8" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 flex-grow">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
