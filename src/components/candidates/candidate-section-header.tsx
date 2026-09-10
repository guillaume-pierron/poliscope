import type { ComponentType, ReactNode } from "react";

/**
 * En-tête d'un panneau (icône, titre éditorial, repère chiffré, description),
 * partagé par les six onglets de la fiche candidat pour qu'ils se lisent
 * comme une même famille visuelle. `children`, quand fourni, prend place
 * sous la description — filtres par thème, essentiellement.
 */
export function CandidateSectionHeader({
  icon: Icon,
  title,
  count,
  countLabel,
  description,
  children,
}: {
  icon: ComponentType<{ size?: number; className?: string }>;
  title: string;
  /** Absent (plutôt que 0) quand rien n'est documenté : le sous-titre se limite alors au titre. */
  count?: number;
  countLabel?: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
          <Icon size={22} />
        </span>
        <div className="min-w-0">
          <h2 className="font-serif text-[1.6rem] font-semibold leading-tight tracking-tight">{title}</h2>
          {typeof count === "number" && (
            <p className="mt-0.5 text-sm text-muted">
              <span className="font-semibold text-foreground">{count}</span> {countLabel}
            </p>
          )}
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-muted">{description}</p>
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}
