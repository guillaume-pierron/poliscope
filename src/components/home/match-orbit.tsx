import { UserRound } from "lucide-react";
import { CandidateAvatar } from "@/components/candidates/candidate-avatar";
import { HandNote } from "@/components/ui/hand-note";
import type { Candidate } from "@/lib/types";

/**
 * Positions fixes sur l'orbite plutôt qu'un tirage au rendu, qui produirait
 * une disposition différente côté serveur et côté client.
 */
const ORBIT_SPOTS = [
  { left: "40%", top: "0%", size: "lg", delay: "0s" },
  { left: "13%", top: "13%", size: "md", delay: "1.1s" },
  { left: "71%", top: "16%", size: "md", delay: "2.2s" },
  { left: "1%", top: "48%", size: "md", delay: "0.5s" },
  { left: "77%", top: "48%", size: "md", delay: "1.7s" },
  { left: "17%", top: "78%", size: "md", delay: "2.8s" },
  { left: "56%", top: "80%", size: "md", delay: "0.9s" },
] as const;

/** Petits points de couleur sur les orbites, comme sur la maquette. */
const ORBIT_DOTS = [
  { left: "70%", top: "8%", tone: "bg-danger/70", size: "h-2.5 w-2.5" },
  { left: "30%", top: "26%", tone: "bg-primary/60", size: "h-2 w-2" },
  { left: "66%", top: "34%", tone: "bg-success/60", size: "h-2 w-2" },
  { left: "23%", top: "44%", tone: "bg-primary/70", size: "h-2.5 w-2.5" },
  { left: "38%", top: "44%", tone: "bg-accent/70", size: "h-2 w-2" },
  { left: "44%", top: "70%", tone: "bg-success/60", size: "h-2 w-2" },
  { left: "62%", top: "88%", tone: "bg-primary/60", size: "h-2.5 w-2.5" },
] as const;

/** Constellation décorative : le visiteur au centre, les candidats autour. */
export function MatchOrbit({ candidates }: { candidates: Candidate[] }) {
  const orbiting = ORBIT_SPOTS.slice(0, candidates.length).map((spot, i) => ({
    ...spot,
    candidate: candidates[i],
  }));

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[420px]">
      {/* Orbites */}
      <span
        aria-hidden="true"
        className="absolute inset-[13%] rounded-full border border-dashed border-primary/25"
      />
      <span
        aria-hidden="true"
        className="absolute inset-[27%] rounded-full border border-dashed border-primary/20"
      />

      <div aria-hidden="true">
        {ORBIT_DOTS.map((dot) => (
          <span
            key={`${dot.left}-${dot.top}`}
            className={`absolute rounded-full ${dot.tone} ${dot.size}`}
            style={{ left: dot.left, top: dot.top }}
          />
        ))}
      </div>

      {/* Le visiteur, au centre */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <span className="flex h-[108px] w-[108px] items-center justify-center rounded-full border-[5px] border-card bg-primary-soft text-primary/70 shadow-[0_16px_40px_-22px_rgba(15,23,41,0.5)]">
          <UserRound size={46} strokeWidth={1.5} />
        </span>
        <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary">
          Votre profil
        </span>
      </div>

      {/* Les annotations sont peintes avant les portraits : au-dessus d'un
          élément animé, elles seraient promues sur une couche composite avec
          lui, et le texte pivoté y perd son lissage sous-pixel — il paraît
          alors flou à côté des autres annotations de la page. */}
      <HandNote className="absolute -left-5 -top-7 w-[9rem] -rotate-6 text-left leading-tight sm:-left-12">
        Des candidats sur vos sujets
      </HandNote>
      {/* Calée à l'intérieur de l'orbite : débordant à droite, elle passait
          sous le panneau voisin dans la disposition à trois colonnes. */}
      <HandNote className="absolute -bottom-9 right-2 w-[9rem] rotate-3 text-right leading-tight sm:right-6">
        Comparez leurs propositions
      </HandNote>

      {/* Les candidats en orbite */}
      <div aria-hidden="true">
        {orbiting.map(({ candidate, left, top, size, delay }) => (
          <span
            key={candidate.id}
            className="animate-float absolute"
            style={{ left, top, animationDelay: delay }}
          >
            <CandidateAvatar
              name={candidate.name}
              color={candidate.party?.color}
              photoUrl={candidate.photo_url}
              size={size}
              // ring-offset reproduit le blanc qui séparait déjà le portrait
              // du fond ; ring (plus fin) ajoute le liseré bleu par-dessus,
              // légèrement en retrait plutôt que collé à la photo.
              className="shadow-[0_12px_30px_-16px_rgba(15,23,41,0.55)] ring-offset-[5px] ring-offset-card ring-2 ring-primary/40"
            />
          </span>
        ))}
      </div>
    </div>
  );
}
