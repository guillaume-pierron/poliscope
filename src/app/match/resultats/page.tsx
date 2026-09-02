"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ScanSearch, SplitSquareHorizontal, Info } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CandidateResultCard } from "@/components/results/candidate-result-card";
import { ShareResults } from "@/components/results/share-results";
import { loadAnswers } from "@/lib/match-storage";
import { computeMatchResults } from "@/lib/scoring";
import type { Candidate, CandidateMatchResult, CandidatePosition, Question, UserAnswer } from "@/lib/types";

type MatchData = { candidates: Candidate[]; positions: CandidatePosition[]; questions: Question[] };

export default function ResultatsPage() {
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

  const top2 = results.slice(0, 2).filter((r) => r.score !== null);

  return (
    <div className="container-app max-w-3xl py-10 md:py-16">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Vos résultats</h1>
      <p className="mt-2 text-muted">
        Basés sur {answeredCount} réponse{answeredCount > 1 ? "s" : ""} comparées aux positions
        documentées de chaque candidat.{" "}
        <Link href="/methodologie" className="underline underline-offset-2">
          Comment ce score est calculé ?
        </Link>
      </p>

      <div className="mt-8 flex items-start gap-3 rounded-xl border border-border bg-surface p-4 text-sm text-muted">
        <Info size={16} className="mt-0.5 shrink-0" />
        <p>
          Ces résultats indiquent uniquement que vos réponses sont les plus proches des positions
          actuellement renseignées pour ce candidat — jamais une recommandation de vote.
        </p>
      </div>

      <div className="mt-8 space-y-3">
        {results.map((result, i) => (
          <CandidateResultCard key={result.candidate.id} result={result} rank={i + 1} />
        ))}
      </div>

      {top2.length === 2 && (
        <ButtonLink
          href={`/comparer/${top2[0].candidate.slug}-vs-${top2[1].candidate.slug}`}
          variant="outline"
          size="lg"
          className="mt-8 w-full sm:w-auto"
        >
          <SplitSquareHorizontal size={18} />
          Comparer mes deux meilleurs résultats
        </ButtonLink>
      )}

      <div className="mt-10">
        <ShareResults results={results} />
      </div>
    </div>
  );
}
