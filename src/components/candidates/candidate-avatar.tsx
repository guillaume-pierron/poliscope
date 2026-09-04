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

const SIZES = {
  sm: { className: "h-9 w-9 text-xs", px: 36 },
  md: { className: "h-12 w-12 text-sm", px: 48 },
  lg: { className: "h-20 w-20 text-xl", px: 80 },
  xl: { className: "h-28 w-28 text-3xl", px: 112 },
} as const;

export function CandidateAvatar({
  name,
  color = "#4338ca",
  photoUrl,
  className,
  size = "md",
}: {
  name: string;
  color?: string;
  /** Chemin d'une photo (ex. /candidates/marine-le-pen.jpg). Repli sur les initiales tant qu'elle est absente ou introuvable. */
  photoUrl?: string | null;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const [failed, setFailed] = useState(false);
  const { className: sizeClass, px } = SIZES[size];

  if (photoUrl && !failed) {
    return (
      <div className={cn("relative shrink-0 overflow-hidden rounded-full", sizeClass, className)}>
        <Image
          src={photoUrl}
          alt={name}
          fill
          sizes={`${px}px`}
          className="object-cover"
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold text-white",
        sizeClass,
        className
      )}
      style={{
        background: `linear-gradient(145deg, ${color}, color-mix(in srgb, ${color} 60%, black))`,
      }}
      aria-hidden="true"
    >
      {initials(name)}
    </div>
  );
}
