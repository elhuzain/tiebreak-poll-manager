import { getPublicResults, type PollResults } from "@/lib/data/public-polls";
import { selectPollOptions } from "@/lib/supabase/api/public-polls";
import {
  selectCreatorPoll, selectRecentCrew, updateCreatorPollStatus, updateSuggestionStatus,
} from "@/lib/supabase/api/polls";

export type CrewMember = { name: string; avatarSeed: string; avatarTint: string };
export type PendingSuggestion = { id: string; label: string; name: string; avatarSeed: string; avatarTint: string; status: "pending" | "declined" };
export type CreatorPollDetail = {
  slug: string;
  title: string;
  status: "open" | "settled";
  closesAt: string;
  suggestionsEnabled: boolean;
  crew: CrewMember[];
  lastVoteMinutes: number | null;
  results: PollResults;
  suggestions: PendingSuggestion[];
};

async function ownedPoll(creatorId: string, slug: string) {
  const { data, error } = await selectCreatorPoll(creatorId, slug);
  if (error) throw new Error(`Unable to load creator poll: ${error.message}`);
  return data;
}

async function settleExpiredPoll(poll: NonNullable<Awaited<ReturnType<typeof ownedPoll>>>, creatorId: string) {
  if (poll.status !== "open" || new Date(poll.closes_at).getTime() > Date.now()) return poll;
  const { error } = await updateCreatorPollStatus(poll.id, creatorId, "open", {
    status: "settled", settled_at: poll.closes_at,
  });
  if (error) throw new Error(`Unable to settle poll: ${error.message}`);
  return { ...poll, status: "settled" as const };
}

export async function getCreatorPollDetail(creatorId: string, slug: string): Promise<CreatorPollDetail | null> {
  const original = await ownedPoll(creatorId, slug);
  if (!original) return null;
  const poll = await settleExpiredPoll(original, creatorId);
  const [{ data: options, error: optionsError }, { data: recent, error: recentError }, results] = await Promise.all([
    selectPollOptions(poll.id), selectRecentCrew(poll.id), getPublicResults(slug),
  ]);
  if (optionsError || recentError || !results) throw new Error(`Unable to load poll detail: ${optionsError?.message ?? recentError?.message ?? "Missing results"}`);
  const lastCast = recent?.[0]?.cast_at;
  return {
    slug: poll.slug,
    title: poll.title,
    status: poll.status === "settled" ? "settled" : "open",
    closesAt: poll.closes_at,
    suggestionsEnabled: poll.suggestions_enabled,
    crew: (recent ?? []).map((voter) => ({ name: voter.voter_name, avatarSeed: voter.voter_avatar_seed, avatarTint: voter.voter_avatar_tint })),
    lastVoteMinutes: lastCast ? Math.max(0, Math.floor((Date.now() - new Date(lastCast).getTime()) / 60000)) : null,
    results,
    suggestions: (options ?? []).filter((option) => option.source === "suggestion" && (option.suggestion_status === "pending" || option.suggestion_status === "declined"))
      .map((option) => ({ id: option.id, label: option.label, name: option.suggester_name ?? "Someone", avatarSeed: option.suggester_avatar_seed ?? "Milo", avatarTint: option.suggester_avatar_tint ?? "cbe2d8", status: option.suggestion_status as "pending" | "declined" })),
  };
}

export async function moderateCreatorSuggestion(creatorId: string, slug: string, optionId: string, decision: "approved" | "declined" | "pending") {
  const original = await ownedPoll(creatorId, slug);
  if (!original) return { error: "Poll not found." };
  const poll = await settleExpiredPoll(original, creatorId);
  if (poll.status !== "open") return { error: "Suggestions are closed." };
  const current = decision === "pending" ? "declined" : "pending";
  const { data, error } = await updateSuggestionStatus(poll.id, optionId, current, decision);
  return error || !data ? { error: "That suggestion is no longer available." } : { success: true as const };
}

export async function endCreatorPoll(creatorId: string, slug: string) {
  const original = await ownedPoll(creatorId, slug);
  if (!original) return { error: "Poll not found." };
  const poll = await settleExpiredPoll(original, creatorId);
  if (poll.status !== "open") return { error: "Voting has already closed." };
  const { data, error } = await updateCreatorPollStatus(poll.id, creatorId, "open", {
    status: "settled", settled_at: new Date().toISOString(),
  });
  return error || !data ? { error: "We couldn’t end voting. Try again." } : { success: true as const };
}

export async function reopenCreatorPoll(creatorId: string, slug: string, closesAt: string) {
  if (new Date(closesAt).getTime() <= Date.now()) return { error: "Choose a future closing time." };
  const original = await ownedPoll(creatorId, slug);
  if (!original) return { error: "Poll not found." };
  const poll = await settleExpiredPoll(original, creatorId);
  if (poll.status !== "settled") return { error: "Voting is still open." };
  const { data, error } = await updateCreatorPollStatus(poll.id, creatorId, "settled", {
    status: "open", settled_at: null, closes_at: closesAt,
  });
  return error || !data ? { error: "We couldn’t reopen voting. Try again." } : { success: true as const };
}
