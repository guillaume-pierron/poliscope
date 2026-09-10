import Link from "next/link";
import { ArrowLeftRight, CheckCircle2, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Figures } from "@/components/ui/figures";
import { PassageAuReelLink } from "@/components/passage-au-reel/passage-au-reel-link";
import { ThemeIcon } from "@/lib/theme-icons";
import { formatDate, isQuantifiedProposal } from "@/lib/utils";
import { PROPOSAL_STATUS_LABELS, type Proposal, type Theme } from "@/lib/types";

const STATUS_VARIANT: Record<Proposal["status"], "default" | "primary" | "accent" | "success"> = {
  annonce: "default",
  proposition_officielle: "primary",
  programme: "success",
  precision_ulterieure: "accent",
};

export function CandidateProposalCard({
  proposal,
  theme,
  candidateSlug,
  hasAnalysis,
}: {
  proposal: Proposal;
  theme: Theme | undefined;
  candidateSlug: string;
  /** True only when a *published* "Passage au réel" analysis exists for this proposal. */
  hasAnalysis?: boolean;
}) {
  const quantified = isQuantifiedProposal(proposal);

  return (
    <article className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start gap-4">
        <div className="flex min-w-0 flex-1 items-start gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
            <ThemeIcon icon={theme?.icon ?? "globe"} className="h-6 w-6" />
          </span>
          <div className="min-w-0 flex-1">
            {theme && (
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary">
                {theme.name}
              </p>
            )}
            <h3 className="text-base font-semibold leading-snug">{proposal.title}</h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Badge variant={STATUS_VARIANT[proposal.status]}>
                {PROPOSAL_STATUS_LABELS[proposal.status]}
              </Badge>
              {quantified && (
                <span className="rounded-full bg-success-soft px-2.5 py-1 text-xs font-medium text-success">
                  Mesure chiffrée
                </span>
              )}
            </div>
            {/* Le résumé est la ligne à lire en premier : il porte donc le
                contraste le plus fort, et la description — le détail sourcé —
                passe en retrait. L'inverse (résumé en `text-muted` sous une
                description plus sombre) attirait l'œil vers le pavé plutôt
                que vers l'essentiel. */}
            <p className="mt-2.5 text-[0.9375rem] font-medium leading-snug text-foreground">
              <Figures text={proposal.summary} />
            </p>
            {proposal.description && (
              <p className="mt-2 text-sm leading-relaxed text-muted">
                <Figures text={proposal.description} />
              </p>
            )}
          </div>
        </div>

        <div className="hidden w-48 shrink-0 text-right text-xs text-muted-2 sm:block">
          <p>Source : {proposal.source_name}</p>
          {proposal.verified_at && (
            <p className="mt-1 flex items-center justify-end gap-1">
              Vérifiée le {formatDate(proposal.verified_at)}
              <CheckCircle2 size={12} className="text-success" />
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
        <a
          href={proposal.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          Voir la source
          <ExternalLink size={13} />
        </a>
        <div className="flex items-center gap-4">
          {hasAnalysis && <PassageAuReelLink proposalId={proposal.id} />}
          <Link
            href={`/comparer?a=${candidateSlug}`}
            className="focus-ring inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-foreground"
          >
            <ArrowLeftRight size={13} />
            Comparer cette mesure
          </Link>
        </div>
      </div>
    </article>
  );
}
