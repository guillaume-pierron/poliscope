import type { CandidatePosition, UserAnswer } from "@/lib/types";

/**
 * All Match state lives in localStorage, in the visitor's browser only.
 * Nothing here is ever sent to a server — see /confidentialite.
 *
 * Bumped to v2 alongside the 2026 questionnaire rewrite: several question
 * ids changed shape (numeric likert → option-based choice) or meaning
 * (e.g. q6's polarity flipped, see questions.ts), so a v1 answer would
 * silently mean something different if reused as-is. Old v1 data is simply
 * ignored — the visitor is prompted to redo the (now more precise) Match
 * rather than risk a wrong result.
 */
const ANSWERS_KEY = "poliscope:match:answers:v2";
const SNAPSHOT_KEY = "poliscope:match:snapshot:v2";

export function loadAnswers(): UserAnswer[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(ANSWERS_KEY);
    return raw ? (JSON.parse(raw) as UserAnswer[]) : [];
  } catch {
    return [];
  }
}

export function saveAnswers(answers: UserAnswer[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ANSWERS_KEY, JSON.stringify(answers));
  } catch {
    // localStorage unavailable (private mode, quota) — the questionnaire
    // still works in-memory for the current session.
  }
}

export function clearAnswers() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(ANSWERS_KEY);
  } catch {
    // ignore
  }
}

/** The slice of a candidate position that matters for change detection. */
type PositionSnapshot = {
  candidate_id: string;
  question_id: string;
  numeric_score: number | null;
  option_id: string | null;
};

interface MatchSnapshot {
  computedAt: string;
  positions: PositionSnapshot[];
}

function toSnapshotPositions(positions: CandidatePosition[]): PositionSnapshot[] {
  return positions
    .map((p) => ({
      candidate_id: p.candidate_id,
      question_id: p.question_id,
      numeric_score: p.numeric_score,
      option_id: p.option_id,
    }))
    .sort((a, b) =>
      a.candidate_id === b.candidate_id
        ? a.question_id.localeCompare(b.question_id)
        : a.candidate_id.localeCompare(b.candidate_id)
    );
}

/**
 * The positions snapshot last used to compute results, and when — purely
 * for local drift detection (has anything changed since your last visit?).
 * Never used as the source of truth for display: results are always
 * recomputed live from the current answers + current positions.
 */
export function loadSnapshot(): MatchSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SNAPSHOT_KEY);
    return raw ? (JSON.parse(raw) as MatchSnapshot) : null;
  } catch {
    return null;
  }
}

export function saveSnapshot(positions: CandidatePosition[], computedAt: string) {
  if (typeof window === "undefined") return;
  try {
    const snapshot: MatchSnapshot = { computedAt, positions: toSnapshotPositions(positions) };
    window.localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(snapshot));
  } catch {
    // ignore
  }
}

/**
 * Counts documented positions that differ between two snapshots (added,
 * removed, or a changed score) — used to surface "your Match changed"
 * rather than silently recomputing without explanation.
 */
export function countChangedPositions(
  previous: PositionSnapshot[],
  current: CandidatePosition[]
): number {
  const key = (p: { candidate_id: string; question_id: string }) =>
    `${p.candidate_id}::${p.question_id}`;
  const valueOf = (p: { numeric_score: number | null; option_id: string | null }) =>
    p.numeric_score ?? p.option_id;
  const prevByKey = new Map(previous.map((p) => [key(p), valueOf(p)]));
  const currByKey = new Map(current.map((p) => [key(p), valueOf(p)]));

  let changed = 0;
  const allKeys = new Set([...prevByKey.keys(), ...currByKey.keys()]);
  for (const k of allKeys) {
    if (prevByKey.get(k) !== currByKey.get(k)) changed += 1;
  }
  return changed;
}
