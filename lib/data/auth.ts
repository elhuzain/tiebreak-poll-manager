import { cache } from "react";
import {
  exchangeAuthCode,
  getAuthenticatedUser,
  registerWithPassword,
  signInWithPassword,
  signOutAuthenticatedUser,
  verifyEmailToken,
} from "@/lib/supabase/api/auth";

export type Creator = { id: string; email: string };
export type AuthOutcome =
  | { status: "authenticated" }
  | { status: "confirmation_required" }
  | { status: "error"; message: string };

export const getCreator = cache(async (): Promise<Creator | null> => {
  const { data, error } = await getAuthenticatedUser();
  if (error || !data.user) return null;
  return { id: data.user.id, email: data.user.email ?? "" };
});

export async function loginCreator(email: string, password: string): Promise<AuthOutcome> {
  const { data, error } = await signInWithPassword(email, password);
  if (error || !data.session) {
    return { status: "error", message: "We couldn’t log you in. Check your email and password, and confirm your email if you just signed up." };
  }
  return { status: "authenticated" };
}

export async function registerCreator(email: string, password: string, redirectTo: string): Promise<AuthOutcome> {
  const { data, error } = await registerWithPassword(email, password, redirectTo);
  if (error) {
    return { status: "error", message: "We couldn’t create your account. Check your details and try again." };
  }
  if (!data.session) return { status: "confirmation_required" };
  return { status: "authenticated" };
}

export async function logoutCreator() {
  const { error } = await signOutAuthenticatedUser();
  return !error;
}

export async function confirmCreatorEmail({ code, tokenHash }: { code?: string; tokenHash?: string }) {
  if (code) {
    const { error } = await exchangeAuthCode(code);
    return !error;
  }
  if (tokenHash) {
    const { error } = await verifyEmailToken(tokenHash);
    return !error;
  }
  return false;
}
