import Link from "next/link";
import { ArrowRight, SplitSquareHorizontal } from "lucide-react";
import { CandidateAvatar } from "@/components/candidates/candidate-avatar";
import { ThemeIcon } from "@/lib/theme-icons";
import { cn } from "@/lib/utils";
import { VERDICT_LABELS, type ThemeVerdict } from "@/lib/compare";
import type { Candidate, Theme } from "@/lib/types";

const VERDICT_TONE: Record<ThemeVerdict, string> = {
  accord: "bg-success-soft text-success",
  desaccord: "bg-danger-soft text-danger",
  nuance: "bg-surface-strong text-muted",
  inconnu: "bg-surface-strong text-muted",
};

export function CompareShowcaseCard({
  candidates,
  agreement,
  disagreement,
  className,
}: {
  candidates: { a: Candidate; b: Candidate } | null;
  agreement: { theme: Theme; verdict: ThemeVerdict } | null;
  disagreement: { theme: Theme; verdict: ThemeVerdict } | null;
  className?: string;
}) {
  const href = candidates ? `/comparer/${candidates.a.slug}-vs-${candidates.b.slug}` : "/comparer";
  const rows = [disagreement, agreement].filter(
    (r): r is { theme: Theme; verdict: ThemeVerdict } => r !== null
  );

  return (
    <Link
      href={href}
      className={cn(
        "focus-ring group flex flex-col rounded-[20px] border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[0_20px_40px_-24px_rgba(15,23,41,0.25)]",
        className
      )}
    >
      <div className="flex items-center gap-1.5">
        <SplitSquareHorizontal className="text-primary" size={20} strokeWidth={1.75} />
        <h3 className="text-base font-semibold">Comparer</h3>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Deux candidats. Leurs différences, thème par thème.
      </p>

      {candidates && (
        <div className="mt-4 flex items-center justify-center gap-3">
          <CandidateAvatar
            name={candidates.a.name}
            color={candidates.a.party?.color}
            photoUrl={candidates.a.photo_url}
            size="sm"
          />
          <span className="text-xs font-semibold text-muted-2">VS</span>
          <CandidateAvatar
            name={candidates.b.name}
            color={candidates.b.party?.color}
            photoUrl={candidates.b.photo_url}
            size="sm"
          />
        </div>
      )}

      {rows.length > 0 && (
        <ul className="mt-4 space-y-2">
          {rows.map(({ theme, verdict }) => (
            <li
              key={theme.id}
              className="flex items-center justify-between gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-xs"
            >
              <span className="flex items-center gap-1.5 font-medium text-foreground/85">
                <ThemeIcon icon={theme.icon} className="h-3.5 w-3.5 text-muted-2" />
                {theme.name}
              </span>
              <span className={cn("rounded-full px-2 py-0.5 font-medium", VERDICT_TONE[verdict])}>
                {VERDICT_LABELS[verdict]}
              </span>
            </li>
          ))}
        </ul>
      )}

      <p className="focus-ring mt-4 flex items-center gap-1.5 text-sm font-medium text-primary">
        Comparer deux candidats
        <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
      </p>
    </Link>
  );
}
