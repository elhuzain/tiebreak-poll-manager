"use client";

import { useEffect, useRef, useState } from "react";
import type { PollResults } from "@/lib/data/public-polls";
import { PollResultsView } from "@/components/containers/poll-results-view";

export function VoterResultsPanel({ slug, mine }: { slug: string; mine: string[] }) {
  const [results, setResults] = useState<PollResults | null>(null);
  const [error, setError] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const lastAnnouncement = useRef(0);
  const previousTotal = useRef<number | null>(null);

  useEffect(() => {
    let active = true;
    async function refresh() {
      try {
        const response = await fetch(`/api/poll/${slug}/results`, { cache: "no-store" });
        if (!response.ok) throw new Error("Results unavailable");
        const next = await response.json() as PollResults;
        if (!active) return;
        if (previousTotal.current !== null && previousTotal.current !== next.totalBallots && Date.now() - lastAnnouncement.current > 15000) {
          lastAnnouncement.current = Date.now();
          setAnnouncement(`${next.totalBallots} ${next.totalBallots === 1 ? "person has" : "people have"} voted.`);
        }
        previousTotal.current = next.totalBallots;
        setResults(next);
        setError(false);
      } catch {
        if (active) setError(true);
      }
    }
    void refresh();
    const interval = setInterval(() => void refresh(), 5000);
    return () => { active = false; clearInterval(interval); };
  }, [slug]);

  return <section aria-labelledby="results-title" className="mt-8">
    <h2 id="results-title" className="font-display text-xl font-extrabold">{results?.status === "settled" ? "Final results" : "Live results"}</h2>
    <p className="mt-1 font-body text-sm text-cocoa-soft">Counts update as votes arrive.</p>
    <p className="sr-only" aria-live="polite">{announcement}</p>
    {results ? <PollResultsView results={results} mine={mine} /> : <p className="mt-5 rounded-md border-2 border-cocoa bg-card p-5 font-body">Loading results…</p>}
    {error && <p role="status" className="mt-3 font-body text-sm text-cocoa-soft">Results couldn’t update just now. Trying again.</p>}
  </section>;
}
