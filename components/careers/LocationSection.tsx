function LocationSection() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gray-100 shadow-lg">
          <div className="grid md:grid-cols-2">
            <div className="flex flex-col justify-center p-8 md:p-12">
              <h2 className="mb-4 text-4xl font-bold md:text-5xl">Location</h2>
              <p className="text-xl text-gray-600">Currently, pre-incubated at Nirmaan, IIT Madras, Chennai, India</p>
            </div>
            <div className="h-64 md:h-auto">
              <img
                src="/nirmaan-building.jpg?height=400&width=600"
                alt="Office location"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
export default LocationSection;