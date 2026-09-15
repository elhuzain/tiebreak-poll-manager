import Link from "next/link";
import { AuthForm } from "@/components/containers/auth-form";
import { LandingFooter } from "@/components/containers/landing-footer";
import { LandingHeader } from "@/components/containers/landing-header";

export function AuthScreen({ mode, notice }: { mode: "login" | "signup"; notice?: string }) {
  const isLogin = mode === "login";

  return (
    <div className="flex min-h-screen flex-col bg-cream font-body text-cocoa">
      <LandingHeader />
      <main className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8 sm:py-18">
        <div className="w-full max-w-form">
          <Link className="mb-6 inline-flex min-h-11 items-center gap-2 font-body text-sm font-bold text-teal-deep underline underline-offset-4 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal" href="/">
            <svg className="size-4" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M16 10H4m5 5-5-5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Back to home
          </Link>
          <div className="rounded-lg border-[2.5px] border-cocoa bg-card p-6 sm:p-10">
            <p className="mb-3 font-body text-xs font-extrabold tracking-[0.1em] text-teal-deep">FOR THE POLL CREATOR</p>
            <h1 className="font-display text-[2.2rem] leading-tight font-black tracking-[-0.035em] sm:text-[2.7rem]">
              {isLogin ? "Welcome back." : "Make the call together."}
            </h1>
            <p className="mt-3 max-w-110 font-body text-base leading-normal text-cocoa-soft">
              {isLogin ? "Log in to pick up where your crew left off." : "Create an account to start polls and keep your crew moving."}
            </p>
            {notice && <p className="mt-5 rounded-md border-2 border-cocoa bg-cream-deep px-4 py-3 font-body text-sm font-bold text-cocoa" role="alert">{notice}</p>}
            <AuthForm mode={mode} />
            <div className="mt-8 border-t-2 border-dashed border-cream-deep pt-6 text-center font-body text-sm font-bold text-cocoa-soft">
              {isLogin ? "New to Tiebreak? " : "Already have an account? "}
              <Link className="text-teal-deep underline underline-offset-4 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal" href={isLogin ? "/signup" : "/login"}>
                {isLogin ? "Sign up" : "Log in"}
              </Link>
            </div>
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
