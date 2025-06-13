"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { label: "Blogs", href: "https://blog.ments.app" },
  { label: "Careers", href: "/careers" },
  { label: "About us", href: "/about" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <motion.nav
      className="fixed top-6 w-full z-50 flex justify-center px-4"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="bg-black/90 backdrop-blur-md rounded-full px-8 py-4 flex items-center justify-between max-w-4xl w-full md:w-auto">
        {/* Brand / Toggle */}
        <motion.button
          type="button"
          className="text-white font-bold text-xl focus:outline-none"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          onClick={() => setOpen(o => !o)}
        >
          ments
        </motion.button>

        {/* Desktop Links (centered) */}
        <div className="hidden md:flex items-center space-x-6 mx-6">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.label}
              href={item.href}
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Join Waitlist (always visible) */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <a
            href="https://ments.ezzyforms.in/forms/6841e534f06f98d51b4f"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              className="bg-white text-black border-white hover:bg-gray-100 rounded-full px-6"
            >
              Join Waitlist
            </Button>
          </a>
        </motion.div>
      </div>

      {/* Mobile Dropdown (only nav links; no Join Waitlist here) */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute top-full mt-2 w-full max-w-xs mx-auto bg-black/90 backdrop-blur-md rounded-2xl p-6 md:hidden"
          >
            <ul className="space-y-4">
              {NAV_ITEMS.map(item => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="block text-gray-200 hover:text-white text-lg"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
