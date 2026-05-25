import { CTASection } from "@/components/landing/cta-section";
import { HeroSection } from "@/components/landing/hero-section";
import { LandingHeader } from "@/components/landing/landing-header";
import { FeaturesSection } from "@/components/landing/features-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { IntegrationSection } from "@/components/landing/integration-section";

export default function Home() {
  return (
    <div>
      <LandingHeader />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <IntegrationSection />
      <CTASection />
    </div>
  );
}
