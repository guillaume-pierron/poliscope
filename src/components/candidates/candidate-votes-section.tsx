"use client";

import { useMemo, useState } from "react";
import { Gavel } from "lucide-react";
import { ThemeIcon } from "@/lib/theme-icons";
import { cn } from "@/lib/utils";
import type { CandidateVote, Theme } from "@/lib/types";
import { CandidateVoteCard } from "./candidate-vote-card";

/**
 * "Ses votes" — liste filtrable par thème plutôt qu'un tableau : voir la
 * note de design de CandidateProposalsSection, même principe. Les votes mis
 * en avant (`featured`, sélectionnés par l'admin selon une méthodologie
 * publique — voir /methodologie) sont affichés en premier.
 */
export function CandidateVotesSection({ votes, themes }: { votes: CandidateVote[]; themes: Theme[] }) {
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
      <h2 id="votes" className="scroll-mt-24 flex items-center gap-2 text-2xl font-semibold tracking-tight">
        <Gavel size={20} className="text-primary" />
        Ses votes
      </h2>
      <p className="mt-2 text-sm text-muted">
        Des votes publics individuels, quand ils sont disponibles — Assemblée nationale, Sénat, Parlement
        européen. « Absent » et « N&apos;a pas pris part au vote » ne sont jamais affichés comme une abstention
        politique.
      </p>

      {votes.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-border p-5 text-sm text-muted-2">
          Aucun vote référencé dans Polysia pour ce candidat à ce stade.
        </p>
      ) : (
        <>
          <div className="mt-5 flex flex-wrap gap-1.5">
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

          <div className="mt-5 space-y-3">
            {sorted.map((vote) => (
              <CandidateVoteCard key={vote.id} vote={vote} theme={themes.find((t) => t.id === vote.theme_id)} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
