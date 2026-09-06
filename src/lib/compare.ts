import { calculateChoiceSimilarity, calculateLikertSimilarity } from "@/lib/scoring";
import type { CandidatePosition, Question } from "@/lib/types";

export type ThemeVerdict = "accord" | "desaccord" | "nuance" | "inconnu";

/**
 * Average similarity between two candidates for a given theme, computed
 * from the Match question bank — the only quantitative signal we have,
 * likert and choice questions alike (never a "priority" question, which
 * never has a candidate position to compare). Returns null when neither
 * candidate has a documented, shared question for that theme — in that
 * case the UI treats it as "unknown" rather than guessing similarity from
 * free-text proposals.
 */
export function themeSimilarity(
  themeId: string,
  candidateAId: string,
  candidateBId: string,
  questions: Question[],
  positions: CandidatePosition[]
): number | null {
  const themeQuestions = questions.filter((q) => q.theme_id === themeId && q.answer_type !== "priority");
  if (themeQuestions.length === 0) return null;

  let sum = 0;
  let count = 0;
  for (const q of themeQuestions) {
    const posA = positions.find((p) => p.question_id === q.id && p.candidate_id === candidateAId);
    const posB = positions.find((p) => p.question_id === q.id && p.candidate_id === candidateBId);
    if (!posA || !posB) continue;

    if (q.answer_type === "likert") {
      if (posA.numeric_score === null || posB.numeric_score === null) continue;
      sum += calculateLikertSimilarity(posA.numeric_score, posB.numeric_score);
      count += 1;
    } else {
      if (posA.option_id === null || posB.option_id === null) continue;
      sum += calculateChoiceSimilarity(posA.option_id, posB.option_id, q.compatibility);
      count += 1;
    }
  }

  return count > 0 ? sum / count : null;
}

export function verdictFromSimilarity(similarity: number | null): ThemeVerdict {
  if (similarity === null) return "inconnu";
  if (similarity >= 0.75) return "accord";
  if (similarity <= 0.35) return "desaccord";
  return "nuance";
}

export const VERDICT_LABELS: Record<ThemeVerdict, string> = {
  accord: "Positions proches",
  desaccord: "Positions opposées",
  nuance: "Positions nuancées",
  inconnu: "Non comparable",
};
