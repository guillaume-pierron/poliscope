import { ButtonLink } from "@/components/ui/button";
import { HeroCompatDemo } from "./hero-compat-demo";
import type { Candidate } from "@/lib/types";
import { ArrowRight, SplitSquareHorizontal } from "lucide-react";

export function Hero({ candidates }: { candidates: Candidate[] }) {
  return (
    <section className="mesh-bg relative overflow-hidden">
      <div className="container-app grid gap-12 py-16 md:grid-cols-2 md:items-center md:py-24">
        <div className="animate-rise">
          <p className="mb-5 inline-flex items-center rounded-full border border-border-strong px-3 py-1 text-xs font-medium text-muted">
            Présidentielle 2027 · Plateforme indépendante
          </p>
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-[3.4rem] md:leading-[1.05]">
            Et si vous compariez vraiment les programmes&nbsp;?
          </h1>
          <p className="mt-6 max-w-lg text-balance text-lg text-muted">
            Découvrez les candidats les plus proches de vos idées, comparez leurs
            propositions et suivez la présidentielle 2027 simplement.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/match" variant="accent" size="lg">
              Faire mon Match
              <ArrowRight size={18} />
            </ButtonLink>
            <ButtonLink href="/comparer" variant="outline" size="lg">
              <SplitSquareHorizontal size={18} />
              Comparer les candidats
            </ButtonLink>
          </div>
          <p className="mt-6 text-xs text-muted-2">
            Aucun compte requis. Vos réponses restent sur votre appareil.
          </p>
        </div>

        <div className="animate-fade-in [animation-delay:150ms]">
          <HeroCompatDemo candidates={candidates} />
        </div>
      </div>
    </section>
  );
}
