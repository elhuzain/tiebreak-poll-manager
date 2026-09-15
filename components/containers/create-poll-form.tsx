"use client";

import { useActionState, useState, type FormEvent } from "react";
import { createPollAction, type CreatePollState } from "@/lib/actions/polls";

const inputClass = "min-h-12 w-full rounded-md border-2 border-cocoa bg-card px-4 font-body text-base text-cocoa focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal";

export function CreatePollForm() {
  const [options, setOptions] = useState(["", ""]);
  const [maxChoices, setMaxChoices] = useState(1);
  const [state, formAction, pending] = useActionState(createPollAction, {} as CreatePollState);

  function prepareClosingTime(event: FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    const local = form.elements.namedItem("closing_time");
    const utc = form.elements.namedItem("closes_at");
    if (local instanceof HTMLInputElement && utc instanceof HTMLInputElement) {
      utc.value = local.value ? new Date(local.value).toISOString() : "";
    }
  }

  return (
    <form action={formAction} onSubmit={prepareClosingTime} className="mt-8 grid gap-7 rounded-lg border-[2.5px] border-cocoa bg-card p-5 sm:p-8">
      <div className="grid gap-2">
        <label htmlFor="poll-title" className="font-body text-sm font-extrabold">Poll question</label>
        <input id="poll-title" name="title" className={inputClass} placeholder="Where should we meet?" maxLength={200} required />
      </div>

      <fieldset className="grid gap-3">
        <legend className="mb-3 font-body text-sm font-extrabold">Options</legend>
        {options.map((option, index) => (
          <div key={index} className="flex items-center gap-2">
            <label htmlFor={`option-${index}`} className="w-6 shrink-0 font-display font-extrabold">{index + 1}.</label>
            <input id={`option-${index}`} name="option" className={inputClass} value={option} onChange={(event) => setOptions((current) => current.map((item, itemIndex) => itemIndex === index ? event.target.value : item))} placeholder={`Option ${index + 1}`} maxLength={200} required />
            {options.length > 2 && <button type="button" onClick={() => { setOptions((current) => current.filter((_, itemIndex) => itemIndex !== index)); setMaxChoices((current) => Math.min(current, options.length - 1)); }} className="min-h-12 rounded-md px-2 font-body text-sm font-bold underline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal" aria-label={`Remove option ${index + 1}`}>Remove</button>}
          </div>
        ))}
        {options.length < 10 && <button type="button" onClick={() => setOptions((current) => [...current, ""])} className="w-fit rounded-full border-2 border-cocoa px-4 py-2 font-display text-sm font-extrabold focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal">+ Add option</button>}
      </fieldset>

      <div className="grid gap-2">
        <label htmlFor="closing-time" className="font-body text-sm font-extrabold">Voting closes</label>
        <input id="closing-time" name="closing_time" type="datetime-local" className={inputClass} required />
        <input name="closes_at" type="hidden" />
        <p className="font-body text-sm text-cocoa-soft">In your local time.</p>
      </div>

      <div className="grid gap-2">
        <label htmlFor="max-choices" className="font-body text-sm font-extrabold">Choices per person</label>
        <select id="max-choices" name="max_choices" className={inputClass} value={maxChoices} onChange={(event) => setMaxChoices(Number(event.target.value))}>
          {options.map((_, index) => <option key={index} value={index + 1}>{index === 0 ? "Pick one" : `Pick up to ${index + 1}`}</option>)}
        </select>
      </div>

      <label className="flex items-start gap-3 font-body text-base font-bold">
        <input name="suggestions_enabled" type="checkbox" className="mt-1 size-5 accent-teal-deep" />
        Let voters suggest options for you to approve
      </label>

      {state.error && <p role="alert" className="rounded-md border-2 border-cocoa bg-cream-deep p-3 font-body text-sm font-bold">{state.error}</p>}
      <button type="submit" disabled={pending} className="min-h-12 rounded-full border-2 border-tangerine-deep bg-tangerine-deep px-6 font-display text-base font-extrabold text-cream-bright shadow-press-tangerine focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal disabled:opacity-70">{pending ? "Creating…" : "Create poll"}</button>
    </form>
  );
}
