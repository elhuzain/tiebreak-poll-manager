import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthScreen } from "@/components/containers/auth-screen";
import { getCreator } from "@/lib/data/auth";

export const metadata: Metadata = {
  title: "Sign up — Tiebreak",
  description: "Create a Tiebreak account to start group polls.",
};

export default async function SignupPage() {
  if (await getCreator()) redirect("/dashboard");
  return <AuthScreen mode="signup" />;
}
