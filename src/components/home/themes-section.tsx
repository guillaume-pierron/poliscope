import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ThemeIcon } from "@/lib/theme-icons";
import { Swoosh } from "@/components/ui/swoosh";
import { hexToRgba } from "@/lib/utils";
import type { Theme } from "@/lib/types";

/** Rotating accent hues for the theme cards, as in the design. */
const THEME_COLORS = ["#1d6ff2", "#eb6834", "#16a34a", "#7c3aed", "#eda100", "#e87ba4"];

export function ThemesSection({
  themes,
  proposalCounts,
}: {
  themes: Theme[];
  /** Documented proposals per theme id — same count as the theme page itself, never a guessed number. */
  proposalCounts: Record<string, number>;
}) {
  return (
    <section className="container-app py-12">
      <h2 className="relative inline-flex font-serif text-[1.8rem] font-semibold tracking-tight sm:text-[2rem]">
        Les sujets qui comptent
        <Swoosh className="text-primary/70" />
      </h2>

      <div className="mt-7 grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-3 xl:grid-cols-4">
        {themes.map((theme, i) => {
          const color = THEME_COLORS[i % THEME_COLORS.length];
          const count = proposalCounts[theme.id] ?? 0;
          return (
            <Link
              key={theme.id}
              href={`/themes/${theme.slug}`}
              aria-label={`${theme.name}, ${count} proposition${count > 1 ? "s" : ""} documentée${count > 1 ? "s" : ""}`}
              className="focus-ring group flex min-w-0 items-center gap-2 rounded-2xl border border-border bg-card px-3 py-3 transition-all hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[0_16px_32px_-22px_rgba(15,23,41,0.32)] sm:gap-3 sm:px-4 sm:py-3.5"
            >
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full sm:h-11 sm:w-11"
                style={{ background: hexToRgba(color, 0.14), color }}
              >
                <ThemeIcon icon={theme.icon} className="h-4 w-4 sm:h-5 sm:w-5" />
              </span>
              {/* Pas de troncature : « Pouvoir d'achat · 12 » a besoin
                  d'environ 119px, plus que ce qu'une vraie grille à deux
                  colonnes peut offrir sur un téléphone étroit — tronquer un
                  libellé de navigation ferait perdre de l'information.
                  Le nom passe donc à la ligne plutôt que de couper. */}
              <span className="min-w-0 flex-1 font-serif text-sm font-semibold leading-snug tracking-tight sm:text-[1.05rem]">
                {theme.name}
                {/* Pas de whitespace-nowrap : sur les colonnes les plus
                    étroites, cette contrainte poussait le texte 2px au-delà
                    du bord — un simple retour à la ligne avant le nombre
                    coûte moins qu'un débordement horizontal. */}
                <span
                  className="ml-1 font-sans text-xs font-normal text-muted-2 tabular-nums sm:ml-1.5 sm:text-sm"
                  aria-hidden="true"
                >
                  · {count}
                </span>
              </span>
              <ChevronRight
                size={16}
                className="shrink-0 text-muted-2 transition-colors group-hover:text-foreground sm:h-[18px] sm:w-[18px]"
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
