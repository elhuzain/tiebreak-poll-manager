import { LandingPollOption } from "@/components/landing-poll-option";

export function LandingPollOptionList({ options }: { options: string[] }) {
  return (
    <div className="my-6 grid gap-2.5">
      {options.map((option) => <LandingPollOption key={option} label={option} />)}
    </div>
  );
}
