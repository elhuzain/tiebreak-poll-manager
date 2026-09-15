"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useSyncExternalStore } from "react";
import { endVotingAction, reopenVotingAction } from "@/lib/actions/creator-poll";
import { CopyPollLinkButton } from "@/components/copy-poll-link-button";

export function CreatorPollControls({ slug, status }: { slug: string; status: "open" | "settled" }) {
  const router = useRouter();
  const origin = useSyncExternalStore(() => () => {}, () => window.location.origin, () => "");
  const url = origin ? new URL(`/poll/${slug}`, origin).toString() : `/poll/${slug}`;
  const [newClosingTime, setNewClosingTime] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const trigger = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  async function submit() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      let outcome: { error?: string; success?: true };
      if (status === "open") outcome = await endVotingAction(slug);
      else {
        const date = new Date(newClosingTime);
        if (!Number.isFinite(date.getTime()) || date.getTime() <= Date.now()) { setError("Choose a future closing time."); return; }
        outcome = await reopenVotingAction({ slug, closesAt: date.toISOString() });
      }
      if ("error" in outcome) { setError(outcome.error ?? "That didn’t work. Try again."); return; }
      dialog.current?.close();
      router.refresh();
    } catch { setError("That didn’t work. Try again."); }
    finally { setBusy(false); }
  }

  return <section aria-labelledby="share-title" className="mt-8 rounded-lg border-[2.5px] border-cocoa bg-card p-5 sm:p-7">
    <h2 id="share-title" className="font-display text-xl font-extrabold">Share this poll</h2>
    <p className="mt-2 font-body text-sm text-cocoa-soft">Anyone with the link can vote while voting is open.</p>
    <div className="mt-4 flex flex-wrap items-center gap-3 rounded-md border-2 border-cocoa bg-cream p-3"><span className="min-w-0 flex-1 truncate font-body text-sm" title={url}>{url}</span><CopyPollLinkButton slug={slug} /></div>
    <button ref={trigger} type="button" onClick={() => { setError(""); dialog.current?.showModal(); }} className="mt-6 min-h-11 rounded-full border-2 border-cocoa px-5 font-display text-sm font-extrabold focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal">{status === "open" ? "End voting" : "Re-open voting"}</button>
    <dialog ref={dialog} onClose={() => trigger.current?.focus()} aria-labelledby="poll-action-title" className="m-auto w-[calc(100%-2rem)] max-w-md rounded-lg border-[2.5px] border-cocoa bg-card p-6 text-cocoa backdrop:bg-cocoa/60">
      <h3 id="poll-action-title" className="font-display text-xl font-extrabold">{status === "open" ? "End voting now?" : "Re-open voting?"}</h3>
      <p className="mt-2 font-body text-sm text-cocoa-soft">{status === "open" ? "The ballot will close and the result will be final until you re-open it." : "The group can vote again, but existing votes stay final."}</p>
      {status === "settled" && <><label htmlFor="new-closing-time" className="mt-5 block font-body text-sm font-extrabold">New closing time</label><input id="new-closing-time" type="datetime-local" value={newClosingTime} onChange={(event) => setNewClosingTime(event.target.value)} className="mt-2 min-h-12 w-full rounded-md border-2 border-cocoa bg-cream px-4 font-body text-base focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal" /><p className="mt-1 font-body text-xs text-cocoa-soft">In your local time.</p></>}
      {error && <p role="alert" className="mt-4 rounded-md border-2 border-cocoa bg-cream-deep p-3 font-body text-sm font-bold">{error}</p>}
      <div className="mt-6 flex flex-wrap gap-3"><button type="button" disabled={busy} onClick={() => dialog.current?.close()} className="min-h-11 rounded-full border-2 border-cocoa px-5 font-display text-sm font-extrabold">Cancel</button><button type="button" disabled={busy} aria-busy={busy} onClick={() => void submit()} className="min-h-11 rounded-full border-2 border-teal-deep bg-teal-deep px-5 font-display text-sm font-extrabold text-cream-bright disabled:cursor-wait disabled:opacity-50">{busy ? status === "open" ? "Ending voting…" : "Re-opening…" : status === "open" ? "End voting" : "Re-open voting"}</button></div>
    </dialog>
  </section>;
}
