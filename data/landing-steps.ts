export type LandingStep = {
  number: string;
  title: string;
  description: string;
};

export const landingSteps: LandingStep[] = [
  { number: "01", title: "Put it to a vote", description: "Add your choices, pick a closing time, and send one link to the chat." },
  { number: "02", title: "Let the crew weigh in", description: "Friends vote on their phones without making an account. They can suggest a new choice, too." },
  { number: "03", title: "Make the call", description: "Follow the results as votes land, then close the poll and reveal who backed what." },
];
