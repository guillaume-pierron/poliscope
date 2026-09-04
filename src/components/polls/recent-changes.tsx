import { ArrowDown, ArrowUp } from "lucide-react";
import type { SnapshotEntry } from "@/lib/polls-aggregate";

export function RecentChanges({ entries, windowSize }: { entries: SnapshotEntry[]; windowSize: number }) {
  const withTrend = entries.filter((e) => e.trend !== null && e.trend !== 0);
  if (withTrend.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h2 className="text-sm font-semibold">Ce qui a changé récemment</h2>
      <ul className="mt-3 space-y-3">
        {withTrend.map((entry) => {
          const up = entry.trend! > 0;
          return (
            <li key={entry.candidate.id} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                    up ? "bg-success-soft text-success" : "bg-danger-soft text-danger"
                  }`}
                >
                  {up ? <ArrowUp size={13} /> : <ArrowDown size={13} />}
                </span>
                <div className="min-w-0">
                  <p
                    className="truncate text-sm font-semibold"
                    style={{ color: entry.candidate.party?.color }}
                  >
                    {entry.candidate.name}
                  </p>
                  <p className={`text-xs font-medium ${up ? "text-success" : "text-danger"}`}>
                    {up ? "+" : ""}
                    {entry.trend!.toFixed(1)} pt vs la période précédente
                  </p>
                </div>
              </div>
              <span className="shrink-0 font-mono text-sm font-semibold tabular-nums">
                {entry.average.toFixed(1)} %
              </span>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-xs text-muted-2">
        Évolutions calculées sur une moyenne des {windowSize} derniers sondages.
      </p>
    </div>
  );
}
