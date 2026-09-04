"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

/** Large portrait treatment for the candidate hero — falls back to initials, just like CandidateAvatar. */
export function CandidateHeroPhoto({
  name,
  color = "#4338ca",
  photoUrl,
  className,
}: {
  name: string;
  color?: string;
  photoUrl?: string | null;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (photoUrl && !failed) {
    return (
      <div className={cn("relative overflow-hidden rounded-[20px] bg-surface", className)}>
        <Image
          src={photoUrl}
          alt={name}
          fill
          sizes="320px"
          className="object-cover"
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={cn("flex items-center justify-center rounded-[20px] text-5xl font-semibold text-white", className)}
      style={{ background: `linear-gradient(145deg, ${color}, color-mix(in srgb, ${color} 60%, black))` }}
      aria-hidden="true"
    >
      {initials(name)}
    </div>
  );
}
