import type { PollResults } from "@/lib/data/public-polls";
import { VoterResultOption } from "@/components/voter-result-option";

export function VoterResultsList({ results, mine }: { results: PollResults; mine: string[] }) {
  const leaderVotes = Math.max(0, ...results.options.map((option) => option.votes));
  const leaders = results.options.filter((option) => option.votes === leaderVotes);
  const singleLeader = leaderVotes > 0 && leaders.length === 1 ? leaders[0].id : null;
  return <>
    {results.totalBallots === 0 ? <p className="rounded-md border-2 border-cocoa bg-card p-4 font-body text-base">No votes yet. The race starts with the first ballot.</p> :
      <p className="font-body text-base font-bold">{singleLeader ? `${leaders[0].label} is in the lead with ${leaderVotes} ${leaderVotes === 1 ? "vote" : "votes"}.` : `Tied at ${leaderVotes} ${leaderVotes === 1 ? "vote" : "votes"} each.`}</p>}
    <ul className="mt-5 grid gap-3">{results.options.map((option) => <VoterResultOption key={option.id} option={option} totalBallots={results.totalBallots} leaderVotes={leaderVotes} isLeader={option.id === singleLeader} showTicks={results.totalBallots <= 20} isMine={mine.includes(option.id)} />)}</ul>
  </>;
}
