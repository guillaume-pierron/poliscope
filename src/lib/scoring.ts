import type {
  Candidate,
  CandidateMatchResult,
  CandidatePosition,
  CoverageLevel,
  Question,
  Theme,
  ThemeMatchScore,
  ThemeWeightMap,
  UserAnswer,
} from "@/lib/types";

/** Maximum possible distance between two scores on the -2..2 scale. */
const MAX_DISTANCE = 4;

/**
 * Similarity between one answer and one documented position, both on the
 * -2..2 scale. A distance of 0 gives 100%, the maximal distance of 4 gives 0%.
 */
export function calculateQuestionSimilarity(userValue: number, candidateScore: number): number {
  const distance = Math.abs(userValue - candidateScore);
  return 1 - distance / MAX_DISTANCE;
}

/**
 * A theme's score is the plain mean of its comparable questions' similarity
 * — never weighted by how many questions the theme happens to have. Returns
 * a 0..1 fraction; round only for display.
 */
export function calculateThemeScore(similarities: number[]): number {
  if (similarities.length === 0) return 0;
  return similarities.reduce((sum, s) => sum + s, 0) / similarities.length;
}

/**
 * Share of the user's answers this candidate's score actually rests on.
 * Null only when the user answered nothing at all — never NaN.
 */
export function calculateCandidateCoverage(
  comparableQuestions: number,
  answeredQuestions: number
): number | null {
  if (answeredQuestions === 0) return null;
  return comparableQuestions / answeredQuestions;
}

export function coverageLevelFor(coverage: number | null): CoverageLevel | null {
  if (coverage === null) return null;
  if (coverage >= 0.8) return "elevee";
  if (coverage >= 0.6) return "moyenne";
  return "faible";
}

/**
 * The global score is the mean of the per-theme scores — every theme counts
 * equally by default. `themeWeights` is an extension point for a future
 * "prioritize these themes" feature; omitted, every theme has weight 1, so
 * there is never a hidden editorial weighting.
 */
export function calculateCandidateScore(
  themeAverages: { themeId: string; average: number }[],
  themeWeights?: ThemeWeightMap
): number | null {
  if (themeAverages.length === 0) return null;
  let weightedSum = 0;
  let totalWeight = 0;
  for (const { themeId, average } of themeAverages) {
    const weight = themeWeights?.[themeId] ?? 1;
    weightedSum += average * weight;
    totalWeight += weight;
  }
  return totalWeight > 0 ? Math.round((weightedSum / totalWeight) * 100) : null;
}

/**
 * Compatibility scoring, entirely client-side and stateless: no answer is
 * ever sent to a server. Scored theme-first so a theme never carries more
 * weight just because it happens to have more questions in it:
 *
 *   1. similarity, question by question (calculateQuestionSimilarity)
 *   2. score per theme = mean of that theme's similarities (calculateThemeScore)
 *   3. global score = mean of the per-theme scores (calculateCandidateScore)
 *
 * "Sans opinion" answers (value: null) are excluded entirely — they must
 * never be treated as a neutral 0. A candidate's own undocumented positions
 * ("Position non renseignée") are excluded for that candidate only, never
 * guessed, so coverage can differ between candidates.
 */
export function computeMatchResults(
  answers: UserAnswer[],
  candidates: Candidate[],
  positions: CandidatePosition[],
  questions: Question[],
  themeWeights?: ThemeWeightMap
): CandidateMatchResult[] {
  const questionById = new Map(questions.map((q) => [q.id, q]));
  const answeredList = answers.filter(
    (a): a is { question_id: string; value: number } => a.value !== null
  );

  const results = candidates.map((candidate) => {
    const positionByQuestion = new Map(
      positions.filter((p) => p.candidate_id === candidate.id).map((p) => [p.question_id, p])
    );

    const byTheme = new Map<string, { theme: Theme; similarities: number[] }>();
    let comparableQuestions = 0;
    const agreements: { question: Question; similarity: number; position: CandidatePosition }[] = [];
    const disagreements: { question: Question; similarity: number; position: CandidatePosition }[] = [];

    for (const answer of answeredList) {
      const position = positionByQuestion.get(answer.question_id);
      const question = questionById.get(answer.question_id);
      if (!position || position.score === null || !question || !question.theme) continue;

      comparableQuestions += 1;
      const similarity = calculateQuestionSimilarity(answer.value, position.score);

      const bucket = byTheme.get(question.theme.id) ?? { theme: question.theme, similarities: [] };
      bucket.similarities.push(similarity);
      byTheme.set(question.theme.id, bucket);

      if (similarity >= 0.75) {
        agreements.push({ question, similarity, position });
      } else if (similarity <= 0.25) {
        disagreements.push({ question, similarity, position });
      }
    }

    agreements.sort((a, b) => b.similarity - a.similarity);
    disagreements.sort((a, b) => a.similarity - b.similarity);

    const themeAverages: { themeId: string; average: number }[] = [];
    const themeScores: ThemeMatchScore[] = [];
    for (const { theme, similarities } of byTheme.values()) {
      const average = calculateThemeScore(similarities);
      themeAverages.push({ themeId: theme.id, average });
      themeScores.push({
        theme,
        score: Math.round(average * 100),
        comparableQuestions: similarities.length,
      });
    }
    themeScores.sort((a, b) => b.score - a.score);

    const score = calculateCandidateScore(themeAverages, themeWeights);
    const coverage = calculateCandidateCoverage(comparableQuestions, answeredList.length);
    const coverageLevel = coverageLevelFor(coverage);

    const agreementThemes: Theme[] = [];
    for (const { question } of agreements) {
      if (question.theme && !agreementThemes.some((t) => t.id === question.theme!.id)) {
        agreementThemes.push(question.theme);
      }
    }

    return {
      candidate,
      score,
      answeredQuestions: answeredList.length,
      comparableQuestions,
      coverage,
      coverageLevel,
      themeScores,
      agreements,
      disagreements,
      agreementThemes,
    } satisfies CandidateMatchResult;
  });

  return results.sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
}

/**
 * Themes the visitor seems to care most about — derived only from their own
 * answers (strongly-held opinions, |value| = 2), never from any candidate's
 * data. Purely a reflection of what they answered, most frequent first.
 */
export function computeUserPriorityThemes(
  answers: UserAnswer[],
  questions: Question[],
  max = 4
): Theme[] {
  const questionById = new Map(questions.map((q) => [q.id, q]));
  const counts = new Map<string, { theme: Theme; count: number }>();

  for (const answer of answers) {
    if (answer.value === null || Math.abs(answer.value) < 2) continue;
    const theme = questionById.get(answer.question_id)?.theme;
    if (!theme) continue;
    const entry = counts.get(theme.id) ?? { theme, count: 0 };
    entry.count += 1;
    counts.set(theme.id, entry);
  }

  return [...counts.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, max)
    .map((e) => e.theme);
}
