import { VoterAvatar } from "@/components/voter-avatar";
import type { PollResults } from "@/lib/data/public-polls";

type Option = PollResults["options"][number];

export function PollLeaderCard({ option, ballots, aheadBy, settled, isMine = false }: {
  option: Option; ballots: number; aheadBy: number; settled: boolean; isMine?: boolean;
}) {
  const percent = ballots ? Math.round(option.votes / ballots * 100) : 0;
  const filled = Math.round(percent / 10);
  return <section aria-label={settled ? "Winning option" : "Leading option"} className="relative overflow-hidden rounded-lg border-[2.5px] border-cocoa bg-tangerine p-6 text-cream-bright sm:p-8">
    <p className="absolute bg-butter text-cocoa py-2 w-90 right-0 rotate-30 translate-x-24 translate-y-1 border-y-[2.5px] border-y-cocoa text-center font-body text-xs font-extrabold tracking-[0.1em]">{settled ? "WINNING OPTION" : "IN THE LEAD"}</p>
    <h2 className="font-display text-2xl font-black leading-tight md:text-3xl">{option.label}</h2>
    {/* {isMine && <span className="mt-4 inline-block rounded-full border-2 border-cream-bright px-3 py-1 font-body text-xs font-extrabold">Your pick</span>} */}
    {option.suggestedBy && <div className="mt-4 flex items-center gap-2 bg-cocoa/35 w-fit rounded-full pe-3 py-1 p-1"><VoterAvatar seed={option.suggestedByAvatar ?? "Milo"} tint={option.suggestedByTint ?? "cbe2d8"} size={32} /><p className="font-body text-sm font-bold">Suggested by {option.suggestedBy}</p></div>}
    <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
      <p className="font-display text-4xl font-black tabular-nums md:text-5xl">{percent}%</p>
      <p className="rounded-md bg-cocoa/40 px-3 py-2 font-body text-sm font-extrabold tabular-nums">{option.votes} of {ballots} {ballots === 1 ? "vote" : "votes"}{settled ? "" : ` · Ahead by ${aheadBy}`}</p>
    </div>
    <div aria-hidden="true" className="mt-4 grid grid-cols-10 gap-1.5">{Array.from({ length: 10 }, (_, index) => <span key={index} className={`h-6 rounded-sm ${index < filled ? "bg-butter" : "bg-cocoa/35"}`} />)}</div>
  </section>;
}
