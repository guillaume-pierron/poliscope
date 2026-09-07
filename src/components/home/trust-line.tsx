import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * The "who are you, are you neutral?" answer, which a political site has to
 * give within seconds. Deliberately a single quiet line rather than a card:
 * the previous colored 3-card row crowded the top of the page, but the
 * credibility signal it carried is worth keeping.
 */
export function TrustLine({
  proposalCount,
  candidateCount,
}: {
  proposalCount: number;
  candidateCount: number;
}) {
  return (
    <section className="border-b border-border bg-surface/60">
      <div className="container-app flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 py-3 text-xs text-muted">
        <span>
          <strong className="font-semibold tabular-nums text-foreground">{proposalCount}</strong>{" "}
          propositions sourcées
        </span>
        <Separator />
        <span>
          <strong className="font-semibold tabular-nums text-foreground">{candidateCount}</strong>{" "}
          candidats couverts
        </span>
        <Separator />
        <span>Aucune affiliation à un parti</span>
        <Separator />
        <Link
          href="/methodologie"
          className="focus-ring group inline-flex items-center gap-1 font-medium text-primary hover:underline"
        >
          Méthodologie publique
          <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}

function Separator() {
  return <span aria-hidden="true" className="hidden h-3 w-px bg-border sm:block" />;
}
