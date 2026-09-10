"use client";

import { useMemo, useState } from "react";
import { FileText } from "lucide-react";
import { CandidateProposalCard } from "./candidate-proposal-card";
import { CandidateSectionHeader } from "./candidate-section-header";
import { ThemeIcon } from "@/lib/theme-icons";
import { cn } from "@/lib/utils";
import type { Proposal, Theme } from "@/lib/types";

export function CandidateProposalsSection({
  candidateName,
  proposals,
  themes,
  candidateSlug,
  analyzedProposalIds,
}: {
  candidateName: string;
  proposals: Proposal[];
  themes: Theme[];
  candidateSlug: string;
  /** Proposal ids with a *published* "Passage au réel" analysis. */
  analyzedProposalIds: Set<string>;
}) {
  const [activeThemeId, setActiveThemeId] = useState<string | null>(null);

  const usedThemes = useMemo(
    () => themes.filter((t) => proposals.some((p) => p.theme_id === t.id)),
    [themes, proposals]
  );

  const filtered = activeThemeId ? proposals.filter((p) => p.theme_id === activeThemeId) : proposals;

  return (
    <div>
      <CandidateSectionHeader
        icon={FileText}
        title="Programme"
        count={proposals.length || undefined}
        countLabel={`proposition${proposals.length > 1 ? "s" : ""} documentée${proposals.length > 1 ? "s" : ""}`}
        description={`Découvrez les propositions de ${candidateName} pour la France, sourcées et analysées par notre équipe.`}
      >
        {proposals.length > 0 && (
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

      {proposals.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-border p-5 text-sm text-muted-2">
          Aucune proposition documentée pour ce candidat à ce stade.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {filtered.map((proposal) => (
            <CandidateProposalCard
              key={proposal.id}
              proposal={proposal}
              theme={themes.find((t) => t.id === proposal.theme_id)}
              candidateSlug={candidateSlug}
              hasAnalysis={analyzedProposalIds.has(proposal.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
