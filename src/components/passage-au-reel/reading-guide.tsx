import Link from "next/link";
import { BookOpen, Sparkles } from "lucide-react";
import { FEASIBILITY_STATUS_LABELS, type FeasibilityStatus } from "@/lib/types";

/**
 * Trois étapes de lecture, volontairement écrites comme une méthode et non
 * comme une promesse : ce que l'analyse fait, et où elle s'arrête.
 */
const STEPS: { title: string; body: string }[] = [
  {
    title: "Partir du texte de la mesure",
    body: "Chaque analyse démarre d'une proposition réellement formulée par le candidat, avec le lien vers sa source d'origine.",
  },
  {
    title: "Chercher un chiffrage existant",
    body: "Nous ne calculons rien nous-mêmes : nous reprenons les estimations publiées par des institutions ou des instituts, en citant chacune d'elles.",
  },
  {
    title: "Dire ce qui reste inconnu",
    body: "Quand aucune source ne permet de chiffrer un coût ou une population, la ligne affiche « non chiffré ». C'est un résultat, pas un oubli.",
  },
];

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
        <h2 className="flex items-center gap-2 font-serif text-lg font-semibold tracking-tight">
          <BookOpen size={17} className="text-primary" />
          Comment lire ces analyses ?
        </h2>

        <ol className="mt-4 space-y-4">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
                {i + 1}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium leading-snug">{step.title}</span>
                <span className="mt-1 block text-xs leading-relaxed text-muted">{step.body}</span>
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-5 border-t border-border pt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-2">
            Les cinq statuts de faisabilité
          </p>
          <ul className="mt-3 space-y-2.5">
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
        </div>

        <Link
          href="/methodologie#passage-au-reel"
          className="focus-ring mt-5 flex items-center justify-center gap-2 rounded-xl border border-border-strong bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:bg-surface"
        >
          Lire la méthodologie complète
        </Link>
      </div>

      <Link
        href="/simulateur"
        className="focus-ring group mt-4 flex flex-col rounded-2xl border border-primary/20 bg-primary-soft/50 p-5 transition-colors hover:bg-primary-soft"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-primary">
          <Sparkles size={15} />
          Et pour vous ?
        </span>
        <span className="mt-1.5 text-xs leading-relaxed text-muted">
          Le simulateur applique quelques-unes de ces mesures à votre propre situation, à partir des mêmes
          chiffrages sourcés.
        </span>
        <span className="mt-3 text-sm font-medium text-primary group-hover:underline">
          Ouvrir le simulateur
        </span>
      </Link>
    </aside>
  );
}
