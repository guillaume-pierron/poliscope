"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { questions, LIKERT_OPTIONS } from "@/lib/data/local/questions";
import { themes } from "@/lib/data/local/themes";
import { loadAnswers, saveAnswers } from "@/lib/match-storage";
import type { UserAnswer } from "@/lib/types";

export function Questionnaire() {
  const router = useRouter();
  const total = questions.length;
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
    const firstUnanswered = questions.findIndex((q) => !(q.id in map));
    setIndex(firstUnanswered === -1 ? 0 : firstUnanswered);
    setHydrated(true);
  }, []);

  const question = questions[index];
  const theme = useMemo(
    () => themes.find((t) => t.id === question.theme_id),
    [question]
  );
  const options = question.answer_type === "choice" && question.choices
    ? question.choices
    : LIKERT_OPTIONS;

  const currentValue = answers[question.id];
  const isAnswered = currentValue !== undefined;
  const isLast = index === total - 1;

  function persist(next: Record<string, number | null>) {
    setAnswers(next);
    const list: UserAnswer[] = questions
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

  if (!hydrated) {
    return <div className="container-app py-24" />;
  }

  return (
    <div className="container-app max-w-2xl py-10 md:py-16">
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-sm text-muted">
          <span>
            Question {index + 1} / {total}
          </span>
          {theme && <Badge variant="primary">{theme.name}</Badge>}
        </div>
        <Progress value={((index + 1) / total) * 100} />
      </div>

      <div key={question.id} className="animate-rise">
        <h1 className="text-balance text-2xl font-semibold leading-snug sm:text-3xl">
          {question.question}
        </h1>
        {question.description && (
          <p className="mt-3 text-sm text-muted">{question.description}</p>
        )}

        <div className="mt-8 space-y-2.5">
          {options.map((option) => {
            const selected = currentValue === option.value;
            return (
              <button
                key={option.label}
                type="button"
                onClick={() => selectValue(option.value)}
                className={cn(
                  "focus-ring flex w-full items-center justify-between rounded-xl border px-5 py-4 text-left text-sm font-medium transition-all duration-150",
                  selected
                    ? "border-primary bg-primary-soft text-primary"
                    : "border-border-strong bg-background hover:border-border-strong hover:bg-surface"
                )}
              >
                {option.label}
                {selected && <CheckCircle2 size={18} className="shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between gap-3">
        <Button variant="ghost" onClick={goPrevious} disabled={index === 0}>
          <ArrowLeft size={16} />
          Précédent
        </Button>

        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={skip} className="text-muted">
            Passer
          </Button>
          <Button variant="accent" onClick={goNext} disabled={!isAnswered}>
            {isLast ? "Voir mes résultats" : "Suivant"}
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
