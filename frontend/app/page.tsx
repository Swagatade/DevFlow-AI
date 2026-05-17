import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { CapabilitiesSection } from "@/sections/landing/capabilities-section";
import { CtaSection } from "@/sections/landing/cta-section";
import { DemoPreviewSection } from "@/sections/landing/demo-preview-section";
import { FeaturesSection } from "@/sections/landing/features-section";
import { HeroSection } from "@/sections/landing/hero-section";
import { HowItWorksSection } from "@/sections/landing/how-it-works-section";
import { OpenSourceSection } from "@/sections/landing/open-source-section";
import { TechnologyStackSection } from "@/sections/landing/technology-stack-section";

export default function LandingPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <TechnologyStackSection />
        <FeaturesSection />
        <CapabilitiesSection />
        <DemoPreviewSection />
        <OpenSourceSection />
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
