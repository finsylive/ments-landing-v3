import { Handshake, Eye, Zap } from "lucide-react"

const values = [
  {
    icon: <Handshake className="h-8 w-8" />,
    title: "Collaboration",
    description: "We believe in the power of working together to achieve extraordinary results.",
  },
  {
    icon: <Eye className="h-8 w-8" />,
    title: "Transparency",
    description: "Open communication and honest relationships form the foundation of trust.",
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: "Impact",
    description: "Every action we take is focused on creating meaningful change in the startup ecosystem.",
  },
]

export function OurValuesSection() {
  return (
    <section className="relative w-full overflow-hidden pb-20">
      {/* Background elements */}
      <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-100 opacity-30 blur-3xl" />

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h2 className="mb-4 text-center text-4xl font-semibold md:text-5xl lg:text-6xl">Our Values</h2>
          <p className="text-gray-600 md:text-lg">Principles that keep us grounded while we build for the long term.</p>
        </div>

        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-3">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-green-600 ring-1 ring-green-200">
                  {value.icon}
                </div>
                <h3 className="mb-2 text-xl font-semibold">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
