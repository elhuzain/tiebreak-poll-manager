import { PollCard } from "@/components/poll-card";
import type { PollSummary } from "@/lib/data/polls";

export function PollList({ polls }: { polls: PollSummary[] }) {
  return <ul className="grid gap-4">{polls.map((poll) => <PollCard key={poll.id} poll={poll} />)}</ul>;
}
