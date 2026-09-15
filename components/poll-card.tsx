import Link from "next/link";
import type { PollSummary } from "@/lib/data/polls";
import { CopyPollLinkButton } from "@/components/copy-poll-link-button";

export function PollCard({ poll }: { poll: PollSummary }) {
  const closes = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }).format(new Date(poll.closesAt));
  return <li className="border-b border-cocoa/20 py-4 last:border-b-0">
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <Link href={`/dashboard/poll/${poll.slug}`} className="font-display text-lg font-extrabold leading-tight underline decoration-cocoa/40 underline-offset-4 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal">{poll.title}</Link>
        <p className="mt-1 font-body text-sm text-cocoa-soft">{poll.status === "open" ? <><span>Voting open · </span><time dateTime={poll.closesAt}>Closes {closes} UTC</time></> : "Voting closed"}</p>
        {poll.pendingSuggestions > 0 && <p className="mt-1 font-body text-sm font-extrabold text-tangerine-deep">{poll.pendingSuggestions} pending {poll.pendingSuggestions === 1 ? "suggestion" : "suggestions"}</p>}
      </div>
      <CopyPollLinkButton slug={poll.slug} minimal />
    </div>
  </li>;
}
