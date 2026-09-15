import { createHash } from "node:crypto";
import {
  countPollBallots, deleteBallot, insertBallot, insertBallotVotes,
  insertPendingSuggestion, selectBallotByTokenHash, selectBallotChoices,
  selectPollBySlug, selectPollOptions, selectPollVotes,
} from "@/lib/supabase/api/public-polls";

export type PublicOption = { id: string; label: string; suggestedBy: string | null, suggestedByAvatar: string | null, suggestedByTint: string | null };
export type PublicPoll = {
  slug: string;
  title: string;
  maxChoices: number;
  suggestionsEnabled: boolean;
  closesAt: string;
  status: "open" | "settled";
  options: PublicOption[];
};
export type PollResults = {
  status: "open" | "settled";
  totalBallots: number;
  options: (PublicOption & { votes: number })[];
};
export type SavedBallot = { name: string; optionIds: string[] };
export type CastOutcome =
  | { status: "cast" | "already"; optionIds: string[] }
  | { status: "error"; message: string };

function effectiveStatus(poll: { status: string; closes_at: string }): "open" | "settled" {
  return poll.status === "settled" || new Date(poll.closes_at).getTime() <= Date.now() ? "settled" : "open";
}

async function loadPoll(slug: string) {
  const { data: poll, error } = await selectPollBySlug(slug);
  if (error) throw new Error(`Unable to load poll: ${error.message}`);
  return poll;
}

function visibleOptions(options: Awaited<ReturnType<typeof selectPollOptions>>["data"]): PublicOption[] {
  return (options ?? []).filter((option) => option.source === "creator" || option.suggestion_status === "approved")
    .map((option) => ({ id: option.id, label: option.label, suggestedByAvatar: option.source === "suggestion" ? option.suggester_avatar_seed : null, suggestedByTint: option.source === "suggestion" ? option.suggester_avatar_tint : null, suggestedBy: option.source === "suggestion" ? option.suggester_name : null }));
}

export async function getPublicPoll(slug: string): Promise<PublicPoll | null> {
  const poll = await loadPoll(slug);
  if (!poll) return null;
  const { data: options, error } = await selectPollOptions(poll.id);
  if (error) throw new Error(`Unable to load options: ${error.message}`);
  return {
    slug: poll.slug,
    title: poll.title,
    maxChoices: poll.max_choices,
    suggestionsEnabled: poll.suggestions_enabled,
    closesAt: poll.closes_at,
    status: effectiveStatus(poll),
    options: visibleOptions(options),
  };
}

export async function getPublicResults(slug: string): Promise<PollResults | null> {
  const poll = await loadPoll(slug);
  if (!poll) return null;
  const [{ data: options, error: optionsError }, { count, error: ballotsError }] = await Promise.all([
    selectPollOptions(poll.id), countPollBallots(poll.id),
  ]);
  if (optionsError || ballotsError) throw new Error(`Unable to load results: ${optionsError?.message ?? ballotsError?.message}`);
  const tallies = new Map<string, number>();
  for (let start = 0; ; start += 1000) {
    const { data: votes, error } = await selectPollVotes(poll.id, start);
    if (error) throw new Error(`Unable to load votes: ${error.message}`);
    for (const vote of votes ?? []) tallies.set(vote.option_id, (tallies.get(vote.option_id) ?? 0) + 1);
    if (!votes || votes.length < 1000) break;
  }
  return {
    status: effectiveStatus(poll),
    totalBallots: count ?? 0,
    options: visibleOptions(options).map((option) => ({ ...option, votes: tallies.get(option.id) ?? 0 })),
  };
}

export async function getSavedBallot(slug: string, token: string): Promise<SavedBallot | null> {
  if (!/^[0-9a-f]{64}$/.test(token)) return null;
  const poll = await loadPoll(slug);
  if (!poll) return null;
  const hash = createHash("sha256").update(token).digest("hex");
  const { data: ballot, error } = await selectBallotByTokenHash(poll.id, hash);
  if (error) throw new Error(`Unable to check ballot: ${error.message}`);
  if (!ballot) return null;
  const { data: votes, error: votesError } = await selectBallotChoices(ballot.id);
  if (votesError) throw new Error(`Unable to check choices: ${votesError.message}`);
  if (!votes?.length) return null;
  return { name: ballot.voter_name, optionIds: (votes ?? []).map((vote) => vote.option_id) };
}

export async function castPublicVote(input: {
  slug: string; token: string; name: string; avatarSeed: string; avatarTint: string; optionIds: string[];
}): Promise<CastOutcome> {
  const poll = await loadPoll(input.slug);
  if (!poll) return { status: "error", message: "Poll not found." };
  const hash = createHash("sha256").update(input.token).digest("hex");
  const { data: existing, error: existingError } = await selectBallotByTokenHash(poll.id, hash);
  if (existingError) return { status: "error", message: "We couldn’t check your previous vote. Try again." };
  if (existing) {
    const { data, error } = await selectBallotChoices(existing.id);
    if (error) return { status: "error", message: "We couldn’t load your vote. Try again." };
    if (!data?.length) return { status: "error", message: "Your vote is still processing. Try again in a moment." };
    return { status: "already", optionIds: (data ?? []).map((vote) => vote.option_id) };
  }
  if (effectiveStatus(poll) !== "open") return { status: "error", message: "Voting has closed." };
  if (input.optionIds.length < 1 || input.optionIds.length > poll.max_choices || new Set(input.optionIds).size !== input.optionIds.length) {
    return { status: "error", message: "Choose a valid number of options." };
  }
  const { data: options, error: optionsError } = await selectPollOptions(poll.id);
  if (optionsError) return { status: "error", message: "We couldn’t load the options. Try again." };
  const allowed = new Set(visibleOptions(options).map((option) => option.id));
  if (input.optionIds.some((id) => !allowed.has(id))) return { status: "error", message: "One of those options is no longer available." };

  const { data: ballot, error: ballotError } = await insertBallot({
    pollId: poll.id, hash, name: input.name, avatarSeed: input.avatarSeed, avatarTint: input.avatarTint,
  });
  if (ballotError?.code === "23505") {
    const saved = await getSavedBallot(input.slug, input.token);
    return saved ? { status: "already", optionIds: saved.optionIds } : { status: "error", message: "That vote is still processing. Try again." };
  }
  if (ballotError || !ballot) return { status: "error", message: "That didn’t send. Try again." };
  const { error: votesError } = await insertBallotVotes(poll.id, ballot.id, input.optionIds);
  if (votesError) {
    await deleteBallot(ballot.id);
    return { status: "error", message: "That didn’t send. Try again." };
  }
  return { status: "cast", optionIds: input.optionIds };
}

export async function addPublicSuggestion(input: {
  slug: string; label: string; name: string; avatarSeed: string; avatarTint: string;
}) {
  const poll = await loadPoll(input.slug);
  if (!poll) return { error: "Poll not found." };
  if (effectiveStatus(poll) !== "open" || !poll.suggestions_enabled) return { error: "Suggestions are closed." };
  const { data: options, error } = await selectPollOptions(poll.id);
  if (error) return { error: "We couldn’t add your suggestion. Try again." };
  const order = Math.max(-1, ...(options ?? []).map((option) => option.display_order)) + 1;
  const { error: insertError } = await insertPendingSuggestion({ pollId: poll.id, label: input.label, order, name: input.name, avatarSeed: input.avatarSeed, avatarTint: input.avatarTint });
  return insertError ? { error: "We couldn’t add your suggestion. Try again." } : { success: true as const };
}
