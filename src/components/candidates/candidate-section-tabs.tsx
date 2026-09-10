"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { Landmark, Scale, ShieldCheck, FileText, History, Vote } from "lucide-react";
import { cn } from "@/lib/utils";

export const SECTIONS = [
  { id: "programme", label: "Programme", icon: FileText },
  { id: "parcours", label: "Parcours", icon: Landmark },
  { id: "votes", label: "Votes", icon: Vote },
  { id: "evolution-positions", label: "Évolution", icon: History },
  { id: "affaires", label: "Affaires", icon: Scale },
  { id: "transparence", label: "Transparence", icon: ShieldCheck },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

const ActiveSectionContext = createContext<SectionId>("programme");

/**
 * Onglets de la fiche candidat. Chaque section reste entièrement rendue côté
 * serveur (référençable, lisible sans JS dans le HTML brut) — seule la
 * visibilité bascule côté client via l'attribut `hidden`, jamais un montage
 * conditionnel : un lecteur d'écran retrouve les six panneaux, un moteur qui
 * lit le HTML brut aussi. Sans JavaScript, le panneau par défaut
 * (« Programme ») reste seul visible plutôt que tout empiler — c'est le prix
 * de ce design en onglets, assumé.
 *
 * L'onglet ouvert à l'arrivée suit le lien utilisé pour accéder à la page
 * (`#parcours`, `#votes`...), pour que les liens externes vers une section
 * précise (carte candidat, méthodologie) continuent de fonctionner.
 */
export function CandidateSectionTabs({
  counts,
  children,
}: {
  counts: Partial<Record<SectionId, number>>;
  children: ReactNode;
}) {
  // Initialisation paresseuse plutôt qu'un effet : lire le hash au montage
  // (plutôt qu'à l'exécution du corps du composant) provoquerait un rendu
  // supplémentaire juste après l'hydratation, visible comme un sursaut de
  // l'onglet actif. `location` est absent côté serveur — le premier rendu y
  // retombe donc toujours sur "programme", corrigé dès l'hydratation.
  const [active, setActive] = useState<SectionId>(() => {
    if (typeof window === "undefined") return "programme";
    const hash = window.location.hash.replace("#", "");
    return SECTIONS.some((s) => s.id === hash) ? (hash as SectionId) : "programme";
  });

  return (
    <ActiveSectionContext.Provider value={active}>
      <div
        role="tablist"
        aria-label="Sections de la fiche candidat"
        className="flex gap-1.5 overflow-x-auto rounded-2xl border border-border bg-surface p-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {SECTIONS.map((section) => {
          const isActive = section.id === active;
          const count = counts[section.id];
          return (
            <button
              key={section.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${section.id}`}
              id={`tab-${section.id}`}
              onClick={() => {
                setActive(section.id);
                history.replaceState(null, "", `#${section.id}`);
              }}
              className={cn(
                "focus-ring flex min-w-[92px] flex-1 flex-col items-center gap-2 rounded-xl border px-3 py-3 text-center transition-colors",
                isActive
                  ? "border-primary bg-primary-soft"
                  : "border-transparent bg-card hover:border-border-strong"
              )}
            >
              <span className="relative">
                <span
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full",
                    isActive ? "bg-card text-primary" : "bg-surface-strong text-muted"
                  )}
                >
                  <section.icon size={19} />
                </span>
                {!!count && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[0.6875rem] font-semibold text-primary-foreground">
                    {count}
                  </span>
                )}
              </span>
              <span
                className={cn(
                  "whitespace-nowrap text-sm font-medium",
                  isActive ? "text-primary" : "text-muted"
                )}
              >
                {section.label}
              </span>
            </button>
          );
        })}
      </div>

      {children}
    </ActiveSectionContext.Provider>
  );
}

export function SectionPanel({ id, children }: { id: SectionId; children: ReactNode }) {
  const active = useContext(ActiveSectionContext);
  return (
    <div
      id={`panel-${id}`}
      role="tabpanel"
      aria-labelledby={`tab-${id}`}
      hidden={active !== id}
      className="scroll-mt-24"
    >
      {children}
    </div>
  );
}
