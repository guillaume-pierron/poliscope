import { UserRound } from "lucide-react";
import { CandidateAvatar } from "@/components/candidates/candidate-avatar";
import type { Candidate } from "@/lib/types";

/** Positions fixes : un tirage au rendu différerait entre serveur et client. */
const SPOTS = [
  { left: "12%", top: "6%" },
  { left: "2%", top: "52%" },
  { left: "70%", top: "6%" },
  { left: "80%", top: "52%" },
] as const;

/**
 * Constellation compacte du panneau d'accueil : le visiteur au centre, quelques
 * candidats autour. Purement illustratif — aucun score n'est affiché tant que
 * le questionnaire n'a pas été rempli.
 */
export function MatchMiniOrbit({ candidates }: { candidates: Candidate[] }) {
  const around = SPOTS.slice(0, candidates.length).map((spot, i) => ({
    ...spot,
    candidate: candidates[i],
  }));

  return (
    <div className="relative h-[150px] w-full" aria-hidden="true">
      {/* Traits pointillés du centre vers chaque portrait. */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full text-primary/30"
      >
        {[
          [21, 17],
          [12, 65],
          [79, 17],
          [88, 65],
        ].map(([x, y]) => (
          <line
            key={`${x}-${y}`}
            x1="50"
            y1="50"
            x2={x}
            y2={y}
            stroke="currentColor"
            strokeWidth="0.6"
            strokeDasharray="3 3"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary">
          <UserRound size={26} strokeWidth={1.6} />
        </span>
        <span className="mt-1.5 block whitespace-nowrap text-xs font-medium text-muted">
          Votre profil
        </span>
      </div>

      {around.map(({ candidate, left, top }) => (
        <span key={candidate.id} className="absolute" style={{ left, top }}>
          <CandidateAvatar
            name={candidate.name}
            color={candidate.party?.color}
            photoUrl={candidate.photo_url}
            size="md"
            // ring-offset reprend le blanc qui séparait déjà le portrait des
            // traits pointillés derrière lui ; le fin ring gris vient
            // s'ajouter par-dessus, légèrement en retrait.
            className="ring-offset-4 ring-offset-card ring-2 ring-border-strong"
          />
        </span>
      ))}
    </div>
  );
}
