"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { moderateSuggestionAction } from "@/lib/actions/creator-poll";
import { VoterAvatar } from "@/components/voter-avatar";
import type { PendingSuggestion } from "@/lib/data/creator-poll-detail";

export function CreatorSuggestionCard({ suggestion, slug }: { suggestion: PendingSuggestion; slug: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [declined, setDeclined] = useState(suggestion.status === "declined");
  const [error, setError] = useState("");
  const undoButton = useRef<HTMLButtonElement>(null);

  async function decide(decision: "approved" | "declined" | "pending") {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const outcome = await moderateSuggestionAction({ slug, optionId: suggestion.id, decision });
      if ("error" in outcome) { setError(outcome.error ?? "That didn’t work. Try again."); return; }
      if (decision === "declined") { setDeclined(true); router.refresh(); requestAnimationFrame(() => undoButton.current?.focus()); }
      else if (decision === "pending") { setDeclined(false); router.refresh(); document.getElementById("suggestions-title")?.focus(); }
      else { document.getElementById("suggestions-title")?.focus(); router.refresh(); }
    } catch { setError("That didn’t work. Try again."); }
    finally { setBusy(false); }
  }

  return <li className="rounded-lg border-2 border-cocoa bg-card p-4 sm:p-5">
    <div className="flex items-start gap-3"><VoterAvatar seed={suggestion.avatarSeed} tint={suggestion.avatarTint} size={48} /><div><p className="font-body text-sm text-cocoa-soft">{suggestion.name} suggested:</p><h3 className="font-display text-base font-extrabold">{suggestion.label}</h3></div></div>
    {declined ? <div className="mt-4 flex flex-wrap items-center gap-3"><p role="status" className="font-body text-sm font-bold">Not this time.</p><button ref={undoButton} type="button" disabled={busy} onClick={() => void decide("pending")} className="min-h-11 rounded-full border-2 border-cocoa px-4 font-display text-sm font-extrabold focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal">Undo</button></div> :
      <div className="mt-4 flex flex-wrap gap-3"><button type="button" disabled={busy} onClick={() => void decide("approved")} className="min-h-11 rounded-full border-2 border-teal-deep bg-teal-deep px-4 font-display text-sm font-extrabold text-cream-bright focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal">Add it</button><button type="button" disabled={busy} onClick={() => void decide("declined")} className="min-h-11 rounded-full border-2 border-cocoa px-4 font-display text-sm font-extrabold focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal">Not this time</button></div>}
    {error && <p role="alert" className="mt-3 font-body text-sm font-bold">{error}</p>}
  </li>;
}
