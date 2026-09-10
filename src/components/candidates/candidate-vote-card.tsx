import { ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { VOTE_INSTITUTION_LABELS, type CandidateVote, type Theme } from "@/lib/types";
import { VoteBadge } from "./record-badges";

export function CandidateVoteCard({ vote, theme }: { vote: CandidateVote; theme?: Theme }) {
  return (
    <article className="rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-2">
        <span>{VOTE_INSTITUTION_LABELS[vote.institution]}</span>
        <span aria-hidden>·</span>
        <span>{formatDate(vote.vote_date)}</span>
        {vote.importance_level === "major" && (
          <>
            <span aria-hidden>·</span>
            <span className="text-accent">Vote structurant</span>
          </>
        )}
      </div>
      <h3 className="mt-1.5 font-medium">{vote.title}</h3>
      {vote.description && <p className="mt-2 text-sm leading-relaxed text-foreground/85">{vote.description}</p>}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <VoteBadge value={vote.candidate_vote} />
        {theme && (
          <span className="rounded-full border border-border-strong bg-surface px-2.5 py-1 text-xs font-medium text-muted">
            {theme.name}
          </span>
        )}
      </div>

      {vote.source_url && (
        <a
          href={vote.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          Voir le scrutin officiel
          <ExternalLink size={13} />
        </a>
      )}
    </article>
  );
}
