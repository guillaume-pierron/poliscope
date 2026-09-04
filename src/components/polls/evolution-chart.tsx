"use client";

import { useMemo, useState } from "react";
import { TrendChart } from "@/components/polls/trend-chart";
import { cn } from "@/lib/utils";
import type { Candidate, Poll, PollResult } from "@/lib/types";
import type { PollWithHeadline } from "@/lib/polls-aggregate";

const PERIODS = [
  { id: "30j", label: "30 jours", days: 30 },
  { id: "3m", label: "3 mois", days: 90 },
  { id: "6m", label: "6 mois", days: 180 },
  { id: "1a", label: "1 an", days: 365 },
] as const;

export function EvolutionChart({
  headlines,
  candidates,
}: {
  headlines: PollWithHeadline[];
  candidates: Candidate[];
}) {
  const [periodId, setPeriodId] = useState<(typeof PERIODS)[number]["id"]>("3m");

  const testedCandidateIds = useMemo(() => {
    const ids = new Set<string>();
    for (const h of headlines) for (const r of h.results) ids.add(r.candidate_id);
    return ids;
  }, [headlines]);
  const testedCandidates = candidates.filter((c) => testedCandidateIds.has(c.id));

  const period = PERIODS.find((p) => p.id === periodId)!;
  const cutoff = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - period.days);
    return d.toISOString().slice(0, 10);
  }, [period.days]);

  const filtered = headlines.filter((h) => h.poll.published_at >= cutoff);

  const polls: Poll[] = filtered.map((h) => h.poll);
  const resultsByPoll: Record<string, PollResult[]> = {};
  for (const h of filtered) resultsByPoll[h.poll.id] = h.results;

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold">Évolution des intentions de vote</h2>
        <div className="flex gap-1 rounded-lg bg-surface p-1">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPeriodId(p.id)}
              className={cn(
                "focus-ring rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                p.id === periodId ? "bg-card shadow-sm" : "text-muted hover:text-foreground"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-1 text-xs text-muted-2">Moyenne des sondages — principaux candidats.</p>

      <div className="mt-4">
        {polls.length < 2 ? (
          <p className="py-10 text-center text-sm text-muted-2">
            Pas encore assez de sondages de premier tour sur cette période pour tracer une évolution.
          </p>
        ) : (
          <TrendChart polls={polls} resultsByPoll={resultsByPoll} candidates={testedCandidates} />
        )}
      </div>
    </div>
  );
}
