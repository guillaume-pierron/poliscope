"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Sparkle } from "@/components/ui/swoosh";
import { CivicSceneDoodle, CloudDoodle, PaperPlaneDoodle, PlantDoodle } from "@/components/ui/doodles";
import { ThemeIcon } from "@/lib/theme-icons";
import { cn } from "@/lib/utils";
import { LIKERT_OPTIONS } from "@/lib/data/local/questions";
import { loadAnswers, saveAnswers } from "@/lib/match-storage";
import type { Question, UserAnswer } from "@/lib/types";

/** Intensity glyphs for the five likert answers, from most to least agreement. */
const INTENSITY_GLYPHS: Record<number, string> = {
  2: "++",
  1: "+",
  0: "○",
  [-1]: "–",
  [-2]: "– –",
};

export function Questionnaire() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // localStorage is an external system only readable client-side on mount.
    const saved = loadAnswers();
    const map: Record<string, number | null> = {};
    saved.forEach((a) => {
      map[a.question_id] = a.value;
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAnswers(map);
    // Fetch the same public reference dataset the results page and homepage
    // panel use (candidates/positions/questions) so a saved answer's
    // question_id always matches whichever backend (Supabase or the local
    // fallback) is currently serving positions — never the demo IDs.
    fetch("/api/match-data")
      .then((res) => res.json())
      .then((data: { questions: Question[] }) => {
        const qs = data.questions;
        setQuestions(qs);
        const firstUnanswered = qs.findIndex((q) => !(q.id in map));
        setIndex(firstUnanswered === -1 ? 0 : firstUnanswered);
        setHydrated(true);
      })
      .catch(() => {
        setQuestions([]);
        setHydrated(true);
      });
  }, []);

  if (!hydrated || !questions || questions.length === 0) {
    return <div className="container-app py-24" />;
  }

  const total = questions.length;
  const question = questions[index];
  const theme = question.theme;
  const isLikert = question.answer_type !== "choice";
  const options = !isLikert && question.choices ? question.choices : LIKERT_OPTIONS;

  const currentValue = answers[question.id];
  const isAnswered = currentValue !== undefined;
  const isLast = index === total - 1;
  const estimatedMinutesLeft = Math.max(1, Math.round(((total - index) * 10) / 60));

  function persist(next: Record<string, number | null>) {
    setAnswers(next);
    const list: UserAnswer[] = questions!
      .filter((q) => q.id in next)
      .map((q) => ({ question_id: q.id, value: next[q.id] }));
    saveAnswers(list);
  }

  function selectValue(value: number) {
    persist({ ...answers, [question.id]: value });
  }

  function goNext() {
    if (isLast) {
      router.push("/match/resultats");
      return;
    }
    setIndex((i) => Math.min(i + 1, total - 1));
  }

  function goPrevious() {
    setIndex((i) => Math.max(i - 1, 0));
  }

  function skip() {
    persist({ ...answers, [question.id]: null });
    goNext();
  }

  return (
    <div className="overflow-hidden py-10 md:py-16">
      <div className="container-app max-w-2xl">
        <div className="relative">
          <CloudDoodle className="pointer-events-none absolute -bottom-6 -left-20 hidden h-8 w-16 opacity-60 lg:block" />
          <PaperPlaneDoodle className="pointer-events-none absolute -bottom-16 -left-36 hidden h-10 w-10 opacity-50 xl:block" />
          <PlantDoodle className="pointer-events-none absolute -right-16 top-16 hidden h-24 w-12 opacity-60 lg:block xl:-right-24" />
          <Sparkle className="pointer-events-none absolute -left-10 top-4 hidden h-4 w-4 text-primary/40 lg:block" />

          <div className="mb-8 flex items-center gap-4 text-sm">
            <span className="shrink-0 font-medium text-foreground">
              {index + 1} sur {total}
            </span>
            <Progress value={((index + 1) / total) * 100} className="flex-1" />
            <span className="flex shrink-0 items-center gap-1.5 text-muted-2">
              <Clock size={14} />
              ~{estimatedMinutesLeft} min
            </span>
          </div>

          <div
            key={question.id}
            className="animate-rise relative rounded-[24px] border border-border bg-card p-7 sm:p-9"
          >
          <div className="flex items-start justify-between gap-4">
            {theme && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1.5 text-sm font-medium text-primary">
                <ThemeIcon icon={theme.icon} className="h-4 w-4" />
                {theme.name}
              </span>
            )}
            <CivicSceneDoodle className="hidden h-16 w-24 shrink-0 sm:block" />
          </div>

          <h1 className="mt-5 text-balance font-serif text-2xl font-semibold leading-snug sm:text-[1.75rem]">
            {question.question}
          </h1>
          {question.description && (
            <p className="mt-2 text-sm text-muted">{question.description}</p>
          )}

          <div className="mt-7 space-y-2.5">
            {options.map((option) => {
              const selected = currentValue === option.value;
              const glyph = isLikert ? (INTENSITY_GLYPHS[option.value] ?? "○") : null;
              return (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => selectValue(option.value)}
                  className={cn(
                    "focus-ring flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left text-sm font-medium transition-all duration-150",
                    selected
                      ? "border-primary bg-primary-soft text-primary"
                      : "border-border-strong bg-card hover:bg-surface"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold tracking-tight",
                      selected ? "bg-card text-primary" : "bg-primary-soft text-primary"
                    )}
                  >
                    {glyph ?? <span className="h-2 w-2 rounded-full bg-current" />}
                  </span>
                  <span className="flex-1">{option.label}</span>
                  {selected && (
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                      <Check size={14} strokeWidth={3} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={goPrevious}
            disabled={index === 0}
            className="focus-ring flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground disabled:opacity-40"
          >
            <ArrowLeft size={16} />
            Précédent
          </button>

          <button
            type="button"
            onClick={skip}
            className="focus-ring text-sm font-medium text-muted-2 transition-colors hover:text-foreground"
            title="Exclut cette question du calcul — différent de « Neutre », qui compte comme une vraie réponse."
          >
            Passer <span className="hidden sm:inline">(sans opinion)</span>
          </button>

          <button
            type="button"
            onClick={goNext}
            disabled={!isAnswered}
            className="focus-ring flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-40"
          >
            {isLast ? "Voir mes résultats" : "Suivant"}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
