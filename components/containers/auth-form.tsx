"use client";

import { useActionState } from "react";
import { loginAction, signupAction, type AuthFormState } from "@/lib/actions/auth";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const action = mode === "login" ? loginAction : signupAction;
  const [state, formAction, pending] = useActionState(action, {} as AuthFormState);

  return (
    <form className="mt-8 grid gap-5" action={formAction}>
      <div className="grid gap-2">
        <label className="font-body text-sm font-extrabold text-cocoa" htmlFor="email">Email</label>
        <input
          className="min-h-12 w-full rounded-md border-2 border-cocoa bg-card px-4 font-body text-base text-cocoa placeholder:text-cocoa-soft focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
        />
      </div>
      <div className="grid gap-2">
        <label className="font-body text-sm font-extrabold text-cocoa" htmlFor="password">Password</label>
        <input
          className="min-h-12 w-full rounded-md border-2 border-cocoa bg-card px-4 font-body text-base text-cocoa focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal"
          id="password"
          name="password"
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          minLength={mode === "signup" ? 8 : undefined}
          required
        />
      </div>
      {state.error && (
        <p className="rounded-md border-2 border-cocoa bg-cream-deep px-4 py-3 font-body text-sm font-bold text-cocoa" role="alert">{state.error}</p>
      )}
      {state.message && (
        <p className="rounded-md border-2 border-teal-deep bg-teal-soft px-4 py-3 font-body text-sm font-bold text-teal-deep" role="status">{state.message}</p>
      )}
      <button
        className="mt-2 min-h-12 rounded-full border-2 border-tangerine-deep bg-tangerine-deep px-5 font-display text-base font-extrabold text-cream-bright shadow-press-tangerine focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal disabled:cursor-wait disabled:opacity-70"
        type="submit"
        disabled={pending}
      >
        {pending ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
      </button>
    </form>
  );
}
