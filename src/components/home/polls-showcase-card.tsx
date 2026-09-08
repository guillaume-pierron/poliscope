import Link from "next/link";
import { ArrowRight, BarChart3 } from "lucide-react";
import { CandidateAvatar } from "@/components/candidates/candidate-avatar";
import { HandNote } from "@/components/ui/hand-note";
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
  const top = headline ? [...headline.results].sort((a, b) => b.value - a.value).slice(0, 2) : [];
  const maxValue = Math.max(...top.map((r) => r.value), 1);

  return (
    <Link
      href="/sondages"
      className={cn(
        // Fond blanc et non crème : le bandeau du simulateur, juste en
        // dessous, est crème sur toute la largeur — la même couleur ici
        // faisait lire les deux comme une seule zone continue.
        "focus-ring group relative flex flex-col overflow-hidden rounded-[22px] border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[0_20px_44px_-26px_rgba(15,23,41,0.28)]",
        className
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3.5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">
            <BarChart3 size={20} />
          </span>
          <div className="min-w-0">
            <h3 className="font-serif text-[1.6rem] font-semibold leading-none tracking-tight">
              Sondages
            </h3>
            <p className="mt-2 text-sm font-semibold">Suivez la course à 2027.</p>
            {/* Un seul scénario est montré ici : les hypothèses ne sont jamais
                mélangées, même dans un aperçu. */}
            <p className="mt-1 text-sm leading-relaxed text-muted">
              Les dernières intentions de vote, scénario par scénario, sans mélanger les
              hypothèses.
            </p>
          </div>
        </div>

        {headline && (
          <span className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            <span className="text-muted-2">
              Dernière vague
              <span className="ml-1 font-medium text-foreground">
                {formatDate(headline.poll.published_at)}
              </span>
            </span>
          </span>
        )}
      </div>

      {headline && top.length > 0 ? (
        <>
          <ul className="mt-4 space-y-3">
            {top.map((result) => {
              const candidate = candidates.find((c) => c.id === result.candidate_id);
              if (!candidate) return null;
              const color = candidate.party?.color ?? "var(--primary)";
              return (
                <li key={result.id} className="flex items-center gap-3">
                  <CandidateAvatar
                    name={candidate.name}
                    color={candidate.party?.color}
                    photoUrl={candidate.photo_url}
                    size="sm"
                    className="ring-2 ring-primary/35"
                  />
                  <span className="w-[104px] shrink-0 truncate text-sm font-medium">
                    {candidate.name}
                  </span>
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-surface-strong">
                    <span
                      className="block h-full rounded-full"
                      style={{ width: `${(result.value / maxValue) * 100}%`, background: color }}
                    />
                  </span>
                  <span
                    className="w-12 shrink-0 text-right font-mono text-sm font-semibold tabular-nums"
                    style={{ color }}
                  >
                    {result.value}%
                  </span>
                </li>
              );
            })}
          </ul>

          <p className="mt-4 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-muted-2">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Dernière mise à jour&nbsp;: {formatDate(headline.poll.published_at)} · Source&nbsp;:{" "}
            {headline.poll.institute} — {headline.scenario.label}
          </p>
        </>
      ) : (
        <p className="mt-5 text-sm text-muted-2">Aucun sondage disponible pour l&apos;instant.</p>
      )}

      <div className="mt-4 flex items-end justify-between gap-3">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary-soft px-4 py-2.5 text-sm font-semibold text-primary transition-colors group-hover:bg-primary-soft/80">
          Voir les sondages
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </span>
        <HandNote className="hidden w-[8.5rem] -rotate-3 pb-1 text-right leading-tight sm:block">
          Une autre façon de voir 2027
        </HandNote>
      </div>
    </Link>
  );
}
