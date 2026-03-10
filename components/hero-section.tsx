"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Brain, TrendingUp, ChevronRight, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function HeroSection() {
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    const dismissed = sessionStorage.getItem("waitlist-popup-dismissed")
    if (!dismissed) {
      const timer = setTimeout(() => setShowPopup(true), 4000)
      return () => clearTimeout(timer)
    }
  }, [])

  const dismissPopup = () => {
    setShowPopup(false)
    sessionStorage.setItem("waitlist-popup-dismissed", "1")
  }

  return (
    <div className="w-full bg-gray-50">
      {/* Beta testing popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="fixed bottom-6 right-6 z-50 max-w-xs"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className="bg-black/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-white/10">
              <button
                onClick={dismissPopup}
                className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-start gap-3 pr-4">
                <span className="relative flex h-2.5 w-2.5 mt-1.5 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <div>
                  <p className="text-white text-sm font-medium leading-snug">
                    Beta testing is live
                  </p>
                  <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                    Get early access to Ments. Join the waitlist for updates.
                  </p>
                  <a
                    href="https://www.ments.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-white mt-2.5 hover:text-gray-300 transition-colors"
                    onClick={dismissPopup}
                  >
                    Sign In
                    <ChevronRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 sm:px-6 pt-20 pb-16 max-w-7xl">
      <div className="flex items-center justify-center min-h-[80vh] relative">
        {/* Responsive Flex: column on mobile, row on md+ */}
        <div className="flex flex-col-reverse md:flex-row items-center
                        space-y-12 md:space-y-0 md:space-x-12 lg:space-x-20 w-full
                        md:justify-between">
          {/* Headline Text */}
          <motion.div
            className="space-y-4 flex-shrink-0 px-2 md:px-0"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Hustle with icons */}
            <div className="flex items-center space-x-2">
              <motion.div
                className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500 rounded-full flex items-center justify-center"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.3, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.1, rotate: 10 }}
              >
                <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </motion.div>
              <motion.div
                className="w-16 h-16 sm:w-20 sm:h-20 bg-yellow-400 rounded-full flex items-center justify-center -ml-3"
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.5, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.1, rotate: -10 }}
              >
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </motion.div>
              <motion.h1
                className="text-6xl sm:text-9xl md:text-7xl lg:text-8xl xl:text-9xl font-thin text-black ml-2"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                Hustle
              </motion.h1>
            </div>

            {/* Begins */}
            <motion.div
              className="text-6xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-thin text-gray-400"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              Begins
            </motion.div>

            {/* Here with arrow */}
            <div className="flex items-center space-x-2">
              <motion.div
                className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-500 rounded-full flex items-center justify-center"
                initial={{ scale: 0, x: -50 }}
                animate={{ scale: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.1, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.1 }}
              >
                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 text-white -ml-4" />
              </motion.div>
              <motion.h1
                className="text-6xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-thin text-black ml-2"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.3 }}
              >
                Here.
              </motion.h1>
            </div>

            {/* Beta announcement + CTAs */}
            <motion.div
              className="flex flex-wrap items-center gap-3 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.6 }}
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/5 border border-black/10 px-3 py-1.5 text-xs sm:text-sm text-gray-600">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                Beta is live
              </span>

              <a
                href="https://www.ments.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-black text-white px-4 py-1.5 text-xs sm:text-sm font-medium hover:bg-black/80 transition-colors"
              >
                Sign In
                <ChevronRight className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://chat.whatsapp.com/FrOV4Ir4xpmBuV0v70QCIO"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-700 px-3 py-1.5 text-xs sm:text-sm font-medium hover:bg-green-500/20 transition-colors"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.386" />
                </svg>
                Join Community
              </a>
            </motion.div>
          </motion.div>

          {/* Character Image */}
          <motion.div
            className="flex-shrink-0 w-full md:w-auto md:ml-auto"
            initial={{ opacity: 0, x: 50, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          >
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                className="block w-full"
              >
                <Image
                  src="/Laptop Investor drinking-min.png"
                  alt="Character with laptop showing Ments"
                  width={400}
                  height={400}
                  className="w-full max-w-[360px] sm:max-w-[400px] md:max-w-[450px] xl:max-w-[520px] mx-auto h-auto object-contain"
                  sizes="(max-width: 640px) 95vw, (max-width: 1024px) 50vw, 520px"
                  priority
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  </div>
  )
}
