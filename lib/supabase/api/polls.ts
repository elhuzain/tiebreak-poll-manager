import { createAdminClient } from "@/lib/supabase/server";
import { randomUUID } from "node:crypto";

export async function selectCreatorPolls(creatorId: string) {
  const supabase = createAdminClient();
  return supabase.from("polls")
    .select("id, slug, title, closes_at, status, created_at")
    .eq("creator_id", creatorId)
    .order("created_at", { ascending: false });
}

export async function selectPendingSuggestions(pollIds: string[], start: number) {
  return createAdminClient().from("options")
    .select("poll_id")
    .in("poll_id", pollIds)
    .eq("source", "suggestion")
    .eq("suggestion_status", "pending")
    .order("id")
    .range(start, start + 999);
}

export async function selectCreatorPoll(creatorId: string, slug: string) {
  return createAdminClient().from("polls")
    .select("id, slug, title, closes_at, status, suggestions_enabled, max_choices")
    .eq("creator_id", creatorId).eq("slug", slug).maybeSingle();
}

export async function selectRecentCrew(pollId: string) {
  return createAdminClient().from("ballots")
    .select("voter_name, voter_avatar_seed, voter_avatar_tint, cast_at")
    .eq("poll_id", pollId).order("cast_at", { ascending: false }).limit(4);
}

export async function updateCreatorPollStatus(pollId: string, creatorId: string, currentStatus: "open" | "settled", updates: {
  status: "open" | "settled"; settled_at: string | null; closes_at?: string;
}) {
  return createAdminClient().from("polls").update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", pollId).eq("creator_id", creatorId).eq("status", currentStatus).select("id").maybeSingle();
}

export async function updateSuggestionStatus(pollId: string, optionId: string, currentStatus: "pending" | "declined", nextStatus: "approved" | "declined" | "pending") {
  return createAdminClient().from("options").update({ suggestion_status: nextStatus })
    .eq("id", optionId).eq("poll_id", pollId).eq("source", "suggestion")
    .eq("suggestion_status", currentStatus).select("id").maybeSingle();
}

export async function insertCreatorPoll(input: {
  creatorId: string;
  title: string;
  options: string[];
  maxChoices: number;
  suggestionsEnabled: boolean;
  closesAt: string;
}) {
  const supabase = createAdminClient();
  let pollId: string | null = null;
  for (let attempt = 0; attempt < 5; attempt++) {
    const { data, error } = await supabase.from("polls").insert({
      creator_id: input.creatorId,
      slug: randomUUID().replaceAll("-", ""),
      title: input.title,
      max_choices: input.maxChoices,
      suggestions_enabled: input.suggestionsEnabled,
      closes_at: input.closesAt,
    }).select("id").single();
    if (!error && data) {
      pollId = data.id;
      break;
    }
    if (error?.code !== "23505") return { error: error?.message ?? "Poll insert failed" };
  }
  if (!pollId) return { error: "Could not generate a unique poll link" };

  const { error: optionsError } = await supabase.from("options").insert(
    input.options.map((label, displayOrder) => ({
      poll_id: pollId,
      label,
      display_order: displayOrder,
      source: "creator",
    })),
  );
  if (optionsError) {
    const { error: cleanupError } = await supabase.from("polls").delete().eq("id", pollId);
    return { error: cleanupError ? `${optionsError.message}; cleanup failed: ${cleanupError.message}` : optionsError.message };
  }
  return { id: pollId };
}
