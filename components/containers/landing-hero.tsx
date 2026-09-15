import { LandingPollPreview } from "@/components/landing-poll-preview";

export function LandingHero() {
  return (
    <section className="mx-auto grid max-w-page items-center gap-12 px-5 pt-12 pb-16 sm:px-8 md:gap-16 md:pt-20 lg:grid-cols-[1.07fr_0.93fr] lg:gap-20 lg:pt-26 lg:pb-24" aria-labelledby="hero-title">
      <div className="max-w-148">
        <p className="mb-5 flex items-center gap-3 font-body text-xs font-extrabold tracking-[0.1em] text-teal-deep">
          <span className="h-[3px] w-7 rounded-full bg-teal" aria-hidden="true" /> GROUP DECISIONS, SETTLED
        </p>
        <h1 id="hero-title" className="font-display text-[2.8rem] leading-[0.98] font-black tracking-[-0.055em] text-balance md:text-[3.3rem] lg:text-[3.8rem]">
          The group chat has questions. <em className="mt-[0.1em] block text-tangerine-deep not-italic">Get answers.</em>
        </h1>
        <p className="mt-7 max-w-130 font-body text-[1.05rem] leading-[1.58] text-cocoa-soft lg:text-[1.2rem]">
          Tiebreak is a simple way to make decisions together. Create a poll, share it with your crew, and watch the votes come in. No accounts for voters, no endless back-and-forth.
        </p>
        <p className="mt-7 font-body text-sm font-bold text-cocoa-soft">Create an account to start a poll for your crew.</p>
      </div>
      <LandingPollPreview />
    </section>
  );
}
