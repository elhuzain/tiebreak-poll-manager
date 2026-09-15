"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCreator } from "@/lib/data/auth";
import { createMyPoll } from "@/lib/data/polls";

export type CreatePollState = { error?: string };

export async function createPollAction(_state: CreatePollState, formData: FormData): Promise<CreatePollState> {
  const creator = await getCreator();
  if (!creator) redirect("/login");

  const rawTitle = formData.get("title");
  const rawOptions = formData.getAll("option");
  const rawMaxChoices = formData.get("max_choices");
  const rawClosesAt = formData.get("closes_at");
  if (typeof rawTitle !== "string" || typeof rawMaxChoices !== "string" || typeof rawClosesAt !== "string") {
    return { error: "Fill in the poll title, options, and closing time." };
  }

  const title = rawTitle.trim();
  const options = rawOptions.map((value) => typeof value === "string" ? value.trim() : "");
  const maxChoices = Number(rawMaxChoices);
  const closesAt = new Date(rawClosesAt);
  if (!title || title.length > 200 || options.length < 2 || options.length > 10 ||
      options.some((option) => !option || option.length > 200)) {
    return { error: "Add a title and 2 to 10 options (up to 200 characters each)." };
  }
  if (!Number.isInteger(maxChoices) || maxChoices < 1 || maxChoices > options.length) {
    return { error: "Choose a valid number of selections." };
  }
  if (Number.isNaN(closesAt.getTime()) || closesAt.getTime() <= Date.now()) {
    return { error: "Choose a closing time in the future." };
  }

  const result = await createMyPoll({
    creatorId: creator.id,
    title,
    options,
    maxChoices,
    suggestionsEnabled: formData.get("suggestions_enabled") === "on",
    closesAt: closesAt.toISOString(),
  });
  if ("error" in result) return { error: "We couldn’t create the poll. Please try again." };

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
