import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { HomeHeroPanel } from "./home-hero-panel";
import { Swoosh } from "@/components/ui/swoosh";
import { ArrowRight, Clock, Lock, Sun, Target } from "lucide-react";
import type { HeadlinePoll } from "@/lib/data/queries";
import type { Candidate } from "@/lib/types";

export function Hero({
  candidates,
  headline,
  questionCount,
}: {
  candidates: Candidate[];
  headline: HeadlinePoll | null;
  /** Real question count — the promise made here must never drift from the actual questionnaire. */
  questionCount: number;
}) {
  return (
    <section className="mesh-bg relative overflow-hidden border-b border-border">
      <div className="container-app grid gap-10 py-12 lg:grid-cols-[1.12fr_0.88fr] lg:items-center lg:gap-14 lg:py-16">
        <div className="flex items-center gap-4 xl:gap-7">
          {/* Illustration — remplaçable : public/illustrations/hero.svg */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/illustrations/hero.svg"
            alt=""
            aria-hidden="true"
            className="hidden w-[200px] shrink-0 select-none lg:block xl:w-[260px]"
          />

          <div className="animate-rise">
            <h1 className="font-serif text-[2.5rem] font-semibold leading-[1.08] tracking-tight sm:text-[3rem] xl:text-[3.4rem]">
              La présidentielle,
              <span className="mt-1 block">
                <span className="relative inline-block whitespace-nowrap italic text-primary">
                  au clair
                  <Swoosh className="text-primary/70" />
                </span>{" "}
                chaque jour.
              </span>
            </h1>

            <p className="mt-7 max-w-[460px] text-[1.02rem] leading-relaxed text-muted">
              Comparez les candidats, leurs programmes et l&apos;impact réel de leurs mesures,
              toujours à partir de{" "}
              <span className="font-medium text-primary">sources vérifiables</span>.
            </p>

            {/* Mobile seulement : l'engagement demandé, annoncé avant les boutons. */}
            <p className="mt-5 flex items-center gap-2 text-sm text-muted-2 sm:hidden">
              <Clock size={15} className="shrink-0" />
              {questionCount} questions · 3 minutes
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
              <ButtonLink
                href="/match"
                variant="accent"
                size="lg"
                className="relative w-full max-sm:h-14 max-sm:rounded-full sm:w-auto"
              >
                Découvrir mon Match
                <Sun size={17} />
                <ArrowRight size={18} className="absolute right-6 sm:hidden" />
              </ButtonLink>
              <ButtonLink
                href="/comparer"
                variant="outline"
                size="lg"
                className="relative w-full max-sm:h-14 max-sm:rounded-full sm:w-auto"
              >
                Comparer les candidats
                <ArrowRight size={18} className="absolute right-6 sm:hidden" />
              </ButtonLink>
            </div>

            <p className="mt-5 flex items-center gap-1.5 text-xs text-muted-2">
              <Lock size={12} />
              Sans inscription · Réponses conservées sur votre appareil
            </p>

            {/* Mobile seulement : sur petit écran le panneau Match arrive loin
                sous le pli, cette carte donne un point d'entrée explicite. */}
            <Link
              href="/match"
              className="focus-ring mt-6 flex items-start gap-4 rounded-2xl border border-primary/20 bg-primary-soft/50 p-5 transition-colors hover:bg-primary-soft/70 sm:hidden"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-card text-primary">
                <Target size={20} strokeWidth={1.75} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-semibold uppercase tracking-wide text-primary">
                  Commencez ici
                </span>
                <span className="mt-1 block font-serif text-[1.15rem] font-semibold leading-snug">
                  Trouvez les candidats qui vous ressemblent.
                </span>
                <span className="mt-1.5 block text-sm leading-relaxed text-muted">
                  Répondez à {questionCount} questions pour découvrir les candidats les plus proches
                  de vos idées.
                </span>
              </span>
              <ArrowRight size={20} className="mt-1 shrink-0 self-center text-primary" />
            </Link>
          </div>
        </div>

        <div className="animate-fade-in [animation-delay:150ms]">
          <HomeHeroPanel candidates={candidates} headline={headline} questionCount={questionCount} />
        </div>
      </div>
    </section>
  );
}
