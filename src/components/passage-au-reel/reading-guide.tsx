import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { FEASIBILITY_STATUS_LABELS, type FeasibilityStatus } from "@/lib/types";

/**
 * Décode les badges portés par les cartes — et rien de plus. La méthode de
 * construction des analyses vit sur /methodologie : la répéter ici mettait
 * plus d'explications au-dessus de la grille qu'il n'y a d'analyses dedans.
 */
const LEGEND: { status: FeasibilityStatus; body: string }[] = [
  { status: "faisable_parametres_connus", body: "Les paramètres de la mesure sont publics et documentés." },
  { status: "faisable_sous_conditions", body: "Réalisable, mais suspendu à un vote, un financement ou une négociation." },
  { status: "mise_en_oeuvre_complexe", body: "Faisable en droit, lourde à déployer (délais, moyens, coordination)." },
  { status: "informations_insuffisantes", body: "La mesure n'est pas assez détaillée pour être évaluée." },
  { status: "obstacle_juridique_majeur", body: "Une norme constitutionnelle ou européenne s'y oppose en l'état." },
];

const LEGEND_DOT: Record<FeasibilityStatus, string> = {
  faisable_parametres_connus: "bg-success",
  faisable_sous_conditions: "bg-primary",
  mise_en_oeuvre_complexe: "bg-accent",
  informations_insuffisantes: "bg-muted-2",
  obstacle_juridique_majeur: "bg-danger",
};

export function ReadingGuide({ className }: { className?: string }) {
  return (
    <aside className={className}>
      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="font-serif text-lg font-semibold tracking-tight">Les cinq statuts de faisabilité</h2>

        <ul className="mt-4 space-y-3">
          {LEGEND.map(({ status, body }) => (
            <li key={status} className="flex gap-2.5">
              <span
                aria-hidden="true"
                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${LEGEND_DOT[status]}`}
              />
              <span className="min-w-0">
                <span className="block text-xs font-medium leading-snug">
                  {FEASIBILITY_STATUS_LABELS[status]}
                </span>
                <span className="mt-0.5 block text-xs leading-relaxed text-muted-2">{body}</span>
              </span>
            </li>
          ))}
        </ul>

        <Link
          href="/methodologie#passage-au-reel"
          className="focus-ring mt-5 flex items-center justify-center gap-2 rounded-xl border border-border-strong bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:bg-surface"
        >
          Lire la méthodologie
        </Link>
      </div>

      <Link
        href="/simulateur"
        className="focus-ring group mt-4 flex items-center gap-2 text-sm font-medium text-primary hover:underline"
      >
        <Sparkles size={15} className="shrink-0" />
        Appliquer ces mesures à votre situation
        <ArrowRight size={14} className="shrink-0 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </aside>
  );
}
