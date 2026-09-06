import "server-only";
import type {
  Candidate,
  CandidatePosition,
  Party,
  Poll,
  PollScenario,
  PollResult,
  Proposal,
  Question,
  Theme,
} from "@/lib/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { activeElection } from "./local/elections";
import { parties as localParties } from "./local/parties";
import { themes as localThemes, getThemeBySlug as localGetThemeBySlug } from "./local/themes";
import { candidates as localCandidates, getCandidateBySlug as localGetCandidateBySlug } from "./local/candidates";
import { questions as localQuestions } from "./local/questions";
import { candidatePositions as localPositions } from "./local/positions";
import { proposals as localProposals } from "./local/proposals";
import {
  polls as localPolls,
  pollScenarios as localPollScenarios,
  pollResults as localPollResults,
} from "./local/polls";

/**
 * Data access layer. Poliscope ships with a fully-featured local demo
 * dataset (src/lib/data/local) so the app works with zero configuration.
 * When Supabase credentials are present (see .env.example), every read
 * transparently switches to Postgres instead — same shapes, same callers.
 * Any Supabase error falls back to the local dataset rather than crashing
 * a page, which keeps the demo resilient while a real database is set up.
 */

function withParty(candidate: Candidate): Candidate {
  return { ...candidate, party: localParties.find((p) => p.id === candidate.party_id) };
}

export async function getActiveElection() {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      const { data, error } = await supabase
        .from("elections")
        .select("*")
        .eq("is_active", true)
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      if (data) return data;
    } catch {
      // fall through to local demo data
    }
  }
  return activeElection;
}

export async function getParties(): Promise<Party[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      const { data, error } = await supabase.from("parties").select("*");
      if (error) throw error;
      if (data && data.length) return data;
    } catch {
      // fall through
    }
  }
  return localParties;
}

export async function getThemes(): Promise<Theme[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      const { data, error } = await supabase
        .from("themes")
        .select("*")
        .order("order_index");
      if (error) throw error;
      if (data && data.length) return data;
    } catch {
      // fall through
    }
  }
  return localThemes;
}

export async function getThemeBySlug(slug: string): Promise<Theme | undefined> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      const { data, error } = await supabase
        .from("themes")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      if (data) return data;
    } catch {
      // fall through
    }
  }
  return localGetThemeBySlug(slug);
}

export async function getCandidates(): Promise<Candidate[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      const { data, error } = await supabase
        .from("candidates")
        .select("*, party:parties(*)")
        .order("order_index");
      if (error) throw error;
      if (data && data.length) return data as Candidate[];
    } catch {
      // fall through
    }
  }
  return localCandidates.map(withParty);
}

export async function getCandidateBySlug(slug: string): Promise<Candidate | undefined> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      const { data, error } = await supabase
        .from("candidates")
        .select("*, party:parties(*)")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      if (data) return data as Candidate;
    } catch {
      // fall through
    }
  }
  const candidate = localGetCandidateBySlug(slug);
  return candidate ? withParty(candidate) : undefined;
}

/**
 * Only "active" questions are served — a question can be prepared (typed,
 * sourced, ready) without being asked in the current questionnaire yet,
 * which is what lets a future "Affiner mon Match" unlock more questions per
 * theme without a breaking change here.
 */
export async function getQuestions(): Promise<Question[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      const { data, error } = await supabase
        .from("questions")
        .select("*, theme:themes(*)")
        .eq("is_active", true)
        .order("order_index");
      if (error) throw error;
      if (data && data.length) return data as Question[];
    } catch {
      // fall through
    }
  }
  return localQuestions
    .filter((q) => q.is_active)
    .map((q) => ({ ...q, theme: localGetThemeBySlug(q.theme_id.replace("theme-", "")) }));
}

export async function getAllPositions(): Promise<CandidatePosition[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      const { data, error } = await supabase.from("candidate_positions").select("*");
      if (error) throw error;
      if (data && data.length) return data;
    } catch {
      // fall through
    }
  }
  return localPositions;
}

export async function getPositionsForCandidate(candidateId: string): Promise<CandidatePosition[]> {
  const all = await getAllPositions();
  return all.filter((p) => p.candidate_id === candidateId);
}

export async function getProposals(): Promise<Proposal[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      const { data, error } = await supabase
        .from("proposals")
        .select("*, theme:themes(*)")
        .order("published_at", { ascending: false });
      if (error) throw error;
      if (data && data.length) return data as Proposal[];
    } catch {
      // fall through
    }
  }
  return localProposals;
}

export async function getProposalsForCandidate(candidateId: string): Promise<Proposal[]> {
  const all = await getProposals();
  return all.filter((p) => p.candidate_id === candidateId);
}

export async function getPolls(): Promise<Poll[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      const { data, error } = await supabase
        .from("polls")
        .select("*")
        .order("published_at", { ascending: false });
      if (error) throw error;
      if (data && data.length) return data;
    } catch {
      // fall through
    }
  }
  return [...localPolls].sort((a, b) => (a.published_at < b.published_at ? 1 : -1));
}

export interface HeadlinePoll {
  poll: Poll;
  scenario: PollScenario;
  results: PollResult[];
}

/**
 * The single most recent poll's headline scenario (order_index 0), for the
 * homepage teaser. Never blends hypotheses — same rule as /sondages — and
 * returns null rather than a guess when no real poll/scenario/result exists.
 */
export async function getHomeHeadlinePoll(): Promise<HeadlinePoll | null> {
  const polls = await getPolls();
  const poll = polls[0];
  if (!poll) return null;

  const scenarios = (await getPollScenarios())
    .filter((s) => s.poll_id === poll.id)
    .sort((a, b) => a.order_index - b.order_index);
  const scenario = scenarios[0];
  if (!scenario) return null;

  const results = await getPollResults(scenario.id);
  if (results.length === 0) return null;

  return { poll, scenario, results };
}

export async function getPollScenarios(): Promise<PollScenario[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      const { data, error } = await supabase
        .from("poll_scenarios")
        .select("*")
        .order("order_index");
      if (error) throw error;
      if (data && data.length) return data;
    } catch {
      // fall through
    }
  }
  return [...localPollScenarios].sort((a, b) => a.order_index - b.order_index);
}

/**
 * Résultats d'un scénario précis (une hypothèse) — jamais d'un sondage entier,
 * pour ne jamais risquer de mélanger deux hypothèses distinctes.
 */
export async function getPollResults(scenarioId: string): Promise<PollResult[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      const { data, error } = await supabase
        .from("poll_results")
        .select("*")
        .eq("scenario_id", scenarioId);
      if (error) throw error;
      if (data && data.length) return data;
    } catch {
      // fall through
    }
  }
  return localPollResults.filter((r) => r.scenario_id === scenarioId);
}
