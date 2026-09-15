import { LandingPollOptionList } from "@/components/list/landing-poll-option-list";
import { landingPreviewOptions } from "@/data/landing-preview-options";

export function LandingPollPreview() {
  return (
    <div className="relative mx-auto w-full max-w-136 py-3 pr-3 pb-7" aria-label="Example of a Tiebreak poll">
      <div className="absolute inset-[0.2rem_0.4rem_0.8rem_1rem] rotate-5 rounded-[2rem] border-[2.5px] border-cocoa bg-teal-soft" aria-hidden="true" />
      <div className="relative -rotate-2 rounded-lg border-[2.5px] border-cocoa bg-card p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-teal-soft px-3 py-2 font-body text-[0.69rem] font-extrabold tracking-[0.055em] text-teal-deep"><span className="size-2 rounded-full bg-teal" aria-hidden="true" /> VOTING OPEN</span>
          <span className="hidden font-body text-[0.65rem] font-extrabold tracking-[0.06em] text-cocoa-soft sm:block">YOUR CREW&apos;S CALL</span>
        </div>
        <h2 className="mt-6 mb-2 max-w-96 font-display text-[1.7rem] leading-tight font-black tracking-[-0.025em] md:text-[2rem] lg:text-[2.3rem]">What&apos;s the plan for Friday?</h2>
        <p className="font-body text-base text-cocoa-soft">One link. Everyone gets a say.</p>
        <LandingPollOptionList options={landingPreviewOptions} />
        <div className="flex items-center gap-3 border-t-2 border-dashed border-cream-deep pt-4 font-body text-sm font-bold text-cocoa-soft">
          <span className="flex items-center pl-0.5" aria-hidden="true">
            <i className="grid size-7 place-items-center rounded-full border-2 border-cocoa bg-tint-peach font-display text-xs font-extrabold not-italic">P</i>
            <i className="-ml-2 grid size-7 place-items-center rounded-full border-2 border-cocoa bg-tint-butter-soft font-display text-xs font-extrabold not-italic">A</i>
            <i className="-ml-2 grid size-7 place-items-center rounded-full border-2 border-cocoa bg-tint-lilac font-display text-xs font-extrabold not-italic">K</i>
          </span>
          <span>Made for the whole crew</span>
        </div>
      </div>
      <span className="absolute right-0 bottom-1 rotate-5 rounded-full border-2 border-cocoa bg-butter px-4 py-3 font-display text-xs font-extrabold sm:text-sm">Got a better idea? Suggest it.</span>
    </div>
  );
}
