import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ReferralSection() {
  return (
    <section className="w-full py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Seeking for referrals from us?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Submit your resume and we'll notify you when matching positions become available.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/careers/referals">
                <Button size="lg">
                  Submit your resume
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
