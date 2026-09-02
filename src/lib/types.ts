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
  round: "premier_tour" | "second_tour";
  published_at: string;
  is_demo: boolean;
}

export interface PollResult {
  id: string;
  poll_id: string;
  candidate_id: string;
  value: number;
  low: number | null;
  high: number | null;
}

/** A user's answer captured client-side only. Never persisted server-side. */
export interface UserAnswer {
  question_id: string;
  /** -2..2, or null when the question was skipped. */
  value: number | null;
}

export interface CandidateMatchResult {
  candidate: Candidate;
  /** 0-100, or null if no comparable data exists for this candidate. */
  score: number | null;
  answeredQuestions: number;
  comparableQuestions: number;
  agreements: { question: Question; similarity: number }[];
  disagreements: { question: Question; similarity: number }[];
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
