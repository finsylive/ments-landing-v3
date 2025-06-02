"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export default function FeaturesSection() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl lg:text-5xl font-regular text-black">Execute on your ideas with Ments</h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {/* Students Card */}
        <motion.div
          className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 relative overflow-hidden text-center items-center "
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          whileHover={{ y: -5 }}
        >
          {/* Green accent */}
          <div className="absolute top-0 left-0 w-20 h-20 bg-emerald-500 rounded-br-full"></div>

          <div className="relative z-10">
            <div className="w-12 h-12 text-emerald-500 mb-6 mx-auto">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>

            <h3 className="text-2xl font-bold text-black mb-4">Students</h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Discover Startups,
              <br />
              Join teams and
              <br />
              start building today.
            </p>

            <motion.button
              className="w-full bg-emerald-500 text-white py-4 px-6 rounded-2xl font-semibold flex items-center justify-center space-x-2 hover:bg-emerald-600 transition-colors text-center items-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Join a Startup</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.button>
          </div>
        </motion.div>

        {/* Entrepreneurs Card */}
        <motion.div
          className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center items-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          whileHover={{ y: -5 }}
        >
          <div className="w-12 h-12  text-emerald-500 mb-6 mx-auto">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>

          <h3 className="text-2xl font-bold text-black mb-4">Entrepreneurs</h3>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Showcase your startup,
            <br />
            recruit talent
            <br />
            schedule pitches
          </p>

          <motion.button
            className="w-full bg-emerald-500 text-white py-4 px-6 rounded-2xl font-semibold flex items-center justify-center space-x-2 hover:bg-emerald-600 transition-colors text-center items-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>Create Profile</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.button>
        </motion.div>

        {/* Investors Card */}
        <motion.div
          className="bg-black rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center items-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          whileHover={{ y: -5 }}
        >
          <div className="w-12 h-12 text-emerald-500 mb-6 mx-auto">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
              <path d="M7 17l9.2-9.2M17 17V7H7" />
            </svg>
          </div>

          <h3 className="text-2xl font-bold text-white mb-4">Investors</h3>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Browse startup profiles,
            <br />
            track them,
            <br />
            invest in ventures
          </p>

          <motion.button
            className="w-full bg-emerald-500 text-white py-4 px-6 rounded-2xl font-semibold flex  justify-center space-x-2 hover:bg-emerald-600 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>Browse Startups</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.button>
        </motion.div>
      </div>

      {/* Description Card */}
      <motion.div
        className="bg-white rounded-3xl p-8 shadow-lg"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
      >
        <div className="flex items-start space-x-6">
          <div className="w-16 h-16 text-emerald-500 flex-shrink-0">
            <Image
            src="/connect.svg"
            alt="Connect"
            width={48}
            height={48}
            className="mb-6"
           />
          </div>
          <div>
            <p className="text-lg text-gray-700 leading-relaxed">
              <span className="font-bold text-black">Ments</span> is a collaborative startup platform where students
              gain experience, entrepreneurs grow their ventures, and investors or incubators discover promising talent
              and ideas.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
