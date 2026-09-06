"use client";

import Link from "next/link";
import { CircleDot, ExternalLink, Minus, ThumbsDown, ThumbsUp } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { CandidateAvatarWithParty } from "./candidate-avatar-party";
import { ThemeIcon } from "@/lib/theme-icons";
import { describePositionValue, positionTone } from "@/lib/match-format";
import type { Candidate, CandidatePosition, Question } from "@/lib/types";

/** A "choice" position has no agree/disagree valence — never a thumbs up/down implying "good/bad". */
function PositionIcon({ question, position }: { question: Question; position: CandidatePosition }) {
  const tone = positionTone(question.answer_type, position);
  if (tone === "positive") return <ThumbsUp size={16} className="shrink-0 text-success" />;
  if (tone === "negative") return <ThumbsDown size={16} className="shrink-0 text-danger" />;
  if (tone === "choice") return <CircleDot size={16} className="shrink-0 text-primary" />;
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

          {describePositionValue(data.question, data.position) && (
            <div className="mt-3 flex items-center gap-2 text-sm font-medium">
              <PositionIcon question={data.question} position={data.position} />
              {describePositionValue(data.question, data.position)}
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
