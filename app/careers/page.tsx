import CareerHero from "@/components/careers/CareerHero";
import ValuesSection from "@/components/careers/ValuesSection";
import BenefitsSection from "@/components/careers/BenefitsSection";
import LocationSection from "@/components/careers/LocationSection";
import Navbar from "@/components/navbar";
import OpeningsSection from "@/components/careers/OpeningsSection";
import Footer from "@/components/footer";

export default function CareersPage() {
  return (
    <main className="min-h-screen w-full">
      <CareerHero />
      <ValuesSection />
      <BenefitsSection />
      <LocationSection />
      <OpeningsSection />
    </main>
    
  )
}

