import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { CreatorPollScreen } from "@/components/containers/creator-poll-screen";
import { getCreator } from "@/lib/data/auth";
import { getCreatorPollDetail } from "@/lib/data/creator-poll-detail";

export const metadata: Metadata = { title: "Manage poll — Tiebreak" };

export default async function CreatorPollPage({ params }: { params: Promise<{ slug: string }> }) {
  const creator = await getCreator();
  if (!creator) redirect("/login");
  const { slug } = await params;
  if (!/^[0-9a-f]{32}$/.test(slug)) notFound();
  const poll = await getCreatorPollDetail(creator.id, slug);
  if (!poll) notFound();
  return <CreatorPollScreen poll={poll} />;
}
