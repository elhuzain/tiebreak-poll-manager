import { createUserClient } from "@/lib/supabase/api/_client";

export async function signInWithPassword(email: string, password: string) {
  const supabase = await createUserClient();
  return supabase.auth.signInWithPassword({ email, password });
}

export async function registerWithPassword(email: string, password: string, emailRedirectTo: string) {
  const supabase = await createUserClient();
  return supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo },
  });
}

export async function getAuthenticatedUser() {
  const supabase = await createUserClient();
  return supabase.auth.getUser();
}

export async function signOutAuthenticatedUser() {
  const supabase = await createUserClient();
  return supabase.auth.signOut();
}

export async function exchangeAuthCode(code: string) {
  const supabase = await createUserClient();
  return supabase.auth.exchangeCodeForSession(code);
}

export async function verifyEmailToken(tokenHash: string) {
  const supabase = await createUserClient();
  return supabase.auth.verifyOtp({ token_hash: tokenHash, type: "email" });
}
