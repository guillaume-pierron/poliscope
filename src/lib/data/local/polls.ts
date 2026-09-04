import type { Poll, PollScenario, PollResult } from "@/lib/types";

/**
 * No demo poll data ships by default. Inventing vote-intention numbers and
 * attaching them to real candidates — even labelled "démonstration" — risks
 * being mistaken for genuine polling once real names are on the site. The
 * structure (this file, the /sondages page, the trend chart) is ready to
 * receive real, sourced polls via Supabase as soon as they're available.
 *
 * A poll can carry several scenarios (first-round hypotheses with different
 * candidate rosters, or several second-round duels). Scenarios are never
 * merged: each one owns its own results, scoped by scenario_id.
 */
export const polls: Poll[] = [];
export const pollScenarios: PollScenario[] = [];
export const pollResults: PollResult[] = [];

export function getScenariosForPoll(pollId: string) {
  return pollScenarios
    .filter((s) => s.poll_id === pollId)
    .sort((a, b) => a.order_index - b.order_index);
}

export function getResultsForScenario(scenarioId: string) {
  return pollResults.filter((r) => r.scenario_id === scenarioId);
}
