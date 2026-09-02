import type { UserAnswer } from "@/lib/types";

/**
 * All Match state lives in localStorage, in the visitor's browser only.
 * Nothing here is ever sent to a server — see /confidentialite.
 */
const KEY = "poliscope:match:answers:v1";

export function loadAnswers(): UserAnswer[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as UserAnswer[]) : [];
  } catch {
    return [];
  }
}

export function saveAnswers(answers: UserAnswer[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(answers));
  } catch {
    // localStorage unavailable (private mode, quota) — the questionnaire
    // still works in-memory for the current session.
  }
}

export function clearAnswers() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
