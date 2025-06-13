"use client";
import { motion } from "framer-motion";

function CareerHero() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Animated Background elements */}
      <motion.div
        className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-purple-300 opacity-40 blur-3xl"
        animate={{ x: [0, 60, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-40 right-20 h-96 w-96 rounded-full bg-emerald-300 opacity-40 blur-3xl"
        animate={{ y: [0, -60, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-300 opacity-40 blur-3xl"
        animate={{ y: [0, 40, 0], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-10 right-1/3 h-48 w-48 rounded-full bg-red-300 opacity-30 blur-2xl"
        animate={{ x: [0, -40, 0], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Asterisk-like elements */}
      <motion.div
        className="absolute top-32 left-1/4 text-6xl text-yellow-400 opacity-60"
        animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      >
        ✦
      </motion.div>
      <motion.div
        className="absolute bottom-32 right-1/4 text-4xl text-pink-400 opacity-50"
        animate={{ rotate: [360, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        ✨
      </motion.div>
      <motion.div
        className="absolute top-1/2 right-10 text-5xl text-indigo-400 opacity-40"
        animate={{ x: [0, 30, 0], rotate: [0, 180, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      >
        ⭐
      </motion.div>
      <motion.div
        className="absolute top-20 left-10 text-7xl text-orange-400 opacity-50"
        animate={{ rotate: [0, -360], scale: [0.8, 1.3, 0.8] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      >
        *
      </motion.div>
      <motion.div
        className="absolute bottom-40 left-1/3 text-5xl text-cyan-400 opacity-60"
        animate={{ y: [0, -30, 0], rotate: [0, 180, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      >
        ✱
      </motion.div>
      <motion.div
        className="absolute top-1/3 left-20 text-4xl text-purple-400 opacity-45"
        animate={{ x: [0, 25, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      >
        ✳
      </motion.div>
      <motion.div
        className="absolute bottom-16 right-1/3 text-6xl text-green-400 opacity-55"
        animate={{ rotate: [360, 0], opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      >
        ✴
      </motion.div>
      <motion.div
        className="absolute top-2/3 right-20 text-3xl text-rose-400 opacity-40"
        animate={{ y: [0, 20, 0], x: [0, -15, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      >
        *
      </motion.div>

      <div className="container mx-auto px-4 py-24 md:py-32 mt-24">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-7xl">Help us build a startup ecosystem</h1>
          <p className="mb-10 text-xl text-gray-600 md:text-2xl">
            Be part of a team turning vision into opportunity—for everyone.
          </p>
          <a
            href="#openings"
            className="inline-flex items-center justify-center rounded-full bg-black px-8 py-3 text-base font-medium text-white transition-colors hover:bg-gray-800"
          >
            See open roles
          </a>
        </div>
      </div>

      <div className="container mx-auto mt-20 px-4">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-white p-8 shadow-xl md:p-12">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-green-300 opacity-20 blur-2xl" />
          <div className="absolute -left-10 bottom-10 h-40 w-40 rounded-full bg-blue-300 opacity-20 blur-2xl" />

          <div className="relative grid gap-8 md:grid-cols-2">
            <div className="flex flex-col justify-center">
              <h2 className="mb-6 text-3xl font-bold md:text-4xl lg:text-5xl">
                You don't work for Ments. You build it with us.
              </h2>
            </div>
            <div className="relative">
              <img
                src="/office.png?height=400&width=500"
                alt="Team collaboration"
                className="rounded-lg object-cover"
              />
              <div className="absolute -right-4 -top-4 h-16 w-16 text-green-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <p className="text-lg text-gray-700">
              Ments is a collaborative startup platform where students gain experience, entrepreneurs grow their
              ventures, and investors or incubators discover promising talent and ideas.
            </p>
            <p className="mt-4 text-lg text-gray-500">
              At Ments, you'll help shape a world where anyone with drive can launch, learn, and lead.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
export default CareerHero;