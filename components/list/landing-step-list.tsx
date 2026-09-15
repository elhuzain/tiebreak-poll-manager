import { LandingStepCard } from "@/components/landing-step-card";
import type { LandingStep } from "@/data/landing-steps";

export function LandingStepList({ steps }: { steps: LandingStep[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {steps.map((step) => <LandingStepCard key={step.number} {...step} />)}
    </div>
  );
}
