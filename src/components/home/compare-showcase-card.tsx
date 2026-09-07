import Link from "next/link";
import { ArrowRight, ChevronRight, Scale } from "lucide-react";
import { CandidateAvatar } from "@/components/candidates/candidate-avatar";
import { HandNote } from "@/components/ui/hand-note";
import { ThemeIcon } from "@/lib/theme-icons";
import { cn } from "@/lib/utils";
import { VERDICT_LABELS, type ThemeVerdict } from "@/lib/compare";
import type { Candidate, Theme } from "@/lib/types";

const VERDICT_TONE: Record<ThemeVerdict, string> = {
  accord: "bg-success-soft text-success",
  desaccord: "bg-danger-soft text-danger",
  nuance: "bg-accent-soft text-accent",
  inconnu: "bg-surface-strong text-muted",
};

export function CompareShowcaseCard({
  candidates,
  rows,
  className,
}: {
  candidates: { a: Candidate; b: Candidate } | null;
  /** Thèmes réellement comparables pour cette paire — jamais un verdict deviné. */
  rows: { theme: Theme; verdict: ThemeVerdict }[];
  className?: string;
}) {
  const href = candidates ? `/comparer/${candidates.a.slug}-vs-${candidates.b.slug}` : "/comparer";

  return (
    <Link
      href={href}
      className={cn(
        "focus-ring group relative flex flex-col overflow-hidden rounded-[22px] border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[0_20px_44px_-26px_rgba(15,23,41,0.28)]",
        className
      )}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-primary/[0.06]"
      />

      <div className="relative flex items-start gap-3.5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          <Scale size={20} />
        </span>
        <div className="min-w-0">
          <h3 className="font-serif text-[1.6rem] font-semibold leading-none tracking-tight">
            Comparer
          </h3>
          <p className="mt-2 text-sm font-semibold">
            Deux candidats. Leurs positions, côte à côte.
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            Comprenez rapidement leurs différences et points d&apos;accord sur les grands enjeux de
            2027.
          </p>
        </div>
      </div>

      {candidates && (
        <div className="relative mt-4 flex items-center gap-3">
          <Side candidate={candidates.a} />
          <span className="shrink-0 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary">
            VS
          </span>
          <Side candidate={candidates.b} align="right" />
        </div>
      )}

      {rows.length > 0 ? (
        <ul className="relative mt-4 space-y-2">
          {rows.map(({ theme, verdict }) => (
            <li
              key={theme.id}
              className="flex items-center gap-2.5 rounded-xl border border-border bg-surface px-3 py-2.5"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-card text-primary">
                <ThemeIcon icon={theme.icon} className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-medium">{theme.name}</span>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium",
                  VERDICT_TONE[verdict]
                )}
              >
                {VERDICT_LABELS[verdict]}
              </span>
              <ChevronRight size={15} className="shrink-0 text-muted-2" />
            </li>
          ))}
        </ul>
      ) : (
        candidates && (
          <p className="relative mt-4 rounded-xl border border-dashed border-border-strong px-3 py-2.5 text-xs text-muted-2">
            Pas encore assez de positions documentées en commun pour ces deux candidats.
          </p>
        )
      )}

      <div className="relative mt-4 flex items-end justify-between gap-3">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary-soft px-4 py-2.5 text-sm font-semibold text-primary transition-colors group-hover:bg-primary-soft/80">
          Comparer deux candidats
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </span>
        <HandNote className="hidden w-[9rem] -rotate-3 pb-1 text-right leading-tight sm:block">
          Des débats plus clairs pour mieux choisir
        </HandNote>
      </div>
    </Link>
  );
}

function Side({ candidate, align = "left" }: { candidate: Candidate; align?: "left" | "right" }) {
  return (
    <span
      className={cn(
        "flex min-w-0 flex-1 items-center gap-2.5",
        align === "right" && "flex-row-reverse text-right"
      )}
    >
      <CandidateAvatar
        name={candidate.name}
        color={candidate.party?.color}
        photoUrl={candidate.photo_url}
        size="sm"
      />
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold">{candidate.name}</span>
        <span className="block truncate text-xs text-muted-2">
          {candidate.party?.name ?? "Sans étiquette"}
        </span>
      </span>
    </span>
  );
}
