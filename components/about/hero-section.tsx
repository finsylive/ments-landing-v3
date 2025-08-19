
'use client'
export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden min-h-[78vh] flex items-center pt-16 md:pt-20">
      {/* Background elements */}
      <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-purple-200 opacity-20 blur-3xl" />
      <div className="absolute top-40 right-20 h-80 w-80 rounded-full bg-green-200 opacity-20 blur-3xl" />
      <div className="absolute bottom-10 left-1/4 h-40 w-40 rounded-full bg-blue-200 opacity-15 blur-3xl" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white pointer-events-none" />

      {/* Floating decorative elements */}
      <div className="absolute top-24 left-16 text-5xl text-gray-200 animate-spin-slow pointer-events-none select-none">✱</div>
      <div className="absolute bottom-24 right-12 text-4xl text-gray-300 animate-pulse pointer-events-none select-none">✦</div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="mx-auto max-w-5xl text-center">
          <span className="inline-flex items-center justify-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 ring-1 ring-green-200">
            About Ments
          </span>
          <h1 className="mt-6 mb-4 text-5xl font-medium tracking-tight md:text-7xl lg:text-8xl">
            Connecting the startup world
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-gray-600 md:text-xl">
            A unified space where founders, investors, and incubators discover each other and move faster—
            from showcasing to recruiting to raising.
          </p>
        </div>
      </div>
    </section>
  )
}