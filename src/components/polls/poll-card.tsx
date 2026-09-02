import { CandidateAvatar } from "@/components/candidates/candidate-avatar";
import { formatDate } from "@/lib/utils";
import type { Candidate, Poll, PollResult } from "@/lib/types";

export function PollCard({
  poll,
  results,
  candidates,
}: {
  poll: Poll;
  results: PollResult[];
  candidates: Candidate[];
}) {
  const sorted = [...results].sort((a, b) => b.value - a.value);
  const maxValue = Math.max(...results.map((r) => r.value), 1);

  return (
    <div className="rounded-xl border border-border bg-background p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold">{poll.institute}</p>
          <p className="text-sm text-muted">
            {poll.round === "premier_tour" ? "Premier tour" : "Second tour"} · Publié le{" "}
            {formatDate(poll.published_at)}
          </p>
        </div>
        <p className="text-xs text-muted-2">
          Terrain du {formatDate(poll.field_start)} au {formatDate(poll.field_end)}
        </p>
      </div>

      <div className="mt-5 space-y-3">
        {sorted.map((result) => {
          const candidate = candidates.find((c) => c.id === result.candidate_id);
          if (!candidate) return null;
          return (
            <div key={result.id} className="flex items-center gap-3">
              <CandidateAvatar name={candidate.name} color={candidate.party?.color} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center justify-between">
                  <p className="truncate text-sm font-medium">{candidate.name}</p>
                  <p className="font-mono text-sm font-semibold tabular-nums">
                    {result.value}%
                    {result.low !== null && result.high !== null && (
                      <span className="ml-1 text-xs font-normal text-muted-2">
                        ({result.low}–{result.high})
                      </span>
                    )}
                  </p>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-strong">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(result.value / maxValue) * 100}%`,
                      background: candidate.party?.color ?? "var(--primary)",
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-5 text-xs text-muted-2">
        {poll.sample_size.toLocaleString("fr-FR")} personnes interrogées ·{" "}
        {poll.sponsor ? `Commanditaire : ${poll.sponsor} · ` : ""}
        {poll.method}
      </p>
    </div>
  );
}
