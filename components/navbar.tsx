"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useAuth } from "@/contexts/auth-context";

const NAV_ITEMS = [
  { label: "Events", href: "/events" },
  { label: "About Us", href: "/about" },
];

function UserMenu() {
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const avatarUrl = user.user_metadata?.avatar_url;
  const displayName =
    user.user_metadata?.full_name || user.user_metadata?.name || user.email;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center gap-2 rounded-full transition-colors duration-200"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Avatar"
            className="w-8 h-8 rounded-full border-2 border-zinc-600"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center border-2 border-zinc-600">
            <User size={16} className="text-zinc-300" />
          </div>
        )}
      </button>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-56 bg-zinc-900 border border-zinc-700
                       rounded-xl shadow-xl overflow-hidden z-50"
          >
            <div className="px-4 py-3 border-b border-zinc-800">
              <p className="text-sm font-medium text-white truncate">
                {displayName}
              </p>
              {user.email && (
                <p className="text-xs text-zinc-400 truncate">{user.email}</p>
              )}
            </div>
            <button
              onClick={() => {
                setMenuOpen(false);
                signOut();
              }}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-zinc-300
                         hover:bg-zinc-800 hover:text-white transition-colors duration-150"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, loading, signOut } = useAuth();

  return (
    <motion.nav
      className="fixed top-4 left-0 right-0 z-50 flex justify-center box-border px-4 md:px-6"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div
        className="box-border w-full md:w-auto max-w-4xl
                      bg-black/90 backdrop-blur-md rounded-full
                      px-4 md:px-8 py-4 flex items-center justify-between"
      >
        <Link
          href="/"
          className="flex items-center mr-4"
          aria-label="Ments home"
        >
          <Image
            src="/white.svg"
            alt="Ments logo"
            width={120}
            height={36}
            priority
            className="h-7 md:h-8 w-auto"
          />
        </Link>

        <div className="hidden md:flex items-center space-x-6 pr-4">
          {NAV_ITEMS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="hidden md:block">
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-zinc-700 animate-pulse" />
          ) : user ? (
            <UserMenu />
          ) : (
            <Link href="/login">
              <Button
                variant="outline"
                className="bg-white text-black border-white hover:bg-gray-100 rounded-full px-6"
              >
                Sign In
              </Button>
            </Link>
          )}
        </div>

        <button
          className="md:hidden text-white"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

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
                <Link
                  href={href}
                  className="block text-gray-200 hover:text-white text-lg"
                  onClick={() => setOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
            <li>
              {user ? (
                <div className="space-y-3 pt-2 border-t border-zinc-700">
                  <div className="flex items-center gap-3 px-1">
                    {user.user_metadata?.avatar_url ? (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt="Avatar"
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                        <User size={16} className="text-zinc-300" />
                      </div>
                    )}
                    <span className="text-zinc-300 text-sm truncate">
                      {user.user_metadata?.full_name || user.email}
                    </span>
                  </div>
                  <Button
                    onClick={() => {
                      setOpen(false);
                      signOut();
                    }}
                    variant="outline"
                    className="w-full rounded-full border-zinc-600 text-zinc-300"
                  >
                    <LogOut size={16} className="mr-2" />
                    Sign out
                  </Button>
                </div>
              ) : (
                <Link href="/login" onClick={() => setOpen(false)}>
                  <Button className="w-full rounded-full">Sign In</Button>
                </Link>
              )}
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
