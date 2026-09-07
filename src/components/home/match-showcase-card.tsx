import Link from "next/link";
import { ArrowUpRight, Lock, Sun } from "lucide-react";
import { CandidateAvatar } from "@/components/candidates/candidate-avatar";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Candidate } from "@/lib/types";

/**
 * Emplacements du nuage de portraits. Fixes plutôt qu'aléatoires : un tirage
 * au rendu donnerait un balayage différent côté serveur et côté client.
 */
const FLOATING_SPOTS = [
  { left: "1%", top: "8%", size: "lg", delay: "0s" },
  { left: "22%", top: "48%", size: "md", delay: "1.4s" },
  { left: "37%", top: "4%", size: "md", delay: "0.6s" },
  { left: "53%", top: "52%", size: "lg", delay: "2.1s" },
  { left: "68%", top: "10%", size: "sm", delay: "1s" },
  { left: "80%", top: "44%", size: "md", delay: "2.6s" },
  { left: "13%", top: "76%", size: "sm", delay: "3.1s" },
] as const;

export function MatchShowcaseCard({
  questionCount,
  proposalCount,
  candidates,
  className,
}: {
  questionCount: number;
  proposalCount: number;
  candidates: Candidate[];
  className?: string;
}) {
  const floating = FLOATING_SPOTS.slice(0, candidates.length).map((spot, i) => ({
    ...spot,
    candidate: candidates[i],
  }));
  return (
    <div
      className={cn(
        "flex flex-col justify-between rounded-[24px] border border-primary/15 bg-primary-soft/60 p-7 sm:p-8",
        className
      )}
    >
      <div>
        <div className="flex items-center gap-1.5">
          <h3 className="font-serif text-[1.7rem] font-semibold tracking-tight sm:text-[1.9rem]">
            Mon Match
          </h3>
        </div>
        <p className="mt-1.5 text-[1.02rem] font-medium text-foreground/85">
          Quels candidats sont les plus proches de vos réponses&nbsp;?
        </p>
        <p className="mt-2.5 max-w-md text-sm leading-relaxed text-muted">
          Répondez à {questionCount} questions et comparez vos positions avec celles, documentées,
          des candidats.
        </p>

        <div className="relative mt-6 h-[190px] sm:h-[210px]" aria-hidden="true">
          {floating.map(({ candidate, left, top, size, delay }) => (
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
                className="shadow-[0_10px_24px_-12px_rgba(15,23,41,0.45)] ring-4 ring-card"
              />
            </span>
          ))}
        </div>
        <p className="text-sm text-muted">
          {candidates.length} candidats déclarés, comparés sur les mêmes questions.
        </p>
      </div>

      <div className="mt-7">
        <div className="flex flex-wrap items-center gap-4">
          <ButtonLink href="/match" variant="accent" size="lg">
            Découvrir mon Match
            <Sun size={17} />
          </ButtonLink>
          <p className="flex items-center gap-1.5 text-xs text-muted-2">
            <Lock size={12} />
            Sans inscription · résultats calculés sur votre appareil
          </p>
        </div>

        <Link
          href="/candidats"
          className="focus-ring group mt-5 flex items-center gap-1.5 border-t border-primary/15 pt-5 text-sm font-medium text-primary hover:underline"
        >
          Explorer les {proposalCount} propositions sourcées
          <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
