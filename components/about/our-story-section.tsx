import { Calendar, Award, Rocket } from "lucide-react"

export function OurStorySection() {
  return (
    <section className="relative w-full overflow-hidden bg-gray-50 py-20">
      {/* Background elements */}
      <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-purple-100 opacity-30 blur-3xl" />

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h2 className="mb-4 text-center text-4xl font-semibold md:text-5xl lg:text-6xl">Our Story</h2>
          <p className="text-gray-600 md:text-lg">Milestones that shaped our journey and community.</p>
        </div>

        <div className="relative mx-auto max-w-4xl">
          {/* Timeline spine */}
          <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-green-200 via-green-100 to-transparent md:left-1/2 md:-translate-x-1/2" />

          <ol className="space-y-10">
            {/* Founded */}
            <li className="relative flex gap-6 md:gap-10 md:items-center">
              <div className="relative z-10 mt-1 h-10 w-10 shrink-0 rounded-2xl bg-green-100 ring-1 ring-green-200 flex items-center justify-center md:mx-auto md:mt-0">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 md:ml-0 md:max-w-[42rem]">
                <h3 className="text-xl font-semibold">Founded & Pre-incubated</h3>
                <p className="mt-2 text-gray-600 leading-relaxed">
                  Ments was founded and pre-incubated at Nirmaan IIT Madras, where our vision of connecting the startup
                  ecosystem began to take shape. With the support of one of India's premier institutions, we laid the
                  foundation for what would become a transformative platform.
                </p>
              </div>
            </li>

            {/* AWS */}
            <li className="relative flex gap-6 md:gap-10 md:flex-row-reverse md:items-center">
              <div className="relative z-10 mt-1 h-10 w-10 shrink-0 rounded-2xl bg-green-100 ring-1 ring-green-200 flex items-center justify-center md:mx-auto md:mt-0">
                <Award className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 md:mr-0 md:max-w-[42rem]">
                <h3 className="text-xl font-semibold">AWS Activate Credits</h3>
                <p className="mt-2 text-gray-600 leading-relaxed">
                  We were awarded AWS Activate Credits, recognizing our potential and providing us with the cloud
                  infrastructure needed to scale. This milestone validated our approach and gave us the technical
                  foundation to serve thousands of users.
                </p>
              </div>
            </li>

            {/* Community */}
            <li className="relative flex gap-6 md:gap-10 md:items-center">
              <div className="relative z-10 mt-1 h-10 w-10 shrink-0 rounded-2xl bg-green-100 ring-1 ring-green-200 flex items-center justify-center md:mx-auto md:mt-0">
                <Rocket className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 md:ml-0 md:max-w-[42rem]">
                <h3 className="text-xl font-semibold">Community Building</h3>
                <p className="mt-2 text-gray-600 leading-relaxed">
                  We created our community "Future Innovators," where 800+ cross-college students and entrepreneurs
                  joined us, finding the vision of Ments useful and inspiring.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </section>
  )
}
