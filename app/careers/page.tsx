import CareerHero from "@/components/careers/CareerHero";
import ValuesSection from "@/components/careers/ValuesSection";
import BenefitsSection from "@/components/careers/BenefitsSection";
import LocationSection from "@/components/careers/LocationSection";
import Navbar from "@/components/navbar";
import OpeningsSection from "@/components/careers/OpeningsSection";



export default function CareersPage() {
  return (
    <main className="flex w-full flex-col items-center gap-32 pb-32">
      <Navbar/> 
      <CareerHero />
      <ValuesSection />
      <BenefitsSection />
      <LocationSection />
      <OpeningsSection />
    </main>
  )
}

