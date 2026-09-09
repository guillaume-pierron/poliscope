import Image from "next/image";
// Import statique : l'URL générée porte un hash du contenu, donc remplacer
// le fichier suffit à invalider le cache de l'optimiseur d'images.
import heroIllustration from "../../../public/illustrations/hero.png";
import heroIllustrationDesktop from "../../../public/illustrations/hero_deskop.png";
import { ButtonLink } from "@/components/ui/button";
import { HomeHeroPanel } from "./home-hero-panel";
import { Swoosh } from "@/components/ui/swoosh";
import { HandNote } from "@/components/ui/hand-note";
import { ArrowRight, Clock, Lock, Sun } from "lucide-react";
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
    // Le hero remonte derrière l'en-tête transparent — sinon on ne verrait
    // à sa place que le fond crème de la page, et le menu ressemblerait à un
    // bandeau plein. Le padding rend au contenu la hauteur reprise par la
    // marge négative, donc rien ne passe sous le menu. Le +1px reprend le
    // filet inférieur de l'en-tête.
    <section className="mesh-bg relative -mt-[calc(var(--header-height)_+_1px)] overflow-hidden border-b border-border pt-[calc(var(--header-height)_+_1px)]">
      {/* Mobile seulement : l'aquarelle sert de fond au premier écran. Sa
          moitié gauche est volontairement vide pour laisser passer le texte,
          et le bas est rogné puis fondu pour éviter une coupure nette. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-2 right-0 w-[68%] max-w-[280px] select-none [mask-composite:intersect] [mask-image:linear-gradient(to_right,transparent,black_24%),linear-gradient(to_bottom,black_86%,transparent)] sm:hidden"
      >
        <Image
          src={heroIllustration}
          alt=""
          priority
          // Desktop ne l'affiche jamais : on demande alors la plus petite
          // variante possible plutôt que de télécharger l'aquarelle pour rien.
          sizes="(max-width: 639px) 68vw, 1px"
          className="h-auto w-full"
        />
        {/* Voile blanc : atténue l'aquarelle pour que le texte qui passe
            par-dessus reste lisible. Masqué comme l'image, donc il s'efface
            avec elle sur les bords. */}
        <span className="absolute inset-0 bg-white/55" />
      </div>

      {/* Desktop : l'illustration occupe toute la hauteur de la section, collée
          au bord gauche de la fenêtre. En recadrage, donc l'élargir ne
          l'allonge pas ; son bord droit est fondu vers la zone de texte. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 hidden w-[360px] select-none [mask-image:linear-gradient(to_left,transparent,black_28%)] lg:block xl:w-[440px]"
      >
        <Image
          src={heroIllustrationDesktop}
          alt=""
          fill
          priority
          sizes="(min-width: 1280px) 440px, (min-width: 1024px) 360px, 1px"
          className="object-cover object-left"
        />
      </div>

      <div className="container-app relative z-10 grid gap-10 py-12 lg:grid-cols-[1.12fr_0.88fr] lg:items-center lg:gap-14 lg:py-16">
        <div className="flex items-center gap-4 xl:gap-7">
          {/* Réserve la largeur laissée à l'illustration épinglée ci-dessus,
              pour que le texte garde sa position. */}
          <div aria-hidden="true" className="hidden w-[130px] shrink-0 lg:block xl:w-[200px]" />

          <div className="animate-rise relative z-10">
            <span className="mb-4 inline-flex rounded-full bg-primary-soft px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary sm:hidden">
              Élection présidentielle 2027
            </span>

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

            <HandNote tone="danger" className="mt-3 block -rotate-3 pr-6 text-right sm:hidden">
              Des faits pour vos choix
            </HandNote>

            <p className="mt-7 max-w-[460px] text-[1.02rem] leading-relaxed text-muted max-sm:mt-6 max-sm:max-w-[78%]">
              Comparez les candidats, leurs programmes et l&apos;impact réel de leurs mesures,
              toujours à partir de{" "}
              <span className="font-medium text-primary">sources vérifiables</span>.
            </p>

            <HandNote tone="danger" className="mt-3 block rotate-3 pr-4 text-right sm:hidden">
              Une société plus éclairée
            </HandNote>

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
          </div>
        </div>

        <div className="animate-fade-in [animation-delay:150ms]">
          <HomeHeroPanel candidates={candidates} headline={headline} questionCount={questionCount} />
        </div>
      </div>
    </section>
  );
}
