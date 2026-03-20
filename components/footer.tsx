"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12 sm:py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-0 mb-10 sm:mb-14">
          {/* Navigation Links */}
          <motion.div
            className="flex flex-wrap gap-4 sm:gap-6 md:gap-8 text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {[
              { name: "Home", href: "/" },
              { name: "Events", href: "/events" },
              { name: "Blog", href: "/blog" },
              { name: "Careers", href: "/careers" },
              { name: "About us", href: "/about" },
              { name: "Community", href: "/community" },
              { name: "CSAE Policy", href: "/CSAE-Policy" },
              { name: "Legal", href: "/legal" },
              { name: "Delete Account", href: "/delete-account" },
            ].map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="hover:text-white transition-colors duration-200 text-sm sm:text-base"
                whileHover={{ y: -2 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.07 }}
                viewport={{ once: true }}
              >
                {item.name}
              </motion.a>
            ))}
          </motion.div>

          {/* Email */}
          <motion.div
            className="lg:text-right"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <a
              href="mailto:official@ments.app"
              className="text-white text-base sm:text-xl lg:text-2xl hover:text-emerald-400 transition-colors duration-200"
            >
              official@ments.app
            </a>
          </motion.div>
        </div>

        {/* Social Media Links */}
        <motion.div
          className="flex justify-start lg:justify-end gap-5 sm:gap-8 mb-10 sm:mb-14"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          {[
            { name: "LinkedIn", href: "https://www.linkedin.com/company/103759950/admin/dashboard/" },
            { name: "Instagram", href: "https://www.instagram.com/ments_app" },
          ].map((social, index) => (
            <motion.a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors duration-200 text-sm sm:text-base"
              whileHover={{ y: -2, scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
              viewport={{ once: true }}
            >
              {social.name}
            </motion.a>
          ))}
        </motion.div>

        {/* Divider */}
        <div className="h-px bg-white/10 mb-8 sm:mb-10" />

        {/* Bottom Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 lg:gap-0">
          {/* Ments Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <a href="/" aria-label="Ments home">
              <Image
                src="/white_logo.svg"
                alt="Ments logo"
                width={600}
                height={184}
                priority={false}
                className="w-48 sm:w-64 md:w-96 lg:w-[500px] h-auto"
                sizes="(min-width: 1024px) 500px, (min-width: 768px) 384px, (min-width: 640px) 256px, 192px"
              />
            </a>
          </motion.div>

          {/* Association Section */}
          <motion.div
            className="w-full lg:w-auto"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-400 text-sm sm:text-base mb-4 lg:text-right">
              Incubated at Nirmaan, IIT Madras
            </p>
            <div className="flex items-center justify-start lg:justify-end gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Image src="/nirmaan-logo.png" alt="Nirmaan" width={80} height={80} className="w-16 sm:w-20 h-auto" />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Image src="/IITMadras-logo.png" alt="IIT Madras" width={80} height={80} className="w-16 sm:w-20 h-auto" />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Copyright */}
        <p className="mt-8 text-xs text-gray-600 lg:text-right">
          © {new Date().getFullYear()} Ments. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
