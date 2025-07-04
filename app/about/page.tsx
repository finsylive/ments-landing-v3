"use client"
import { HeroSection } from "@/components/about/hero-section"
import { WhatWeDoSection } from "@/components/about/what-we-do-section"
import { OurStorySection } from "@/components/about/our-story-section"
import { MeetTheTeamSection } from "@/components/about/meet-the-team-section"
import { MeetOurMentorsSection } from "@/components/about/meet-our-mentors-section"
import { OurValuesSection } from "@/components/about/our-values-section"
import { CallToActionSection } from "@/components/about/call-to-action-section"

export default function AboutPage() {
  return (
    <main className="flex w-full flex-col items-center gap-32 ">
      <HeroSection />
      <WhatWeDoSection />
      <OurStorySection />
      <MeetTheTeamSection />
      <MeetOurMentorsSection />
      <OurValuesSection />
    </main>
  )
}