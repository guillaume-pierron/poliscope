"use client";

import { useState } from "react";
import { ChevronDown, ThumbsUp, ThumbsDown } from "lucide-react";
import { CandidateAvatar } from "@/components/candidates/candidate-avatar";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { CandidateMatchResult } from "@/lib/types";

export function CandidateResultCard({
  result,
  rank,
}: {
  result: CandidateMatchResult;
  rank: number;
}) {
  const [open, setOpen] = useState(rank === 1);
  const { candidate, score, agreements, disagreements, comparableQuestions } = result;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="focus-ring flex w-full items-center gap-4 p-5 text-left"
        aria-expanded={open}
      >
        <span className="w-5 shrink-0 text-sm font-semibold text-muted-2">{rank}</span>
        <CandidateAvatar name={candidate.name} color={candidate.party?.color} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{candidate.name}</p>
          <p className="truncate text-sm text-muted">{candidate.party?.name}</p>
          <div className="mt-2 h-2 w-full max-w-xs overflow-hidden rounded-full bg-surface-strong">
            <div
              className="h-full rounded-full transition-[width] duration-700 ease-out"
              style={{
                width: score !== null ? `${score}%` : "0%",
                background: candidate.party?.color ?? "var(--primary)",
              }}
            />
          </div>
        </div>
        <div className="text-right">
          {score !== null ? (
            <span className="font-mono text-2xl font-semibold tabular-nums">{score}%</span>
          ) : (
            <Badge variant="outline">Données insuffisantes</Badge>
          )}
        </div>
        <ChevronDown
          size={18}
          className={cn("shrink-0 text-muted transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="animate-fade-in border-t border-border p-5 pt-4">
          {comparableQuestions === 0 ? (
            <p className="text-sm text-muted">
              Ce candidat n&apos;a pas encore de position documentée sur les questions auxquelles
              vous avez répondu.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-success">
                  <ThumbsUp size={14} /> Vos principaux points d&apos;accord
                </p>
                {agreements.length > 0 ? (
                  <ul className="space-y-1.5">
                    {agreements.map((a) => (
                      <li key={a.question.id} className="text-sm text-muted">
                        {a.question.question}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-2">Aucun accord marqué détecté.</p>
                )}
              </div>
              <div>
                <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-danger">
                  <ThumbsDown size={14} /> Vos principaux points de désaccord
                </p>
                {disagreements.length > 0 ? (
                  <ul className="space-y-1.5">
                    {disagreements.map((d) => (
                      <li key={d.question.id} className="text-sm text-muted">
                        {d.question.question}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-2">Aucun désaccord marqué détecté.</p>
                )}
              </div>
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            <ButtonLink href={`/candidats/${candidate.slug}`} variant="outline" size="sm">
              Voir son programme
            </ButtonLink>
            <ButtonLink href={`/comparer?a=${candidate.slug}`} variant="ghost" size="sm">
              Comparer avec un autre candidat
            </ButtonLink>
          </div>
        </div>
      )}
    </div>
  );
}
