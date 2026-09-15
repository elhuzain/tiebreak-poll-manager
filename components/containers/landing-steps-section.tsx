import { LandingStepList } from "@/components/list/landing-step-list";
import { landingSteps } from "@/data/landing-steps";

export function LandingStepsSection() {
  return (
    <section className="border-t-2 border-cocoa bg-card px-5 py-14 sm:px-8 sm:py-18" aria-labelledby="how-title">
      <div className="mx-auto max-w-page">
        <p className="mb-5 font-body text-xs font-extrabold tracking-[0.1em] text-teal-deep">FROM MAYBE TO MADE UP OUR MINDS</p>
        <h2 id="how-title" className="mb-8 font-display text-[2rem] leading-tight font-black tracking-[-0.035em] md:text-[2.5rem] lg:text-[3rem]">A decision in three moves.</h2>
        <LandingStepList steps={landingSteps} />
      </div>
    </section>
  );
}
