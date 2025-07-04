import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"

export function CallToActionSection() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl rounded-3xl bg-gradient-to-br from-green-600 to-blue-600 p-12 text-center shadow-xl">
          <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">Ready to Join the Ments Community?</h2>
          <p className="mb-8 text-xl text-green-50">
            Connect with innovators, investors, and mentors who are shaping the future of entrepreneurship.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="rounded-2xl bg-white px-8 py-3 text-lg font-semibold text-green-600 shadow-lg transition-all hover:scale-105 hover:shadow-xl hover:bg-gray-50"
            >
              Join Ments Today
            </Button>
            <a
              href="mailto:official@ments.app"
              className="flex items-center gap-2 rounded-2xl border-2 border-white px-6 py-3 text-lg font-medium text-white transition-all hover:bg-white hover:text-green-600"
            >
              <Mail className="h-5 w-5" />
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
