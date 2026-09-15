import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CreatePollScreen } from "@/components/containers/create-poll-screen";
import { getCreator } from "@/lib/data/auth";

export const metadata: Metadata = { title: "Create a poll — Tiebreak" };

export default async function NewPollPage() {
  if (!await getCreator()) redirect("/login");
  return <CreatePollScreen />;
}
