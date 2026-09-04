"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, CircleCheck, CircleX } from "lucide-react";
import { CandidateAvatarWithParty } from "@/components/candidates/candidate-avatar-party";
import { PositionDetailModal, type PositionModalData } from "@/components/candidates/position-detail-modal";
import { Badge } from "@/components/ui/badge";
import { ProvisionalResultBadge } from "./coverage-badge";
import { ThemeScoreList } from "./theme-score-list";
import { cn } from "@/lib/utils";
import type { CandidateMatchResult } from "@/lib/types";

/** One compact row of the results ranking, expandable for the detail. */
export function CandidateResultCard({
  result,
  rank,
  highlighted,
}: {
  result: CandidateMatchResult;
  rank: number;
  highlighted?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [modalData, setModalData] = useState<PositionModalData | null>(null);
  const { candidate, score, agreements, disagreements, comparableQuestions, coverageLevel, themeScores } =
    result;
  const color = candidate.party?.color ?? "var(--primary)";

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border transition-colors",
        highlighted ? "border-primary/40 bg-primary-soft/40" : "border-transparent bg-card"
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="focus-ring flex w-full items-center gap-3 p-3 text-left sm:gap-4 sm:p-4"
        aria-expanded={open}
      >
        <span className="w-4 shrink-0 text-sm font-medium text-muted-2">{rank}</span>
        <CandidateAvatarWithParty candidate={candidate} size="sm" />

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{candidate.name}</p>
          {coverageLevel === "faible" ? (
            <ProvisionalResultBadge className="mt-0.5" />
          ) : (
            <p className="truncate text-xs text-muted">{candidate.party?.name}</p>
          )}
        </div>

        {score !== null ? (
          <>
            <span
              className="w-12 shrink-0 text-right font-serif text-lg font-semibold tabular-nums"
              style={{ color }}
            >
              {score}%
            </span>
            <div className="hidden h-2 flex-1 overflow-hidden rounded-full bg-surface-strong sm:block">
              <div
                className="h-full rounded-full transition-[width] duration-700 ease-out"
                style={{ width: `${score}%`, background: color }}
              />
            </div>
            <span className="hidden shrink-0 items-center gap-3 text-xs text-muted md:flex">
              <span className="flex items-center gap-1">
                <CircleCheck size={14} className="text-success" />
                {agreements.length}
              </span>
              <span className="flex items-center gap-1">
                <CircleX size={14} className="text-danger" />
                {disagreements.length}
              </span>
            </span>
          </>
        ) : (
          <Badge variant="outline">Données insuffisantes</Badge>
        )}

        <ChevronDown
          size={17}
          className={cn("shrink-0 text-muted-2 transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="animate-fade-in border-t border-border px-4 pb-4 pt-3">
          {comparableQuestions === 0 ? (
            <p className="text-sm text-muted">
              Ce candidat n&apos;a pas encore de position documentée sur les questions auxquelles
              vous avez répondu.
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="min-w-0">
                <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-success">
                  <CircleCheck size={14} /> Points d&apos;accord
                </p>
                {agreements.length > 0 ? (
                  <ul className="space-y-2">
                    {agreements.slice(0, 5).map((a) => (
                      <li key={a.question.id} className="text-sm leading-snug">
                        <span className="text-muted">{a.question.question}</span>{" "}
                        <button
                          type="button"
                          onClick={() =>
                            setModalData({ candidate, question: a.question, position: a.position })
                          }
                          className="focus-ring whitespace-nowrap text-xs font-medium text-primary underline underline-offset-2"
                        >
                          Voir la position
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-2">Aucun accord marqué détecté.</p>
                )}
              </div>
              <div className="min-w-0">
                <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-danger">
                  <CircleX size={14} /> Points de désaccord
                </p>
                {disagreements.length > 0 ? (
                  <ul className="space-y-2">
                    {disagreements.slice(0, 5).map((d) => (
                      <li key={d.question.id} className="text-sm leading-snug">
                        <span className="text-muted">{d.question.question}</span>{" "}
                        <button
                          type="button"
                          onClick={() =>
                            setModalData({ candidate, question: d.question, position: d.position })
                          }
                          className="focus-ring whitespace-nowrap text-xs font-medium text-primary underline underline-offset-2"
                        >
                          Voir la position
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-2">Aucun désaccord marqué détecté.</p>
                )}
              </div>
            </div>
          )}

          {themeScores.length > 0 && (
            <div className="mt-4 border-t border-border pt-4">
              <p className="mb-2.5 text-sm font-semibold">Scores par thème</p>
              <ThemeScoreList themeScores={themeScores} />
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <Link
              href={`/candidats/${candidate.slug}`}
              className="focus-ring font-medium text-primary hover:underline"
            >
              Voir son programme
            </Link>
            <Link
              href={`/comparer?a=${candidate.slug}`}
              className="focus-ring text-muted hover:text-foreground"
            >
              Comparer avec un autre candidat
            </Link>
          </div>
        </div>
      )}

      <PositionDetailModal data={modalData} onClose={() => setModalData(null)} />
    </div>
  );
}
