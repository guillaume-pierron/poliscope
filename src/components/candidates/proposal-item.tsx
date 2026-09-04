import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { PROPOSAL_STATUS_LABELS, type Proposal } from "@/lib/types";

const STATUS_VARIANT: Record<Proposal["status"], "default" | "primary" | "accent" | "success"> = {
  annonce: "default",
  proposition_officielle: "primary",
  programme: "success",
  precision_ulterieure: "accent",
};

export function ProposalItem({ proposal }: { proposal: Proposal }) {
  return (
    <article className="rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={STATUS_VARIANT[proposal.status]}>
          {PROPOSAL_STATUS_LABELS[proposal.status]}
        </Badge>
        {proposal.verified_at && (
          <span className="text-xs text-muted-2">
            Vérifié le {formatDate(proposal.verified_at)}
          </span>
        )}
      </div>
      <h3 className="mt-2.5 text-base font-semibold">{proposal.title}</h3>
      <p className="mt-1.5 text-sm text-muted">{proposal.summary}</p>
      <p className="mt-2 text-sm leading-relaxed text-foreground/80">{proposal.description}</p>
      <a
        href={proposal.source_url}
        target="_blank"
        rel="noopener noreferrer"
        className="focus-ring mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
      >
        Voir la source
        <ExternalLink size={13} />
      </a>
    </article>
  );
}
