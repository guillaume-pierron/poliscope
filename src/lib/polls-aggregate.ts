import type { Candidate, Poll, PollResult, PollScenario } from "@/lib/types";

/**
 * Everything here works only from "premier tour" scenarios — the only ones
 * comparable across a multi-candidate snapshot. Second-round duels test a
 * different pair of candidates each time and are never folded into these
 * aggregates (see PollScenario: hypotheses are never mixed).
 *
 * All of this simply renders nothing when no premier-tour scenario exists
 * yet in the data — it must never fall back to inventing or estimating
 * numbers.
 */

export interface PollWithHeadline {
  poll: Poll;
  scenario: PollScenario;
  results: PollResult[];
}

/** The poll's earliest-ordered "premier tour" scenario, if it has one. */
export function headlinePremierTourScenario(
  scenarios: PollScenario[]
): PollScenario | null {
  const premierTour = scenarios.filter((s) => s.round === "premier_tour");
  if (premierTour.length === 0) return null;
  return [...premierTour].sort((a, b) => a.order_index - b.order_index)[0];
}

/** Every poll that has a premier-tour headline scenario, sorted most recent first. */
export function collectPremierTourHeadlines(
  polls: Poll[],
  scenariosByPoll: Record<string, PollScenario[]>,
  resultsByScenario: Record<string, PollResult[]>
): PollWithHeadline[] {
  const items: PollWithHeadline[] = [];
  for (const poll of polls) {
    const scenario = headlinePremierTourScenario(scenariosByPoll[poll.id] ?? []);
    if (!scenario) continue;
    items.push({ poll, scenario, results: resultsByScenario[scenario.id] ?? [] });
  }
  return items.sort((a, b) => (a.poll.published_at < b.poll.published_at ? 1 : -1));
}

export interface SnapshotEntry {
  candidate: Candidate;
  average: number;
  trend: number | null;
  pollCount: number;
}

/**
 * Simple mean of a candidate's score across the last `windowSize` premier-
 * tour headline polls, plus the momentum vs. the same rolling average one
 * poll earlier — real arithmetic on real numbers, no smoothing beyond a
 * plain average, no invented weighting.
 */
export function computeSnapshot(
  headlines: PollWithHeadline[],
  candidates: Candidate[],
  windowSize = 5
): SnapshotEntry[] {
  if (headlines.length === 0) return [];
  const window = headlines.slice(0, windowSize);

  const entries: SnapshotEntry[] = [];
  for (const candidate of candidates) {
    const inWindow = window
      .map((h) => h.results.find((r) => r.candidate_id === candidate.id)?.value)
      .filter((v): v is number => v !== undefined);
    if (inWindow.length === 0) continue;

    const average = mean(inWindow);

    let trend: number | null = null;
    if (headlines.length > windowSize) {
      const previousWindow = headlines
        .slice(1, windowSize + 1)
        .map((h) => h.results.find((r) => r.candidate_id === candidate.id)?.value)
        .filter((v): v is number => v !== undefined);
      if (previousWindow.length > 0) trend = average - mean(previousWindow);
    } else if (window.length > 1) {
      const latestValue = window[0].results.find((r) => r.candidate_id === candidate.id)?.value;
      const restAverage = mean(
        window
          .slice(1)
          .map((h) => h.results.find((r) => r.candidate_id === candidate.id)?.value)
          .filter((v): v is number => v !== undefined)
      );
      if (latestValue !== undefined && !Number.isNaN(restAverage)) trend = latestValue - restAverage;
    }

    entries.push({ candidate, average, trend, pollCount: inWindow.length });
  }

  return entries.sort((a, b) => b.average - a.average);
}

function mean(values: number[]): number {
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}
