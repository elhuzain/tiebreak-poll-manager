import Link from "next/link";
import { logoutAction } from "@/lib/actions/auth";
import { getCreator } from "@/lib/data/auth";
import { LogoutButton } from "@/components/logout-button";

export async function LandingHeader() {
  const creator = await getCreator();

  return (
    <header className="sticky top-0 z-100 bg-cream/90 backdrop-blur-sm">
      <div className="mx-auto flex min-h-19 max-w-page items-center justify-between gap-4 px-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-black tracking-[-0.04em] whitespace-nowrap sm:text-[1.65rem]" aria-label="Tiebreak">
          <span className="grid size-7 -rotate-10 place-items-center rounded-full border-[2.5px] border-cocoa bg-tangerine text-cream-bright" aria-hidden="true">
            <svg className="size-4" viewBox="0 0 32 32" fill="none"><path d="m8.5 16.5 5 5 10-11" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
          <span>tiebreak</span>
        </Link>
        <div className="flex items-center gap-2">
          {creator ? (
            <>
              <Link className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-teal-deep bg-teal px-3 font-display text-sm font-extrabold text-cream focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal sm:px-5 sm:text-base" href="/dashboard">My polls</Link>
              <form action={logoutAction}>
                <LogoutButton />
              </form>
            </>
          ) : (
            <>
              <Link className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-cocoa px-3 font-display text-sm font-extrabold focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal sm:px-5 sm:text-base" href="/login">Log in</Link>
              <Link className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-tangerine-deep bg-tangerine-deep px-3 font-display text-sm font-extrabold text-cream-bright shadow-press-tangerine focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal sm:px-5 sm:text-base" href="/signup">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
