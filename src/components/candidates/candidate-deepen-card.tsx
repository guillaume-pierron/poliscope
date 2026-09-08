import { Scale, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

export function CandidateDeepenCard({ slug }: { slug: string }) {
  return (
    <div className="rounded-2xl border border-border bg-primary-soft/40 p-6">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-primary">
        <Scale size={18} />
      </span>
      <p className="mt-3 font-semibold">Approfondissez votre choix</p>
      <p className="mt-1.5 text-sm text-muted">
        Comparez ce candidat avec un autre, ou découvrez son impact sur votre situation
        personnelle.
      </p>
      {/* `whitespace-normal` + `h-auto` : ces deux libellés sont trop longs
          pour tenir d'un bloc dans la colonne latérale sur un écran de 320 px,
          et un bouton qui ne peut pas se replier impose sa largeur à toute la
          page. */}
      <div className="mt-4 flex flex-col gap-2">
        <ButtonLink
          href={`/comparer?a=${slug}`}
          variant="accent"
          size="sm"
          className="h-auto min-h-9 justify-center whitespace-normal py-2 text-center"
        >
          <Scale size={15} className="shrink-0" />
          Comparer avec un autre candidat
        </ButtonLink>
        <ButtonLink
          href="/simulateur"
          variant="outline"
          size="sm"
          className="h-auto min-h-9 justify-center whitespace-normal py-2 text-center"
        >
          <Sparkles size={15} className="shrink-0" />
          Voir son impact sur ma situation
        </ButtonLink>
      </div>
    </div>
  );
}
