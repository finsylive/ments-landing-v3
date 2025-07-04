import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const mentors = [
  {
    name: "Dr Ravi Shankar ",
    title: "Lead scientist at IISc",
    expertise: "",
    initials: "",
  },
  {
    name: "Sarat ",
    title: "Company secretary",
    expertise: "",
    initials: "",
  },
  {
    name: "Jayath",
    title: "Chartered Accountant",
    expertise: "",
    initials: "",
  },
]

export function MeetOurMentorsSection() {
  return (
    <section className="relative w-full overflow-hidden bg-gray-50 py-20">
      {/* Background elements */}
      <div className="absolute bottom-20 right-20 h-64 w-64 rounded-full bg-green-100 opacity-30 blur-3xl" />

      <div className="container mx-auto px-4">
        <h2 className="mb-16 text-center text-4xl font-semibold md:text-5xl lg:text-6xl">Our Mentors</h2>

        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {mentors.map((mentor, index) => (
              <Card
                key={index}
                className="rounded-2xl bg-white p-6 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                <div className="text-center">
                  <Avatar className="mx-auto mb-4 h-20 w-20 border-4 border-white shadow-lg">
                    <AvatarImage src={`/placeholder.svg?height=80&width=80`} alt={mentor.name} />
                    <AvatarFallback className="bg-green-100 text-lg font-semibold text-green-700">
                      {mentor.initials}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="mb-1 text-lg font-semibold">{mentor.name}</h3>
                  <p className="mb-2 text-sm font-medium text-green-600">{mentor.title}</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{mentor.expertise}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
