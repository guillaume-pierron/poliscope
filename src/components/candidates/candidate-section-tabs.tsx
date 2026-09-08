"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface CandidateTab {
  /** id de la section visée, sans le « # ». */
  id: string;
  label: string;
  /** Effectif réel de la section — omis plutôt que forcé à zéro. */
  count?: number;
}

/**
 * Barre d'onglets du bas de la fiche. Ce sont de vraies ancres : chaque
 * onglet mène à une section réellement présente sur la page, et l'onglet
 * actif suit la section visible plutôt que d'être figé sur le premier.
 *
 * Sans icônes : dans la colonne de gauche, les quatre libellés français plus
 * leurs pastilles dépassaient la largeur disponible et faisaient apparaître
 * une barre de défilement. Les libellés portent tout le sens, les icônes
 * n'ajoutaient que de la largeur.
 */
export function CandidateSectionTabs({ tabs }: { tabs: CandidateTab[] }) {
  const [active, setActive] = useState(tabs[0]?.id);

  useEffect(() => {
    const sections = tabs
      .map((tab) => document.getElementById(tab.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    // La marge haute écarte la zone masquée par l'en-tête collant ; la marge
    // basse évite qu'une section très courte en bas de page ne prenne jamais
    // la main.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-96px 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [tabs]);

  return (
    <nav
      aria-label="Sections de la fiche"
      className="no-scrollbar -mx-6 mt-7 overflow-x-auto border-t border-border px-6 sm:-mx-8 sm:px-8"
    >
      <ul className="flex min-w-max gap-1">
        {tabs.map(({ id, label, count }) => {
          const isActive = active === id;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "focus-ring -mb-px flex items-center gap-2 border-b-2 px-2.5 py-3.5 text-sm font-medium transition-colors",
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted hover:text-foreground"
                )}
              >
                {label}
                {count !== undefined && (
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-xs font-semibold tabular-nums",
                      isActive ? "bg-primary-soft text-primary" : "bg-surface text-muted-2"
                    )}
                  >
                    {count}
                  </span>
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
