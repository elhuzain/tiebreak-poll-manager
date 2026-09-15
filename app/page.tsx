const steps = [
  { number: "01", title: "Put it to a vote", description: "Add your choices, pick a closing time, and send one link to the chat." },
  { number: "02", title: "Let the crew weigh in", description: "Friends vote on their phones without making an account. They can suggest a new choice, too." },
  { number: "03", title: "Make the call", description: "Follow the results as votes land, then close the poll and reveal who backed what." },
];

function PollOption({ label }: { label: string }) {
  return (
    <div className="flex min-h-13 items-center gap-3 rounded-xl border-2 border-cocoa bg-card px-4 py-3 font-body text-base font-extrabold leading-tight">
      <span className="size-6 shrink-0 rounded-full border-2 border-cocoa" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

function StepCard({ number, title, description }: (typeof steps)[number]) {
  return (
    <article className="rounded-lg border-[2.5px] border-cocoa bg-cream p-6">
      <span className="font-display text-xl font-black text-teal">{number}</span>
      <h3 className="mt-5 mb-2 font-display text-lg font-black leading-tight">{title}</h3>
      <p className="font-body leading-normal text-cocoa-soft">{description}</p>
    </article>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-cream font-body text-cocoa">
      <header className="sticky top-0 bg-cream/90 z-100 backdrop-blur-sm">
        <div className="mx-auto flex min-h-19 max-w-page items-center justify-between gap-4 px-4 sm:px-8">
          <div className="flex items-center gap-2 font-display text-xl font-black tracking-[-0.04em] whitespace-nowrap sm:text-[1.65rem]" aria-label="Tiebreak">
            <span className="grid size-7 -rotate-10 place-items-center rounded-full border-[2.5px] border-cocoa bg-tangerine text-cream-bright" aria-hidden="true">
              <svg className="size-4" viewBox="0 0 32 32" fill="none"><path d="m8.5 16.5 5 5 10-11" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
            <span>tiebreak</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="min-h-11 cursor-not-allowed rounded-full border-2 border-cocoa px-3 font-display text-sm font-extrabold sm:px-5 sm:text-base" type="button" disabled>Log in</button>
            <button className="min-h-11 cursor-not-allowed rounded-full border-2 border-tangerine-deep bg-tangerine-deep px-3 font-display text-sm font-extrabold text-cream-bright shadow-press-tangerine sm:px-5 sm:text-base" type="button" disabled>Sign up</button>
          </div>
        </div>
      </header>

      <main>
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
            <p className="mt-7 font-body text-sm font-bold text-cocoa-soft">Account access coming soon</p>
          </div>

          <div className="relative mx-auto w-full max-w-136 py-3 pr-3 pb-7" aria-label="Example of a Tiebreak poll">
            <div className="absolute inset-[0.2rem_0.4rem_0.8rem_1rem] rotate-5 rounded-[2rem] border-[2.5px] border-cocoa bg-teal-soft" aria-hidden="true" />
            <div className="relative -rotate-2 rounded-lg border-[2.5px] border-cocoa bg-card p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-teal-soft px-3 py-2 font-body text-[0.69rem] font-extrabold tracking-[0.055em] text-teal-deep"><span className="size-2 rounded-full bg-teal" aria-hidden="true" /> VOTING OPEN</span>
                <span className="hidden font-body text-[0.65rem] font-extrabold tracking-[0.06em] text-cocoa-soft sm:block">YOUR CREW&apos;S CALL</span>
              </div>
              <h2 className="mt-6 mb-2 max-w-96 font-display text-[1.7rem] leading-tight font-black tracking-[-0.025em] md:text-[2rem] lg:text-[2.3rem]">What&apos;s the plan for Friday?</h2>
              <p className="font-body text-base text-cocoa-soft">One link. Everyone gets a say.</p>
              <div className="my-6 grid gap-2.5">
                <PollOption label="Pizza night" />
                <PollOption label="Movie marathon" />
                <PollOption label="Something outdoors" />
              </div>
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
        </section>

        <section className="border-t-2 border-cocoa bg-card px-5 py-14 sm:px-8 sm:py-18" aria-labelledby="how-title">
          <div className="mx-auto max-w-page">
            <p className="mb-5 font-body text-xs font-extrabold tracking-[0.1em] text-teal-deep">FROM MAYBE TO MADE UP OUR MINDS</p>
            <h2 id="how-title" className="mb-8 font-display text-[2rem] leading-tight font-black tracking-[-0.035em] md:text-[2.5rem] lg:text-[3rem]">A decision in three moves.</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {steps.map((step) => <StepCard key={step.number} {...step} />)}
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-page items-center justify-between gap-4 px-5 py-6 sm:px-8">
        <span className="font-display text-lg font-black tracking-[-0.04em]">tiebreak<span className="text-tangerine-deep" aria-hidden="true">.</span></span>
        <p className="font-body text-sm font-bold text-cocoa-soft">Less debating. More doing.</p>
      </footer>
    </div>
  );
}
