import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Target, DollarSign } from "lucide-react"

const features = [
  {
    icon: <Target className="h-8 w-8" />,
    title: "Showcase Projects",
    description:
      "Present your startup ideas, prototypes, and achievements to a community of investors, mentors, and potential collaborators through our intuitive project showcase platform.",
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Recruit Talent",
    description:
      "Connect with skilled developers, designers, marketers, and other professionals who are passionate about joining innovative startups and making an impact.",
  },
  {
    icon: <DollarSign className="h-8 w-8" />,
    title: "Raise Funds & Connect with Investors",
    description:
      "Access a network of angel investors, VCs, and funding opportunities. Present your business case and connect with the right investors for your stage and industry.",
  },
]

export function WhatWeDoSection() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background elements */}
      <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-green-100 opacity-30 blur-3xl" />

      <div className="container mx-auto px-4">
        <h2 className="mb-16 text-center text-4xl font-semibold md:text-5xl lg:text-6xl">What We Do</h2>

        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="rounded-2xl bg-white p-6 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
