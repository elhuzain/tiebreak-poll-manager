import type { PublicOption } from "@/lib/data/public-polls";

export function VoterBallotOption({ option, selected, multiple, onToggle }: {
  option: PublicOption; selected: boolean; multiple: boolean; onToggle: () => void;
}) {
  return <label className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-md border-2 px-4 py-3 focus-within:outline-[3px] focus-within:outline-offset-2 focus-within:outline-teal ${selected ? "border-teal-deep bg-teal-soft" : "border-cocoa bg-card"}`}>
    <input type={multiple ? "checkbox" : "radio"} name="ballot-choice" checked={selected} onChange={onToggle} className="size-5 shrink-0 accent-teal-deep" />
    <span className="font-body text-base font-bold">{option.label}{option.suggestedBy && <span className="mt-1 block text-sm font-normal text-cocoa-soft">Suggested by {option.suggestedBy}</span>}</span>
  </label>;
}
