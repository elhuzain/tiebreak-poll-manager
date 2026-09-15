"use server";

import { revalidatePath } from "next/cache";
import { getCreator } from "@/lib/data/auth";
import { endCreatorPoll, moderateCreatorSuggestion, reopenCreatorPoll } from "@/lib/data/creator-poll-detail";

const slugPattern = /^[0-9a-f]{32}$/;
const uuidPattern = /^[0-9a-f-]{36}$/i;

function refreshPoll(slug: string) {
  revalidatePath(`/dashboard/poll/${slug}`);
  revalidatePath(`/poll/${slug}`);
  revalidatePath("/dashboard");
}

export async function moderateSuggestionAction(input: { slug: string; optionId: string; decision: "approved" | "declined" | "pending" }) {
  const creator = await getCreator();
  if (!creator) return { error: "Sign in to manage this poll." };
  if (!input || !slugPattern.test(input.slug) || !uuidPattern.test(input.optionId) ||
      !["approved", "declined", "pending"].includes(input.decision)) return { error: "Invalid suggestion." };
  const outcome = await moderateCreatorSuggestion(creator.id, input.slug, input.optionId, input.decision);
  if ("success" in outcome) refreshPoll(input.slug);
  return outcome;
}

export async function endVotingAction(slug: string) {
  const creator = await getCreator();
  if (!creator) return { error: "Sign in to manage this poll." };
  if (!slugPattern.test(slug)) return { error: "Invalid poll." };
  const outcome = await endCreatorPoll(creator.id, slug);
  if ("success" in outcome) refreshPoll(slug);
  return outcome;
}

export async function reopenVotingAction(input: { slug: string; closesAt: string }) {
  const creator = await getCreator();
  if (!creator) return { error: "Sign in to manage this poll." };
  if (!input || !slugPattern.test(input.slug) || typeof input.closesAt !== "string") return { error: "Invalid poll or closing time." };
  const date = new Date(input.closesAt);
  if (!Number.isFinite(date.getTime()) || date.getTime() <= Date.now()) return { error: "Choose a future closing time." };
  const outcome = await reopenCreatorPoll(creator.id, input.slug, date.toISOString());
  if ("success" in outcome) refreshPoll(input.slug);
  return outcome;
}
