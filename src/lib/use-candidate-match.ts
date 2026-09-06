"use client";

import { useEffect, useState } from "react";
import { loadAnswers } from "@/lib/match-storage";
import { computeMatchResults, computeThemeWeightsFromPriorityAnswers } from "@/lib/scoring";
import type { Candidate, CandidateMatchResult, CandidatePosition, Question } from "@/lib/types";

type MatchData = { candidates: Candidate[]; positions: CandidatePosition[]; questions: Question[] };

export type CandidateMatchState =
  | { status: "loading" }
  | { status: "no-match" }
  | { status: "no-data" }
  | { status: "ready"; result: CandidateMatchResult; computedAt: string };

/**
 * Computes one candidate's Match result client-side (localStorage answers +
 * the public reference dataset). Presentational components call this
 * directly rather than re-deriving the score themselves — the single source
 * of truth stays computeMatchResults.
 */
export function useCandidateMatchResult(candidate: Candidate): CandidateMatchState {
  const [state, setState] = useState<CandidateMatchState>({ status: "loading" });

  useEffect(() => {
    const answers = loadAnswers();
    const hasAnswers = answers.some((a) => a.value !== null);
    if (!hasAnswers) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState({ status: "no-match" });
      return;
    }

    fetch("/api/match-data")
      .then((res) => res.json())
      .then((data: MatchData) => {
        const themeWeights = computeThemeWeightsFromPriorityAnswers(answers, data.questions);
        const [computed] = computeMatchResults(answers, [candidate], data.positions, data.questions, themeWeights);
        if (!computed || computed.score === null) {
          setState({ status: "no-data" });
        } else {
          setState({ status: "ready", result: computed, computedAt: new Date().toISOString() });
        }
      })
      .catch(() => setState({ status: "no-data" }));
  }, [candidate]);

  return state;
}
