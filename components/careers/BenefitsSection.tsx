function BenefitsSection() {
  return (
    <section className="relative w-full overflow-hidden bg-gray-50 py-20">
      {/* Background elements */}
      <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-purple-100 opacity-30 blur-3xl" />
      <div className="absolute bottom-20 right-20 h-64 w-64 rounded-full bg-green-100 opacity-30 blur-3xl" />

      <div className="container mx-auto px-4">
        <h2 className="mb-16 text-center text-4xl font-bold md:text-5xl lg:text-6xl">Benefits & Perks</h2>

        <div className="mx-auto grid max-w-6xl gap-x-12 gap-y-8 md:grid-cols-2">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 text-green-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-medium">Pro Tools Access</h3>
              <p className="text-gray-600">ChatGPT Plus, Canva Pro, Adobe</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 text-green-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-medium">Event Exposure</h3>
              <p className="text-gray-600">Speak, host, or rep us at startup events</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 text-green-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-medium">Top Mentorship</h3>
              <p className="text-gray-600">Founders, growth & tech/design leads</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 text-green-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-medium">Career Boost</h3>
              <p className="text-gray-600">LinkedIn cred, LORs, real project outcomes</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 text-green-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-medium">Build with Us</h3>
              <p className="text-gray-600">Shape product & brand early</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 text-green-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-medium">Early Access</h3>
              <p className="text-gray-600">Test beta features & prototypes</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 text-green-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-medium">Get Featured</h3>
              <p className="text-gray-600">Credit on viral content & blog and LinkedIn</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 text-green-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-medium">Future Rewards</h3>
              <p className="text-gray-600">ESOPs/bonuses as we grow</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default BenefitsSection;