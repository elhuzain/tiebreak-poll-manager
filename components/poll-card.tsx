import type { PollSummary } from "@/lib/data/polls";
import { CopyPollLinkButton } from "@/components/copy-poll-link-button";
import { PollStatusPills } from "@/components/poll-status-pills";
import Link from "next/link";

export function PollCard({ poll }: { poll: PollSummary }) {
  return <li className="rounded-lg border-[2.5px] border-cocoa bg-card p-5 sm:p-6">
    <Link href={`/dashboard/poll/${poll.slug}`} className="block rounded-md focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal">
      <h2 className="font-display text-lg font-extrabold underline decoration-cocoa/40 underline-offset-4">{poll.title}</h2>
      <PollStatusPills status={poll.status} closesAt={poll.closesAt} className="mt-3" />
    </Link>
    <CopyPollLinkButton slug={poll.slug} />
  </li>;
}
