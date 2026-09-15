import { LandingFooter } from "@/components/containers/landing-footer";
import { LandingHeader } from "@/components/containers/landing-header";
import { LandingHero } from "@/components/containers/landing-hero";
import { LandingStepsSection } from "@/components/containers/landing-steps-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-cream font-body text-cocoa">
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingStepsSection />
      </main>
      <LandingFooter />
    </div>
  );
}
