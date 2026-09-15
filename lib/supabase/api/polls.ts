import { createAdminClient } from "@/lib/supabase/server";
import { randomUUID } from "node:crypto";

export async function selectCreatorPolls(creatorId: string) {
  const supabase = createAdminClient();
  return supabase.from("polls")
    .select("id, slug, title, closes_at, status, created_at")
    .eq("creator_id", creatorId)
    .order("created_at", { ascending: false });
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
