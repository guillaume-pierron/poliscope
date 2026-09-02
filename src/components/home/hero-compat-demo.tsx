"use client";

import { motion } from "framer-motion";
import { CandidateAvatar } from "@/components/candidates/candidate-avatar";
import { Badge } from "@/components/ui/badge";
import type { Candidate } from "@/lib/types";

const DEMO_SCORES = [78, 62, 54, 41, 33];

export function HeroCompatDemo({ candidates }: { candidates: Candidate[] }) {
  const rows = candidates.slice(0, 5).map((candidate, i) => ({
    candidate,
    score: DEMO_SCORES[i] ?? 30,
  }));

  return (
    <div className="rounded-2xl border border-border bg-background/80 p-5 shadow-[0_30px_80px_-40px_rgba(15,15,25,0.35)] backdrop-blur">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Mon Match — aperçu</p>
        <Badge variant="demo">Démonstration</Badge>
      </div>

      <ul className="mt-5 space-y-4">
        {rows.map(({ candidate, score }, index) => (
          <li key={candidate.id}>
            <div className="mb-1.5 flex items-center gap-3">
              <CandidateAvatar name={candidate.name} color={candidate.party?.color} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{candidate.name}</p>
              </div>
              <span className="font-mono text-sm font-semibold tabular-nums">{score}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-strong">
              <motion.div
                className="h-full rounded-full"
                style={{ background: candidate.party?.color ?? "var(--primary)" }}
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 0.9, delay: 0.15 * index, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-5 text-xs text-muted">
        Résultats fictifs à titre d&apos;illustration. Répondez au questionnaire pour obtenir les vôtres.
      </p>
    </div>
  );
}
