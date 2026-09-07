import Link from "next/link";
import { ArrowUpRight, Compass, ScanSearch, TriangleAlert } from "lucide-react";
import type { MeasureAnalysisBundle } from "@/lib/types";

/**
 * Counts only — deliberately no aggregate "réalisme du candidat" score.
 * "Passage au réel" evaluates measures, never the candidate as a whole.
 */
export function PassageAuReelCandidateSummary({ bundles }: { bundles: MeasureAnalysisBundle[] }) {
  if (bundles.length === 0) return null;

  const quantified = bundles.filter((b) => b.budgetEstimates.length > 0).length;
  const uncertain = bundles.filter(
    (b) =>
      b.analysis.confidence_level === "faible" ||
      b.analysis.feasibility_status === "informations_insuffisantes" ||
      b.analysis.feasibility_status === "obstacle_juridique_majeur"
  ).length;

  const stats = [
    { icon: Compass, value: bundles.length, label: `mesure${bundles.length > 1 ? "s" : ""} analysée${bundles.length > 1 ? "s" : ""}` },
    { icon: ScanSearch, value: quantified, label: "chiffrées" },
    { icon: TriangleAlert, value: uncertain, label: "forte incertitude" },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <p className="text-sm font-semibold">Passage au réel</p>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="min-w-0">
            <stat.icon size={17} className="text-primary" />
            <p className="mt-2 font-serif text-xl font-semibold leading-none tabular-nums">{stat.value}</p>
            <p className="mt-1.5 text-xs leading-snug text-muted">{stat.label}</p>
          </div>
        ))}
      </div>
      <Link
        href="/passage-au-reel"
        className="focus-ring group mt-4 flex items-center gap-1.5 border-t border-border pt-4 text-sm font-medium text-primary hover:underline"
      >
        Explorer les analyses
        <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}
