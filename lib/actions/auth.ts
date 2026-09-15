"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { loginCreator, logoutCreator, registerCreator } from "@/lib/data/auth";

export type AuthFormState = { error?: string; message?: string };

function readCredentials(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");
  if (typeof email !== "string" || typeof password !== "string") return null;
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || normalizedEmail.length > 254 || !normalizedEmail.includes("@") || !password) return null;
  return { email: normalizedEmail, password };
}

export async function loginAction(_state: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const credentials = readCredentials(formData);
  if (!credentials) return { error: "Add a valid email and password to log in." };

  const outcome = await loginCreator(credentials.email, credentials.password);
  if (outcome.status === "error") return { error: outcome.message };

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signupAction(_state: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const credentials = readCredentials(formData);
  if (!credentials) return { error: "Add a valid email and password to sign up." };
  if (credentials.password.length < 8) return { error: "Use a password with at least 8 characters." };

  const origin = (await headers()).get("origin");
  if (!origin) return { error: "We couldn’t start signup. Please try again." };
  let emailRedirectTo: string;
  try {
    const callbackUrl = new URL("/auth/callback", origin);
    if (!["http:", "https:"].includes(callbackUrl.protocol)) throw new Error("Invalid origin");
    emailRedirectTo = callbackUrl.toString();
  } catch {
    return { error: "We couldn’t start signup. Please try again." };
  }
  const outcome = await registerCreator(credentials.email, credentials.password, emailRedirectTo);
  if (outcome.status === "error") return { error: outcome.message };
  if (outcome.status === "confirmation_required") {
    return { message: "Check your email to confirm your account. Then you’ll be taken to My polls." };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function logoutAction() {
  await logoutCreator();
  revalidatePath("/", "layout");
  redirect("/");
}
