import type { CandidatePosition, Question } from "@/lib/types";

export type ThemeVerdict = "accord" | "desaccord" | "nuance" | "inconnu";

/**
 * Average similarity between two candidates for a given theme, computed
 * from the Match question bank (the only quantitative, -2..2 signal we
 * have). Returns null when neither candidate has a documented, shared
 * question for that theme — in that case the UI treats it as "unknown"
 * rather than guessing similarity from free-text proposals.
 */
export function themeSimilarity(
  themeId: string,
  candidateAId: string,
  candidateBId: string,
  questions: Question[],
  positions: CandidatePosition[]
): number | null {
  const themeQuestions = questions.filter((q) => q.theme_id === themeId);
  if (themeQuestions.length === 0) return null;

  let sum = 0;
  let count = 0;
  for (const q of themeQuestions) {
    const posA = positions.find((p) => p.question_id === q.id && p.candidate_id === candidateAId);
    const posB = positions.find((p) => p.question_id === q.id && p.candidate_id === candidateBId);
    if (!posA || !posB || posA.score === null || posB.score === null) continue;
    const distance = Math.abs(posA.score - posB.score);
    sum += 1 - distance / 4;
    count += 1;
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
