"use client";

import Link from "next/link";
import Image from "next/image";
import { GraduationCap, Briefcase, LineChart, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

type Audience = {
  title: string;
  description: string;
  href: string;
  Icon: React.ComponentType<{ className?: string }>;
  image?: string; // optional top illustration in the media area
};

const audiences: Audience[] = [
  {
    title: "For Talent",
    description:
      "Discover innovative startups, join talented teams, and start building the future today.",
    href: "/",
    Icon: GraduationCap,
  image: "/lap%20laptop.png", // requested laptop image from public/
  },
  {
    title: "For Founders",
    description:
      "Showcase your vision, recruit top-tier talent, and connect with incubators and accelerators.",
    href: "/",
    Icon: Briefcase,
  image: "/Notepad Idea.jpeg", // notepad/idea graphic (existing)
  },
  {
    title: "For Investors",
    description:
      "Browse curated startup profiles, track their growth, and invest in the next big thing.",
    href: "/",
    Icon: LineChart,
  image: "/roundtable no text.jpeg", // team-collab overhead graphic (existing)
  },
];

// Subtle media area styles per card (simulating the colorful image header)
const mediaStyles = [
  "bg-[radial-gradient(1200px_300px_at_-100px_-100px,#00D0B6_0%,transparent_40%),linear-gradient(135deg,#0B4660_0%,#0A2342_90%)]",
  "bg-[radial-gradient(900px_260px_at_120%_-10%,#FFD166_0%,transparent_45%),linear-gradient(135deg,#114B5F_0%,#0D2B45_85%)]",
  "bg-[radial-gradient(1000px_300px_at_-50%_-20%,#9C5FFF_0%,transparent_40%),linear-gradient(135deg,#0C2233_0%,#0A1730_90%)]",
];

export default function ModernAudienceSection() {
  return (
    <section
      className={cn(
        "w-full bg-gray-100 text-neutral-900 py-20 md:py-28 px-4 mt-20",
        poppins.variable
      )}
    >
      <div className="mx-auto max-w-6xl">
        {/* Header (left-aligned, semi-bold, brand green) */}
        <div className="mb-10 md:mb-14">
          <h2 className="font-semibold tracking-tight text-left text-balance text-[38px] leading-[1.1] sm:text-[54px] md:text-[68px]">
            Your Startup Journey
            <br className="hidden sm:block" />
            Starts on <span className="text-gray-400">Ments</span>.
          </h2>
          <p className="mt-4 max-w-2xl text-left text-gray-600 text-lg sm:text-xl">
            A one-stop platform for talent, founders, and investors to connect, build, and grow together.
          </p>
        </div>

        {/* Cards row */}
        <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {audiences.map(({ title, description, href, Icon }, idx) => (
            <Link href={href} key={idx} className="group">
              <Card
                className={cn(
                  "overflow-hidden rounded-2xl bg-transparent border-0 shadow-none h-full"
                )}
              >
                {/* Outer frame like screenshot: dark surface with rounded radius and strong shadow */}
                <div className="rounded-2xl bg-neutral-50 p-0 shadow-[0_12px_40px_rgba(0,0,0,0.15)] ring-1 ring-neutral-200">
                  {/* Top media area (gradient + optional image) */}
                  <div
                    className={cn(
                      "relative h-44 sm:h-48 md:h-56 w-full rounded-t-2xl overflow-hidden",
                      mediaStyles[idx % mediaStyles.length]
                    )}
                  >
                    {/* Decorative vertical slice (mimics split color blocks) */}
                    <div className="absolute inset-y-0 left-[18%] w-[6px] bg-white/20 rounded-full opacity-70" />
                    {/* Illustration if provided, else fallback big icon */}
          {audiences[idx].image ? (
                      <Image
                        src={audiences[idx].image as string}
                        alt={audiences[idx].title}
                        fill
                        sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover"
                        priority
                      />
                    ) : (
                      <Icon className="absolute bottom-4 left-4 h-10 w-10 text-white/90 drop-shadow-[0_6px_18px_rgba(0,0,0,0.35)]" />
                    )}
                    {/* Corner rounding mask */}
                    <div className="pointer-events-none absolute inset-0 rounded-t-2xl ring-1 ring-black/10" />
                  </div>

                  {/* White content panel */}
                  <div className="bg-white text-neutral-900 rounded-b-2xl p-6 sm:p-7 md:p-8">
                    <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-left">
                      {title}
                    </h3>

                    {/* Description (no bullet icon) */}
                    <p className="mt-3 text-neutral-700 text-sm sm:text-base leading-relaxed text-left">
                      {description}
                    </p>

                    {/* Divider line */}
                    <div className="mt-6 h-px w-full bg-neutral-200" />

                    {/* CTA */}
                    <div className="mt-6">
                      <div className="inline-flex items-center justify-between w-full sm:w-auto gap-3">
                        <span className="sr-only">Learn more about {title}</span>
                        <span className="flex-1" />
                      </div>
                      <button
                        aria-label={`Learn more about ${title}`}
            className="w-full sm:w-auto inline-flex items-center justify-between gap-3 rounded-xl bg-green-600 text-white px-5 py-4 font-semibold tracking-tight ring-1 ring-green-600/20 transition-colors hover:bg-green-700"
                      >
                        Learn More
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}