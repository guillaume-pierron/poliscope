"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, RefreshCcw, ScanSearch, SplitSquareHorizontal } from "lucide-react";
import { CandidateAvatar } from "@/components/candidates/candidate-avatar";
import { ButtonLink } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { computeMatchResults } from "@/lib/scoring";
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

export function MatchHeroPanel({ answers }: { answers: UserAnswer[] }) {
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

  if (answeredCount === 0) {
    return (
      <div className="rounded-[20px] border border-border bg-card p-6 text-center shadow-[0_24px_70px_-38px_rgba(15,23,41,0.35)]">
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-primary-soft text-primary">
          <ScanSearch size={20} />
        </span>
        <p className="mt-3 text-sm text-muted">
          Vous n&apos;avez pas encore fait le Match sur cet appareil.
        </p>
        <ButtonLink href="/match" variant="accent" size="sm" className="mt-4">
          Faire mon Match
        </ButtonLink>
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

  const results: CandidateMatchResult[] = computeMatchResults(
    answers,
    data.candidates,
    data.positions,
    data.questions
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

function isToday(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}
