import Link from "next/link";
import { ArrowRight, LineChart } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { HeadlinePoll } from "@/lib/data/queries";
import type { Candidate } from "@/lib/types";

export function PollsShowcaseCard({
  headline,
  candidates,
  className,
}: {
  headline: HeadlinePoll | null;
  candidates: Candidate[];
  className?: string;
}) {
  const top = headline
    ? [...headline.results].sort((a, b) => b.value - a.value).slice(0, 2)
    : [];
  const maxValue = Math.max(...top.map((r) => r.value), 1);

  return (
    <Link
      href="/sondages"
      className={cn(
        "focus-ring group flex flex-col rounded-[20px] border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[0_20px_40px_-24px_rgba(15,23,41,0.25)]",
        className
      )}
    >
      <div className="flex items-center gap-1.5">
        <LineChart className="text-primary" size={20} strokeWidth={1.75} />
        <h3 className="text-base font-semibold">Sondages</h3>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Suivez la course à 2027 sans mélanger les scénarios.
      </p>

      {headline && top.length > 0 ? (
        <>
          <ul className="mt-4 space-y-2.5">
            {top.map((result) => {
              const candidate = candidates.find((c) => c.id === result.candidate_id);
              if (!candidate) return null;
              const color = candidate.party?.color ?? "var(--primary)";
              return (
                <li key={result.id} className="flex items-center gap-2.5">
                  <span className="w-[92px] shrink-0 truncate text-xs font-medium text-foreground/85">
                    {candidate.name}
                  </span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-strong">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${(result.value / maxValue) * 100}%`, background: color }}
                    />
                  </div>
                  <span
                    className="w-11 shrink-0 text-right font-mono text-xs font-semibold tabular-nums"
                    style={{ color }}
                  >
                    {result.value}%
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-2">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Dernière mise à jour : {formatDate(headline.poll.published_at)}
          </p>
        </>
      ) : (
        <p className="mt-4 text-sm text-muted-2">Aucun sondage disponible pour l&apos;instant.</p>
      )}

      <p className="focus-ring mt-4 flex items-center gap-1.5 text-sm font-medium text-primary">
        Voir les sondages
        <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
      </p>
    </Link>
  );
}
