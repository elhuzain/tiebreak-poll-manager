import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthScreen } from "@/components/containers/auth-screen";
import { getCreator } from "@/lib/data/auth";

export const metadata: Metadata = {
  title: "Log in — Tiebreak",
  description: "Log in to manage your Tiebreak polls.",
};

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  if (await getCreator()) redirect("/dashboard");
  const confirmation = (await searchParams).confirmation;
  const notice = confirmation === "failed" ? "That confirmation link didn’t work. Try signing up again or log in if your email is already confirmed." : undefined;
  return <AuthScreen mode="login" notice={notice} />;
}
