import { CreatorSuggestionCard } from "@/components/creator-suggestion-card";
import type { PendingSuggestion } from "@/lib/data/creator-poll-detail";

export function CreatorSuggestionList({ suggestions, slug }: { suggestions: PendingSuggestion[]; slug: string }) {
  const pending = suggestions.filter((suggestion) => suggestion.status === "pending");
  const declined = suggestions.filter((suggestion) => suggestion.status === "declined");
  return <section aria-labelledby="suggestions-title" className="mt-8"><h2 id="suggestions-title" tabIndex={-1} className="font-display text-xl font-extrabold">Suggestions {pending.length > 0 && <span className="font-body text-base text-cocoa-soft">({pending.length})</span>}</h2>
    {suggestions.length ? <ul className="mt-4 grid gap-3">{[...pending, ...declined].map((suggestion) => <CreatorSuggestionCard key={suggestion.id} suggestion={suggestion} slug={slug} />)}</ul> : <p className="mt-3 rounded-lg border-2 border-cocoa bg-card p-4 font-body text-sm text-cocoa-soft">No suggestions waiting for a decision.</p>}
  </section>;
}
