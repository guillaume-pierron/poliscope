import { ExternalLink, Minus, ThumbsDown, ThumbsUp } from "lucide-react";
import type { CandidatePosition, Question } from "@/lib/types";

const SCORE_LABEL: Record<number, string> = {
  2: "Totalement favorable",
  1: "Plutôt favorable",
  0: "Neutre",
  [-1]: "Plutôt opposé",
  [-2]: "Totalement opposé",
};

function ScoreIcon({ score }: { score: number }) {
  if (score > 0) return <ThumbsUp size={15} className="shrink-0 text-success" />;
  if (score < 0) return <ThumbsDown size={15} className="shrink-0 text-danger" />;
  return <Minus size={15} className="shrink-0 text-muted-2" />;
}

/**
 * One entry per documented Match position, anchored by question id so
 * "Voir la position du candidat" links (from the results pages) can jump
 * straight to the relevant one instead of the top of the profile.
 */
export function CandidatePositionList({
  positions,
  questions,
}: {
  positions: CandidatePosition[];
  questions: Question[];
}) {
  const questionById = new Map(questions.map((q) => [q.id, q]));
  const items = positions
    .filter((p) => p.score !== null)
    .map((p) => ({ position: p, question: questionById.get(p.question_id) }))
    .filter((item): item is { position: CandidatePosition; question: Question } => !!item.question)
    .sort((a, b) => a.question.order_index - b.question.order_index);

  if (items.length === 0) return null;

  return (
    <div className="space-y-3">
      {items.map(({ position, question }) => (
        <article
          key={position.id}
          id={`position-${question.id}`}
          className="scroll-mt-28 rounded-xl border border-border bg-card p-5 [&:target]:border-primary [&:target]:ring-2 [&:target]:ring-primary/25"
        >
          {question.theme && (
            <p className="text-xs font-medium uppercase tracking-wide text-muted-2">
              {question.theme.name}
            </p>
          )}
          <h3 className="mt-1 font-medium">{question.question}</h3>
          <div className="mt-2.5 flex items-center gap-2 text-sm font-medium">
            <ScoreIcon score={position.score!} />
            {SCORE_LABEL[position.score!]}
          </div>
          {position.explanation && (
            <p className="mt-2 text-sm leading-relaxed text-foreground/85">{position.explanation}</p>
          )}
          {position.source_url && (
            <a
              href={position.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              Voir la source
              <ExternalLink size={13} />
            </a>
          )}
        </article>
      ))}
    </div>
  );
}
