import CareerHero from "@/components/careers/CareerHero";
import ValuesSection from "@/components/careers/ValuesSection";
import BenefitsSection from "@/components/careers/BenefitsSection";
import LocationSection from "@/components/careers/LocationSection";
import OpeningsSection from "@/components/careers/OpeningsSection";


export default function CareersPage() {
  return (
    <main className="min-h-screen w-full overflow-x-hidden">
      <CareerHero />
      <ValuesSection />
      <BenefitsSection />
      <LocationSection />
      <OpeningsSection />
    </main>
    
  )
}

