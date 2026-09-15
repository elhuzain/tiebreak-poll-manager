import type { PollSummary } from "@/lib/data/polls";
import { CopyPollLinkButton } from "@/components/copy-poll-link-button";

export function PollCard({ poll }: { poll: PollSummary }) {
  const closes = new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }).format(new Date(poll.closesAt));
  return <li className="rounded-lg border-[2.5px] border-cocoa bg-card p-5 sm:p-6">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <h2 className="font-display text-lg font-extrabold">{poll.title}</h2>
      <span className="rounded-full border-2 border-teal-deep bg-teal-soft px-3 py-1 font-body text-xs font-extrabold text-teal-deep">{poll.status === "open" ? "Voting open" : "Voting closed"}</span>
    </div>
    <p className="mt-3 font-body text-sm text-cocoa-soft">Closes {closes} UTC</p>
    <CopyPollLinkButton slug={poll.slug} />
  </li>;
}
