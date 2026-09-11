"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { Landmark, Scale, ShieldCheck, FileText, History, Vote } from "lucide-react";
import { cn } from "@/lib/utils";

export const SECTIONS = [
  { id: "programme", label: "Programme", subtitle: "Propositions", icon: FileText },
  { id: "parcours", label: "Parcours", subtitle: "Biographie", icon: Landmark },
  { id: "votes", label: "Votes", subtitle: "Positions", icon: Vote },
  { id: "evolution-positions", label: "Évolution", subtitle: "Dans le temps", icon: History },
  { id: "affaires", label: "Affaires", subtitle: "Contrôlés", icon: Scale },
  { id: "transparence", label: "Transparence", subtitle: "Patrimoine", icon: ShieldCheck },
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
          const count = counts[section.id] ?? 0;
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
                "focus-ring flex min-w-[92px] flex-1 flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-center transition-colors",
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
                {/* Le compteur s'affiche même à 0 — un chiffre absent laisserait
                    croire à un onglet non chargé plutôt qu'à une rubrique
                    simplement vide ; un 0 en gris atténué dit l'inverse d'un
                    coup d'œil : « vérifié, rien à ce stade ». */}
                <span
                  className={cn(
                    "absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[0.6875rem] font-semibold",
                    count > 0 ? "bg-primary text-primary-foreground" : "bg-border-strong text-muted-2"
                  )}
                >
                  {count}
                </span>
              </span>
              <span className="leading-tight">
                <span
                  className={cn(
                    "block whitespace-nowrap text-sm font-semibold",
                    isActive ? "text-primary" : "text-foreground"
                  )}
                >
                  {section.label}
                </span>
                <span className="block whitespace-nowrap text-xs text-muted-2">{section.subtitle}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="my-5 flex items-center gap-3 text-xs text-muted-2">
        <span className="h-px flex-1 bg-border" aria-hidden />
        Choisissez un angle de lecture pour explorer ce candidat
        <span className="h-px flex-1 bg-border" aria-hidden />
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
