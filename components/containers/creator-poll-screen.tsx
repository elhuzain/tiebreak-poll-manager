import Link from "next/link";
import { CrewAvatarStack } from "@/components/crew-avatar-stack";
import { CreatorPollControls } from "@/components/creator-poll-controls";
import { CreatorPollLiveRefresh } from "@/components/creator-poll-live-refresh";
import { PollResultsView } from "@/components/containers/poll-results-view";
import { CreatorSuggestionList } from "@/components/list/creator-suggestion-list";
import { LandingFooter } from "@/components/containers/landing-footer";
import { LandingHeader } from "@/components/containers/landing-header";
import { PollStatusPills } from "@/components/poll-status-pills";
import type { CreatorPollDetail } from "@/lib/data/creator-poll-detail";

export function CreatorPollScreen({ poll }: { poll: CreatorPollDetail }) {
  const ballots = poll.results.totalBallots;
  const settled = poll.status === "settled";
  const lastVote = poll.lastVoteMinutes === null ? "Waiting for the first vote" : poll.lastVoteMinutes === 0 ? "Last one just now" : `Last one ${poll.lastVoteMinutes} min ago`;

  return <div className="flex min-h-screen flex-col bg-cream font-body text-cocoa">
    {!settled && <CreatorPollLiveRefresh />}
    <LandingHeader />
    <main className="mx-auto w-full max-w-content flex-1 px-5 py-10 sm:px-8 md:py-14">
      <Link href="/dashboard" className="font-body text-sm font-extrabold underline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal">← My polls</Link>
      <PollStatusPills status={poll.status} closesAt={poll.closesAt} className="mt-7" />
      <h1 className="mt-5 font-display text-2xl font-black leading-tight tracking-tight md:text-3xl">{poll.title}</h1>
      <div className="mt-5 flex flex-wrap items-center gap-3"><CrewAvatarStack crew={poll.crew} /><p className="font-body text-sm font-bold tabular-nums">{ballots} of your crew voted · {lastVote}</p></div>

      <PollResultsView results={poll.results} />
      {!settled && poll.suggestionsEnabled && <CreatorSuggestionList suggestions={poll.suggestions} slug={poll.slug} />}
      <CreatorPollControls slug={poll.slug} status={poll.status} />
    </main>
    <LandingFooter />
  </div>;
}
