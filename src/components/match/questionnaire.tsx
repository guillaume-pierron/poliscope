"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import sideLeft from "../../../public/illustrations/match-side-left.png";
import sideRight from "../../../public/illustrations/match-side-right.png";
import questionVignette from "../../../public/illustrations/match-question.png";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  ChevronsDown,
  ChevronsUp,
  Clock,
  Info,
  Minus,
  Scale,
  Sprout,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { HandNote } from "@/components/ui/hand-note";
import { ThemeIcon } from "@/lib/theme-icons";
import { cn } from "@/lib/utils";
import { calculateQuestionDiscrimination } from "@/lib/scoring";
import { loadAnswers, saveAnswers } from "@/lib/match-storage";
import type {
  CandidatePosition,
  Question,
  QuestionDiscrimination,
  Theme,
  UserAnswer,
} from "@/lib/types";
import { QUESTION_DISCRIMINATION_LABELS } from "@/lib/types";

/**
 * Repères visuels des cinq réponses likert, du plus favorable au plus opposé.
 * Indexés par valeur, donc partagés par les deux formulations (accord,
 * intensité) — la convention de signe est la même partout (voir questions.ts).
 */
const INTENSITY_ICONS: Record<number, { icon: typeof ChevronsUp; tone: string }> = {
  2: { icon: ChevronsUp, tone: "bg-success-soft text-success" },
  1: { icon: ChevronUp, tone: "bg-success-soft text-success" },
  0: { icon: Minus, tone: "bg-surface-strong text-muted" },
  [-1]: { icon: ChevronDown, tone: "bg-danger-soft text-danger" },
  [-2]: { icon: ChevronsDown, tone: "bg-danger-soft text-danger" },
};

/**
 * "Pourquoi cette question ?" toggle. A separate component keyed by
 * question id in the parent so its open/closed state always resets when
 * the visitor moves to another question, without extra effect plumbing.
 */
function QuestionContext({ context }: { context: string | null }) {
  // Ouvert d'emblée : ce qui explique pourquoi la question est posée ne doit
  // pas demander un clic — c'est ce qui rend le questionnaire lisible.
  const [open, setOpen] = useState(true);
  if (!context) return null;

  return (
    <div className="mt-3 flex items-start gap-2.5">
      <Info size={17} className="mt-0.5 shrink-0 text-primary" />
      <div className="min-w-0">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="focus-ring text-sm font-semibold text-primary transition-opacity hover:opacity-80"
        >
          Pourquoi cette question&nbsp;?
        </button>
        {open && (
          <p className="animate-fade-in mt-1 text-sm leading-relaxed text-muted">{context}</p>
        )}
      </div>
    </div>
  );
}

export function Questionnaire() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [positions, setPositions] = useState<CandidatePosition[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | string | null>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // localStorage is an external system only readable client-side on mount.
    const saved = loadAnswers();
    const map: Record<string, number | string | null> = {};
    saved.forEach((a) => {
      map[a.question_id] = a.value;
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAnswers(map);
    // Fetch the same public reference dataset the results page and homepage
    // panel use (candidates/positions/questions) so a saved answer's
    // question_id always matches whichever backend (Supabase or the local
    // fallback) is currently serving positions — never the demo IDs. The
    // positions are also what the discrimination hint below is computed
    // from — never a hardcoded per-question verdict.
    fetch("/api/match-data")
      .then((res) => res.json())
      .then((data: { questions: Question[]; positions: CandidatePosition[] }) => {
        const qs = data.questions;
        setQuestions(qs);
        setPositions(data.positions);
        const firstUnanswered = qs.findIndex((q) => !(q.id in map));
        setIndex(firstUnanswered === -1 ? 0 : firstUnanswered);
        setHydrated(true);
      })
      .catch(() => {
        setQuestions([]);
        setHydrated(true);
      });
  }, []);

  // Every theme referenced by a likert/choice question already carries the
  // full Theme (with icon) via the API — reused here to illustrate a
  // "priority" question's options without a second data fetch.
  const themeById = useMemo(() => {
    const map = new Map<string, Theme>();
    for (const q of questions ?? []) {
      if (q.theme) map.set(q.theme.id, q.theme);
    }
    return map;
  }, [questions]);

  // Every hook above must run on every render regardless of `hydrated` (the
  // Rules of Hooks) — this one guards its own input instead of being
  // skipped by an early return, so the hook count never changes between
  // the loading and ready renders.
  const currentQuestion = hydrated && questions ? (questions[index] ?? null) : null;
  const discrimination: QuestionDiscrimination = useMemo(
    () => (currentQuestion ? calculateQuestionDiscrimination(currentQuestion, positions) : null),
    [currentQuestion, positions]
  );

  if (!hydrated || !questions || questions.length === 0 || !currentQuestion) {
    return <div className="container-app py-24" />;
  }

  const total = questions.length;
  const question = currentQuestion;
  const theme = question.theme;
  const isLikert = question.answer_type === "likert";
  const isPriority = question.answer_type === "priority";

  // A visitor's earlier "priority" pick shouldn't be offered again on a
  // later priority question — picking the same topic twice would be a
  // no-op that just wastes a question.
  const options = isPriority
    ? question.options.filter((o) => {
        const pickedEarlier = questions
          .slice(0, index)
          .filter((q) => q.answer_type === "priority")
          .some((q) => answers[q.id] === o.id);
        return !pickedEarlier;
      })
    : question.options;

  const currentValue = answers[question.id];
  const isAnswered = currentValue !== undefined;
  const isLast = index === total - 1;
  const estimatedMinutesLeft = Math.max(1, Math.round(((total - index) * 10) / 60));

  function persist(next: Record<string, number | string | null>) {
    setAnswers(next);
    const list: UserAnswer[] = questions!
      .filter((q) => q.id in next)
      .map((q) => ({ question_id: q.id, value: next[q.id] }));
    saveAnswers(list);
  }

  function selectValue(value: number | string) {
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
    // Hauteur de la fenêtre moins l'en-tête : le questionnaire tient d'un
    // seul écran, sans défilement, tant que la place le permet.
    <div className="relative flex min-h-[calc(100svh-73px)] flex-col justify-center overflow-hidden py-6 md:py-8">
      {/* Décor latéral. Import statique plutôt que fond CSS : les fichiers
          pèsent plusieurs Mo et ne seraient sinon ni convertis ni
          redimensionnés — et l'URL générée porte un hash du contenu, donc les
          remplacer suffit à voir le changement. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 top-24 hidden w-[26vw] max-w-[420px] lg:block"
      >
        <Image
          src={sideLeft}
          alt=""
          fill
          sizes="(max-width: 1023px) 1px, 420px"
          className="object-contain object-bottom"
        />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 top-1/2 hidden w-[16vw] max-w-[260px] xl:block"
      >
        <Image
          src={sideRight}
          alt=""
          fill
          sizes="(max-width: 1279px) 1px, 260px"
          className="object-contain object-bottom"
        />
      </div>

      <HandNote className="pointer-events-none absolute left-[6vw] top-40 hidden w-[9rem] -rotate-6 text-center leading-tight xl:block">
        Une société plus éclairée
      </HandNote>
      <HandNote className="pointer-events-none absolute right-[7vw] top-24 hidden w-[10rem] rotate-3 text-center leading-tight xl:block">
        Des idées d&apos;aujourd&apos;hui pour demain
      </HandNote>
      <HandNote className="pointer-events-none absolute right-[6vw] top-[26rem] hidden w-[10rem] -rotate-3 text-center leading-tight xl:block">
        Le débat qui compte
      </HandNote>
      <p
        aria-hidden="true"
        className="pointer-events-none absolute right-[5vw] top-[34rem] hidden w-[13rem] font-serif text-[1.05rem] leading-relaxed text-foreground/70 xl:block"
      >
        Mieux comprendre les idées d&apos;aujourd&apos;hui pour une société de demain.
      </p>

      <div className="container-app relative z-10 max-w-2xl">
        <div className="relative">
          <div className="mb-3 flex items-center gap-4 text-sm">
            <span className="shrink-0 font-semibold text-foreground">
              Question {index + 1} sur {total}
            </span>
            <Progress value={((index + 1) / total) * 100} className="flex-1" />
            <span className="flex shrink-0 items-center gap-1.5 text-muted-2">
              <Clock size={14} />
              ~ {estimatedMinutesLeft} min
            </span>
          </div>

          <p className="mb-7 flex items-center justify-center gap-2 text-sm text-muted">
            <Sprout size={15} className="shrink-0 text-success" />
            Répondez instinctivement, il n&apos;y a pas de bonne ou de mauvaise réponse.
          </p>

          <div
            key={question.id}
            className="animate-rise relative rounded-[24px] border border-border bg-card p-6 shadow-[0_24px_70px_-46px_rgba(15,23,41,0.4)] sm:p-7"
          >
          <div className="flex items-start justify-between gap-4">
            {theme && !isPriority && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1.5 text-sm font-medium text-primary">
                <ThemeIcon icon={theme.icon} className="h-4 w-4" />
                {theme.name}
              </span>
            )}
            {isPriority && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1.5 text-sm font-medium text-accent">
                <Scale className="h-4 w-4" />
                Vos priorités
              </span>
            )}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-6 top-6 hidden h-16 w-24 sm:block"
            >
              <Image
                src={questionVignette}
                alt=""
                fill
                sizes="96px"
                className="object-contain object-right-top"
              />
            </span>
          </div>

          <h1 className="mt-4 text-balance font-serif text-2xl font-semibold leading-snug sm:text-[1.75rem]">
            {question.question}
          </h1>
          {question.description && (
            <p className="mt-2 text-sm text-muted">{question.description}</p>
          )}

          <QuestionContext key={`${question.id}-context`} context={question.context} />

          {discrimination && (
            <p className="mt-2 text-xs italic text-muted-2">{QUESTION_DISCRIMINATION_LABELS[discrimination]}</p>
          )}

          <div className="mt-5 space-y-2">
            {options.map((option) => {
              const value = isLikert ? option.value! : option.id;
              const selected = currentValue === value;
              const intensity = isLikert ? INTENSITY_ICONS[option.value!] : undefined;
              const optionTheme = option.theme_id ? themeById.get(option.theme_id) : undefined;
              const IntensityIcon = intensity?.icon;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => selectValue(value)}
                  className={cn(
                    "focus-ring flex w-full items-center gap-3.5 rounded-2xl border px-4 py-2.5 text-left transition-all duration-150",
                    selected
                      ? "border-primary bg-primary-soft/60"
                      : "border-border-strong bg-card hover:bg-surface"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                      intensity?.tone ?? "bg-primary-soft text-primary"
                    )}
                  >
                    {optionTheme ? (
                      <ThemeIcon icon={optionTheme.icon} className="h-4 w-4" />
                    ) : IntensityIcon ? (
                      <IntensityIcon size={19} strokeWidth={2.4} />
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-current" />
                    )}
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-semibold">{option.label}</span>
                    {option.description && (
                      <span className="mt-0.5 block text-xs text-muted">{option.description}</span>
                    )}
                  </span>
                  {selected && (
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                      <Check size={15} strokeWidth={3} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={goPrevious}
            disabled={index === 0}
            className="focus-ring flex items-center gap-1.5 rounded-full border border-border-strong bg-card px-5 py-2.5 text-sm font-medium transition-colors hover:bg-surface disabled:opacity-40"
          >
            <ArrowLeft size={16} />
            Précédent
          </button>

          <button
            type="button"
            onClick={skip}
            className="focus-ring text-sm font-medium text-muted-2 transition-colors hover:text-foreground"
            title={
              isPriority
                ? "N'ajuste aucune pondération pour ce sujet."
                : "Exclut cette question du calcul — différent de « Neutre », qui compte comme une vraie réponse."
            }
          >
            Passer <span className="hidden sm:inline">{isPriority ? "(optionnel)" : "(sans opinion)"}</span>
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

        <p className="mt-3 text-center text-xs text-muted-2">Vous pourrez revenir en arrière.</p>
      </div>
    </div>
  );
}
