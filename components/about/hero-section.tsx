
'use client'
export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden min-h-[80vh] flex items-center pt-20">
      {/* Background elements */}
      <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-purple-200 opacity-20 blur-3xl" />
      <div className="absolute top-40 right-20 h-96 w-96 rounded-full bg-green-200 opacity-20 blur-3xl" />
      <div className="absolute bottom-10 left-1/4 h-48 w-48 rounded-full bg-blue-200 opacity-15 blur-3xl" />

      {/* Floating decorative elements */}
      <div className="absolute top-20 left-16 text-6xl text-gray-200 animate-spin-slow pointer-events-none select-none">✱</div>
      <div className="absolute bottom-32 right-12 text-4xl text-gray-300 animate-pulse pointer-events-none select-none">✦</div>
      <div className="absolute top-1/3 right-1/4 text-3xl text-gray-200 opacity-60 animate-bounce pointer-events-none select-none">●</div>
      <div className="absolute bottom-20 left-20 text-5xl text-gray-250 opacity-50 animate-pulse pointer-events-none select-none">◆</div>
      <div className="absolute top-16 right-32 text-2xl text-gray-300 opacity-70 pointer-events-none select-none">✧</div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="mb-8 text-6xl font-regular tracking-tight md:text-8xl lg:text-9xl">
            About Ments
          </h1>
          <p className="mb-12 text-2xl text-gray-600 md:text-3xl lg:text-4xl font-light">
            Connecting innovators, investors, and incubators in one place.
          </p>
          <div className="mx-auto max-w-4xl">
            <p className="text-xl text-gray-500 leading-relaxed md:text-2xl">
              Ments is revolutionizing how entrepreneurs, investors, and incubators collaborate by providing a unified
              platform that streamlines project showcasing, talent recruitment, and funding connections. We believe that
              great ideas deserve great support, and we're here to make those connections happen seamlessly.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}