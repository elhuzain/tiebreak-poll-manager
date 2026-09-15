"use client";

import { useEffect, useRef, useState } from "react";

export function CopyPollLinkButton({ slug }: { slug: string }) {
  const [feedback, setFeedback] = useState<"copied" | "failed" | null>(null);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timeout.current) clearTimeout(timeout.current);
  }, []);

  async function copyLink() {
    try {
      const url = new URL(`/poll/${slug}`, window.location.origin).toString();
      await navigator.clipboard.writeText(url);
      setFeedback("copied");
    } catch {
      setFeedback("failed");
    }
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setFeedback(null), 3000);
  }

  return <>
    <button type="button" onClick={copyLink} className="mt-4 min-h-10 rounded-full border-2 border-cocoa bg-cream px-4 font-display text-sm font-extrabold focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal">
      {feedback === "copied" ? "Copied!" : feedback === "failed" ? "Try again" : "Copy Link"}
    </button>
    <span role="status" className="sr-only">{feedback === "copied" ? "Copied!" : feedback === "failed" ? "Couldn’t copy the link. Try again." : ""}</span>
  </>;
}
