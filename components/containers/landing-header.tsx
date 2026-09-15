export function LandingHeader() {
  return (
    <header className="sticky top-0 z-100 bg-cream/90 backdrop-blur-sm">
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
  );
}
