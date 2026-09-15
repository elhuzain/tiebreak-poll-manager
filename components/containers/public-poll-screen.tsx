"use client";

import { useEffect, useRef, useState } from "react";
import { avatarChoices } from "@/lib/avatars";
import { castVoteAction, suggestOptionAction } from "@/lib/actions/public-polls";
import type { PublicPoll, SavedBallot } from "@/lib/data/public-polls";
import { VoterAvatarList } from "@/components/list/voter-avatar-list";
import { VoterBallotList } from "@/components/list/voter-ballot-list";
import { VoterResultsPanel } from "@/components/containers/voter-results-panel";
import { PollStatusPills } from "@/components/poll-status-pills";

type View = "checking" | "ballot" | "voted" | "closed" | "check-error";

function randomToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function PublicPollScreen({ poll }: { poll: PublicPoll }) {
  const [view, setView] = useState<View>("checking");
  const [name, setName] = useState("");
  const [avatarSeed, setAvatarSeed] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [mine, setMine] = useState<string[]>([]);
  const [returning, setReturning] = useState(false);
  const [busyAction, setBusyAction] = useState<"vote" | "suggestion" | null>(null);
  const [retrying, setRetrying] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const castTrigger = useRef<HTMLButtonElement>(null);
  const suggestTrigger = useRef<HTMLButtonElement>(null);
  const confirmDialog = useRef<HTMLDialogElement>(null);
  const suggestionDialog = useRef<HTMLDialogElement>(null);
  const pendingToken = useRef<string | null>(null);

  const votedKey = `tiebreak:voted:${poll.slug}`;
  const pendingKey = `tiebreak:pending:${poll.slug}`;
  const choice = avatarChoices.find((avatar) => avatar.seed === avatarSeed);
  const closed = poll.status === "settled";
  const selectedLabels = poll.options.filter((option) => selectedIds.includes(option.id)).map((option) => option.label);
  const ready = name.trim().length > 0 && choice && selectedIds.length > 0;

  useEffect(() => {
    let active = true;
    async function checkSavedVote() {
      let token: string | null = null;
      try {
        token = sessionStorage.getItem(votedKey) ?? sessionStorage.getItem(pendingKey);
      } catch { /* Session storage may be blocked. */ }
      if (!token) {
        if (active) setView(closed ? "closed" : "ballot");
        return;
      }
      pendingToken.current = token;
      try {
        const response = await fetch(`/api/poll/${poll.slug}/ballot`, { headers: { "x-voter-token": token }, cache: "no-store" });
        if (!response.ok) throw new Error("Ballot check failed");
        const { ballot } = await response.json() as { ballot: SavedBallot | null };
        if (!active) return;
        if (ballot) {
          setMine(ballot.optionIds);
          setName(ballot.name);
          setReturning(true);
          setView("voted");
          try { sessionStorage.setItem(votedKey, token); sessionStorage.removeItem(pendingKey); } catch { /* Continue without storage. */ }
        } else setView(closed ? "closed" : "ballot");
      } catch {
        if (active) setView("check-error");
      }
    }
    void checkSavedVote();
    return () => { active = false; };
  }, [poll.slug, votedKey, pendingKey, closed]);

  useEffect(() => {
    if (view !== "ballot") return;
    const interval = setInterval(() => {
      if (Date.now() >= new Date(poll.closesAt).getTime()) setView("closed");
    }, 5000);
    return () => clearInterval(interval);
  }, [view, poll.closesAt]);

  function toggleOption(id: string) {
    setError("");
    if (poll.maxChoices === 1) { setSelectedIds([id]); return; }
    setSelectedIds((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= poll.maxChoices) {
        setError(`Pick up to ${poll.maxChoices} options.`);
        return current;
      }
      return [...current, id];
    });
  }

  function openConfirmation() {
    if (!name.trim()) { setError("Add your name first."); nameRef.current?.focus(); return; }
    if (!choice) { setError("Choose an avatar first."); avatarRef.current?.querySelector("button")?.focus(); return; }
    if (!selectedIds.length) { setError("Choose an option first."); document.getElementById("ballot-options")?.querySelector("input")?.focus(); return; }
    setError("");
    confirmDialog.current?.showModal();
  }

  async function castVote() {
    if (!choice || busyAction) return;
    setBusyAction("vote");
    setError("");
    const token = pendingToken.current ?? randomToken();
    pendingToken.current = token;
    try { sessionStorage.setItem(pendingKey, token); } catch { /* Vote still works without storage. */ }
    try {
      const result = await castVoteAction({ slug: poll.slug, token, name, avatarSeed: choice.seed, avatarTint: choice.tint, optionIds: selectedIds });
      if (result.status === "error") { setError(result.message); confirmDialog.current?.close(); return; }
      setMine(result.optionIds);
      setReturning(result.status === "already");
      setView("voted");
      try { sessionStorage.setItem(votedKey, token); sessionStorage.removeItem(pendingKey); } catch { /* Continue without storage. */ }
      confirmDialog.current?.close();
    } catch {
      setError("That didn’t send. Try again.");
      confirmDialog.current?.close();
    } finally { setBusyAction(null); }
  }

  function openSuggestion() {
    if (!name.trim()) { setError("Add your name before suggesting an option."); nameRef.current?.focus(); return; }
    if (!choice) { setError("Choose an avatar before suggesting an option."); avatarRef.current?.querySelector("button")?.focus(); return; }
    setError("");
    suggestionDialog.current?.showModal();
  }

  async function submitSuggestion() {
    if (!choice || !suggestion.trim() || busyAction) return;
    setBusyAction("suggestion");
    try {
      const result = await suggestOptionAction({ slug: poll.slug, label: suggestion, name, avatarSeed: choice.seed, avatarTint: choice.tint });
      if (result.error) { setError(result.error); suggestionDialog.current?.close(); return; }
      setSuggestion("");
      setMessage("Suggestion sent. The poll creator can add it to the ballot.");
      suggestionDialog.current?.close();
    } catch {
      setError("That suggestion didn’t send. Try again.");
      suggestionDialog.current?.close();
    } finally { setBusyAction(null); }
  }

  return <div className="font-body">
    <main className="mx-auto w-full max-w-content px-5 py-8 pb-16 sm:px-8 md:py-12">
      <p className="font-body text-xs font-extrabold tracking-[0.1em] text-teal-deep">GROUP POLL</p>
      <PollStatusPills status={poll.status} closesAt={poll.closesAt} viewClosed={view === "closed"} />
      <h1 className="mt-5 font-display text-2xl font-black leading-tight tracking-tight md:text-3xl">{poll.title}</h1>

      {view === "checking" && <p className="mt-8 rounded-lg border-2 border-cocoa bg-card p-6">Checking your vote…</p>}
      {view === "check-error" && <div className="mt-8 rounded-lg border-2 border-cocoa bg-card p-6"><p role="alert">We couldn’t check your previous vote.</p><button type="button" disabled={retrying} aria-busy={retrying} onClick={() => { setRetrying(true); window.location.reload(); }} className="mt-4 underline disabled:cursor-wait disabled:opacity-70">{retrying ? "Retrying…" : "Try again"}</button></div>}
      {view === "ballot" && <>
        <section className="mt-8 rounded-lg border-[2.5px] border-cocoa bg-card p-5 sm:p-7" aria-labelledby="identity-title">
          <h2 id="identity-title" className="font-display text-lg font-extrabold">First, who’s voting?</h2>
          <label htmlFor="voter-name" className="mt-5 block font-body text-sm font-extrabold">Your name</label>
          <input ref={nameRef} id="voter-name" value={name} onChange={(event) => { setName(event.target.value); setError(""); }} maxLength={80} autoComplete="name" placeholder="Your name" aria-describedby={error ? "vote-error" : undefined} className="mt-2 min-h-12 w-full rounded-md border-2 border-cocoa bg-cream px-4 font-body text-base focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal" />
          <div ref={avatarRef} className="mt-6"><p className="mb-3 font-body text-sm font-extrabold">Pick a face</p><VoterAvatarList selectedSeed={avatarSeed} onSelect={(seed) => { setAvatarSeed(seed); setError(""); }} /></div>
        </section>
        <section id="ballot-options" className="mt-8" aria-labelledby="ballot-title">
          <h2 id="ballot-title" className="font-display text-lg font-extrabold">{poll.maxChoices === 1 ? "Choose one" : `Choose up to ${poll.maxChoices}`}</h2>
          <p className="mt-1 font-body text-sm text-cocoa-soft">Your vote is final. No takebacks.</p>
          <div className="mt-5"><VoterBallotList options={poll.options} selectedIds={selectedIds} maxChoices={poll.maxChoices} onToggle={toggleOption} /></div>
        </section>
        {error && <p id="vote-error" role="alert" className="mt-5 rounded-md border-2 border-cocoa bg-cream-deep p-4 font-body text-sm font-bold">{error}</p>}
        {message && <p role="status" className="mt-5 rounded-md border-2 border-teal-deep bg-teal-soft p-4 font-body text-sm font-bold text-teal-deep">{message}</p>}
        <button ref={castTrigger} type="button" disabled={!ready || !!busyAction} onClick={openConfirmation} className="mt-7 min-h-14 w-full rounded-full border-2 border-tangerine-deep bg-tangerine-deep px-5 py-3 font-display text-base font-extrabold text-cream-bright shadow-press-tangerine focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal disabled:cursor-not-allowed disabled:opacity-50">{selectedIds.length === 1 ? `Cast my vote for ${selectedLabels[0]}` : selectedIds.length > 1 ? `Cast my vote for ${selectedIds.length} choices` : "Cast my vote"}</button>
        {poll.suggestionsEnabled && <button ref={suggestTrigger} type="button" disabled={!!busyAction} onClick={openSuggestion} className="mt-5 min-h-11 w-full rounded-full border-2 border-cocoa bg-card px-5 font-display text-sm font-extrabold focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal disabled:cursor-wait disabled:opacity-70">Suggest something else</button>}
      </>}

      {view === "voted" && <><div role="status" className="mt-8 rounded-lg border-[2.5px] border-teal-deep bg-teal-soft p-6"><h2 className="font-display text-xl font-extrabold">{returning ? "You already voted" : "Your vote counted!"}</h2><p className="mt-2 font-body text-base">{returning ? "Votes are final. You cannot vote again." : "Thanks for helping the group decide."}</p>{mine.length > 0 && <p className="mt-2 font-body text-sm font-bold">You backed {poll.options.filter((option) => mine.includes(option.id)).map((option) => option.label).join(" and ")}.</p>}</div><VoterResultsPanel slug={poll.slug} mine={mine} /></>}
      {view === "closed" && <><div role="status" className="mt-8 rounded-lg border-[2.5px] border-cocoa bg-card p-6"><h2 className="font-display text-xl font-extrabold">Voting has closed</h2><p className="mt-2 font-body text-base">The group has made its picks. Here’s how it ended.</p></div><VoterResultsPanel slug={poll.slug} mine={[]} /></>}
    </main>

    <dialog ref={confirmDialog} onClose={() => castTrigger.current?.focus()} aria-labelledby="confirm-title" className="m-auto w-[calc(100%-2rem)] max-w-md rounded-lg border-[2.5px] border-cocoa bg-card p-6 text-cocoa backdrop:bg-cocoa/60">
      <h2 id="confirm-title" className="font-display text-xl font-extrabold">Cast this vote?</h2>
      <p className="mt-3 font-body text-base">You’re choosing {selectedLabels.join(" and ")}. Votes are final.</p>
      <div className="mt-6 flex flex-wrap gap-3"><button type="button" disabled={!!busyAction} onClick={() => confirmDialog.current?.close()} className="min-h-11 rounded-full border-2 border-cocoa px-5 font-display font-extrabold">Keep choosing</button><button type="button" disabled={!!busyAction} aria-busy={busyAction === "vote"} onClick={() => void castVote()} className="min-h-11 rounded-full border-2 border-tangerine-deep bg-tangerine-deep px-5 font-display font-extrabold text-cream-bright disabled:cursor-wait disabled:opacity-70">{busyAction === "vote" ? "Casting vote…" : "Confirm vote"}</button></div>
    </dialog>
    <dialog ref={suggestionDialog} onClose={() => suggestTrigger.current?.focus()} aria-labelledby="suggest-title" className="m-auto w-[calc(100%-2rem)] max-w-md rounded-lg border-[2.5px] border-cocoa bg-card p-6 text-cocoa backdrop:bg-cocoa/60">
      <h2 id="suggest-title" className="font-display text-xl font-extrabold">Suggest something else</h2>
      <p className="mt-2 font-body text-sm text-cocoa-soft">The creator decides whether to add it to the ballot.</p>
      <label htmlFor="suggestion-label" className="mt-5 block font-body text-sm font-extrabold">Your suggestion</label>
      <input id="suggestion-label" value={suggestion} onChange={(event) => setSuggestion(event.target.value)} maxLength={200} className="mt-2 min-h-12 w-full rounded-md border-2 border-cocoa bg-cream px-4 font-body text-base focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal" />
      <div className="mt-6 flex flex-wrap gap-3"><button type="button" disabled={!!busyAction} onClick={() => suggestionDialog.current?.close()} className="min-h-11 rounded-full border-2 border-cocoa px-5 font-display font-extrabold">Cancel</button><button type="button" disabled={!suggestion.trim() || !!busyAction} aria-busy={busyAction === "suggestion"} onClick={() => void submitSuggestion()} className="min-h-11 rounded-full border-2 border-teal-deep bg-teal-deep px-5 font-display font-extrabold text-cream-bright disabled:cursor-wait disabled:opacity-50">{busyAction === "suggestion" ? "Sending…" : "Send suggestion"}</button></div>
    </dialog>
  </div>;
}
