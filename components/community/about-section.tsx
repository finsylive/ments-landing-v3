"use client";

import { motion } from "framer-motion";
import { Sprout, Handshake, DollarSign, MessageSquare } from "lucide-react";

export function AboutSection() {
  const highlights = [
    {
      icon: Sprout,
      title: "Early-stage Founder Support",
      description: "Get the guidance and resources you need to grow your startup from idea to scale",
    },
    {
      icon: Handshake,
      title: "Mentor–Founder Collaboration",
      description: "Connect with experienced mentors who understand your challenges",
    },
    {
      icon: DollarSign,
      title: "Smart Investor Matching",
      description: "Get matched with investors who align with your vision and stage",
    },
    {
      icon: MessageSquare,
      title: "Feedback-driven Product Evolution",
      description: "Help shape the platform through your input and experiences",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            About the Community
          </h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            The Ments Community is designed to go beyond networking.
            <br />
            We're building a platform that evolves through collaboration — shaped by the voices of our members.
            <br />
            Whether you're an early-stage founder looking for mentorship or an investor looking for high-signal startups, Ments connects you meaningfully.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {highlights.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-white shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all"
            >
              <div className="w-16 h-16 rounded-2xl bg-green-100 text-green-600 ring-1 ring-green-200 flex items-center justify-center mb-4">
                <item.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
