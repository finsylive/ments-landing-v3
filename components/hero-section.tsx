"use client"

import { motion } from "framer-motion"
import { Brain, TrendingUp, ChevronRight } from "lucide-react"
import Image from "next/image"

export default function HeroSection() {
  return (
    <div className="container mx-auto px-4 sm:px-6 pt-32 pb-16 max-w-7xl">
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
  )
}
