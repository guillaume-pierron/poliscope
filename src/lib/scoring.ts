import type {
  Candidate,
  CandidateMatchResult,
  CandidatePosition,
  Question,
  UserAnswer,
} from "@/lib/types";

/** Maximum possible distance between two scores on the -2..2 scale. */
const MAX_DISTANCE = 4;

/**
 * Compatibility scoring, entirely client-side and stateless: no answer is
 * ever sent to a server. For each answered question, we compare the user's
 * value to the candidate's documented position on the same -2..2 scale.
 * Questions the candidate has no documented position for ("Position non
 * renseignée") are excluded from that candidate's score rather than guessed,
 * so the denominator (comparableQuestions) can differ between candidates.
 */
export function computeMatchResults(
  answers: UserAnswer[],
  candidates: Candidate[],
  positions: CandidatePosition[],
  questions: Question[]
): CandidateMatchResult[] {
  const questionById = new Map(questions.map((q) => [q.id, q]));
  const answeredList = answers.filter((a) => a.value !== null) as {
    question_id: string;
    value: number;
  }[];

  const results = candidates.map((candidate) => {
    const positionByQuestion = new Map(
      positions
        .filter((p) => p.candidate_id === candidate.id)
        .map((p) => [p.question_id, p])
    );

    let weightedSimilarity = 0;
    let totalWeight = 0;
    let comparableQuestions = 0;
    const agreements: { question: Question; similarity: number }[] = [];
    const disagreements: { question: Question; similarity: number }[] = [];

    for (const answer of answeredList) {
      const position = positionByQuestion.get(answer.question_id);
      const question = questionById.get(answer.question_id);
      if (!position || position.score === null || !question) continue;

      comparableQuestions += 1;
      const weight = question.weight ?? 1;
      const distance = Math.abs(answer.value - position.score);
      const similarity = 1 - distance / MAX_DISTANCE;

      weightedSimilarity += similarity * weight;
      totalWeight += weight;

      if (similarity >= 0.75) {
        agreements.push({ question, similarity });
      } else if (similarity <= 0.25) {
        disagreements.push({ question, similarity });
      }
    }

    const score = totalWeight > 0 ? Math.round((weightedSimilarity / totalWeight) * 100) : null;

    agreements.sort((a, b) => b.similarity - a.similarity);
    disagreements.sort((a, b) => a.similarity - b.similarity);

    return {
      candidate,
      score,
      answeredQuestions: answeredList.length,
      comparableQuestions,
      agreements: agreements.slice(0, 4),
      disagreements: disagreements.slice(0, 4),
    } satisfies CandidateMatchResult;
  });

  return results.sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
}
