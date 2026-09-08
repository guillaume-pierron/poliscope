import type { Poll, PollScenario, PollResult } from "@/lib/types";
import { activeElection } from "./elections";
import { candidates } from "./candidates";

/**
 * A poll can carry several scenarios (first-round hypotheses with different
 * candidate rosters, or several second-round duels). Scenarios are never
 * merged: each one owns its own results, scoped by scenario_id.
 *
 * Every result below is a real, sourced figure from the Ipsos bva CESI /
 * Le Parisien poll of September 2026 — never invented. The full report
 * tested 6 first-round hypotheses; only the one actually requested
 * ("R. Glucksmann et E. Philippe") is entered here, and only for the
 * candidates Polysia already tracks (Arthaud, Roussel, Dupont-Aignan and
 * Zemmour scored in this hypothesis too, per the source, but have no
 * candidate profile on this site and are deliberately left out rather than
 * added as thin, unsourced profiles just to hold one number).
 */

const poll1: Poll = {
  id: "poll-ipsos-bva-le-parisien-2026-09",
  election_id: activeElection.id,
  institute: "Ipsos bva CESI école d'ingénieurs",
  sponsor: "Le Parisien",
  field_start: "2026-08-31",
  field_end: "2026-09-02",
  // Échantillon total interrogé (voir fiche méthodologique) ; chaque
  // hypothèse a ensuite sa propre base de répondants "certains d'aller
  // voter, exprimés" (1 005 personnes pour ce scénario), plus fine que ce
  // seul champ ne peut le représenter.
  sample_size: 1500,
  method:
    "Échantillon interrogé en ligne (Access panel Ipsos), représentatif de la population française de 18 ans et plus inscrite sur les listes électorales, selon la méthode des quotas (sexe, âge, profession, catégorie d'agglomération, région). Base pour cette hypothèse : 1 005 personnes certaines d'aller voter et exprimées.",
  source_name: "Ipsos — Notice technique Commission des sondages",
  source_url:
    "https://www.commission-des-sondages.fr/notices/files/notices/2026/septembre/10250-pres-iv-ipsos-bva-le-parisien-5-septembre.pdf",
  published_at: "2026-09-05",
  is_demo: false,
};

const scenario1: PollScenario = {
  id: "poll-scenario-ipsos-2026-09-glucksmann-philippe",
  poll_id: poll1.id,
  label: "Hypothèse R. Glucksmann et E. Philippe",
  round: "premier_tour",
  order_index: 0,
};

/** [candidateSlug, value, low, high] — low/high are the poll's own published confidence interval (95%), never recomputed. */
const resultRows: [string, number, number, number][] = [
  ["marine-le-pen", 34.5, 31.6, 37.4],
  ["edouard-philippe", 19, 16.6, 21.4],
  ["jean-luc-melenchon", 15, 12.8, 17.2],
  ["raphael-glucksmann", 12, 10, 14],
  ["bruno-retailleau", 7.5, 5.9, 9.1],
  ["marine-tondelier", 4, 2.8, 5.2],
];

const scenario1Results: PollResult[] = resultRows.map(([slug, value, low, high], index) => {
  const candidate = candidates.find((c) => c.slug === slug)!;
  return {
    id: `poll-result-ipsos-2026-09-gp-${index + 1}`,
    scenario_id: scenario1.id,
    candidate_id: candidate.id,
    value,
    low,
    high,
  };
});

export const polls: Poll[] = [poll1];
export const pollScenarios: PollScenario[] = [scenario1];
export const pollResults: PollResult[] = [...scenario1Results];

export function getScenariosForPoll(pollId: string) {
  return pollScenarios
    .filter((s) => s.poll_id === pollId)
    .sort((a, b) => a.order_index - b.order_index);
}

export function getResultsForScenario(scenarioId: string) {
  return pollResults.filter((r) => r.scenario_id === scenarioId);
}
