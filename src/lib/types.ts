/**
 * Domain types shared across the app. These mirror the Postgres schema
 * defined in supabase/migrations/0001_init.sql so the local demo dataset
 * and a real Supabase-backed dataset are interchangeable.
 */

export type Orientation =
  | "gauche"
  | "centre-gauche"
  | "centre"
  | "centre-droit"
  | "droite"
  | "extreme-droite"
  | "extreme-gauche"
  | "non-partisan";

export type ProposalStatus =
  | "annonce"
  | "proposition_officielle"
  | "programme"
  | "precision_ulterieure";

export type AnswerType = "likert" | "choice";

export interface Election {
  id: string;
  slug: string;
  name: string;
  kind: "presidentielle" | "legislatives" | "municipales" | "europeennes" | "autre";
  round_date: string | null;
  second_round_date: string | null;
  is_active: boolean;
}

export interface Party {
  id: string;
  name: string;
  short_name: string | null;
  orientation: Orientation;
  color: string;
}

export interface Candidate {
  id: string;
  slug: string;
  name: string;
  photo_url: string | null;
  party_id: string | null;
  party?: Party;
  biography: string;
  official_website: string | null;
  election_id: string;
  is_demo: boolean;
  order_index: number;
}

export interface Theme {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  order_index: number;
}

export interface Question {
  id: string;
  theme_id: string;
  theme?: Theme;
  question: string;
  description: string | null;
  /** Kept for schema compatibility — no longer used by scoring, which weighs every theme equally by default (see calculateCandidateScore). */
  weight: number;
  answer_type: AnswerType;
  order_index: number;
  choices?: { label: string; value: number }[] | null;
}

export interface Source {
  id: string;
  name: string;
  url: string;
  is_demo: boolean;
}

export interface CandidatePosition {
  id: string;
  candidate_id: string;
  question_id: string;
  /** -2..2, or null when the candidate's position is not documented. */
  score: number | null;
  explanation: string | null;
  source_url: string | null;
}

export interface Proposal {
  id: string;
  candidate_id: string;
  theme_id: string;
  theme?: Theme;
  title: string;
  summary: string;
  description: string;
  source_name: string;
  source_url: string;
  published_at: string | null;
  verified_at: string | null;
  status: ProposalStatus;
  /** Comma-separated topic tags (e.g. "SMIC, Prix") — parse with parseTags(). */
  tags: string | null;
}

export interface Poll {
  id: string;
  election_id: string;
  institute: string;
  sponsor: string | null;
  field_start: string;
  field_end: string;
  sample_size: number;
  method: string;
  /** Nom affiché du lien source (institut ou média qui publie les chiffres). */
  source_name: string;
  /** URL de la source primaire — jamais un agrégateur. Toujours renseignée. */
  source_url: string;
  published_at: string;
  is_demo: boolean;
}

/**
 * Un sondage teste souvent plusieurs hypothèses de premier tour (rosters de
 * candidats différents) ou plusieurs duels de second tour. Chaque hypothèse
 * est un scénario distinct avec ses propres résultats : on ne mélange jamais
 * les chiffres de deux scénarios, y compris au sein d'un même sondage.
 */
export interface PollScenario {
  id: string;
  poll_id: string;
  /** Ex. « Hypothèse Attal + Philippe », « Second tour : Le Pen face à Philippe ». */
  label: string;
  round: "premier_tour" | "second_tour";
  order_index: number;
}

export interface PollResult {
  id: string;
  scenario_id: string;
  candidate_id: string;
  value: number;
  low: number | null;
  high: number | null;
}

/**
 * A user's answer captured client-side only. Never persisted server-side.
 * `value: 0` is a genuine "Neutre" answer and counts in the score like any
 * other; `value: null` is "Sans opinion" / skipped and is excluded entirely
 * — the two must never be conflated.
 */
export interface UserAnswer {
  question_id: string;
  /** -2..2 (0 = Neutre, a real answer), or null when skipped ("Sans opinion"). */
  value: number | null;
}

export type CoverageLevel = "elevee" | "moyenne" | "faible";

export const COVERAGE_LEVEL_LABELS: Record<CoverageLevel, string> = {
  elevee: "Couverture élevée",
  moyenne: "Couverture moyenne",
  faible: "Couverture faible",
};

/** A candidate's score on one theme — themes are always weighted equally by default. */
export interface ThemeMatchScore {
  theme: Theme;
  /** 0-100, rounded — the mean similarity of that theme's comparable questions. */
  score: number;
  comparableQuestions: number;
}

/**
 * Optional per-theme weight multipliers for a future "prioritize these
 * themes" feature. Omitted (or a theme absent from the map) means weight 1 —
 * every theme counts equally by default, with no hidden editorial weighting.
 */
export type ThemeWeightMap = Record<string, number>;

export interface CandidateMatchResult {
  candidate: Candidate;
  /** 0-100, or null if no theme was comparable at all for this candidate. */
  score: number | null;
  answeredQuestions: number;
  comparableQuestions: number;
  /**
   * comparableQuestions / answeredQuestions — how much of the user's answers
   * this candidate's score actually rests on. Null only when the user
   * answered nothing at all.
   */
  coverage: number | null;
  coverageLevel: CoverageLevel | null;
  /** Per-theme breakdown, highest score first. */
  themeScores: ThemeMatchScore[];
  agreements: { question: Question; similarity: number; position: CandidatePosition }[];
  disagreements: { question: Question; similarity: number; position: CandidatePosition }[];
  /** Distinct themes behind the agreements above, strongest first. */
  agreementThemes: Theme[];
}

export const PROPOSAL_STATUS_LABELS: Record<ProposalStatus, string> = {
  annonce: "Annonce",
  proposition_officielle: "Proposition officielle",
  programme: "Programme",
  precision_ulterieure: "Précision apportée ultérieurement",
};

export const ORIENTATION_LABELS: Record<Orientation, string> = {
  gauche: "Gauche",
  "centre-gauche": "Centre gauche",
  centre: "Centre",
  "centre-droit": "Centre droit",
  droite: "Droite",
  "extreme-droite": "Extrême droite",
  "extreme-gauche": "Extrême gauche",
  "non-partisan": "Non partisan",
};
