function ValuesSection() {
  return (
    <section className="relative w-full pb-16 py-10"> {/* Removed overflow-hidden, added pb-16 */}
      {/* Background elements */}
      <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-green-100 opacity-30 blur-3xl" />

      <div className="container mx-auto px-4">
        <h2 className="mb-16 text-center text-4xl font-bold md:text-5xl lg:text-6xl">Our Values</h2>

        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Curiosity</h3>
              <p className="text-gray-600">
                Challenging established assumptions, we deeply understand customer needs and collaborate closely to
                develop the most effective solutions.
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Communication</h3>
              <p className="text-gray-600">
                The best ideas are shaped by different perspectives. We listen to feedback and interact transparently,
                both within the company and with our users.
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Ownership</h3>
              <p className="text-gray-600">
                Everyone is a founder of their work. We own outcomes end-to-end and celebrate wins (and lessons)
                together.
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Growth & Enablement</h3>
              <p className="text-gray-600">
                We invest in your growth, providing the resources (any tools you need), mentorship, and freedom you need
                to do your best work.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
export default ValuesSection;