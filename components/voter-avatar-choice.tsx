import { VoterAvatar } from "@/components/voter-avatar";

export function VoterAvatarChoice({ choice, selected, onSelect }: {
  choice: { seed: string; tint: string; label: string };
  selected: boolean;
  onSelect: () => void;
}) {
  return <button type="button" onClick={onSelect} aria-pressed={selected} aria-label={choice.label}
    className={`rounded-full p-1 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal ${selected ? "outline-[3px] outline-offset-2 outline-teal-deep" : ""}`}>
    <VoterAvatar seed={choice.seed} tint={choice.tint} />
  </button>;
}
