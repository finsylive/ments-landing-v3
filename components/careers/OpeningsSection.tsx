function OpeningsSection() {
  const openings = [
    {
      title: "Video Editor",
      type: "Part-time / Internship (Unpaid, with perks)",
      location: "Remote",
      description: "Edit videos for our content creators, gain real-world startup experience, and build your portfolio.",
      applyLink: "https://docs.google.com/forms/d/e/1FAIpQLSdJ66Pe7nLQDo0QsYLBMCYsUXy5j2n7C4HNb099HHLk9PMB-A/viewform?usp=header",
    },
    {
      title: "Content Creator",
      type: "Part-time / Internship",
      location: "Remote",
      description: "Create engaging content for our blog, social media, and other channels.",
      applyLink: "https://forms.gle/RgiuThLHnKdT4cii9",
    },
    {
      title: "Content Writer",
      type: "Part-time / Internship",
      location: "Remote",
      description: "Write compelling articles, blogs, and copy that resonate with the college community.",
      applyLink: "https://forms.gle/anhPZfoeVkpqNVYQA",
    },
    {
      title: "Business Development Intern",
      type: "Internship",
      location: "Remote",
      description: "Drive partnerships, outreach, and growth strategies to expand Ments' reach and impact.",
      applyLink: "https://forms.gle/n7gdS7bmZ1cUMyDz8",
    },
  ];

  return (
    <section id="openings" className="relative w-full overflow-hidden py-20">
      {/* Background elements */}
      <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-100 opacity-30 blur-3xl" />

      <div className="container mx-auto px-4">
        <h2 className="mb-16 text-center text-4xl font-bold md:text-5xl lg:text-6xl">Current Openings</h2>

        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          {openings.map((job, index) => (
            <div key={index} className="rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl">
              <h3 className="mb-2 text-2xl font-semibold">{job.title}</h3>
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-800">{job.type}</span>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">{job.location}</span>
              </div>
              <p className="mb-6 text-gray-600">{job.description}</p>
              {job.applyLink ? (
                <a
                  href={job.applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-black px-6 py-2 text-white transition-colors hover:bg-gray-800 inline-block text-center"
                >
                  Apply Now
                </a>
              ) : (
                <button
                  className="rounded-lg bg-black px-6 py-2 text-white transition-colors hover:bg-gray-800"
                  disabled
                >
                  Apply Now
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="mb-6 text-lg text-gray-600">
            Don't see a role that fits your skills? We're always looking for talented people to join our team.
          </p>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSfHatDy7QkpDsmUYN7vVL1OvKECrZVzEjY5mvGerHn9_SJcLQ/viewform?usp=header"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <button className="rounded-lg border border-black bg-white px-6 py-2 text-black transition-colors hover:bg-gray-100">
              Send us an open application?
            </button>
          </a>
        </div>
      </div>
    </section>
  )
}
export default OpeningsSection;