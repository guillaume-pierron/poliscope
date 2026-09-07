import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

/**
 * Only ever rendered by a caller that already knows a *published* analysis
 * exists for this proposal (see getPublishedMeasureAnalysisBundleForProposal)
 * — never guessed or shown speculatively.
 */
export function PassageAuReelLink({ proposalId, className }: { proposalId: string; className?: string }) {
  return (
    <Link
      href={`/mesures/${proposalId}`}
      className={
        className ??
        "focus-ring group inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
      }
    >
      <Compass size={13} className="shrink-0" />
      Passage au réel
      <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
