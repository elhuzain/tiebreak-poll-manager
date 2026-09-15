import { avatarChoices } from "@/lib/avatars";
import { VoterAvatarChoice } from "@/components/voter-avatar-choice";

export function VoterAvatarList({ selectedSeed, onSelect }: { selectedSeed: string | null; onSelect: (seed: string) => void }) {
  return <div className="flex flex-wrap gap-3">{avatarChoices.map((choice) => <VoterAvatarChoice key={choice.seed} choice={choice} selected={selectedSeed === choice.seed} onSelect={() => onSelect(choice.seed)} />)}</div>;
}
