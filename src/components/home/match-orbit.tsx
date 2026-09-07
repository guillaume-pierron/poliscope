import { UserRound } from "lucide-react";
import { CandidateAvatar } from "@/components/candidates/candidate-avatar";
import { HandNote } from "@/components/ui/hand-note";
import type { Candidate } from "@/lib/types";

/**
 * Positions fixes sur l'orbite plutôt qu'un tirage au rendu, qui produirait
 * une disposition différente côté serveur et côté client.
 */
const ORBIT_SPOTS = [
  { left: "30%", top: "6%", size: "lg", delay: "0s" },
  { left: "72%", top: "18%", size: "md", delay: "1.2s" },
  { left: "6%", top: "38%", size: "md", delay: "2.4s" },
  { left: "20%", top: "76%", size: "lg", delay: "0.6s" },
  { left: "68%", top: "72%", size: "md", delay: "1.8s" },
] as const;

/** Constellation décorative : le visiteur au centre, les candidats autour. */
export function MatchOrbit({ candidates }: { candidates: Candidate[] }) {
  const orbiting = ORBIT_SPOTS.slice(0, candidates.length).map((spot, i) => ({
    ...spot,
    candidate: candidates[i],
  }));

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[340px]">
      {/* Cercles d'orbite */}
      <span
        aria-hidden="true"
        className="absolute inset-[8%] rounded-full border border-dashed border-primary/20"
      />
      <span
        aria-hidden="true"
        className="absolute inset-[26%] rounded-full border border-dashed border-primary/15"
      />

      {/* Le visiteur, au centre */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <span className="flex h-[104px] w-[104px] items-center justify-center rounded-full border-4 border-primary/25 bg-card text-muted-2 shadow-[0_16px_40px_-20px_rgba(15,23,41,0.5)]">
          <UserRound size={40} strokeWidth={1.5} />
        </span>
        <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
          Votre profil
        </span>
      </div>

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
              className="shadow-[0_12px_30px_-16px_rgba(15,23,41,0.55)] ring-4 ring-card"
            />
          </span>
        ))}
      </div>

      <HandNote className="absolute -top-1 left-0 w-[9rem] -rotate-6 text-left leading-tight">
        Des candidats sur vos sujets
      </HandNote>
      <HandNote className="absolute -bottom-2 right-0 w-[8.5rem] rotate-3 text-right leading-tight">
        Comparez leurs propositions
      </HandNote>
    </div>
  );
}
