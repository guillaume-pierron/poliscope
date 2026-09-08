"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, FileText, HelpCircle, Lock, RefreshCcw, SplitSquareHorizontal, Users } from "lucide-react";
import { CandidateAvatar } from "@/components/candidates/candidate-avatar";
import { ButtonLink } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { HandNote } from "@/components/ui/hand-note";
import { MatchMiniOrbit } from "./match-mini-orbit";
import { computeMatchResults, computeThemeWeightsFromPriorityAnswers } from "@/lib/scoring";
import { countChangedPositions, loadSnapshot, saveSnapshot } from "@/lib/match-storage";
import { formatDate } from "@/lib/utils";
import type {
  Candidate,
  CandidateMatchResult,
  CandidatePosition,
  Question,
  UserAnswer,
} from "@/lib/types";

type MatchData = { candidates: Candidate[]; positions: CandidatePosition[]; questions: Question[] };

export function MatchHeroPanel({
  answers,
  questionCount,
  candidates,
}: {
  answers: UserAnswer[];
  /** Portraits de la constellation du premier écran. */
  candidates: Candidate[];
  /** Real number of questions currently asked — never a hardcoded "18" that could go stale. */
  questionCount: number;
}) {
  const [data, setData] = useState<MatchData | null>(null);
  const [changedCount, setChangedCount] = useState(0);
  const [computedAt, setComputedAt] = useState<string | null>(null);
  const answeredCount = answers.filter((a) => a.value !== null).length;

  useEffect(() => {
    if (answeredCount === 0) return;
    // The public reference dataset (candidates/positions/questions) is
    // fetched fresh — never a visitor's own answers, which stay local.
    fetch("/api/match-data")
      .then((res) => res.json())
      .then((json: MatchData) => {
        const previous = loadSnapshot();
        if (previous) {
          setChangedCount(countChangedPositions(previous.positions, json.positions));
        }
        const now = new Date().toISOString();
        saveSnapshot(json.positions, now);
        setComputedAt(now);
        setData(json);
      })
      .catch(() => setData({ candidates: [], positions: [], questions: [] }));
  }, [answeredCount]);

  // Premier écran d'un visiteur qui découvre le site : le panneau explique
  // l'outil et l'engagement demandé, sans jamais montrer de score d'exemple
  // qui pourrait se lire comme un vrai résultat.
  if (answeredCount === 0) {
    return (
      <div className="rounded-[22px] border border-border bg-card p-6 shadow-[0_24px_70px_-38px_rgba(15,23,41,0.35)] sm:p-7">
        <h2 className="font-serif text-[1.9rem] font-semibold leading-none tracking-tight">
          Mon Match
        </h2>
        <p className="mt-2.5 text-sm leading-relaxed text-muted">
          Répondez à {questionCount} questions et découvrez les candidats les plus proches de vos
          idées.
        </p>

        <div className="mt-5 grid grid-cols-3 gap-2.5">
          <PanelStat icon={FileText} value={`${questionCount} questions`} detail="sur les grands enjeux" />
          <PanelStat icon={Clock} value="3 minutes" detail="seulement" />
          <PanelStat
            icon={Users}
            value={`${candidates.length} candidats`}
            detail="comparés"
          />
        </div>

        <div className="mt-5 border-t border-border pt-4">
          <div className="relative">
            <MatchMiniOrbit candidates={candidates} />
            <HandNote className="absolute -top-1 right-0 hidden w-[8rem] -rotate-3 text-right leading-tight lg:block">
              Des idées plus proches de vous&nbsp;?
            </HandNote>
          </div>
        </div>

        <ButtonLink href="/match" variant="accent" size="lg" className="mt-4 w-full">
          Commencer le questionnaire
          <ArrowRight size={17} />
        </ButtonLink>

        <Link
          href="/methodologie"
          className="focus-ring mt-3 flex items-center justify-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          <HelpCircle size={15} />
          Comment ça marche&nbsp;?
        </Link>

        <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-2">
          <Lock size={12} />
          Sans inscription · Réponses conservées sur votre appareil
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-3 rounded-[20px] border border-border bg-card p-6 shadow-[0_24px_70px_-38px_rgba(15,23,41,0.35)]">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  const themeWeights = computeThemeWeightsFromPriorityAnswers(answers, data.questions);
  const results: CandidateMatchResult[] = computeMatchResults(
    answers,
    data.candidates,
    data.positions,
    data.questions,
    themeWeights
  );
  const top5 = results.slice(0, 5);
  const top2 = results.slice(0, 2).filter((r) => r.score !== null);

  return (
    <div className="rounded-[20px] border border-border bg-card p-6 shadow-[0_24px_70px_-38px_rgba(15,23,41,0.35)]">
      <div className="flex items-center justify-between gap-3">
        <p className="font-serif text-[1.05rem] font-semibold">Mon Match</p>
        {changedCount > 0 ? (
          <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent">
            <RefreshCcw size={11} />
            Votre Match a changé
          </span>
        ) : (
          <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-success-soft px-2.5 py-1 text-xs font-medium text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Mis à jour {computedAt && isToday(computedAt) ? "aujourd'hui" : computedAt ? formatDate(computedAt) : ""}
          </span>
        )}
      </div>
      {changedCount > 0 && (
        <p className="mt-1 text-xs text-muted-2">
          {changedCount} position{changedCount > 1 ? "s" : ""} candidate
          {changedCount > 1 ? "s ont" : " a"} été mise{changedCount > 1 ? "s" : ""} à jour depuis
          votre dernière visite.
        </p>
      )}

      <ul className="mt-5 space-y-3.5">
        {top5.map((result) => {
          const { candidate, score, agreements } = result;
          const color = candidate.party?.color ?? "var(--primary)";
          const themeTag = agreements[0]?.question.theme?.name;
          return (
            <li key={candidate.id} className="flex items-center gap-3">
              <CandidateAvatar
                name={candidate.name}
                color={candidate.party?.color}
                photoUrl={candidate.photo_url}
                size="sm"
                className="ring-2 ring-primary/35"
              />
              <p className="w-[100px] shrink-0 truncate text-sm font-medium xl:w-[130px]">
                {candidate.name}
              </p>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-strong">
                <div
                  className="h-full rounded-full transition-[width] duration-700 ease-out"
                  style={{ width: score !== null ? `${score}%` : "0%", background: color }}
                />
              </div>
              <span
                className="w-[42px] shrink-0 text-right font-mono text-sm font-semibold tabular-nums"
                style={{ color }}
              >
                {score !== null ? `${score}%` : "—"}
              </span>
              {themeTag && (
                <span className="hidden shrink-0 rounded-full bg-surface px-2.5 py-1 text-xs text-muted xl:inline-block">
                  {themeTag}
                </span>
              )}
            </li>
          );
        })}
      </ul>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <Link
          href="/match/resultats"
          className="focus-ring flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          Voir le détail
          <ArrowRight size={13} />
        </Link>
        {top2.length === 2 && (
          <Link
            href={`/comparer/${top2[0].candidate.slug}-vs-${top2[1].candidate.slug}`}
            className="focus-ring flex items-center gap-1.5 text-xs font-medium text-muted hover:text-foreground"
          >
            <SplitSquareHorizontal size={13} />
            Comparer mes deux premiers résultats
          </Link>
        )}
      </div>
    </div>
  );
}

function PanelStat({
  icon: Icon,
  value,
  detail,
}: {
  icon: typeof Users;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-xl bg-primary-soft/60 p-3">
      <Icon size={16} className="text-primary" />
      <p className="mt-1.5 text-sm font-semibold leading-tight">{value}</p>
      <p className="text-xs leading-tight text-muted-2">{detail}</p>
    </div>
  );
}

function isToday(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}
