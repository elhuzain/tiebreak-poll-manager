"use client";

import { useEffect, useRef, useState } from "react";

export function CopyPollLinkButton({ slug, minimal = false }: { slug: string; minimal?: boolean }) {
  const [feedback, setFeedback] = useState<"copied" | "failed" | null>(null);
  const [copying, setCopying] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timeout.current) clearTimeout(timeout.current);
  }, []);

  async function copyLink() {
    if (copying) return;
    setCopying(true);
    try {
      const url = new URL(`/poll/${slug}`, window.location.origin).toString();
      await navigator.clipboard.writeText(url);
      setFeedback("copied");
    } catch {
      setFeedback("failed");
    } finally {
      setCopying(false);
    }
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setFeedback(null), 3000);
  }

  return <>
    <button type="button" onClick={copyLink} disabled={copying} aria-busy={copying} className={minimal ? "min-h-11 shrink-0 font-body text-sm font-extrabold underline underline-offset-4 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal disabled:cursor-wait disabled:opacity-70" : "mt-4 min-h-10 rounded-full border-2 border-cocoa bg-cream px-4 font-display text-sm font-extrabold focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal disabled:cursor-wait disabled:opacity-70"}>
      {copying ? "Copying…" : feedback === "copied" ? "Copied!" : feedback === "failed" ? "Try again" : "Copy Link"}
    </button>
    <span role="status" className="sr-only">{feedback === "copied" ? "Copied!" : feedback === "failed" ? "Couldn’t copy the link. Try again." : ""}</span>
  </>;
}
