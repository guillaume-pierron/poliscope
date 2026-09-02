import type { Poll, PollResult } from "@/lib/types";
import { activeElection } from "./elections";
import { candidates } from "./candidates";

const findId = (slug: string) => candidates.find((c) => c.slug === slug)!.id;

export const polls: Poll[] = [
  {
    id: "poll-1",
    election_id: activeElection.id,
    institute: "Institut Demo Opinion",
    sponsor: "Le Journal Fictif",
    field_start: "2026-07-01",
    field_end: "2026-07-02",
    sample_size: 1502,
    method: "Échantillon représentatif interrogé en ligne, méthode des quotas (démonstration)",
    round: "premier_tour",
    published_at: "2026-07-03",
    is_demo: true,
  },
  {
    id: "poll-2",
    election_id: activeElection.id,
    institute: "Institut Demo Opinion",
    sponsor: "Le Journal Fictif",
    field_start: "2026-08-05",
    field_end: "2026-08-06",
    sample_size: 1487,
    method: "Échantillon représentatif interrogé en ligne, méthode des quotas (démonstration)",
    round: "premier_tour",
    published_at: "2026-08-07",
    is_demo: true,
  },
  {
    id: "poll-3",
    election_id: activeElection.id,
    institute: "Baromètre Fictif",
    sponsor: null,
    field_start: "2026-09-01",
    field_end: "2026-09-03",
    sample_size: 2011,
    method: "Échantillon représentatif interrogé par téléphone et en ligne (démonstration)",
    round: "premier_tour",
    published_at: "2026-09-04",
    is_demo: true,
  },
];

export const pollResults: PollResult[] = [
  // Poll 1
  { id: "pr-1-1", poll_id: "poll-1", candidate_id: findId("camille-martin"), value: 24, low: 22, high: 26 },
  { id: "pr-1-2", poll_id: "poll-1", candidate_id: findId("alexandre-leroy"), value: 27, low: 25, high: 29 },
  { id: "pr-1-3", poll_id: "poll-1", candidate_id: findId("sarah-moreau"), value: 16, low: 14, high: 18 },
  { id: "pr-1-4", poll_id: "poll-1", candidate_id: findId("thomas-bernard"), value: 19, low: 17, high: 21 },
  { id: "pr-1-5", poll_id: "poll-1", candidate_id: findId("nina-laurent"), value: 14, low: 12, high: 16 },
  // Poll 2
  { id: "pr-2-1", poll_id: "poll-2", candidate_id: findId("camille-martin"), value: 23, low: 21, high: 25 },
  { id: "pr-2-2", poll_id: "poll-2", candidate_id: findId("alexandre-leroy"), value: 28, low: 26, high: 30 },
  { id: "pr-2-3", poll_id: "poll-2", candidate_id: findId("sarah-moreau"), value: 17, low: 15, high: 19 },
  { id: "pr-2-4", poll_id: "poll-2", candidate_id: findId("thomas-bernard"), value: 18, low: 16, high: 20 },
  { id: "pr-2-5", poll_id: "poll-2", candidate_id: findId("nina-laurent"), value: 14, low: 12, high: 16 },
  // Poll 3
  { id: "pr-3-1", poll_id: "poll-3", candidate_id: findId("camille-martin"), value: 22, low: 20, high: 24 },
  { id: "pr-3-2", poll_id: "poll-3", candidate_id: findId("alexandre-leroy"), value: 29, low: 27, high: 31 },
  { id: "pr-3-3", poll_id: "poll-3", candidate_id: findId("sarah-moreau"), value: 18, low: 16, high: 20 },
  { id: "pr-3-4", poll_id: "poll-3", candidate_id: findId("thomas-bernard"), value: 17, low: 15, high: 19 },
  { id: "pr-3-5", poll_id: "poll-3", candidate_id: findId("nina-laurent"), value: 14, low: 12, high: 16 },
];

export function getResultsForPoll(pollId: string) {
  return pollResults.filter((r) => r.poll_id === pollId);
}
