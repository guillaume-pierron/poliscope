import { CircleCheck, CircleMinus, CircleX, ExternalLink, Minus } from "lucide-react";
import { CandidateAvatar } from "@/components/candidates/candidate-avatar";
import { describePositionValue, positionTone } from "@/lib/match-format";
import { SUBJECT_VERDICT_LABELS, type SubjectComparison } from "@/lib/compare";
import { cn } from "@/lib/utils";
import type { ThemeVerdict } from "@/lib/compare";
import type { Candidate, CandidatePosition, Question } from "@/lib/types";

const VERDICT_STYLE: Record<
  ThemeVerdict,
  { icon: typeof CircleCheck; text: string; bubble: string }
> = {
  accord: { icon: CircleCheck, text: "text-success", bubble: "bg-success-soft text-success" },
  nuance: { icon: CircleMinus, text: "text-accent", bubble: "bg-accent-soft text-accent" },
  desaccord: { icon: CircleX, text: "text-danger", bubble: "bg-danger-soft text-danger" },
  inconnu: { icon: Minus, text: "text-muted-2", bubble: "bg-surface text-muted-2" },
};

/**
 * Une question du Match, les deux positions documentées en vis-à-vis, et le
 * verdict qui porte exactement sur ces deux positions-là — et non, comme
 * auparavant, sur des propositions affichées à côté d'un score calculé
 * ailleurs.
 */
export function CompareSubjectRow({
  subject,
  candidateA,
  candidateB,
}: {
  subject: SubjectComparison;
  candidateA: Candidate;
  candidateB: Candidate;
}) {
  const { question, positionA, positionB, verdict } = subject;
  const style = VERDICT_STYLE[verdict];
  const VerdictIcon = style.icon;

  // Seul cas où l'on peut nommer la cause du « sujet incomplet » sans rien
  // supposer : une position manque, et on sait laquelle.
  const onlyDocumentedFor =
    verdict === "inconnu" && positionA && !positionB
      ? candidateA.name
      : verdict === "inconnu" && positionB && !positionA
        ? candidateB.name
        : null;

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="grid gap-px bg-border lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)_minmax(0,1.1fr)_minmax(0,0.85fr)]">
        <div className="bg-card p-4">
          <h4 className="text-sm font-semibold leading-snug">{question.question}</h4>
          {question.description && (
            <p className="mt-1.5 text-xs leading-relaxed text-muted">{question.description}</p>
          )}
        </div>

        <PositionCell candidate={candidateA} question={question} position={positionA} />
        <PositionCell candidate={candidateB} question={question} position={positionB} />

        <div className="flex flex-col justify-center bg-card p-4 text-center">
          <span
            className={cn(
              "mx-auto flex h-8 w-8 items-center justify-center rounded-full",
              style.bubble
            )}
          >
            <VerdictIcon size={17} />
          </span>
          <p className={cn("mt-2 text-sm font-semibold leading-snug", style.text)}>
            {SUBJECT_VERDICT_LABELS[verdict]}
          </p>
          {onlyDocumentedFor && (
            <p className="mt-1 text-xs leading-relaxed text-muted-2">
              Position documentée uniquement pour {onlyDocumentedFor}.
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

/** Teinte du fond selon le sens de la position — jamais pour une question
 *  « choice », où les options ne s'ordonnent pas et où une couleur
 *  suggérerait un pour/contre qui n'existe pas. */
const TONE_BG: Record<string, string> = {
  positive: "bg-primary-soft/40",
  negative: "bg-danger-soft/40",
  neutral: "bg-card",
  choice: "bg-card",
};

const TONE_BADGE: Record<string, string> = {
  positive: "bg-primary-soft text-primary",
  negative: "bg-danger-soft text-danger",
  neutral: "bg-surface text-muted",
  choice: "bg-surface text-muted",
};

function PositionCell({
  candidate,
  question,
  position,
}: {
  candidate: Candidate;
  question: Question;
  position: CandidatePosition | null;
}) {
  if (!position) {
    return (
      <div className="bg-card p-4">
        <CellHeader candidate={candidate} badge="Non renseignée" badgeClass={TONE_BADGE.neutral} />
        <p className="mt-2.5 text-sm leading-relaxed text-muted-2">
          Aucune position trouvée dans les sources analysées.
        </p>
      </div>
    );
  }

  const tone = positionTone(question.answer_type, position);
  const label = describePositionValue(question, position);

  return (
    <div className={cn("p-4", TONE_BG[tone])}>
      <CellHeader
        candidate={candidate}
        badge={label ?? "Position documentée"}
        badgeClass={TONE_BADGE[tone]}
      />
      {/* Sans guillemets : ce texte est notre synthèse sourcée de la
          position, pas une citation du candidat. */}
      {position.explanation && (
        <p className="mt-2.5 text-sm leading-relaxed text-foreground/85">{position.explanation}</p>
      )}
      {position.source_url && (
        <a
          href={position.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring mt-2.5 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
        >
          {position.source_name ?? "Voir la source"}
          <ExternalLink size={11} className="shrink-0" />
        </a>
      )}
    </div>
  );
}

function CellHeader({
  candidate,
  badge,
  badgeClass,
}: {
  candidate: Candidate;
  badge: string;
  badgeClass: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <CandidateAvatar
        name={candidate.name}
        color={candidate.party?.color}
        photoUrl={candidate.photo_url}
        size="sm"
        className="ring-2 ring-border-strong"
      />
      <span className="min-w-0 flex-1 truncate text-sm font-medium">{candidate.name}</span>
      <span
        className={cn(
          "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium leading-none",
          badgeClass
        )}
      >
        {badge}
      </span>
    </div>
  );
}
