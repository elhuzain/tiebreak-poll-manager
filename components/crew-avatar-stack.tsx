import { VoterAvatar } from "@/components/voter-avatar";
import type { CrewMember } from "@/lib/data/creator-poll-detail";

export function CrewAvatarStack({ crew }: { crew: CrewMember[] }) {
  if (!crew.length) return null;
  return <ul className="flex pl-2" aria-label="Recent voters">{crew.map((member, index) => <li key={`${member.name}-${index}`} className="-ml-2" title={member.name} aria-label={member.name}>
    <VoterAvatar seed={member.avatarSeed} tint={member.avatarTint} size={36} />
  </li>)}</ul>;
}
