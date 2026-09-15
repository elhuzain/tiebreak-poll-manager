import { createAdminClient } from "@/lib/supabase/server";

export async function selectPollBySlug(slug: string) {
  return createAdminClient().from("polls")
    .select("id, slug, title, max_choices, suggestions_enabled, closes_at, status")
    .eq("slug", slug).maybeSingle();
}

export async function selectPollOptions(pollId: string) {
  return createAdminClient().from("options")
    .select("id, label, display_order, source, suggestion_status, suggester_name")
    .eq("poll_id", pollId).order("display_order");
}

export async function selectPollVotes(pollId: string, start: number) {
  return createAdminClient().from("votes")
    .select("option_id").eq("poll_id", pollId)
    .order("id").range(start, start + 999);
}

export async function countPollBallots(pollId: string) {
  return createAdminClient().from("ballots")
    .select("id", { count: "exact", head: true }).eq("poll_id", pollId);
}

export async function selectBallotByTokenHash(pollId: string, hash: string) {
  return createAdminClient().from("ballots")
    .select("id, voter_name").eq("poll_id", pollId)
    .eq("voter_token_hash", hash).maybeSingle();
}

export async function selectBallotChoices(ballotId: string) {
  return createAdminClient().from("votes")
    .select("option_id").eq("ballot_id", ballotId);
}

export async function insertBallot(input: {
  pollId: string;
  hash: string;
  name: string;
  avatarSeed: string;
  avatarTint: string;
}) {
  return createAdminClient().from("ballots").insert({
    poll_id: input.pollId,
    voter_token_hash: input.hash,
    voter_name: input.name,
    voter_avatar_seed: input.avatarSeed,
    voter_avatar_tint: input.avatarTint,
  }).select("id").single();
}

export async function insertBallotVotes(pollId: string, ballotId: string, optionIds: string[]) {
  return createAdminClient().from("votes").insert(optionIds.map((optionId) => ({
    poll_id: pollId,
    ballot_id: ballotId,
    option_id: optionId,
  })));
}

export async function deleteBallot(ballotId: string) {
  return createAdminClient().from("ballots").delete().eq("id", ballotId);
}

export async function insertPendingSuggestion(input: {
  pollId: string;
  label: string;
  order: number;
  name: string;
  avatarSeed: string;
  avatarTint: string;
}) {
  return createAdminClient().from("options").insert({
    poll_id: input.pollId,
    label: input.label,
    display_order: input.order,
    source: "suggestion",
    suggestion_status: "pending",
    suggester_name: input.name,
    suggester_avatar_seed: input.avatarSeed,
    suggester_avatar_tint: input.avatarTint,
  });
}
