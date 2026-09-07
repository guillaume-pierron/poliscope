import { Check, Lightbulb } from "lucide-react";
import { CivicSceneDoodle } from "@/components/ui/doodles";
import { HandNote } from "@/components/ui/hand-note";
import type { Theme } from "@/lib/types";

const POINTS = [
  "Des comparaisons claires sur les mêmes questions",
  "Des réponses sourcées et documentées",
  "Un moyen simple de mieux comprendre leurs propositions",
];

export function MatchExplainerCard({ themes }: { themes: Theme[] }) {
  // Les thèmes cités viennent de la vraie liste du site, pour que la phrase
  // ne dérive pas si un thème est renommé.
  const named = themes.slice(0, 5).map((t) => t.name.toLowerCase()).join(", ");

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-[22px] border border-border bg-card/70 p-6">
      <div className="flex items-start gap-3.5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-accent">
          <Lightbulb size={20} />
        </span>
        <h4 className="font-serif text-[1.3rem] font-semibold leading-snug tracking-tight">
          Des réponses pour éclairer votre choix
        </h4>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted">
        Comparez les positions des candidats avec les vôtres, sur les grands enjeux de 2027&nbsp;:{" "}
        {named}…
      </p>

      <ul className="mt-5 space-y-3.5 border-t border-border pt-5">
        {POINTS.map((point) => (
          <li key={point} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Check size={14} strokeWidth={3} />
            </span>
            <span className="text-sm leading-snug text-foreground/85">{point}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex items-end justify-between gap-3 pt-8">
        <CivicSceneDoodle className="h-16 w-24 shrink-0 opacity-50" />
        <HandNote className="w-[9rem] -rotate-3 pb-2 text-right leading-tight">
          Un choix plus éclairé pour demain
        </HandNote>
      </div>
    </div>
  );
}
