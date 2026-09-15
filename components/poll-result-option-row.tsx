import type { PollResults } from "@/lib/data/public-polls";

type Option = PollResults["options"][number];

export function PollResultOptionRow({ option, ballots, leaderVotes, tiedTop, isMine }: {
  option: Option; ballots: number; leaderVotes: number; tiedTop: boolean; isMine: boolean;
}) {
  const percent = ballots ? Math.round(option.votes / ballots * 100) : 0;
  return <li className={`border-b-2 border-dashed border-cocoa/20 p-4 last:border-b-0 sm:p-5 ${tiedTop ? "bg-butter/40" : ""}`}>
    <div className="flex flex-wrap items-start justify-between gap-2"><div><h3 className="font-display text-base font-extrabold">{option.label}</h3>{option.suggestedBy && <p className="font-body text-sm text-cocoa-soft">Suggested by {option.suggestedBy}</p>}</div><div className="flex flex-wrap items-center gap-2">{isMine && <span className="rounded-full border-2 border-cocoa bg-cream px-3 py-1 font-body text-xs font-extrabold">Your pick</span>}<p className="font-body text-sm font-extrabold tabular-nums">{percent}% · {option.votes} of {ballots}</p></div></div>
    <div aria-hidden="true" className="mt-3 h-2.5 overflow-hidden rounded-full bg-cream-deep"><div className="h-full rounded-full bg-teal-deep" style={{ width: `${leaderVotes ? option.votes / leaderVotes * 100 : 0}%` }} /></div>
  </li>;
}
