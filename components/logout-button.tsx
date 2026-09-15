"use client";

import { useFormStatus } from "react-dom";

export function LogoutButton() {
  const { pending } = useFormStatus();
  return <button className="min-h-11 rounded-full border-2 border-cocoa px-3 font-display text-sm font-extrabold focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal disabled:cursor-wait disabled:opacity-70 sm:px-5 sm:text-base" type="submit" disabled={pending} aria-busy={pending}>{pending ? "Logging out…" : "Log out"}</button>;
}
