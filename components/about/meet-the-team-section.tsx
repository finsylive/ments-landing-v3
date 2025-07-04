import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const teamMembers = [
  { name: "Ayushman", role: "Co-Founder & COO", initials: "AY", education: "IIT Madras", image: "/team/ayushman.jpeg" },
  { name: "Shriyash", role: "Co-Founder & CTO", initials: "SH", education: "IIT Madras", image: "/team/shriyash.png" },
  { name: "RajKamal Kaushal", role: "Co-Founder & CEO", initials: "KR", education: "IIT Madras", image: "/team/krishna.jpeg" },
  { name: "Adarsh", role: "Development officer", initials: "AD", education: "Hindu College, DU", image: "/team/adarsh.png" },
  { name: "Dev", role: "Head of Marketing", initials: "DE", education: "Punjab University", image: "/team/dev.png" },
  { name: "Shobit", role: "Research", initials: "SH", education: "IIT Madras", image: "/team/shobit.jpg" },
]

export function MeetTheTeamSection() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="mb-16 text-center text-4xl font-semibold md:text-5xl lg:text-6xl">Meet the Team</h2>

        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center transition-all hover:scale-105">
                <Avatar className="mx-auto mb-4 h-24 w-24 border-4 border-white shadow-lg transition-all hover:shadow-xl">
                  <AvatarImage src={member.image} alt={member.name} />
                  <AvatarFallback className="bg-green-100 text-lg font-semibold text-green-700">
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
                <h3 className="mb-1 text-lg font-semibold">{member.name}</h3>
                <p className="text-sm text-gray-600">{member.role}</p>
                <p className="text-xs text-gray-400">{member.education}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}