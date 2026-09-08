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
  ringColor,
}: {
  name: string;
  color?: string;
  photoUrl?: string | null;
  className?: string;
  /** Liseré autour du portrait, dans la couleur du parti. Absent par défaut. */
  ringColor?: string;
}) {
  const [failed, setFailed] = useState(false);

  // Un anneau discret : la couleur du parti cerne le portrait sans le teinter.
  const ring = ringColor
    ? { boxShadow: `0 0 0 4px color-mix(in srgb, ${ringColor} 22%, transparent)` }
    : undefined;

  if (photoUrl && !failed) {
    return (
      <div className={cn("relative overflow-hidden rounded-[20px] bg-surface", className)} style={ring}>
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
      style={{
        ...ring,
        background: `linear-gradient(145deg, ${color}, color-mix(in srgb, ${color} 60%, black))`,
      }}
      aria-hidden="true"
    >
      {initials(name)}
    </div>
  );
}
