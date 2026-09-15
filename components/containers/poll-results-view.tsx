import type { PollResults } from "@/lib/data/public-polls";
import { PollLeaderCard } from "@/components/poll-leader-card";
import { PollResultOptionList } from "@/components/list/poll-result-option-list";

export function PollResultsView({ results, mine = [] }: { results: PollResults; mine?: string[] }) {
  const sorted = [...results.options].sort((a, b) => b.votes - a.votes || a.label.localeCompare(b.label));
  const topVotes = sorted[0]?.votes ?? 0;
  const leaders = topVotes > 0 ? sorted.filter((option) => option.votes === topVotes) : [];
  const singleLeader = leaders.length === 1 ? leaders[0] : null;
  const secondVotes = sorted.find((option) => option.id !== singleLeader?.id)?.votes ?? 0;
  const settled = results.status === "settled";

  return <>
    {singleLeader && <div className="mt-8"><PollLeaderCard option={singleLeader} ballots={results.totalBallots} aheadBy={topVotes - secondVotes} settled={settled} isMine={mine.includes(singleLeader.id)} /></div>}
    {!singleLeader && <p className="mt-8 rounded-lg border-2 border-cocoa bg-card p-5 font-body text-base font-bold">{results.totalBallots === 0 ? settled ? "Voting ended with no votes. There’s no winner to reveal." : "No votes yet. Share the link to get your crew started." : `Tied at ${topVotes} ${topVotes === 1 ? "vote" : "votes"} each.`}</p>}
    <PollResultOptionList results={results} mine={mine} omitId={settled ? undefined : singleLeader?.id} />
  </>;
}
