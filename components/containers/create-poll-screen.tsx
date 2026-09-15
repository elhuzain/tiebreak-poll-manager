import Link from "next/link";
import { CreatePollForm } from "@/components/containers/create-poll-form";
import { LandingFooter } from "@/components/containers/landing-footer";
import { LandingHeader } from "@/components/containers/landing-header";

export function CreatePollScreen() {
  return <div className="flex min-h-screen flex-col bg-cream font-body text-cocoa">
    <LandingHeader />
    <main className="mx-auto w-full max-w-form flex-1 px-5 py-12 sm:px-8">
      <Link href="/dashboard" className="font-body text-sm font-extrabold underline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal">← My polls</Link>
      <h1 className="mt-6 font-display text-3xl font-black tracking-tight md:text-4xl">Create a poll</h1>
      <p className="mt-2 font-body text-base text-cocoa-soft">Ask a question, add options, and choose when voting closes.</p>
      <CreatePollForm />
    </main>
    <LandingFooter />
  </div>;
}
