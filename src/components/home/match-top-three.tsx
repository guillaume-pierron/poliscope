"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight, Trophy } from "lucide-react";
import { CandidateAvatar } from "@/components/candidates/candidate-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { loadAnswers } from "@/lib/match-storage";
import { computeMatchResults, computeThemeWeightsFromPriorityAnswers } from "@/lib/scoring";
import type { Candidate, CandidatePosition, Question, UserAnswer } from "@/lib/types";

type MatchData = { candidates: Candidate[]; positions: CandidatePosition[]; questions: Question[] };

/**
 * « Votre top 3 » : n'affiche que les résultats réellement calculés à partir
 * des réponses du visiteur, jamais un classement d'exemple. Tant qu'il n'a pas
 * répondu, le panneau explique ce qu'il obtiendra — sans pourcentage inventé.
 * Les réponses ne quittent pas l'appareil : seul le jeu de données public est
 * récupéré du serveur.
 */
export function MatchTopThree({ candidateCount }: { candidateCount: number }) {
  const [answers, setAnswers] = useState<UserAnswer[] | null>(null);
  const [data, setData] = useState<MatchData | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAnswers(loadAnswers());
  }, []);

  const answeredCount = answers?.filter((a) => a.value !== null).length ?? 0;

  useEffect(() => {
    if (answeredCount === 0) return;
    fetch("/api/match-data")
      .then((res) => res.json())
      .then(setData)
      .catch(() => setData({ candidates: [], positions: [], questions: [] }));
  }, [answeredCount]);

  return (
    <div className="rounded-[22px] border border-border bg-card p-5 shadow-[0_24px_70px_-40px_rgba(15,23,41,0.35)] sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
            <Trophy size={19} />
          </span>
          <h4 className="font-serif text-[1.35rem] font-semibold tracking-tight">Votre top 3</h4>
        </div>
        <span className="shrink-0 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-medium text-primary">
          {candidateCount} candidats comparés
        </span>
      </div>

      <Body answers={answers} answeredCount={answeredCount} data={data} candidateCount={candidateCount} />
    </div>
  );
}

function Body({
  answers,
  answeredCount,
  data,
  candidateCount,
}: {
  answers: UserAnswer[] | null;
  answeredCount: number;
  data: MatchData | null;
  candidateCount: number;
}) {
  // Tant que la lecture du stockage local n'a pas abouti, on ne peut rien
  // affirmer : le rendu serveur ne doit pas deviner à la place du visiteur.
  if (answers === null) {
    return (
      <div className="mt-5 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </div>
    );
  }

  if (answeredCount === 0) {
    return (
      <>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          Votre classement s&apos;affichera ici, du candidat le plus proche de vos réponses au plus
          éloigné. Le pourcentage mesure la compatibilité de ses positions documentées avec vos
          idées — il n&apos;existe qu&apos;une fois vos réponses données.
        </p>
        <ul className="mt-4 space-y-2.5">
          {[1, 2, 3].map((rank) => (
            <li
              key={rank}
              className="flex items-center gap-3 rounded-2xl border border-dashed border-border-strong px-4 py-3.5"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface text-xs font-semibold text-muted-2">
                {rank}
              </span>
              <span className="h-9 w-9 shrink-0 rounded-full bg-surface" />
              <span className="text-sm text-muted-2">En attente de vos réponses</span>
            </li>
          ))}
        </ul>
        <Link
          href="/match"
          className="focus-ring mt-4 flex items-center justify-center gap-1.5 rounded-2xl bg-surface px-4 py-3 text-sm font-medium transition-colors hover:bg-surface-strong"
        >
          Répondre aux questions
          <ArrowRight size={15} />
        </Link>
      </>
    );
  }

  if (!data) {
    return (
      <div className="mt-5 space-y-3">
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </div>
    );
  }

  const themeWeights = computeThemeWeightsFromPriorityAnswers(answers, data.questions);
  const results = computeMatchResults(
    answers,
    data.candidates,
    data.positions,
    data.questions,
    themeWeights
  ).filter((r) => r.score !== null);
  const top3 = results.slice(0, 3);

  if (top3.length === 0) {
    return (
      <p className="mt-4 rounded-2xl border border-dashed border-border-strong p-5 text-center text-sm text-muted-2">
        Aucun candidat n&apos;a encore de position documentée sur vos réponses.
      </p>
    );
  }

  return (
    <>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        Voici les candidats les plus proches de vos réponses. Le pourcentage indique la
        compatibilité de leurs positions avec vos idées.
      </p>

      <ul className="mt-4 space-y-2.5">
        {top3.map((result, i) => {
          const { candidate, score } = result;
          const color = candidate.party?.color ?? "var(--primary)";
          return (
            <li key={candidate.id}>
              <Link
                href={`/candidats/${candidate.slug}`}
                className={`focus-ring flex items-center gap-3 rounded-2xl border px-4 py-3.5 transition-colors ${
                  i === 0
                    ? "border-primary/25 bg-primary-soft/50 hover:bg-primary-soft/70"
                    : "border-border hover:bg-surface"
                }`}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-card text-xs font-semibold text-muted">
                  {i + 1}
                </span>
                <CandidateAvatar
                  name={candidate.name}
                  color={candidate.party?.color}
                  photoUrl={candidate.photo_url}
                  size="sm"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{candidate.name}</span>
                  <span className="block truncate text-xs text-muted">
                    {candidate.party?.name ?? "Sans étiquette"}
                  </span>
                  <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-surface-strong">
                    <span
                      className="block h-full rounded-full"
                      style={{ width: `${score}%`, background: color }}
                    />
                  </span>
                </span>
                <span
                  className="shrink-0 font-mono text-sm font-semibold tabular-nums"
                  style={{ color }}
                >
                  {score}%
                </span>
                <ChevronRight size={16} className="shrink-0 text-muted-2" />
              </Link>
            </li>
          );
        })}
      </ul>

      <Link
        href="/match/resultats"
        className="focus-ring mt-4 flex items-center justify-center gap-1.5 rounded-2xl bg-surface px-4 py-3 text-sm font-medium transition-colors hover:bg-surface-strong"
      >
        Voir le classement complet ({candidateCount} candidats)
        <ArrowRight size={15} />
      </Link>
    </>
  );
}
