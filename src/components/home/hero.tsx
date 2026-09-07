import Image from "next/image";
import Link from "next/link";
// Import statique : l'URL générée porte un hash du contenu, donc remplacer
// le fichier suffit à invalider le cache de l'optimiseur d'images.
import heroIllustration from "../../../public/illustrations/hero.png";
import heroIllustrationDesktop from "../../../public/illustrations/hero_deskop.png";
import { ButtonLink } from "@/components/ui/button";
import { HomeHeroPanel } from "./home-hero-panel";
import { Swoosh } from "@/components/ui/swoosh";
import { HandNote } from "@/components/ui/hand-note";
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

            {/* Mobile seulement : sur petit écran le panneau Match arrive loin
                sous le pli, cette carte donne un point d'entrée explicite. */}
            <Link
              href="/match"
              className="focus-ring relative mt-6 block overflow-hidden rounded-2xl border border-primary/20 bg-primary-soft/50 p-5 transition-colors hover:bg-primary-soft/70 sm:hidden"
            >
              {/* Formes douces dans l'angle, comme sur la maquette. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-primary/10"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-4 left-12 h-16 w-16 rounded-full bg-primary/[0.07]"
              />

              <HandNote className="pointer-events-none absolute right-4 top-4 w-[7rem] -rotate-6 text-right leading-tight">
                Ça ne prend que 3 minutes&nbsp;!
              </HandNote>

              <span className="relative flex items-start gap-4">
                <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-card text-primary">
                  <Target size={22} strokeWidth={1.75} />
                </span>
                <span className="min-w-0 flex-1 pr-[6.5rem]">
                  <span className="block text-xs font-semibold uppercase tracking-wide text-primary">
                    Commencez ici
                  </span>
                  <span className="mt-1 block font-serif text-[1.2rem] font-semibold leading-snug">
                    Trouvez les candidats qui vous ressemblent.
                  </span>
                  <span className="mt-2 block text-sm leading-relaxed text-muted">
                    Répondez à {questionCount} questions pour découvrir les candidats les plus
                    proches de vos idées.
                  </span>
                </span>
              </span>

              <span className="absolute bottom-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <ArrowRight size={20} />
              </span>
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
