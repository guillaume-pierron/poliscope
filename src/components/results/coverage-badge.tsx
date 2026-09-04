import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { COVERAGE_LEVEL_LABELS, type CoverageLevel } from "@/lib/types";

const TONE: Record<CoverageLevel, string> = {
  elevee: "bg-success-soft text-success",
  moyenne: "bg-accent-soft text-accent",
  faible: "bg-surface-strong text-muted",
};

export function CoverageBadge({
  level,
  className,
}: {
  level: CoverageLevel;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        TONE[level],
        className
      )}
    >
      {COVERAGE_LEVEL_LABELS[level]}
    </span>
  );
}

/** Shown when a result rests on too little documented data to be read with confidence. */
export function ProvisionalResultBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent",
        className
      )}
    >
      <CircleAlert size={12} />
      Résultat provisoire
    </span>
  );
}
