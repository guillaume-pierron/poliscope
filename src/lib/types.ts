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

/**
 * Three question shapes, chosen to match the actual structure of the
 * underlying political question rather than forcing everything into a
 * single format:
 *
 * - "likert": an opinion or intensity scale, -2..2. Two wordings share this
 *   type ("Tout à fait favorable...Totalement opposé" for agreement,
 *   "Fortement réduire...Fortement augmenter" for intensity) because both
 *   are genuinely ordinal — a single continuum where a numeric distance is
 *   methodologically meaningful. See calculateQuestionSimilarity.
 * - "choice": an arbitrage between mutually exclusive policy directions
 *   that are NOT reducible to one continuum (e.g. "nucléaire" vs
 *   "renouvelables" vs "réduire la consommation" — no natural ordering).
 *   Never scored by numeric distance; see calculateChoiceSimilarity.
 * - "priority": which topics matter most to the visitor. Never compared to
 *   a candidate (no candidate_position ever exists for these) — instead it
 *   sets a per-theme score weight for this visitor only. Excluded from
 *   comparableQuestions/coverage entirely.
 */
export type QuestionAnswerType = "likert" | "choice" | "priority";

export interface QuestionOption {
  /** Stable slug, e.g. "nucleaire" — never a raw index, so it survives reordering. */
  id: string;
  label: string;
  /** One-line clarification shown under the label, e.g. for a "choice" option. */
  description?: string | null;
  /**
   * likert only: the -2..2 point this option represents. Every likert
   * question carries exactly 5 options spanning the full scale.
   */
  value?: number;
  /**
   * priority only: the theme this option boosts when picked. Absent for
   * likert/choice options, which don't set a weight.
   */
  theme_id?: string;
}

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
  /** Short subtitle always visible under the question — distinct from `context` below. */
  description: string | null;
  /**
   * A neutral, 2-4 line explainer shown only behind a "Pourquoi cette
   * question ?" toggle. Must explain the stakes, never argue for an answer,
   * never hint at a candidate's position — see /methodologie.
   */
  context: string | null;
  /** Kept for schema compatibility — no longer used by scoring, which weighs every theme equally by default unless a themeWeights map is given (see calculateCandidateScore). */
  weight: number;
  answer_type: QuestionAnswerType;
  order_index: number;
  /**
   * Whether this question is asked in the V1 questionnaire. A question can
   * be prepared (sourced, typed, ready) without being active yet — the
   * engine already supports a variable question count for a future
   * "Affiner mon Match" that unlocks more questions per theme.
   */
  is_active: boolean;
  /**
   * likert: exactly 5 entries spanning -2..2. choice/priority: 2-6 mutually
   * exclusive entries with no implied order.
   */
  options: QuestionOption[];
  /**
   * choice only, optional: an explicit, publicly documented intermediate
   * compatibility rule between two options (0..1), e.g. "nucléaire" vs
   * "mix" might be defined as 0.5-compatible by a stated methodology. Absent
   * means the default binary rule applies — same option 1, different 0 —
   * never a guessed/subjective closeness. See calculateChoiceSimilarity.
   */
  compatibility?: Record<string, Record<string, number>>;
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
  /** Must match the question's answer_type — a likert position never carries an option_id, a choice/priority position never carries a numeric_score. */
  answer_type: QuestionAnswerType;
  /** likert only: -2..2, or null when the candidate's position is not documented ("Position non renseignée"). */
  numeric_score: number | null;
  /** choice only: the id of the QuestionOption the candidate has taken, or null when not documented. */
  option_id: string | null;
  /** Reserved for a future multi-select format; unused in V1 — see /methodologie and the data-model note in AGENTS work log. */
  option_ids?: string[] | null;
  explanation: string | null;
  source_url: string | null;
  /** Outlet or publication the source_url belongs to — derived from the URL, never guessed content. */
  source_name: string | null;
  /** ISO date this specific position was last checked against its source, or null when not tracked. */
  verified_at: string | null;
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
  /**
   * likert: -2..2 (0 = Neutre, a real answer). choice/priority: the id of
   * the chosen QuestionOption. `null` means skipped ("Sans opinion" / no
   * pick) and excludes the question entirely — never conflate with 0 or
   * with a genuine option pick.
   */
  value: number | string | null;
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
 * Optional per-theme weight multipliers. Omitted (or a theme absent from
 * the map) means weight 1 — every theme counts equally by default, with no
 * hidden editorial weighting. In practice this is populated from the
 * visitor's own answers to the "priority" questions (see
 * computeThemeWeightsFromPriorityAnswers) — never set editorially.
 */
export type ThemeWeightMap = Record<string, number>;

/**
 * How much documented candidate positions actually diverge on one
 * question — always computed from real positions on file, never
 * hardcoded per question. `null` when too few candidates have a
 * documented, comparable position to say anything meaningful (see
 * calculateQuestionDiscrimination), or when the question is a "priority"
 * type (no candidate ever has a position on those).
 */
export type QuestionDiscrimination = "departage" | "proches" | null;

export const QUESTION_DISCRIMINATION_LABELS: Record<Exclude<QuestionDiscrimination, null>, string> = {
  departage: "Cette question départage fortement les candidats.",
  proches: "Les candidats sont plutôt proches sur ce sujet.",
};

export interface CandidateMatchResult {
  candidate: Candidate;
  /** 0-100, or null if no theme was comparable at all for this candidate. */
  score: number | null;
  /** Count of the user's answered likert/choice questions — "priority" answers are never candidate-comparable, so they never enter this count. */
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
