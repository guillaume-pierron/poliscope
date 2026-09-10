import { cn } from "@/lib/utils";
import {
  CANDIDATE_VOTE_LABELS,
  CONTROVERSY_STATUS_LABELS,
  LEGAL_CASE_STATUS_LABELS,
  POSITION_EVOLUTION_TYPE_LABELS,
  RECORD_SOURCE_TYPE_LABELS,
  type CandidateVoteValue,
  type ControversyStatus,
  type LegalCaseStatus,
  type PositionEvolutionType,
  type RecordSourceType,
} from "@/lib/types";

/**
 * Vocabulaire visuel commun à toute la rubrique "Parcours & actes" : jamais
 * de rouge/vert façon verdict pour une affaire judiciaire ou une controverse
 * — seul un vote (accord/désaccord factuel avec un texte) ou une décision de
 * justice définitive s'autorise une tonalité marquée. Tout le reste reste
 * neutre (surface/accent), pour ne jamais laisser le design suggérer un
 * jugement que le texte se refuse à porter.
 */

const badgeBase = "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium";

export function VoteBadge({ value, className }: { value: CandidateVoteValue; className?: string }) {
  const tone =
    value === "for"
      ? "border-success/30 bg-success-soft text-success"
      : value === "against"
        ? "border-danger/30 bg-danger-soft text-danger"
        : value === "abstention"
          ? "border-accent/30 bg-accent-soft text-accent"
          : "border-border-strong bg-surface text-muted";
  return <span className={cn(badgeBase, tone, className)}>{CANDIDATE_VOTE_LABELS[value]}</span>;
}

export function LegalStatusBadge({ status, className }: { status: LegalCaseStatus; className?: string }) {
  const tone =
    status === "convicted_first_instance" || status === "convicted_on_appeal" || status === "convicted_final"
      ? "border-danger/30 bg-danger-soft text-danger"
      : status === "acquitted" || status === "dismissed" || status === "closed_without_action"
        ? "border-success/30 bg-success-soft text-success"
        : "border-accent/30 bg-accent-soft text-accent";
  return <span className={cn(badgeBase, tone, className)}>{LEGAL_CASE_STATUS_LABELS[status]}</span>;
}

export function ControversyStatusBadge({ status, className }: { status: ControversyStatus; className?: string }) {
  return (
    <span className={cn(badgeBase, "border-border-strong bg-surface text-muted", className)}>
      {CONTROVERSY_STATUS_LABELS[status]}
    </span>
  );
}

export function EvolutionTypeBadge({ type, className }: { type: PositionEvolutionType; className?: string }) {
  const tone = type === "position_reversed" ? "border-accent/30 bg-accent-soft text-accent" : "border-primary/25 bg-primary-soft text-primary";
  return <span className={cn(badgeBase, tone, className)}>{POSITION_EVOLUTION_TYPE_LABELS[type]}</span>;
}

export function SourceTypeLabel({ type, className }: { type: RecordSourceType | null; className?: string }) {
  if (!type) return null;
  return <span className={cn("text-xs font-medium text-muted-2", className)}>{RECORD_SOURCE_TYPE_LABELS[type]}</span>;
}
