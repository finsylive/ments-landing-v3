"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-black text-white py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 space-y-8 lg:space-y-0">
          {/* Navigation Links */}
          <motion.div
            className="flex flex-wrap gap-8 text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {[
              { name: "Home", href: "/" },
              { name: "Features", href: "/#features" },
              { name: "Events", href: "/events" },
              { name: "Blog", href: "/blog" },
              { name: "Careers", href: "/careers" },
              { name: "About us", href: "/about" },
              { name: "CSAE Policy", href: "/CSAE-Policy" },
              { name: "Legal", href: "/legal" },
              { name: "Delete Account", href: "/delete-account" },
            ].map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="hover:text-white transition-colors duration-200 text-lg"
                whileHover={{ y: -2 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {item.name}
              </motion.a>
            ))}
          </motion.div>

          {/* Email */}
          <motion.div
            className="text-right"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <a
              href="mailto:official@ments.app"
              className="text-white text-xl lg:text-2xl hover:text-emerald-400 transition-colors duration-200"
            >
              official@ments.app
            </a>
          </motion.div>
        </div>

        {/* Social Media Links */}
        <motion.div
          className="flex justify-end space-x-8 mb-16"
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
              className="text-gray-300 hover:text-white transition-colors duration-200 text-lg"
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

        {/* Bottom Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end space-y-8 lg:space-y-0">
          {/* Ments Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <h1 className="text-8xl lg:text-10xl font-regular text-white">ments</h1>
          </motion.div>

          {/* Association Section */}
          <motion.div
            className="w-full lg:w-auto text-left lg:text-right"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-300 text-lg mb-4 text-right mt-6">
              Incubated at Nirmaan, IIT madras
              <br />
              
            </p>

            {/* Logos */}
            <div className="flex items-center justify-end space-x-4">
              {/* Nirmaan Logo */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Image
                src="/nirmaan-logo.png"
                alt="Connect"
                width={100}
                height={100}
                className="mb-6"
                />
              </motion.div>

              {/* IIT Madras Logo */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Image
                src="/IITMadras-logo.png"
                alt="Connect"
                width={100}
                height={100}
                className="mb-6"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}
