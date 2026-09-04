import Link from "next/link";
import { ArrowRight, ArrowDown, ArrowUp, Clock } from "lucide-react";
import { CandidateAvatar } from "@/components/candidates/candidate-avatar";
import { formatDate } from "@/lib/utils";
import type { SnapshotEntry } from "@/lib/polls-aggregate";

export function TodaySnapshot({
  entries,
  windowSize,
  latestPublishedAt,
}: {
  entries: SnapshotEntry[];
  windowSize: number;
  latestPublishedAt: string;
}) {
  if (entries.length === 0) return null;

  const top = entries.slice(0, 5);
  const rest = entries.slice(5);
  const pollsUsed = Math.min(windowSize, Math.max(...entries.map((e) => e.pollCount)));

  return (
    <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold">Les intentions de vote aujourd&apos;hui</h2>
        <p className="flex items-center gap-1.5 text-xs text-muted-2">
          <Clock size={13} />
          Dernière mise à jour : {formatDate(latestPublishedAt)}
        </p>
      </div>
      <p className="mt-1 text-sm text-muted">
        Moyenne des {pollsUsed} derniers sondages de premier tour — au {formatDate(latestPublishedAt)}.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {top.map((entry) => (
          <div key={entry.candidate.id} className="rounded-xl border border-border bg-surface p-4">
            <div className="flex items-center gap-2.5">
              <CandidateAvatar
                name={entry.candidate.name}
                color={entry.candidate.party?.color}
                photoUrl={entry.candidate.photo_url}
                size="sm"
              />
              <p
                className="min-w-0 truncate text-sm font-semibold"
                style={{ color: entry.candidate.party?.color }}
              >
                {entry.candidate.name}
              </p>
            </div>
            <p className="mt-2.5 font-mono text-2xl font-semibold tabular-nums">
              {entry.average.toFixed(1)} %
            </p>
            {entry.trend !== null && (
              <p
                className={`mt-0.5 flex items-center gap-1 text-xs font-medium ${
                  entry.trend > 0 ? "text-success" : entry.trend < 0 ? "text-danger" : "text-muted-2"
                }`}
              >
                {entry.trend > 0 ? (
                  <ArrowUp size={12} />
                ) : entry.trend < 0 ? (
                  <ArrowDown size={12} />
                ) : null}
                {entry.trend === 0 ? "Stable" : `${entry.trend > 0 ? "+" : ""}${entry.trend.toFixed(1)} pt`}
              </p>
            )}
          </div>
        ))}
      </div>

      {rest.length > 0 && (
        <p className="mt-4 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-muted">
          <span className="text-muted-2">Autres candidats :</span>
          {rest.map((entry, i) => (
            <span key={entry.candidate.id}>
              {entry.candidate.name} {entry.average.toFixed(1)} %{i < rest.length - 1 ? " · " : ""}
            </span>
          ))}
        </p>
      )}

      <Link
        href="#sondages-liste"
        className="focus-ring mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
      >
        Voir le détail
        <ArrowRight size={14} />
      </Link>
    </section>
  );
}
