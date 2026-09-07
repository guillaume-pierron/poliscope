/**
 * Illustrative Match result shown to visitors who haven't taken the test yet
 * — deliberately anonymous ("Candidat A/B/C") and always displayed with an
 * explicit "exemple" label, so it can never be mistaken for a real result or
 * for a ranking of actual candidates. Shared by the hero panel and the
 * homepage showcase card so the two never drift apart.
 */
export const MATCH_PREVIEW_ROWS = [
  { label: "Candidat A", value: 72, tone: "bg-primary" },
  { label: "Candidat B", value: 58, tone: "bg-accent" },
  { label: "Candidat C", value: 41, tone: "bg-muted-2" },
] as const;
