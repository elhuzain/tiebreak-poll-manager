export function LandingPollOption({ label }: { label: string }) {
  return (
    <div className="flex min-h-13 items-center gap-3 rounded-xl border-2 border-cocoa bg-card px-4 py-3 font-body text-base font-extrabold leading-tight">
      <span className="size-6 shrink-0 rounded-full border-2 border-cocoa" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
