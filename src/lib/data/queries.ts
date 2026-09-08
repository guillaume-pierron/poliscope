import "server-only";
import { statSync } from "node:fs";
import { join } from "node:path";
import type {
  Candidate,
  CandidatePosition,
  MeasureAnalysis,
  MeasureAnalysisBundle,
  MeasureAssumption,
  MeasureBudgetEstimate,
  MeasureImpact,
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
import { measureAnalysisBundles as localMeasureAnalysisBundles } from "./local/measure-analyses";

/**
 * Data access layer. Polysia ships with a fully-featured local demo
 * dataset (src/lib/data/local) so the app works with zero configuration.
 * When Supabase credentials are present (see .env.example), every read
 * transparently switches to Postgres instead — same shapes, same callers.
 * Any Supabase error falls back to the local dataset rather than crashing
 * a page, which keeps the demo resilient while a real database is set up.
 */

function withParty(candidate: Candidate): Candidate {
  return { ...candidate, party: localParties.find((p) => p.id === candidate.party_id) };
}

/**
 * En développement uniquement : ajoute à `photo_url` un paramètre dérivé de
 * la date de modification du fichier. Sans ça, remplacer une photo dans
 * public/candidates/ ne change pas son URL, et le cache disque de
 * l'optimiseur d'images de Next (.next/dev/cache/images, qui survit aux
 * redémarrages) continue de servir l'ancien fichier tant qu'une variante
 * (taille, densité d'écran) n'a jamais été demandée — d'où l'actualisation
 * tantôt immédiate, tantôt à retardement, selon la variante déjà en cache.
 *
 * Jamais en production : les déploiements sont immuables, ce problème ne
 * s'y pose pas, et lire le disque à chaque requête n'y aurait aucun intérêt.
 */
function withDevPhotoCacheBust(candidate: Candidate): Candidate {
  if (process.env.NODE_ENV === "production") return candidate;
  const url = candidate.photo_url;
  if (!url || !url.startsWith("/")) return candidate;
  try {
    const { mtimeMs } = statSync(join(process.cwd(), "public", url));
    return { ...candidate, photo_url: `${url}?v=${Math.round(mtimeMs)}` };
  } catch {
    // Fichier absent (avatar de repli aux initiales) : rien à faire.
    return candidate;
  }
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
      if (data && data.length) return (data as Candidate[]).map(withDevPhotoCacheBust);
    } catch {
      // fall through
    }
  }
  return localCandidates.map(withParty).map(withDevPhotoCacheBust);
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
      if (data) return withDevPhotoCacheBust(data as Candidate);
    } catch {
      // fall through
    }
  }
  const candidate = localGetCandidateBySlug(slug);
  return candidate ? withDevPhotoCacheBust(withParty(candidate)) : undefined;
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

/**
 * "Passage au réel" — lecture publique. Ne renvoie jamais un brouillon : la
 * RLS Supabase restreint déjà `measure_analyses`/tables filles à
 * `status = 'published'` pour la clé anonyme (voir la migration), et le
 * fallback local applique le même filtre pour rester cohérent en démo.
 * Le back-office (lib/admin/data.ts) passe par le client service_role, qui
 * voit tous les statuts, y compris les brouillons.
 */
export async function getPublishedMeasureAnalysisBundles(): Promise<MeasureAnalysisBundle[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      const [{ data: analyses, error: e1 }, { data: budgets, error: e2 }, { data: impacts, error: e3 }, { data: assumptions, error: e4 }] =
        await Promise.all([
          supabase.from("measure_analyses").select("*").eq("status", "published"),
          supabase.from("measure_budget_estimates").select("*"),
          supabase.from("measure_impacts").select("*"),
          supabase.from("measure_assumptions").select("*"),
        ]);
      if (e1 || e2 || e3 || e4) throw e1 ?? e2 ?? e3 ?? e4;
      if (analyses && analyses.length) {
        const publishedIds = new Set((analyses as MeasureAnalysis[]).map((a) => a.id));
        return (analyses as MeasureAnalysis[]).map((analysis) => ({
          analysis,
          budgetEstimates: ((budgets ?? []) as MeasureBudgetEstimate[]).filter(
            (b) => b.measure_analysis_id === analysis.id && publishedIds.has(analysis.id)
          ),
          impacts: ((impacts ?? []) as MeasureImpact[]).filter((i) => i.measure_analysis_id === analysis.id),
          assumptions: ((assumptions ?? []) as MeasureAssumption[]).filter(
            (a) => a.measure_analysis_id === analysis.id
          ),
        }));
      }
    } catch {
      // fall through to local demo data
    }
  }
  return localMeasureAnalysisBundles.filter((b) => b.analysis.status === "published");
}

export async function getPublishedMeasureAnalysisBundleForProposal(
  proposalId: string
): Promise<MeasureAnalysisBundle | null> {
  const bundles = await getPublishedMeasureAnalysisBundles();
  return bundles.find((b) => b.analysis.proposal_id === proposalId) ?? null;
}

export async function getProposalById(id: string): Promise<Proposal | undefined> {
  const all = await getProposals();
  return all.find((p) => p.id === id);
}
