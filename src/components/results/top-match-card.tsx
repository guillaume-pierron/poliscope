"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeftRight,
  BadgeCheck,
  CircleCheck,
  CircleMinus,
  CircleX,
  Info,
  Sun,
} from "lucide-react";
import { CandidateAvatarWithParty } from "@/components/candidates/candidate-avatar-party";
import { PositionDetailModal, type PositionModalData } from "@/components/candidates/position-detail-modal";
import { ShareResultsButton } from "./share-results-button";
import { ScoreGauge } from "./score-gauge";
import { CoverageBadge, ProvisionalResultBadge } from "./coverage-badge";
import { ThemeScoreList } from "./theme-score-list";
import { ThemeIcon } from "@/lib/theme-icons";
import type { Candidate, CandidateMatchResult, CandidatePosition, Question, Theme } from "@/lib/types";

export function TopMatchCard({
  result,
  runnerUp,
  priorityThemes,
  allResults,
}: {
  result: CandidateMatchResult;
  runnerUp: CandidateMatchResult | null;
  priorityThemes: Theme[];
  allResults: CandidateMatchResult[];
}) {
  const [expanded, setExpanded] = useState(false);
  const [modalData, setModalData] = useState<PositionModalData | null>(null);
  const {
    candidate,
    score,
    agreements,
    disagreements,
    comparableQuestions,
    answeredQuestions,
    coverageLevel,
    themeScores,
    agreementThemes,
  } = result;
  const neutralCount = Math.max(0, comparableQuestions - agreements.length - disagreements.length);
  const shownAgreements = expanded ? agreements : agreements.slice(0, 4);
  const shownDisagreements = expanded ? disagreements : disagreements.slice(0, 3);

  return (
    <div className="relative rounded-[26px] border border-border bg-card px-6 pb-6 pt-9 shadow-[0_24px_70px_-42px_rgba(15,23,41,0.35)] sm:px-8 sm:pb-8">
      <div className="absolute -top-4 left-6 flex flex-wrap items-center gap-2 sm:left-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium shadow-[0_10px_24px_-16px_rgba(15,23,41,0.4)]">
          <BadgeCheck size={17} className="text-primary" />
          Votre meilleur match
        </span>
        {coverageLevel === "faible" && <ProvisionalResultBadge className="border border-border shadow-[0_10px_24px_-16px_rgba(15,23,41,0.4)]" />}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex min-w-0 items-center gap-4">
          <CandidateAvatarWithParty candidate={candidate} size="xl" />
          <div className="min-w-0">
            <p className="truncate font-serif text-[1.75rem] font-semibold leading-tight sm:text-[2rem]">
              {candidate.name}
            </p>
            <p className="mt-1 flex items-center gap-2 text-sm text-muted">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: candidate.party?.color ?? "var(--primary)" }}
              />
              {candidate.party?.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div>
            <p className="font-serif text-[3.2rem] font-semibold leading-none tabular-nums text-primary">
              {score}%
            </p>
            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted">
              de proximité avec vos réponses
              <Info size={13} className="shrink-0 text-muted-2" />
            </p>
          </div>
          {score !== null && <ScoreGauge score={score} className="hidden h-14 w-28 sm:block" />}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">
        <span>
          Calculé sur {comparableQuestions} position{comparableQuestions > 1 ? "s" : ""} documentée
          {comparableQuestions > 1 ? "s" : ""} parmi vos {answeredQuestions} réponse
          {answeredQuestions > 1 ? "s" : ""}.
        </span>
        {coverageLevel && <CoverageBadge level={coverageLevel} />}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-4 rounded-2xl border border-border p-4">
        <Stat icon={CircleCheck} tone="text-success" value={agreements.length} label="points d'accord" />
        <span className="hidden h-9 w-px bg-border sm:block" />
        <Stat icon={CircleX} tone="text-danger" value={disagreements.length} label="points de désaccord" />
        <span className="hidden h-9 w-px bg-border sm:block" />
        <Stat icon={CircleMinus} tone="text-muted-2" value={neutralCount} label="positions neutres" />

        {agreementThemes.length > 0 && (
          <div className="min-w-0 sm:ml-auto">
            <p className="mb-1.5 text-xs font-medium text-muted">Thèmes clés en commun</p>
            <div className="flex flex-wrap gap-1.5">
              {agreementThemes.slice(0, 4).map((theme) => (
                <span
                  key={theme.id}
                  className="rounded-full bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary"
                >
                  {theme.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr_232px]">
        <PointsPanel
          title="Vos principaux points d'accord"
          tone="success"
          items={shownAgreements}
          candidate={candidate}
          onSelect={setModalData}
          emptyLabel="Aucun accord marqué détecté."
        />
        <PointsPanel
          title="Vos principaux points de désaccord"
          tone="danger"
          items={shownDisagreements}
          candidate={candidate}
          onSelect={setModalData}
          emptyLabel="Aucun désaccord marqué détecté."
        />

        {priorityThemes.length > 0 && (
          <div className="min-w-0 rounded-2xl bg-primary-soft/50 p-4">
            <p className="text-sm font-semibold text-primary">Vos réponses en bref</p>
            <p className="text-xs text-muted">Vos priorités ressorties</p>
            <div className="mt-3 space-y-2">
              {priorityThemes.map((theme) => (
                <span
                  key={theme.id}
                  className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm"
                >
                  <ThemeIcon icon={theme.icon} className="h-4 w-4 shrink-0 text-primary" />
                  <span className="truncate">{theme.name}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {expanded && themeScores.length > 0 && (
        <div className="animate-fade-in mt-4 min-w-0 rounded-2xl border border-border p-4">
          <p className="mb-3 text-sm font-semibold">Vos scores par thème</p>
          <ThemeScoreList themeScores={themeScores} />
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="focus-ring inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98]"
        >
          {expanded ? "Voir moins" : "Voir pourquoi"}
          <Sun size={15} />
        </button>

        {runnerUp && (
          <Link
            href={`/comparer/${candidate.slug}-vs-${runnerUp.candidate.slug}`}
            className="focus-ring inline-flex items-center gap-2 rounded-full border border-border-strong bg-card px-5 py-2.5 text-sm font-medium transition-colors hover:bg-surface"
          >
            <ArrowLeftRight size={15} />
            Comparer avec {runnerUp.candidate.name}
          </Link>
        )}

        <ShareResultsButton results={allResults} className="sm:ml-auto" />
      </div>

      <PositionDetailModal data={modalData} onClose={() => setModalData(null)} />
    </div>
  );
}

function Stat({
  icon: Icon,
  tone,
  value,
  label,
}: {
  icon: typeof CircleCheck;
  tone: string;
  value: number;
  label: string;
}) {
  return (
    <span className="flex items-center gap-2.5">
      <Icon size={20} className={`shrink-0 ${tone}`} />
      <span>
        <span className="block text-lg font-semibold leading-none tabular-nums">{value}</span>
        <span className="mt-1 block text-xs text-muted">{label}</span>
      </span>
    </span>
  );
}

function PointsPanel({
  title,
  tone,
  items,
  candidate,
  onSelect,
  emptyLabel,
}: {
  title: string;
  tone: "success" | "danger";
  items: { question: Question; similarity: number; position: CandidatePosition }[];
  candidate: Candidate;
  onSelect: (data: PositionModalData) => void;
  emptyLabel: string;
}) {
  const Icon = tone === "success" ? CircleCheck : CircleX;
  return (
    <div className="min-w-0 rounded-2xl border border-border p-4">
      <p className={`mb-3 text-sm font-semibold ${tone === "success" ? "text-success" : "text-danger"}`}>
        {title}
      </p>
      {items.length > 0 ? (
        <ul className="space-y-3">
          {items.map(({ question, position }) => (
            <li key={question.id} className="flex gap-2.5">
              <Icon
                size={16}
                className={`mt-0.5 shrink-0 ${tone === "success" ? "text-success" : "text-danger"}`}
              />
              <span className="min-w-0">
                <span className="block text-sm leading-snug">{question.question}</span>
                <button
                  type="button"
                  onClick={() => onSelect({ candidate, question, position })}
                  className="focus-ring mt-0.5 inline-block text-xs font-medium text-primary underline underline-offset-2"
                >
                  Voir la position du candidat
                </button>
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-2">{emptyLabel}</p>
      )}
    </div>
  );
}
