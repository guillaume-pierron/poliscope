import { ButtonLink } from "@/components/ui/button";
import { HomeHeroPanel } from "./home-hero-panel";
import { Swoosh } from "@/components/ui/swoosh";
import { Sun, Lock } from "lucide-react";
import type { HeadlinePoll } from "@/lib/data/queries";
import type { Candidate } from "@/lib/types";

export function Hero({
  candidates,
  headline,
}: {
  candidates: Candidate[];
  headline: HeadlinePoll | null;
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

            <p className="mt-7 max-w-[440px] text-[1.02rem] leading-relaxed text-muted">
              Poliscope compare les programmes, les positions et{" "}
              <span className="font-medium text-primary">les sources</span> pour vous aider à
              vous faire votre propre opinion — sans bruit inutile.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/match" variant="accent" size="lg">
                Faire mon Match
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
          <HomeHeroPanel candidates={candidates} headline={headline} />
        </div>
      </div>
    </section>
  );
}
