import type { PollResults } from "@/lib/data/public-polls";

type Option = PollResults["options"][number];

export function VoterResultOption({ option, totalBallots, leaderVotes, isLeader, showTicks, isMine }: {
  option: Option; totalBallots: number; leaderVotes: number; isLeader: boolean; showTicks: boolean; isMine: boolean;
}) {
  const percent = totalBallots ? Math.round(option.votes / totalBallots * 100) : 0;
  return <li className={`rounded-lg border-[2.5px] border-cocoa p-5 ${isLeader ? "bg-teal-soft" : "bg-card"}`}>
    <div className="flex flex-wrap items-start justify-between gap-2">
      <div>
        <h3 className="font-display text-lg font-extrabold">{option.label}</h3>
        {option.suggestedBy && <p className="font-body text-sm text-cocoa-soft">Suggested by {option.suggestedBy}</p>}
      </div>
      {isMine && <span className="rounded-full border-2 border-cocoa bg-cream px-3 py-1 font-body text-xs font-extrabold">Your pick</span>}
    </div>
    <p className="mt-3 font-body text-sm font-bold tabular-nums">{percent}% · {option.votes} of {totalBallots} {totalBallots === 1 ? "voter" : "voters"}</p>
    {showTicks && isLeader ? <div aria-hidden="true" className="mt-3 flex flex-wrap gap-1">
      {Array.from({ length: totalBallots }, (_, index) => <span key={index} className={`h-5 w-2 rounded-sm ${index < option.votes ? "bg-teal-deep" : "bg-cream-deep"}`} />)}
    </div> : <div aria-hidden="true" className="mt-3 h-3 overflow-hidden rounded-full bg-cream-deep">
      <div className="h-full rounded-full bg-teal-deep" style={{ width: `${leaderVotes ? option.votes / leaderVotes * 100 : 0}%` }} />
    </div>}
  </li>;
}
