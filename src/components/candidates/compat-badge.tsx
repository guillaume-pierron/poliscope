"use client";

import { useEffect, useState } from "react";
import { loadAnswers } from "@/lib/match-storage";
import { computeMatchResults } from "@/lib/scoring";
import type { Candidate, CandidatePosition, Question } from "@/lib/types";

export function CompatBadge({ candidate }: { candidate: Candidate }) {
  const [score, setScore] = useState<number | null | undefined>(undefined);

  useEffect(() => {
    // localStorage is an external system only readable client-side on mount.
    const answers = loadAnswers();
    if (answers.filter((a) => a.value !== null).length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setScore(null);
      return;
    }
    fetch("/api/match-data")
      .then((res) => res.json())
      .then((data: { candidates: Candidate[]; positions: CandidatePosition[]; questions: Question[] }) => {
        const [result] = computeMatchResults(answers, [candidate], data.positions, data.questions);
        setScore(result?.score ?? null);
      })
      .catch(() => setScore(null));
  }, [candidate]);

  if (!score) return null;

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary-soft px-4 py-1.5 text-sm font-medium text-primary">
      <span className="font-mono font-semibold">{score}%</span>
      de compatibilité avec vos réponses
    </div>
  );
}
