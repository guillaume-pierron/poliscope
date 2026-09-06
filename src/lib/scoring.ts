import type {
  Candidate,
  CandidateMatchResult,
  CandidatePosition,
  CoverageLevel,
  Question,
  QuestionDiscrimination,
  Theme,
  ThemeMatchScore,
  ThemeWeightMap,
  UserAnswer,
} from "@/lib/types";

/** Maximum possible distance between two likert scores on the -2..2 scale. */
const MAX_DISTANCE = 4;

/**
 * Similarity between one likert answer and one documented likert position,
 * both on the -2..2 scale. A distance of 0 gives 100%, the maximal distance
 * of 4 gives 0%. Valid for "likert" questions only — both the agreement
 * wording and the intensity wording ("Fortement réduire"..."Fortement
 * augmenter") share this formula because both are genuinely ordinal.
 */
export function calculateLikertSimilarity(userValue: number, candidateScore: number): number {
  const distance = Math.abs(userValue - candidateScore);
  return 1 - distance / MAX_DISTANCE;
}

/**
 * Similarity between one "choice" (or "priority") answer and one documented
 * option pick. These options are mutually exclusive policy directions with
 * no natural ordering, so we never invent a distance between two different
 * options: same option is a full match (1), anything else is 0 — unless the
 * question defines an explicit, publicly documented `compatibility` rule
 * for that exact pair, which is the only sanctioned way to score a partial
 * match (never a subjective guess like "nucléaire ~60% compatible avec
 * mix").
 */
export function calculateChoiceSimilarity(
  userOptionId: string,
  candidateOptionId: string,
  compatibility?: Record<string, Record<string, number>>
): number {
  if (userOptionId === candidateOptionId) return 1;
  const explicit = compatibility?.[userOptionId]?.[candidateOptionId];
  return explicit ?? 0;
}

/**
 * Single entry point used by computeMatchResults: dispatches to the right
 * formula for the question's answer_type and always returns a similarity
 * normalized to 0..1, so a theme mixing likert and choice questions can
 * still be averaged meaningfully. Returns null when the answer or the
 * position doesn't actually carry a comparable value for this type (e.g. a
 * likert answer against a position with no numeric_score) — never a guess.
 */
export function calculateQuestionSimilarity(
  answerValue: number | string,
  position: CandidatePosition,
  question: Pick<Question, "answer_type" | "compatibility">
): number | null {
  if (question.answer_type === "likert") {
    if (typeof answerValue !== "number" || position.numeric_score === null) return null;
    return calculateLikertSimilarity(answerValue, position.numeric_score);
  }
  if (question.answer_type === "choice") {
    if (typeof answerValue !== "string" || position.option_id === null) return null;
    return calculateChoiceSimilarity(answerValue, position.option_id, question.compatibility);
  }
  // "priority" questions never have a candidate position to compare against.
  return null;
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
 * equally by default. `themeWeights` lets a visitor's own "priority"
 * answers count their chosen themes more (see
 * computeThemeWeightsFromPriorityAnswers) — omitted, every theme has weight
 * 1, so there is never a hidden editorial weighting.
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
 * Fixed, documented thresholds — never a per-question hardcoded verdict.
 * Below `minPositions` documented positions we simply don't have enough
 * signal to claim candidates are close or far apart, so we say nothing
 * (spec: never show the indicator in that case).
 */
const DISCRIMINATION_MIN_POSITIONS = 4;
const LIKERT_SPREAD_THRESHOLD = 1.1; // standard deviation on the -2..2 scale
const CHOICE_CONSENSUS_THRESHOLD = 0.6; // share of documented candidates on the single most-picked option

/**
 * How much documented positions actually diverge on one question, computed
 * purely from the positions on file — never hardcoded per question. A wide
 * spread of likert scores, or documented candidates split across several
 * "choice" options rather than clustered on one, both read as
 * "départage" — a tight cluster or a clear majority option reads as
 * "proches". Returns null under low coverage or for "priority" questions,
 * which never have candidate positions at all.
 */
export function calculateQuestionDiscrimination(
  question: Pick<Question, "id" | "answer_type">,
  positions: CandidatePosition[]
): QuestionDiscrimination {
  if (question.answer_type === "priority") return null;
  const relevant = positions.filter((p) => p.question_id === question.id);

  if (question.answer_type === "likert") {
    const scores = relevant.map((p) => p.numeric_score).filter((s): s is number => s !== null);
    if (scores.length < DISCRIMINATION_MIN_POSITIONS) return null;
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((a, b) => a + (b - mean) ** 2, 0) / scores.length;
    return Math.sqrt(variance) >= LIKERT_SPREAD_THRESHOLD ? "departage" : "proches";
  }

  // choice
  const optionIds = relevant.map((p) => p.option_id).filter((o): o is string => o !== null);
  if (optionIds.length < DISCRIMINATION_MIN_POSITIONS) return null;
  const counts = new Map<string, number>();
  for (const id of optionIds) counts.set(id, (counts.get(id) ?? 0) + 1);
  const maxShare = Math.max(...counts.values()) / optionIds.length;
  return maxShare <= CHOICE_CONSENSUS_THRESHOLD ? "departage" : "proches";
}

/**
 * Boost applied to the 1st and 2nd "priority" pick, in that order — a
 * fixed, documented rule (not per-user tuned). A theme not picked by either
 * priority question keeps the default weight of 1.
 */
const PRIORITY_WEIGHT_BOOSTS = [2, 1.5];

/**
 * Turns the visitor's own answers to "priority" questions into a
 * ThemeWeightMap for calculateCandidateScore. Purely a reflection of what
 * they picked — never set editorially, never derived from any candidate's
 * data. Priority questions are ordered by order_index so the first one
 * asked carries the strongest boost.
 */
export function computeThemeWeightsFromPriorityAnswers(
  answers: UserAnswer[],
  questions: Question[]
): ThemeWeightMap {
  const weights: ThemeWeightMap = {};
  const priorityQuestions = questions
    .filter((q) => q.answer_type === "priority")
    .sort((a, b) => a.order_index - b.order_index);

  priorityQuestions.forEach((question, i) => {
    const answer = answers.find((a) => a.question_id === question.id);
    if (!answer || typeof answer.value !== "string") return;
    const option = question.options.find((o) => o.id === answer.value);
    const boost = PRIORITY_WEIGHT_BOOSTS[i];
    if (!option?.theme_id || boost === undefined) return;
    weights[option.theme_id] = Math.max(weights[option.theme_id] ?? 1, boost);
  });

  return weights;
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
 * guessed, so coverage can differ between candidates. "priority" answers
 * never enter this computation directly — see computeThemeWeightsFromPriorityAnswers.
 */
export function computeMatchResults(
  answers: UserAnswer[],
  candidates: Candidate[],
  positions: CandidatePosition[],
  questions: Question[],
  themeWeights?: ThemeWeightMap
): CandidateMatchResult[] {
  const questionById = new Map(questions.map((q) => [q.id, q]));
  // "priority" questions have no candidate position to compare against —
  // they never count as an "answered" question for coverage purposes.
  const answeredList = answers.filter((a): a is { question_id: string; value: number | string } => {
    if (a.value === null) return false;
    const question = questionById.get(a.question_id);
    return !!question && question.answer_type !== "priority";
  });

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
      if (!position || !question || !question.theme) continue;

      const similarity = calculateQuestionSimilarity(answer.value, position, question);
      if (similarity === null) continue;

      comparableQuestions += 1;
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
 * Themes the visitor seems to care most about. Prefers their explicit
 * answers to the "priority" questions (the most direct signal there is);
 * when those are absent (skipped, or an older/partial run) it falls back
 * to inferring priorities from strongly-held likert opinions (|value| = 2),
 * exactly as before. Never derived from any candidate's data.
 */
export function computeUserPriorityThemes(
  answers: UserAnswer[],
  questions: Question[],
  max = 4
): Theme[] {
  const themeById = new Map<string, Theme>();
  for (const q of questions) {
    if (q.theme) themeById.set(q.theme.id, q.theme);
  }

  const explicit = questions
    .filter((q) => q.answer_type === "priority")
    .sort((a, b) => a.order_index - b.order_index)
    .map((q) => {
      const answer = answers.find((a) => a.question_id === q.id);
      if (!answer || typeof answer.value !== "string") return null;
      const option = q.options.find((o) => o.id === answer.value);
      return option?.theme_id ? themeById.get(option.theme_id) ?? null : null;
    })
    .filter((t): t is Theme => t !== null);

  if (explicit.length > 0) return explicit.slice(0, max);

  const questionById = new Map(questions.map((q) => [q.id, q]));
  const counts = new Map<string, { theme: Theme; count: number }>();

  for (const answer of answers) {
    if (answer.value === null || typeof answer.value !== "number" || Math.abs(answer.value) < 2) continue;
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
