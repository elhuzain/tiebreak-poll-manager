"use server";

import { addPublicSuggestion, castPublicVote, type CastOutcome } from "@/lib/data/public-polls";
import { validAvatar } from "@/lib/avatars";

const slugPattern = /^[0-9a-f]{32}$/;
const tokenPattern = /^[0-9a-f]{64}$/;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function validIdentity(name: string, seed: string, tint: string) {
  return name.trim().length >= 1 && name.trim().length <= 80 && validAvatar(seed, tint);
}

export async function castVoteAction(input: {
  slug: string; token: string; name: string; avatarSeed: string; avatarTint: string; optionIds: string[];
}): Promise<CastOutcome> {
  if (!input || !slugPattern.test(input.slug) || !tokenPattern.test(input.token) ||
      !Array.isArray(input.optionIds) || input.optionIds.length > 10 ||
      input.optionIds.some((id) => typeof id !== "string" || !uuidPattern.test(id)) ||
      typeof input.name !== "string" || typeof input.avatarSeed !== "string" || typeof input.avatarTint !== "string" ||
      !validIdentity(input.name, input.avatarSeed, input.avatarTint)) {
    return { status: "error", message: "Add your name, choose an avatar, and select an option." };
  }
  return castPublicVote({ ...input, name: input.name.trim() });
}

export async function suggestOptionAction(input: {
  slug: string; label: string; name: string; avatarSeed: string; avatarTint: string;
}): Promise<{ success?: true; error?: string }> {
  if (!input || !slugPattern.test(input.slug) || typeof input.label !== "string" ||
      input.label.trim().length < 1 || input.label.trim().length > 200 ||
      typeof input.name !== "string" || typeof input.avatarSeed !== "string" || typeof input.avatarTint !== "string" ||
      !validIdentity(input.name, input.avatarSeed, input.avatarTint)) {
    return { error: "Add your name, choose an avatar, and write a suggestion." };
  }
  return addPublicSuggestion({ ...input, label: input.label.trim(), name: input.name.trim() });
}
