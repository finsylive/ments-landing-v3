"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Calendar, Briefcase, ArrowRight, X } from "lucide-react"
import { useState, useEffect } from "react"

export default function EventsCareersCTA() {
  const [showEventBanner, setShowEventBanner] = useState(false)
  const [showCareerBanner, setShowCareerBanner] = useState(false)
  const [dismissed, setDismissed] = useState({ events: false, careers: false })

  useEffect(() => {
    // Show event banner after 3 seconds
    const eventTimer = setTimeout(() => {
      if (!dismissed.events) {
        setShowEventBanner(true)
      }
    }, 3000)

    // Show career banner after 10 seconds
    const careerTimer = setTimeout(() => {
      if (!dismissed.careers) {
        setShowCareerBanner(true)
      }
    }, 10000)

    return () => {
      clearTimeout(eventTimer)
      clearTimeout(careerTimer)
    }
  }, [dismissed])

  const handleDismissEvent = () => {
    setShowEventBanner(false)
    setDismissed(prev => ({ ...prev, events: true }))
  }

  const handleDismissCareer = () => {
    setShowCareerBanner(false)
    setDismissed(prev => ({ ...prev, careers: true }))
  }

  return (
    <>
      {/* Floating Action Buttons - Always Visible */}
      <div className="fixed bottom-20 sm:bottom-24 right-3 sm:right-6 z-40 flex flex-col gap-2 sm:gap-3">
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2, duration: 0.5 }}
        >
          <Link href="/events">
            <motion.button
              className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-3 sm:px-4 py-2.5 sm:py-3 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:group-hover:inline-block font-medium text-sm sm:text-base">Upcoming Events</span>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 hidden sm:group-hover:inline-block" />
            </motion.button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2.2, duration: 0.5 }}
        >
          <Link href="/careers">
            <motion.button
              className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-3 sm:px-4 py-2.5 sm:py-3 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:group-hover:inline-block font-medium text-sm sm:text-base">Apply for Jobs & Gigs!</span>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 hidden sm:group-hover:inline-block" />
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* Event Notification Banner */}
      {showEventBanner && (
        <motion.div
          className="fixed top-16 sm:top-20 left-4 right-4 sm:left-1/2 sm:right-auto sm:transform sm:-translate-x-1/2 z-50 max-w-sm sm:max-w-md mx-auto"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg sm:rounded-xl shadow-2xl p-3 sm:p-4 text-white relative">
            <button
              onClick={handleDismissEvent}
              className="absolute top-2 right-2 text-white/80 hover:text-white p-1"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div className="flex items-start gap-2 sm:gap-3 pr-6">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 mt-0.5 sm:mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-bold text-base sm:text-lg mb-1 leading-tight">Pitch & Dev Summit!</h3>
                <p className="text-xs sm:text-sm text-white/90 mb-2 sm:mb-3 leading-relaxed">
                  Join founders, builders, and investors for innovation.
                </p>
                <Link href="/events">
                  <motion.button
                    className="bg-white text-purple-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg font-semibold text-xs sm:text-sm hover:bg-gray-100 transition-colors inline-flex items-center gap-1.5 sm:gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View Details
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Career Notification Banner */}
      {showCareerBanner && (
        <motion.div
          className="fixed top-16 sm:top-20 left-4 right-4 sm:left-1/2 sm:right-auto sm:transform sm:-translate-x-1/2 z-50 max-w-sm sm:max-w-md mx-auto"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg sm:rounded-xl shadow-2xl p-3 sm:p-4 text-white relative">
            <button
              onClick={handleDismissCareer}
              className="absolute top-2 right-2 text-white/80 hover:text-white p-1"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div className="flex items-start gap-2 sm:gap-3 pr-6">
              <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 mt-0.5 sm:mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-bold text-base sm:text-lg mb-1 leading-tight">We're Hiring!</h3>
                <p className="text-xs sm:text-sm text-white/90 mb-2 sm:mb-3 leading-relaxed">
                  Join startups shaping the future. Explore roles now.
                </p>
                <Link href="/careers">
                  <motion.button
                    className="bg-white text-emerald-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg font-semibold text-xs sm:text-sm hover:bg-gray-100 transition-colors inline-flex items-center gap-1.5 sm:gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Explore Jobs
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  )
}