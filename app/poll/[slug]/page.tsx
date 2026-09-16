import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicPollScreen } from "@/components/containers/public-poll-screen";
import { LandingHeader } from "@/components/containers/landing-header";
import { getPublicPoll } from "@/lib/data/public-polls";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const poll = /^[0-9a-f]{32}$/.test(slug) ? await getPublicPoll(slug) : null;
  return {
    title: poll ? `${poll.title} — Tiebreak` : "Poll not found — Tiebreak",
    openGraph: {
      title: poll?.title,
      description: "Cast your vote and settle it.",
      images: ["/preview.jpg"],
    },
  };
}

export default async function PublicPollPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!/^[0-9a-f]{32}$/.test(slug)) notFound();
  const poll = await getPublicPoll(slug);
  if (!poll) notFound();
  return <div className="min-h-screen bg-cream text-cocoa"><LandingHeader /><PublicPollScreen poll={poll} /></div>;
}
