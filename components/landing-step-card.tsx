import type { LandingStep } from "@/data/landing-steps";

export function LandingStepCard({ number, title, description }: LandingStep) {
  return (
    <article className="rounded-lg border-[2.5px] border-cocoa bg-cream p-6">
      <span className="font-display text-xl font-black text-teal">{number}</span>
      <h3 className="mt-5 mb-2 font-display text-lg font-black leading-tight">{title}</h3>
      <p className="font-body leading-normal text-cocoa-soft">{description}</p>
    </article>
  );
}
