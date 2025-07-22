"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { label: "Blog", href: "/blog" },
  { label: "Careers", href: "/careers" },
  { label: "About Us", href: "/about"}
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <motion.nav
      className="fixed top-4 left-0 right-0 z-50 flex justify-center box-border"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="box-border w-full md:w-auto max-w-4xl 
                      bg-black/90 backdrop-blur-md rounded-full
                      px-4 md:px-8 py-4 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="text-white font-bold text-xl px-4">
          ments
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center space-x-6 pr-4">
          {NAV_ITEMS.map(({ label, href }) => (
            <Link key={label} href={href}
              className="text-gray-300 hover:text-white transition-colors duration-200">
              {label}
            </Link>
          ))}
        </div>

        {/* Join Waitlist */}
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSeKLPysBVutn6RuNDrRpzC8oozVXOJ4FC7SnRuOZ_9Y8fM8cw/viewform?usp=header"
          target="_blank" rel="noopener noreferrer"
          className="hidden md:block"
        >
          <Button variant="outline"
                  className="bg-white text-black border-white hover:bg-gray-100 rounded-full px-6">
            Join Waitlist
          </Button>
        </a>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.ul
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute top-full mt-2 left-0 right-0 
                       bg-black/90 backdrop-blur-md rounded-2xl p-6 space-y-4 md:hidden"
          >
            {NAV_ITEMS.map(({ label, href }) => (
              <li key={label}>
                <Link href={href}
                  className="block text-gray-200 hover:text-white text-lg "
                  onClick={() => setOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSeKLPysBVutn6RuNDrRpzC8oozVXOJ4FC7SnRuOZ_9Y8fM8cw/viewform?usp=header"
                target="_blank" rel="noopener noreferrer"
                className="block"
                onClick={() => setOpen(false)}
              >
                <Button className="w-full rounded-full">Join Waitlist</Button>
              </a>
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
