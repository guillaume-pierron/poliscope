import { CircleCheck, CircleMinus, CircleX, ExternalLink, Minus } from "lucide-react";
import { describePositionValue, positionTone, type PositionTone } from "@/lib/match-format";
import { SUBJECT_VERDICT_LABELS, describeGap, type SubjectComparison } from "@/lib/compare";
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
  inconnu: { icon: Minus, text: "text-muted-2", bubble: "bg-surface-strong text-muted-2" },
};

/**
 * Teintes par sens de la réponse. Une question « choice » n'en reçoit
 * aucune : ses options ne s'ordonnent pas, une couleur y suggérerait un
 * pour/contre qui n'existe pas.
 */
const TONE_STYLE: Record<PositionTone, { card: string; badge: string; icon: typeof CircleCheck }> = {
  positive: {
    card: "border-success/20 bg-success-soft/50",
    badge: "bg-success-soft text-success",
    icon: CircleCheck,
  },
  negative: {
    card: "border-danger/20 bg-danger-soft/50",
    badge: "bg-danger-soft text-danger",
    icon: CircleX,
  },
  neutral: {
    card: "border-accent/20 bg-accent-soft/60",
    badge: "bg-accent-soft text-accent",
    icon: CircleMinus,
  },
  choice: {
    card: "border-border bg-surface",
    badge: "bg-surface-strong text-muted",
    icon: CircleMinus,
  },
};

/**
 * Une ligne du tableau : la question, les deux positions en vis-à-vis, et le
 * verdict qui porte exactement sur ces deux positions-là.
 *
 * Le nom des candidats vit dans l'en-tête du tableau, pas dans chaque
 * cellule — sauf sous `lg`, où le tableau s'empile et où chaque cellule doit
 * redire de qui elle parle.
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
  const gap = describeGap(subject);

  const onlyDocumentedFor =
    verdict === "inconnu" && positionA && !positionB
      ? candidateA.name
      : verdict === "inconnu" && positionB && !positionA
        ? candidateB.name
        : null;

  return (
    <div className="grid gap-4 border-t border-border p-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.15fr)_minmax(0,1.15fr)_minmax(0,0.8fr)] lg:gap-5 lg:px-5 lg:py-5">
      <div className="min-w-0">
        <h4 className="text-sm font-semibold leading-snug">{question.question}</h4>
        {question.description && (
          <p className="mt-1.5 text-xs leading-relaxed text-muted-2">{question.description}</p>
        )}
      </div>

      <PositionCell candidate={candidateA} question={question} position={positionA} />
      <PositionCell candidate={candidateB} question={question} position={positionB} />

      <div className="flex flex-col items-center justify-center gap-1.5 rounded-xl bg-surface/60 p-3.5 text-center lg:bg-transparent lg:p-0">
        <span className={cn("flex h-8 w-8 items-center justify-center rounded-full", style.bubble)}>
          <VerdictIcon size={17} />
        </span>
        <p className={cn("text-sm font-semibold leading-tight", style.text)}>
          {SUBJECT_VERDICT_LABELS[verdict]}
        </p>
        {/* Phrase strictement déduite de l'écart entre les deux réponses —
            jamais une lecture politique de cet écart. */}
        <p className="text-xs leading-relaxed text-muted-2">
          {onlyDocumentedFor
            ? `Position documentée uniquement pour ${onlyDocumentedFor}.`
            : (gap ?? "Aucune position documentée des deux côtés.")}
        </p>
      </div>
    </div>
  );
}

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
      <div className="min-w-0 rounded-xl border border-dashed border-border-strong p-3.5">
        <CandidateLabel candidate={candidate} />
        <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-strong px-2.5 py-1 text-xs font-medium leading-none text-muted-2">
          <Minus size={12} className="shrink-0" />
          Non renseignée
        </span>
        <p className="mt-2.5 text-sm leading-relaxed text-muted-2">
          Aucune position trouvée dans les sources analysées.
        </p>
      </div>
    );
  }

  const tone = positionTone(question.answer_type, position);
  const style = TONE_STYLE[tone];
  const ToneIcon = style.icon;
  const label = describePositionValue(question, position);

  return (
    <div className={cn("min-w-0 rounded-xl border p-3.5", style.card)}>
      <CandidateLabel candidate={candidate} />
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium leading-none",
          style.badge
        )}
      >
        <ToneIcon size={12} className="shrink-0" />
        {label ?? "Position documentée"}
      </span>

      {/* Sans guillemets : cette phrase est notre synthèse sourcée de la
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

/** Redit de qui parle la cellule quand le tableau s'empile, sous `lg`. */
function CandidateLabel({ candidate }: { candidate: Candidate }) {
  return (
    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.06em] text-muted-2 lg:hidden">
      {candidate.name}
    </p>
  );
}
