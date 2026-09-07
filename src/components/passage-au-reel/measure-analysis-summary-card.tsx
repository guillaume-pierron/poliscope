import Link from "next/link";
import { AlertTriangle, Library } from "lucide-react";
import { CandidateAvatar } from "@/components/candidates/candidate-avatar";
import { ThemeIcon } from "@/lib/theme-icons";
import { formatCentral, formatRange } from "@/lib/passage-au-reel/format";
import { cn } from "@/lib/utils";
import { FeasibilityBadge, ConfidenceBadge } from "./badges";
import type { Candidate, MeasureAnalysisBundle, Proposal, Theme } from "@/lib/types";

/** Compact card for /passage-au-reel and the candidate-page teaser — never a full re-render of the fiche. */
export function MeasureAnalysisSummaryCard({
  bundle,
  proposal,
  candidate,
  theme,
  className,
}: {
  bundle: MeasureAnalysisBundle;
  proposal: Proposal;
  candidate: Candidate;
  theme: Theme | undefined;
  className?: string;
}) {
  const { analysis, budgetEstimates, impacts, assumptions } = bundle;
  const bestCost = budgetEstimates[0]
    ? (formatRange(
        budgetEstimates[0].annual_cost_min,
        budgetEstimates[0].annual_cost_central,
        budgetEstimates[0].annual_cost_max,
        budgetEstimates[0].currency + "/an"
      ) ?? formatCentral(budgetEstimates[0].annual_cost_central, budgetEstimates[0].currency + "/an"))
    : null;
  const delay =
    analysis.legal_implementation_delay_min_months !== null ||
    analysis.legal_implementation_delay_max_months !== null
      ? formatRange(
          analysis.legal_implementation_delay_min_months,
          null,
          analysis.legal_implementation_delay_max_months,
          "mois"
        )
      : null;
  const sourceCount =
    new Set(
      [
        ...budgetEstimates.map((b) => b.source_url ?? b.source_name),
        ...impacts.map((i) => i.source_url ?? i.source_name).filter(Boolean),
        ...assumptions.map((a) => a.source_url ?? a.source_name).filter(Boolean),
        proposal.source_url,
      ].filter(Boolean)
    ).size;

  return (
    <Link
      href={`/mesures/${proposal.id}`}
      className={cn(
        "focus-ring group flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[0_16px_32px_-22px_rgba(15,23,41,0.3)]",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <CandidateAvatar name={candidate.name} color={candidate.party?.color} photoUrl={candidate.photo_url} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{candidate.name}</p>
            {theme && (
              <p className="flex items-center gap-1 text-xs text-muted">
                <ThemeIcon icon={theme.icon} className="h-3 w-3" />
                {theme.name}
              </p>
            )}
          </div>
        </div>
        {analysis.status === "outdated" && (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent">
            <AlertTriangle size={11} />À actualiser
          </span>
        )}
      </div>

      <h3 className="text-base font-semibold leading-snug">{proposal.title}</h3>

      {analysis.feasibility_status && <FeasibilityBadge status={analysis.feasibility_status} className="w-fit" />}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
        {bestCost && <span>Coût : {bestCost}</span>}
        {delay && <span>Délai : {delay}</span>}
        <span className="flex items-center gap-1">
          <Library size={12} />
          {sourceCount} source{sourceCount > 1 ? "s" : ""}
        </span>
      </div>

      {analysis.confidence_level && <ConfidenceBadge level={analysis.confidence_level} />}
    </Link>
  );
}
