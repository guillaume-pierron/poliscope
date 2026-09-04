"use client";

import Link from "next/link";
import { ExternalLink, Minus, ThumbsDown, ThumbsUp } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { CandidateAvatarWithParty } from "./candidate-avatar-party";
import { ThemeIcon } from "@/lib/theme-icons";
import type { Candidate, CandidatePosition, Question } from "@/lib/types";

const SCORE_LABEL: Record<number, string> = {
  2: "Totalement favorable",
  1: "Plutôt favorable",
  0: "Neutre",
  [-1]: "Plutôt opposé",
  [-2]: "Totalement opposé",
};

function ScoreIcon({ score }: { score: number }) {
  if (score > 0) return <ThumbsUp size={16} className="shrink-0 text-success" />;
  if (score < 0) return <ThumbsDown size={16} className="shrink-0 text-danger" />;
  return <Minus size={16} className="shrink-0 text-muted-2" />;
}

export interface PositionModalData {
  candidate: Candidate;
  question: Question;
  position: CandidatePosition;
}

/**
 * Shows one documented Match position in place — the proposal behind a
 * given agreement/disagreement — without navigating away from the results.
 */
export function PositionDetailModal({
  data,
  onClose,
}: {
  data: PositionModalData | null;
  onClose: () => void;
}) {
  return (
    <Modal open={data !== null} onClose={onClose}>
      {data && (
        <>
          <div className="flex items-center gap-3 pr-8">
            <CandidateAvatarWithParty candidate={data.candidate} size="md" />
            <div className="min-w-0">
              <p className="truncate font-serif text-lg font-semibold">{data.candidate.name}</p>
              <p className="truncate text-sm text-muted">{data.candidate.party?.name}</p>
            </div>
          </div>

          {data.question.theme && (
            <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary">
              <ThemeIcon icon={data.question.theme.icon} className="h-3.5 w-3.5" />
              {data.question.theme.name}
            </span>
          )}

          <h3 className="mt-3 text-base font-medium leading-snug">{data.question.question}</h3>

          {data.position.score !== null && (
            <div className="mt-3 flex items-center gap-2 text-sm font-medium">
              <ScoreIcon score={data.position.score} />
              {SCORE_LABEL[data.position.score]}
            </div>
          )}

          {data.position.explanation && (
            <p className="mt-3 text-sm leading-relaxed text-foreground/85">
              {data.position.explanation}
            </p>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-border pt-4">
            {data.position.source_url && (
              <a
                href={data.position.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                Voir la source
                <ExternalLink size={13} />
              </a>
            )}
            <Link
              href={`/candidats/${data.candidate.slug}#position-${data.question.id}`}
              className="focus-ring text-sm text-muted hover:text-foreground"
              onClick={onClose}
            >
              Voir toute sa fiche →
            </Link>
          </div>
        </>
      )}
    </Modal>
  );
}
