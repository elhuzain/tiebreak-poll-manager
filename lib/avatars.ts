export const avatarChoices = [
  { seed: "Milo", tint: "f8c9b9", label: "Peach face" },
  { seed: "Nia", tint: "cbe2d8", label: "Teal face" },
  { seed: "Kai", tint: "f6e0a4", label: "Butter face" },
  { seed: "Luna", tint: "e3d2f2", label: "Lilac face" },
] as const;

export function validAvatar(seed: string, tint: string) {
  return avatarChoices.some((choice) => choice.seed === seed && choice.tint === tint);
}

export function avatarUrl(seed: string, tint: string) {
  return `https://api.dicebear.com/10.x/micah/svg?seed=${encodeURIComponent(seed)}&backgroundColor=${tint}`;
}
