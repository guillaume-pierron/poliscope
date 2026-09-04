import Link from "next/link";
import { ArrowLeftRight, CheckCircle2, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
}: {
  proposal: Proposal;
  theme: Theme | undefined;
  candidateSlug: string;
}) {
  const quantified = isQuantifiedProposal(proposal);

  return (
    <article className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
            <ThemeIcon icon={theme?.icon ?? "globe"} className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            {theme && (
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                {theme.name}
              </p>
            )}
            <h3 className="mt-1 text-base font-semibold leading-snug">{proposal.title}</h3>
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
            <p className="mt-2.5 text-sm text-muted">{proposal.summary}</p>
            {proposal.description && (
              <p className="mt-1.5 text-sm leading-relaxed text-foreground/80">
                {proposal.description}
              </p>
            )}
          </div>
        </div>

        <div className="hidden shrink-0 text-right text-xs text-muted-2 sm:block">
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
        <Link
          href={`/comparer?a=${candidateSlug}`}
          className="focus-ring inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-foreground"
        >
          <ArrowLeftRight size={13} />
          Comparer cette mesure
        </Link>
      </div>
    </article>
  );
}
