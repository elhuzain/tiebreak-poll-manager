import Link from "next/link";
import { LandingFooter } from "@/components/containers/landing-footer";
import { LandingHeader } from "@/components/containers/landing-header";

export function NotFoundScreen() {
  return (
    <div className="flex min-h-screen flex-col bg-cream font-body text-cocoa">
      <LandingHeader />
      <main className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8 sm:py-20">
        <section className="mx-auto w-full max-w-content" aria-labelledby="not-found-title">
          <div className="relative rounded-lg border-[2.5px] border-cocoa bg-card px-6 py-10 text-center sm:px-12 sm:py-14">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 rounded-full border-2 border-cocoa bg-teal-soft px-5 py-2 font-body text-xs font-extrabold tracking-[0.08em] whitespace-nowrap text-teal-deep">
              PAGE NOT FOUND
            </div>
            <p className="font-display text-[5.5rem] leading-none font-black tracking-[-0.07em] text-teal sm:text-[8rem]" aria-hidden="true">404</p>
            <h1 id="not-found-title" className="mt-3 font-display text-[2.1rem] leading-tight font-black tracking-[-0.035em] sm:text-[2.8rem]">
              This link isn&apos;t in the running.
            </h1>
            <p className="mx-auto mt-5 max-w-120 font-body text-base leading-normal text-cocoa-soft sm:text-md">
              We couldn&apos;t find this page or poll. The link might have a typo, or the poll may have been removed. Check the link in your chat and try again.
            </p>
            <Link
              className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-teal-deep bg-teal px-6 font-display text-base font-extrabold text-cream focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal"
              href="/"
            >
              Back to Tiebreak
              <svg className="size-4" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Link>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
