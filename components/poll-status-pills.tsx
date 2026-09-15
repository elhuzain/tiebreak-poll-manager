"use client";

import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  const interval = setInterval(callback, 5000);
  return () => clearInterval(interval);
}

function snapshot() {
  return Math.floor(Date.now() / 5000);
}

function dayKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function deadlineLabel(closesAt: Date, now: Date) {
  const time = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(closesAt);
  if (dayKey(closesAt) === dayKey(now)) return `Closes today at ${time}`;
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  if (dayKey(closesAt) === dayKey(tomorrow)) return `Closes tomorrow at ${time}`;
  const date = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(closesAt);
  return `Closes ${date} at ${time}`;
}

export function PollStatusPills({ status, closesAt, viewClosed = false, className = "mt-4" }: {
  status: "open" | "settled"; closesAt: string; viewClosed?: boolean; className?: string;
}) {
  const tick = useSyncExternalStore(subscribe, snapshot, () => null);
  const now = tick === null ? null : new Date(tick * 5000);
  const deadline = new Date(closesAt);
  const closed = status === "settled" || viewClosed || (now !== null && deadline.getTime() <= now.getTime());

  return <div className={`${className} flex flex-wrap items-center gap-3 font-body text-sm font-extrabold`}>
    <span className={`inline-flex min-h-9 items-center gap-2 rounded-full px-4 py-2 ${closed ? "bg-cream-deep text-cocoa" : "bg-teal-soft text-teal-deep"}`}>
      <span aria-hidden="true" className={`size-2 rounded-full ${closed ? "bg-cocoa-soft" : "bg-teal-deep"}`} />
      {closed ? "Voting closed" : "Voting open"}
    </span>
    {!closed && <time dateTime={closesAt} className="inline-flex min-h-9 items-center gap-2 rounded-full border border-cocoa/10 bg-card px-4 py-2 text-cocoa">
      <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4 text-cocoa-soft"><circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.8" /><path d="M10 6v4l2.5 1.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
      {now ? deadlineLabel(deadline, now) : "Closes soon"}
    </time>}
  </div>;
}
