import type { CandidatePosition, Question, QuestionAnswerType } from "@/lib/types";

/**
 * Human-readable label for one likert/choice/priority value — always looked
 * up from the question's own `options`, never from a hardcoded -2..2 → text
 * map. That keeps a single source of truth: the same options array drives
 * the questionnaire buttons, the results pages, and this label. Returns
 * null when the value isn't one of the question's options (shouldn't
 * happen with well-formed data, but never silently mislabel).
 */
export function describeQuestionValue(
  question: Pick<Question, "answer_type" | "options">,
  value: number | string
): string | null {
  if (question.answer_type === "likert") {
    return typeof value === "number"
      ? (question.options.find((o) => o.value === value)?.label ?? null)
      : null;
  }
  return typeof value === "string"
    ? (question.options.find((o) => o.id === value)?.label ?? null)
    : null;
}

/** Same lookup, but reading directly off a documented candidate position. */
export function describePositionValue(
  question: Pick<Question, "answer_type" | "options">,
  position: Pick<CandidatePosition, "numeric_score" | "option_id">
): string | null {
  if (question.answer_type === "likert") {
    return position.numeric_score === null ? null : describeQuestionValue(question, position.numeric_score);
  }
  return position.option_id === null ? null : describeQuestionValue(question, position.option_id);
}

/**
 * Visual tone for one documented position — "positive"/"negative" only make
 * sense for a likert position (a point on an agree/disagree or
 * less/more axis). A "choice" position has no such valence — it's simply
 * one of several non-ordered policy directions — so it always renders
 * neutrally (a plain bullet, never a thumbs up/down implying "good/bad").
 */
export type PositionTone = "positive" | "negative" | "neutral" | "choice";

export function positionTone(
  answerType: QuestionAnswerType,
  position: Pick<CandidatePosition, "numeric_score" | "option_id">
): PositionTone {
  if (answerType !== "likert") return "choice";
  if (position.numeric_score === null) return "neutral";
  if (position.numeric_score > 0) return "positive";
  if (position.numeric_score < 0) return "negative";
  return "neutral";
}
