"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CandidateMatchResult } from "@/lib/types";

export function ShareResults({ results }: { results: CandidateMatchResult[] }) {
  const [copied, setCopied] = useState(false);
  const top = results.slice(0, 3).filter((r) => r.score !== null);

  const text = [
    "Mon Match 2027 — Poliscope",
    ...top.map((r) => `${r.candidate.name} : ${r.score} %`),
    "Faites le vôtre sur Poliscope.",
  ].join("\n");

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
    <div className="rounded-xl border border-dashed border-border-strong bg-surface p-6">
      <p className="text-sm font-semibold">Partager mes résultats</p>
      <div className="mt-4 rounded-lg border border-border bg-background p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-2">Mon Match 2027</p>
        <ul className="mt-3 space-y-1.5">
          {top.map((r) => (
            <li key={r.candidate.id} className="flex justify-between text-sm">
              <span>{r.candidate.name}</span>
              <span className="font-mono font-semibold">{r.score} %</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted-2">Poliscope</p>
      </div>
      <p className="mt-4 text-xs text-muted">
        Seuls vos scores de compatibilité sont partagés — jamais le détail de vos réponses.
      </p>
      <Button onClick={handleShare} variant="outline" size="sm" className="mt-4">
        {copied ? <Check size={16} /> : <Share2 size={16} />}
        {copied ? "Copié" : "Partager mes résultats"}
      </Button>
    </div>
  );
}
