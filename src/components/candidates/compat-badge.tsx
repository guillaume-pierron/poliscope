"use client";

import { useEffect, useState } from "react";
import { loadAnswers } from "@/lib/match-storage";
import { computeMatchResults, computeThemeWeightsFromPriorityAnswers } from "@/lib/scoring";
import type { Candidate, CandidateMatchResult, CandidatePosition, Question } from "@/lib/types";

export function CompatBadge({ candidate }: { candidate: Candidate }) {
  const [result, setResult] = useState<CandidateMatchResult | null | undefined>(undefined);

  useEffect(() => {
    // localStorage is an external system only readable client-side on mount.
    const answers = loadAnswers();
    if (answers.filter((a) => a.value !== null).length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResult(null);
      return;
    }
    fetch("/api/match-data")
      .then((res) => res.json())
      .then((data: { candidates: Candidate[]; positions: CandidatePosition[]; questions: Question[] }) => {
        const themeWeights = computeThemeWeightsFromPriorityAnswers(answers, data.questions);
        const [computed] = computeMatchResults(answers, [candidate], data.positions, data.questions, themeWeights);
        setResult(computed ?? null);
      })
      .catch(() => setResult(null));
  }, [candidate]);

  if (!result?.score) return null;

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary-soft px-4 py-1.5 text-sm font-medium text-primary">
      <span className="font-mono font-semibold">{result.score}%</span>
      de proximité avec vos réponses
      {result.coverageLevel === "faible" && (
        <span className="text-primary/70">(résultat provisoire)</span>
      )}
    </div>
  );
}
