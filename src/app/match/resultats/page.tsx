"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FileText, Info, RotateCcw, ScanSearch, Users } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CandidateResultCard } from "@/components/results/candidate-result-card";
import { TopMatchCard } from "@/components/results/top-match-card";
import { CompareTopTwoCard } from "@/components/results/compare-top-two-card";
import { CivicLandscapeIllustration, ConfettiDoodle } from "@/components/ui/doodles";
import { clearAnswers, loadAnswers } from "@/lib/match-storage";
import { computeMatchResults, computeUserPriorityThemes } from "@/lib/scoring";
import type { Candidate, CandidateMatchResult, CandidatePosition, Question, UserAnswer } from "@/lib/types";

type MatchData = { candidates: Candidate[]; positions: CandidatePosition[]; questions: Question[] };

export default function ResultatsPage() {
  const router = useRouter();
  const [data, setData] = useState<MatchData | null>(null);
  const [answers, setAnswers] = useState<UserAnswer[] | null>(null);

  useEffect(() => {
    // Reading localStorage and fetching are both external-system reads that
    // can only happen client-side on mount — not state derivable from props.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAnswers(loadAnswers());
    fetch("/api/match-data")
      .then((res) => res.json())
      .then(setData)
      .catch(() => setData({ candidates: [], positions: [], questions: [] }));
  }, []);

  if (answers === null || data === null) {
    return (
      <div className="container-app max-w-3xl space-y-4 py-16">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  const answeredCount = answers.filter((a) => a.value !== null).length;

  if (answeredCount === 0) {
    return (
      <div className="container-app flex max-w-lg flex-col items-center py-24 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary">
          <ScanSearch size={24} />
        </span>
        <h1 className="mt-6 text-2xl font-semibold">Aucun résultat pour l&apos;instant</h1>
        <p className="mt-3 text-muted">
          Vous n&apos;avez pas encore répondu au questionnaire, ou vos réponses ont été effacées
          de cet appareil. Faites le Match pour découvrir votre classement.
        </p>
        <ButtonLink href="/match" variant="accent" size="lg" className="mt-8">
          Faire mon Match
        </ButtonLink>
      </div>
    );
  }

  const results: CandidateMatchResult[] = computeMatchResults(
    answers,
    data.candidates,
    data.positions,
    data.questions
  );
  const ranked = results.filter((r) => r.score !== null);
  const top = ranked[0] ?? null;
  const runnerUp = ranked[1] ?? null;
  const priorityThemes = computeUserPriorityThemes(answers, data.questions);

  function refaireLeMatch() {
    clearAnswers();
    router.push("/match");
  }

  return (
    <div className="overflow-hidden py-10 md:py-14">
      <div className="container-app">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-12">
          <div className="min-w-0">
            <div className="relative inline-block">
              <h1 className="text-balance font-serif text-[2.3rem] font-semibold leading-[1.08] tracking-tight sm:text-[2.7rem]">
                Vos résultats
                <br />
                sont prêts
              </h1>
              <ConfettiDoodle className="pointer-events-none absolute -right-20 -top-2 hidden h-20 w-24 sm:block" />
            </div>

            <p className="mt-4 max-w-sm text-muted">
              Basés sur {answeredCount} réponse{answeredCount > 1 ? "s" : ""} comparées aux
              positions documentées de chaque candidat.
            </p>

            <div className="mt-6 flex max-w-sm items-start gap-3 rounded-2xl border border-border bg-surface p-4 text-sm text-muted">
              <Info size={16} className="mt-0.5 shrink-0" />
              <p>
                Poliscope compare vos réponses avec les positions publiques et sourcées des
                candidats. Ce score informe, il ne recommande jamais un vote.{" "}
                <Link href="/methodologie" className="underline underline-offset-2">
                  Comment c&apos;est calculé&nbsp;?
                </Link>
              </p>
            </div>

            <CivicLandscapeIllustration className="mt-8 hidden w-full lg:block" />
          </div>

          <div className="min-w-0">
            {top ? (
              <TopMatchCard
                result={top}
                runnerUp={runnerUp}
                priorityThemes={priorityThemes}
                allResults={results}
              />
            ) : (
              <div className="rounded-[26px] border border-dashed border-border-strong p-8 text-center text-sm text-muted-2">
                Aucun candidat n&apos;a encore de position documentée sur vos réponses.
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,41%)_minmax(0,1fr)]">
          <div className="min-w-0">
            {top && runnerUp && <CompareTopTwoCard first={top} second={runnerUp} />}
          </div>

          <div className="min-w-0 rounded-[22px] border border-border bg-card p-2">
            {results.map((result, i) => (
              <CandidateResultCard
                key={result.candidate.id}
                result={result}
                rank={i + 1}
                highlighted={i === 0}
              />
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <button
            type="button"
            onClick={refaireLeMatch}
            className="focus-ring flex items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 py-3.5 text-sm font-medium transition-colors hover:bg-surface"
          >
            <RotateCcw size={16} className="text-muted" />
            Refaire le Match
          </button>
          <Link
            href="/candidats"
            className="focus-ring flex items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 py-3.5 text-sm font-medium transition-colors hover:bg-surface"
          >
            <Users size={16} className="text-muted" />
            Voir tous les candidats
          </Link>
          <Link
            href="/comparer"
            className="focus-ring flex items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 py-3.5 text-sm font-medium transition-colors hover:bg-surface"
          >
            <FileText size={16} className="text-muted" />
            Explorer les programmes
          </Link>
        </div>

        <p className="mt-4 text-center text-xs text-muted-2">
          Seuls vos scores de proximité sont partagés — jamais le détail de vos réponses, qui ne
          quittent jamais votre appareil.
        </p>
      </div>
    </div>
  );
}
