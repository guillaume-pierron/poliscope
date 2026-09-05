import Link from "next/link";
import { ArrowUpRight, Lock, Sun } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Sparkle } from "@/components/ui/swoosh";
import { cn } from "@/lib/utils";

const PREVIEW_ROWS = [
  { label: "Candidat A", value: 72, tone: "bg-primary" },
  { label: "Candidat B", value: 58, tone: "bg-accent" },
  { label: "Candidat C", value: 41, tone: "bg-muted-2" },
] as const;

export function MatchShowcaseCard({
  questionCount,
  proposalCount,
  className,
}: {
  questionCount: number;
  proposalCount: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between rounded-[24px] border border-primary/15 bg-primary-soft/60 p-7 sm:p-8",
        className
      )}
    >
      <div>
        <div className="flex items-center gap-1.5">
          <h3 className="font-serif text-[1.7rem] font-semibold tracking-tight sm:text-[1.9rem]">
            Mon Match
          </h3>
          <Sparkle className="mt-1 h-3.5 w-3.5 shrink-0 text-primary" />
        </div>
        <p className="mt-1.5 text-[1.02rem] font-medium text-foreground/85">
          Quels candidats sont les plus proches de vos réponses&nbsp;?
        </p>
        <p className="mt-2.5 max-w-md text-sm leading-relaxed text-muted">
          Répondez à {questionCount} questions et comparez vos positions avec celles, documentées,
          des candidats.
        </p>

        <div className="mt-6 max-w-sm rounded-2xl border border-border bg-card p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-2">
            Aperçu d&apos;un résultat
          </p>
          <ul className="mt-3 space-y-3">
            {PREVIEW_ROWS.map((row) => (
              <li key={row.label} className="flex items-center gap-3">
                <span className="w-[84px] shrink-0 truncate text-sm font-medium text-foreground/85">
                  {row.label}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-strong">
                  <div
                    className={cn("h-full rounded-full transition-[width] duration-700 ease-out", row.tone)}
                    style={{ width: `${row.value}%` }}
                  />
                </div>
                <span className="w-9 shrink-0 text-right font-mono text-sm font-semibold tabular-nums">
                  {row.value}%
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-2">
            Exemple illustratif — vos résultats dépendent de vos réponses.
          </p>
        </div>
      </div>

      <div className="mt-7">
        <div className="flex flex-wrap items-center gap-4">
          <ButtonLink href="/match" variant="accent" size="lg">
            Faire mon Match
            <Sun size={17} />
          </ButtonLink>
          <p className="flex items-center gap-1.5 text-xs text-muted-2">
            <Lock size={12} />
            Sans inscription · résultats calculés sur votre appareil
          </p>
        </div>

        <Link
          href="/candidats"
          className="focus-ring group mt-5 flex items-center gap-1.5 border-t border-primary/15 pt-5 text-sm font-medium text-primary hover:underline"
        >
          Explorer les {proposalCount} propositions sourcées
          <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
