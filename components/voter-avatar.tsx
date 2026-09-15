"use client";

import Image from "next/image";
import { useState } from "react";
import { avatarUrl } from "@/lib/avatars";

export function VoterAvatar({ seed, tint, size = 56 }: { seed: string; tint: string; size?: number }) {
  const [broken, setBroken] = useState(false);
  return <span className="shrink-0 flex justify-center items-center overflow-hidden rounded-full border-[2.5px] border-cocoa" style={{ width: size, height: size, backgroundColor: `#${tint}` }}>
    {broken ? <span aria-hidden="true" className="font-display text-xl font-extrabold text-cocoa">{seed[0]}</span> :
      <Image className="object-cover size-8" src={avatarUrl(seed, tint)} alt="" width={size} height={size} unoptimized onError={() => setBroken(true)} />}
  </span>;
}
