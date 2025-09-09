import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const teamMembers = [
  { name: "RajKamal", role: "Co-Founder & CEO", initials: "KR", education: "IIT Madras", image: "/team/krishna.jpeg" },
  { name: "Ayushman", role: "Co-Founder & COO", initials: "AY", education: "IIT Madras", image: "/team/ayushman.jpeg" },
  { name: "Shriyash", role: "Co-Founder & CTO", initials: "SH", education: "IIT Madras", image: "/team/shriyash.jpg" },
  { name: "Dev", role: "Head of Marketing", initials: "DE", education: "Punjab University", image: "/team/dev.png" },
  { name: "Abhijeet Kumar", role: "Events and Business management", initials: "AK", education: "IIT Madras", image: "/team/abhijeet.jpg" },
  { name: "Rithik", role: "Content Creator", initials: "Ri", education: "IIT Madras", image: "/team/ritik.jpg" },
  { name: "Vaibhwee", role: "Content Creator", initials: "Va", education: "IIT Madras", image: "/team/vaibhwee.jpeg" },
  { name: "Shristi", role: "Social Media Manager", initials: "Sh", education: "IIT Madras", image: "/team/shristi.jpeg" },
]

export function MeetTheTeamSection() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h2 className="mb-4 text-center text-4xl font-semibold md:text-5xl lg:text-6xl">Meet the Team</h2>
          <p className="text-gray-600 md:text-lg">A small, fast-moving crew building tools for founders and future makers.</p>
        </div>

        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="group rounded-2xl bg-white/70 p-6 text-center shadow-sm ring-1 ring-gray-100 backdrop-blur transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <Avatar className="mx-auto mb-4 h-24 w-24 border-4 border-white shadow-lg transition-all group-hover:shadow-xl">
                  <AvatarImage src={member.image} alt={member.name} />
                  <AvatarFallback className="bg-green-100 text-lg font-semibold text-green-700">
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
                <h3 className="mb-1 text-lg font-semibold">{member.name}</h3>
                <div className="mb-2 flex items-center justify-center gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-700 border-0">{member.role}</Badge>
                </div>
                <p className="text-xs text-gray-500">{member.education}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}