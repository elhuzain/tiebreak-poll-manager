import { LandingFooter } from "@/components/containers/landing-footer";
import { LandingHeader } from "@/components/containers/landing-header";
import Link from "next/link";
import { PollList } from "@/components/list/poll-list";
import type { PollSummary } from "@/lib/data/polls";

export function AdminDashboard({ email, polls }: { email: string; polls: PollSummary[] }) {
  return (
    <div className="flex min-h-screen flex-col bg-cream font-body text-cocoa">
      <LandingHeader />
      <main className="mx-auto w-full max-w-page flex-1 px-5 py-12 sm:px-8 sm:py-18">
        <p className="mb-3 font-body text-xs font-extrabold tracking-[0.1em] text-teal-deep">YOUR TABLE</p>
        <h1 className="font-display text-[2.8rem] leading-tight font-black tracking-[-0.035em] sm:text-[3.4rem]">My polls</h1>
        <p className="mt-2 font-body text-base text-cocoa-soft">Signed in as {email}</p>
        <div className="mt-8 mb-6"><Link href="/dashboard/new" className="inline-flex min-h-12 items-center rounded-full border-2 border-tangerine-deep bg-tangerine-deep px-6 font-display text-base font-extrabold text-cream-bright shadow-press-tangerine focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal">Create poll</Link></div>
        {polls.length ? <PollList polls={polls} /> : <section className="rounded-lg border-[2.5px] border-cocoa bg-card px-6 py-12 text-center sm:px-10" aria-labelledby="empty-polls-title">
          <div className="mx-auto grid size-14 place-items-center rounded-full border-2 border-cocoa bg-teal-soft text-teal-deep" aria-hidden="true">
            <svg className="size-7" viewBox="0 0 28 28" fill="none"><path d="M7 8h14M7 14h9M7 20h6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg>
          </div>
          <h2 id="empty-polls-title" className="mt-5 font-display text-xl font-black">No polls yet</h2>
          <p className="mx-auto mt-3 max-w-96 font-body text-base leading-normal text-cocoa-soft">The polls you create will show up here.</p>
        </section>}
      </main>
      <LandingFooter />
    </div>
  );
}
