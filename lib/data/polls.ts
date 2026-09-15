import { insertCreatorPoll, selectCreatorPolls, selectPendingSuggestions } from "@/lib/supabase/api/polls";

export type PollSummary = {
  id: string;
  slug: string;
  title: string;
  closesAt: string;
  status: "open" | "settled";
  createdAt: string;
  pendingSuggestions: number;
};

export async function getMyPolls(creatorId: string): Promise<PollSummary[]> {
  const { data, error } = await selectCreatorPolls(creatorId);
  if (error) throw new Error(`Unable to load polls: ${error.message}`);
  const ids = (data ?? []).map((poll) => poll.id);
  const pending = new Map<string, number>();
  if (ids.length) {
    for (let start = 0; ; start += 1000) {
      const { data: suggestions, error: suggestionsError } = await selectPendingSuggestions(ids, start);
      if (suggestionsError) throw new Error(`Unable to load pending suggestions: ${suggestionsError.message}`);
      for (const suggestion of suggestions ?? []) pending.set(suggestion.poll_id, (pending.get(suggestion.poll_id) ?? 0) + 1);
      if (!suggestions || suggestions.length < 1000) break;
    }
  }
  const now = Date.now();
  return (data ?? []).map((poll): PollSummary => ({
    id: poll.id,
    slug: poll.slug,
    title: poll.title,
    closesAt: poll.closes_at,
    status: poll.status === "settled" || new Date(poll.closes_at).getTime() <= now ? "settled" : "open",
    createdAt: poll.created_at,
    pendingSuggestions: poll.status === "open" && new Date(poll.closes_at).getTime() > now ? pending.get(poll.id) ?? 0 : 0,
  })).sort((a, b) => b.pendingSuggestions - a.pendingSuggestions
    || (a.status === b.status ? 0 : a.status === "open" ? -1 : 1)
    || new Date(a.closesAt).getTime() - new Date(b.closesAt).getTime()
    || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function createMyPoll(input: {
  creatorId: string;
  title: string;
  options: string[];
  maxChoices: number;
  suggestionsEnabled: boolean;
  closesAt: string;
}) {
  return insertCreatorPoll(input);
}
