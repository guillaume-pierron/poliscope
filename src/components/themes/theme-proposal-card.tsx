import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate, isQuantifiedProposal, parseTags } from "@/lib/utils";
import { tagIcon } from "@/lib/tag-icons";
import { PROPOSAL_STATUS_LABELS, type Proposal } from "@/lib/types";

const STATUS_VARIANT: Record<Proposal["status"], "default" | "primary" | "accent" | "success"> = {
  annonce: "default",
  proposition_officielle: "primary",
  programme: "success",
  precision_ulterieure: "accent",
};

export function ThemeProposalCard({
  proposal,
  selected,
  onToggleCompare,
}: {
  proposal: Proposal;
  selected: boolean;
  onToggleCompare: () => void;
}) {
  const tags = parseTags(proposal.tags);
  // tagIcon always returns one of a fixed set of stable, module-level lucide
  // icons (never a freshly-created component), so this isn't the remount
  // footgun the rule is guarding against.
  const Icon = tagIcon(tags[0] ?? "");
  const quantified = isQuantifiedProposal(proposal);

  return (
    <article className="relative overflow-hidden rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
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
        <label className="flex shrink-0 cursor-pointer items-center gap-1.5 text-xs font-medium text-muted">
          <input
            type="checkbox"
            checked={selected}
            onChange={onToggleCompare}
            className="h-3.5 w-3.5 accent-[var(--primary)]"
          />
          Comparer
        </label>
      </div>

      <div className="mt-3 flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold">{proposal.title}</h3>
          <p className="mt-1.5 text-sm text-muted">{proposal.summary}</p>
        </div>
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
          {/* eslint-disable-next-line react-hooks/static-components -- tagIcon always resolves to one of a fixed set of stable, module-level lucide icons */}
          <Icon size={22} />
        </span>
      </div>

      {(tags.length > 0 || quantified) && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-surface px-2.5 py-1 text-xs font-medium text-muted"
            >
              {tag}
            </span>
          ))}
          {quantified && (
            <span className="rounded-full bg-success-soft px-2.5 py-1 text-xs font-medium text-success">
              Mesure chiffrée
            </span>
          )}
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="flex items-center gap-1.5 text-xs text-muted-2">
          Source : {proposal.source_name}
        </p>
        <a
          href={proposal.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          Voir la source
          <ExternalLink size={13} />
        </a>
      </div>
    </article>
  );
}
