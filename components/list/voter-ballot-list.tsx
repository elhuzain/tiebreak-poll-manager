import type { PublicOption } from "@/lib/data/public-polls";
import { VoterBallotOption } from "@/components/voter-ballot-option";

export function VoterBallotList({ options, selectedIds, maxChoices, onToggle }: {
  options: PublicOption[]; selectedIds: string[]; maxChoices: number; onToggle: (id: string) => void;
}) {
  return <div className="grid gap-3">{options.map((option) => <VoterBallotOption key={option.id} option={option} selected={selectedIds.includes(option.id)} multiple={maxChoices > 1} onToggle={() => onToggle(option.id)} />)}</div>;
}
