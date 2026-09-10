"use client";

import { useMemo, useState } from "react";
import { Vote } from "lucide-react";
import { ThemeIcon } from "@/lib/theme-icons";
import { cn } from "@/lib/utils";
import type { CandidateVote, Theme } from "@/lib/types";
import { CandidateVoteCard } from "./candidate-vote-card";
import { CandidateSectionHeader } from "./candidate-section-header";

/**
 * "Ses votes" — liste filtrable par thème plutôt qu'un tableau : voir la
 * note de design de CandidateProposalsSection, même principe. Les votes mis
 * en avant (`featured`, sélectionnés par l'admin selon une méthodologie
 * publique — voir /methodologie) sont affichés en premier.
 */
export function CandidateVotesSection({
  candidateName,
  votes,
  themes,
}: {
  candidateName: string;
  votes: CandidateVote[];
  themes: Theme[];
}) {
  const [activeThemeId, setActiveThemeId] = useState<string | null>(null);

  const usedThemes = useMemo(
    () => themes.filter((t) => votes.some((v) => v.theme_id === t.id)),
    [themes, votes]
  );

  const filtered = activeThemeId ? votes.filter((v) => v.theme_id === activeThemeId) : votes;
  const sorted = [...filtered].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return a.vote_date < b.vote_date ? 1 : -1;
  });

  return (
    <div>
      <CandidateSectionHeader
        icon={Vote}
        title="Votes"
        count={votes.length || undefined}
        countLabel={`vote${votes.length > 1 ? "s" : ""} référencé${votes.length > 1 ? "s" : ""}`}
        description={`Des votes publics individuels de ${candidateName}, quand ils sont disponibles — Assemblée nationale, Sénat, Parlement européen. « Absent » et « N'a pas pris part au vote » ne sont jamais affichés comme une abstention politique.`}
      >
        {votes.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setActiveThemeId(null)}
              className={cn(
                "focus-ring rounded-full border px-3.5 py-2 text-sm font-medium transition-colors",
                activeThemeId === null
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-border-strong bg-card hover:bg-surface"
              )}
            >
              Tous
            </button>
            {usedThemes.map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => setActiveThemeId(theme.id)}
                className={cn(
                  "focus-ring flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors",
                  activeThemeId === theme.id
                    ? "border-primary bg-primary-soft text-primary"
                    : "border-border-strong bg-card hover:bg-surface"
                )}
              >
                <ThemeIcon icon={theme.icon} className="h-3.5 w-3.5" />
                {theme.name}
              </button>
            ))}
          </div>
        )}
      </CandidateSectionHeader>

      {votes.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-border p-5 text-sm text-muted-2">
          Aucun vote référencé dans Polysia pour ce candidat à ce stade.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {sorted.map((vote) => (
            <CandidateVoteCard key={vote.id} vote={vote} theme={themes.find((t) => t.id === vote.theme_id)} />
          ))}
        </div>
      )}
    </div>
  );
}
