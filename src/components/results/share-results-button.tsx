"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CandidateMatchResult } from "@/lib/types";

/** Only compatibility scores are ever shared — never the answers themselves. */
export function buildShareText(results: CandidateMatchResult[]): string {
  const top = results.slice(0, 3).filter((r) => r.score !== null);
  return [
    "Mon Match 2027 — Poliscope",
    ...top.map((r) => `${r.candidate.name} : ${r.score} %`),
    "Faites le vôtre sur Poliscope.",
  ].join("\n");
}

export function ShareResultsButton({
  results,
  className,
}: {
  results: CandidateMatchResult[];
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const text = buildShareText(results);

  async function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "Mon Match 2027", text });
        return;
      } catch {
        // user cancelled or share failed — fall back to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — nothing more we can do silently
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className={cn(
        "focus-ring inline-flex items-center gap-2 rounded-full border border-border-strong bg-card px-5 py-2.5 text-sm font-medium transition-colors hover:bg-surface",
        className
      )}
    >
      {copied ? <Check size={15} className="text-success" /> : <Share2 size={15} />}
      {copied ? "Copié" : "Partager mes résultats"}
    </button>
  );
}
