import { insertCreatorPoll, selectCreatorPolls } from "@/lib/supabase/api/polls";

export type PollSummary = {
  id: string;
  slug: string;
  title: string;
  closesAt: string;
  status: "open" | "settled";
  createdAt: string;
};

export async function getMyPolls(creatorId: string): Promise<PollSummary[]> {
  const { data, error } = await selectCreatorPolls(creatorId);
  if (error) throw new Error(`Unable to load polls: ${error.message}`);
  return (data ?? []).map((poll) => ({
    id: poll.id,
    slug: poll.slug,
    title: poll.title,
    closesAt: poll.closes_at,
    status: poll.status === "settled" || new Date(poll.closes_at).getTime() <= Date.now() ? "settled" : "open",
    createdAt: poll.created_at,
  }));
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
