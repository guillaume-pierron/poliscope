import { CircleCheck, CircleMinus, CircleX, ExternalLink, Minus } from "lucide-react";
import { describePositionValue } from "@/lib/match-format";
import { SUBJECT_VERDICT_LABELS, describeGap, type SubjectComparison } from "@/lib/compare";
import { cn } from "@/lib/utils";
import type { ThemeVerdict } from "@/lib/compare";
import type { Candidate, CandidatePosition, Question } from "@/lib/types";

const VERDICT_STYLE: Record<
  ThemeVerdict,
  { icon: typeof CircleCheck; text: string; bubble: string; panel: string; card: string; badge: string }
> = {
  accord: {
    icon: CircleCheck,
    text: "text-success",
    bubble: "bg-card text-success",
    panel: "bg-success-soft/70",
    card: "border-success/25 bg-success-soft/35",
    badge: "bg-success-soft text-success",
  },
  nuance: {
    icon: CircleMinus,
    text: "text-accent",
    bubble: "bg-card text-accent",
    panel: "bg-accent-soft/70",
    card: "border-accent/25 bg-accent-soft/35",
    badge: "bg-accent-soft text-accent",
  },
  desaccord: {
    icon: CircleX,
    text: "text-danger",
    bubble: "bg-card text-danger",
    panel: "bg-danger-soft/70",
    card: "border-danger/25 bg-danger-soft/35",
    badge: "bg-danger-soft text-danger",
  },
  // « Sujet incomplet » vient toujours d'une donnée manquante, jamais d'un
  // désaccord — mais un simple gris se lisait comme « rien à voir ici »
  // plutôt que comme une invitation à lire pourquoi. Le même accent chaud
  // que « nuance » (une icône différente les distingue) attire l'œil sans
  // pour autant lui donner la charge négative du rouge. La carte du côté
  // documenté reste neutre en revanche : on ne sait justement pas s'il y a
  // accord ou désaccord, la colorer trancherait à la place du lecteur.
  inconnu: {
    icon: Minus,
    text: "text-accent",
    bubble: "bg-card text-accent",
    panel: "bg-accent-soft/40",
    card: "border-border-strong bg-card",
    badge: "bg-surface-strong text-muted",
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
  index,
  subject,
  candidateA,
  candidateB,
}: {
  /** Rang du sujet dans le thème affiché (0-based) — purement un repère de lecture, jamais un ordre de priorité. */
  index: number;
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
    <div className="grid gap-4 border-t border-border p-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.15fr)_minmax(0,1.15fr)_minmax(0,0.8fr)] lg:items-stretch lg:gap-5 lg:p-5">
      <div className="min-w-0">
        <span className="mb-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-primary-soft text-sm font-semibold text-primary">
          {index + 1}
        </span>
        <h4 className="text-base font-semibold leading-snug">{question.question}</h4>
        {question.description && (
          <p className="mt-1.5 text-xs leading-relaxed text-muted-2">{question.description}</p>
        )}
      </div>

      <PositionCell candidate={candidateA} question={question} position={positionA} verdict={verdict} />
      <PositionCell candidate={candidateB} question={question} position={positionB} verdict={verdict} />

      <div className={cn("flex flex-col items-center justify-center gap-1.5 rounded-xl p-4 text-center", style.panel)}>
        <span className={cn("flex h-9 w-9 items-center justify-center rounded-full", style.bubble)}>
          <VerdictIcon size={18} />
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
  verdict,
}: {
  candidate: Candidate;
  question: Question;
  position: CandidatePosition | null;
  verdict: ThemeVerdict;
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

  const label = describePositionValue(question, position);
  const style = VERDICT_STYLE[verdict];

  // La couleur suit l'accord entre les deux candidats sur CE sujet (le
  // verdict), jamais où leur position se situe sur l'échelle : « réduire »
  // n'est ni rouge ni vert en soi, mais les deux cartes passent au vert
  // quand elles disent la même chose et au rouge quand elles s'opposent —
  // exactement ce que dit déjà le badge « Notre analyse » juste à côté,
  // simplement redit sur la carte elle-même plutôt qu'en contradiction avec
  // elle.
  return (
    <div className={cn("min-w-0 rounded-xl border p-3.5", style.card)}>
      <CandidateLabel candidate={candidate} />
      <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium leading-none", style.badge)}>
        <CircleMinus size={12} className="shrink-0" />
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
