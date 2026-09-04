"use client";

import { useState } from "react";
import { CircleCheck, CircleX, Info } from "lucide-react";
import { CircularScoreGauge } from "@/components/results/circular-score-gauge";
import { CoverageBadge, ProvisionalResultBadge } from "@/components/results/coverage-badge";
import { PositionDetailModal, type PositionModalData } from "./position-detail-modal";
import { ButtonLink } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCandidateMatchResult } from "@/lib/use-candidate-match";
import { formatDate } from "@/lib/utils";
import { ThemeIcon } from "@/lib/theme-icons";
import type { Candidate, CandidatePosition, Question } from "@/lib/types";

/** The "Votre proximité" gauge card. */
export function CandidateProximityCard({ candidate }: { candidate: Candidate }) {
  const state = useCandidateMatchResult(candidate);

  if (state.status === "loading") {
    return (
      <div className="space-y-3 rounded-2xl border border-border bg-card p-6">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-24 w-24 rounded-full" />
      </div>
    );
  }

  if (state.status === "no-match") {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center">
        <p className="text-sm font-semibold">Votre proximité</p>
        <p className="mt-2 text-sm text-muted">
          Faites le Match pour découvrir votre proximité avec {candidate.name}.
        </p>
        <ButtonLink href="/match" variant="accent" size="sm" className="mt-4">
          Faire mon Match
        </ButtonLink>
      </div>
    );
  }

  if (state.status === "no-data") {
    return (
      <div className="rounded-2xl border border-dashed border-border-strong p-6 text-center text-sm text-muted-2">
        {candidate.name} n&apos;a pas encore de position documentée sur vos réponses.
      </div>
    );
  }

  const { result, computedAt } = state;

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <p className="flex items-center gap-1.5 text-sm font-semibold">
        Votre proximité
        <Info size={13} className="text-muted-2" />
      </p>

      <div className="mt-4 flex items-center gap-5">
        <CircularScoreGauge score={result.score!} />
        <div className="min-w-0">
          {result.coverageLevel === "faible" && <ProvisionalResultBadge />}
          <p className="mt-1.5 text-sm font-medium">
            {result.comparableQuestions} position{result.comparableQuestions > 1 ? "s" : ""}{" "}
            comparable{result.comparableQuestions > 1 ? "s" : ""} sur {result.answeredQuestions}
          </p>
          <p className="mt-1 text-xs text-muted-2">Calculé le {formatDate(computedAt)}</p>
        </div>
      </div>

      {result.coverageLevel && result.coverageLevel !== "faible" && (
        <div className="mt-3">
          <CoverageBadge level={result.coverageLevel} />
        </div>
      )}

      {result.agreementThemes.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {result.agreementThemes.slice(0, 3).map((theme) => (
            <span
              key={theme.id}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary"
            >
              <ThemeIcon icon={theme.icon} className="h-3.5 w-3.5" />
              {theme.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/** "Vos points communs" + "Vos désaccords" — renders nothing until there's a real Match to show. */
export function CandidatePointsCards({ candidate }: { candidate: Candidate }) {
  const [modalData, setModalData] = useState<PositionModalData | null>(null);
  const state = useCandidateMatchResult(candidate);

  if (state.status !== "ready") return null;
  const { result } = state;

  return (
    <>
      <PointsList
        tone="success"
        title="Vos points communs"
        items={result.agreements}
        candidate={candidate}
        onSelect={setModalData}
        emptyLabel="Aucun accord marqué détecté."
      />
      <PointsList
        tone="danger"
        title="Vos désaccords"
        items={result.disagreements}
        candidate={candidate}
        onSelect={setModalData}
        emptyLabel="Aucun désaccord marqué détecté."
      />
      <PositionDetailModal data={modalData} onClose={() => setModalData(null)} />
    </>
  );
}

function PointsList({
  tone,
  title,
  items,
  candidate,
  onSelect,
  emptyLabel,
}: {
  tone: "success" | "danger";
  title: string;
  items: { question: Question; similarity: number; position: CandidatePosition }[];
  candidate: Candidate;
  onSelect: (data: PositionModalData) => void;
  emptyLabel: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const Icon = tone === "success" ? CircleCheck : CircleX;
  const toneClass = tone === "success" ? "text-success" : "text-danger";
  const bgClass = tone === "success" ? "bg-success-soft" : "bg-danger-soft";
  const shown = expanded ? items : items.slice(0, 3);

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <p className={`flex items-center gap-1.5 text-sm font-semibold ${toneClass}`}>
          <Icon size={15} />
          {title}
        </p>
        <p className="mt-2 text-sm text-muted-2">{emptyLabel}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between gap-3">
        <p className={`flex items-center gap-1.5 text-sm font-semibold ${toneClass}`}>
          <Icon size={15} />
          {title}
        </p>
        <span
          className={`flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs font-semibold ${bgClass} ${toneClass}`}
        >
          {items.length}
        </span>
      </div>

      <ul className="mt-3 space-y-2">
        {shown.map((item) => (
          <li key={item.question.id} className="text-sm leading-snug">
            <button
              type="button"
              onClick={() => onSelect({ candidate, question: item.question, position: item.position })}
              className="focus-ring text-left text-foreground/85 hover:text-foreground hover:underline"
            >
              {item.question.question}
            </button>
          </li>
        ))}
      </ul>

      {items.length > 3 && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className={`focus-ring mt-3 text-sm font-medium hover:underline ${toneClass}`}
        >
          {expanded ? "Voir moins" : "Voir le détail →"}
        </button>
      )}
    </div>
  );
}
