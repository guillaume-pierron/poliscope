import { ButtonLink } from "@/components/ui/button";
import { HomeHeroPanel } from "./home-hero-panel";
import { Swoosh } from "@/components/ui/swoosh";
import { Sun, Lock } from "lucide-react";
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

            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/match" variant="accent" size="lg">
                Découvrir mon Match
                <Sun size={17} />
              </ButtonLink>
              <ButtonLink href="/comparer" variant="outline" size="lg">
                Comparer les candidats
              </ButtonLink>
            </div>

            <p className="mt-5 flex items-center gap-1.5 text-xs text-muted-2">
              <Lock size={12} />
              Sans inscription · Réponses conservées sur votre appareil
            </p>
          </div>
        </div>

        <div className="animate-fade-in [animation-delay:150ms]">
          <HomeHeroPanel candidates={candidates} headline={headline} questionCount={questionCount} />
        </div>
      </div>
    </section>
  );
}
