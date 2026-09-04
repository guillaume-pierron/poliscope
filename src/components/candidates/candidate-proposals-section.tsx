"use client";

import { useMemo, useState } from "react";
import { BookMarked, FileCheck2, Library } from "lucide-react";
import { CandidateProposalCard } from "./candidate-proposal-card";
import { ThemeIcon } from "@/lib/theme-icons";
import { cn, isQuantifiedProposal } from "@/lib/utils";
import type { Proposal, Theme } from "@/lib/types";

export function CandidateProposalsSection({
  proposals,
  themes,
  candidateSlug,
}: {
  proposals: Proposal[];
  themes: Theme[];
  candidateSlug: string;
}) {
  const [activeThemeId, setActiveThemeId] = useState<string | null>(null);

  const usedThemes = useMemo(
    () => themes.filter((t) => proposals.some((p) => p.theme_id === t.id)),
    [themes, proposals]
  );

  const filtered = activeThemeId ? proposals.filter((p) => p.theme_id === activeThemeId) : proposals;
  const sourceCount = new Set(proposals.map((p) => p.source_url)).size;
  const quantifiedCount = proposals.filter(isQuantifiedProposal).length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold tracking-tight">Ses propositions</h2>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-muted">
          <span className="flex items-center gap-1.5">
            <FileCheck2 size={15} className="text-primary" />
            <span className="font-semibold text-foreground">{proposals.length}</span>
            propositions documentées
          </span>
          <span className="flex items-center gap-1.5">
            <Library size={15} className="text-primary" />
            <span className="font-semibold text-foreground">{sourceCount}</span>
            sources
          </span>
          <span className="flex items-center gap-1.5">
            <BookMarked size={15} className="text-primary" />
            <span className="font-semibold text-foreground">{quantifiedCount}</span>
            mesures chiffrées
          </span>
        </div>
      </div>

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
        {filtered.map((proposal) => (
          <CandidateProposalCard
            key={proposal.id}
            proposal={proposal}
            theme={themes.find((t) => t.id === proposal.theme_id)}
            candidateSlug={candidateSlug}
          />
        ))}
      </div>
    </div>
  );
}
