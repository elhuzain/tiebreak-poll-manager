import type { PollResults } from "@/lib/data/public-polls";
import { PollResultOptionRow } from "@/components/poll-result-option-row";

export function PollResultOptionList({ results, mine, omitId }: { results: PollResults; mine: string[]; omitId?: string }) {
  const sorted = [...results.options].sort((a, b) => b.votes - a.votes || a.label.localeCompare(b.label));
  const leaderVotes = Math.max(0, ...sorted.map((option) => option.votes));
  const tiedTop = results.status === "settled" && leaderVotes > 0 && sorted.filter((option) => option.votes === leaderVotes).length > 1;
  const shown = omitId ? sorted.filter((option) => option.id !== omitId) : sorted;
  return <section aria-labelledby="all-options-title" className="mt-8"><div className="flex flex-wrap items-end justify-between gap-2"><h2 id="all-options-title" className="font-display text-xl font-extrabold">{omitId ? "Other options" : "All options"}</h2><p className="font-body text-sm font-bold tabular-nums">{results.totalBallots} {results.totalBallots === 1 ? "vote" : "votes"} in</p></div>
    <ul className="mt-4 overflow-hidden rounded-lg border-[2.5px] border-cocoa bg-card">{shown.map((option) => <PollResultOptionRow key={option.id} option={option} ballots={results.totalBallots} leaderVotes={leaderVotes} tiedTop={!!tiedTop && option.votes === leaderVotes} isMine={mine.includes(option.id)} />)}</ul>
  </section>;
}
