"use client";

import { useMemo, useState } from "react";
import { MeasureAnalysisSummaryCard } from "./measure-analysis-summary-card";
import { ReadingGuide } from "./reading-guide";
import { ThemeIcon } from "@/lib/theme-icons";
import { cn } from "@/lib/utils";
import type { Candidate, MeasureAnalysisBundle, Proposal, Theme } from "@/lib/types";

export interface AnalyzedMeasure {
  bundle: MeasureAnalysisBundle;
  proposal: Proposal;
  candidate: Candidate;
  theme: Theme | undefined;
}

type QuickFilter = "toutes" | "recentes" | "chiffrees" | "incertitude";

const QUICK_FILTERS: { key: QuickFilter; label: string }[] = [
  { key: "toutes", label: "Toutes" },
  { key: "recentes", label: "Analyses les plus récentes" },
  { key: "chiffrees", label: "Mesures chiffrées" },
  { key: "incertitude", label: "Forte incertitude" },
];

export function PassageAuReelExplorer({ measures, themes }: { measures: AnalyzedMeasure[]; themes: Theme[] }) {
  const [themeId, setThemeId] = useState<string | null>(null);
  const [quickFilter, setQuickFilter] = useState<QuickFilter>("toutes");

  const usedThemes = useMemo(
    () => themes.filter((t) => measures.some((m) => m.theme?.id === t.id)),
    [themes, measures]
  );

  const filtered = useMemo(() => {
    let result = themeId ? measures.filter((m) => m.theme?.id === themeId) : measures;

    if (quickFilter === "recentes") {
      result = [...result].sort((a, b) => (a.bundle.analysis.published_at ?? "") < (b.bundle.analysis.published_at ?? "") ? 1 : -1);
    } else if (quickFilter === "chiffrees") {
      result = result.filter((m) => m.bundle.budgetEstimates.length > 0);
    } else if (quickFilter === "incertitude") {
      result = result.filter(
        (m) =>
          m.bundle.analysis.confidence_level === "faible" ||
          m.bundle.analysis.feasibility_status === "informations_insuffisantes" ||
          m.bundle.analysis.feasibility_status === "obstacle_juridique_majeur"
      );
    }
    return result;
  }, [measures, themeId, quickFilter]);

  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => setThemeId(null)}
          className={cn(
            "focus-ring rounded-full border px-3.5 py-2 text-sm font-medium transition-colors",
            themeId === null ? "border-primary bg-primary-soft text-primary" : "border-border-strong bg-card hover:bg-surface"
          )}
        >
          Tous
        </button>
        {usedThemes.map((theme) => (
          <button
            key={theme.id}
            type="button"
            onClick={() => setThemeId(theme.id)}
            className={cn(
              "focus-ring flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors",
              themeId === theme.id ? "border-primary bg-primary-soft text-primary" : "border-border-strong bg-card hover:bg-surface"
            )}
          >
            <ThemeIcon icon={theme.icon} className="h-3.5 w-3.5" />
            {theme.name}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex flex-wrap gap-1.5">
          {QUICK_FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setQuickFilter(f.key)}
              className={cn(
                "focus-ring rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                quickFilter === f.key ? "bg-foreground text-card" : "bg-surface text-muted hover:bg-surface-strong"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        {/* Le compteur porte sur les analyses publiées, pas sur les propositions
            du site : les deux nombres n'ont rien à voir. */}
        <p className="text-xs text-muted-2">
          {filtered.length} analyse{filtered.length > 1 ? "s" : ""} affichée
          {filtered.length > 1 ? "s" : ""}
          {filtered.length !== measures.length && ` sur ${measures.length}`}
        </p>
      </div>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_19rem]">
        {filtered.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border-strong p-8 text-center text-sm text-muted-2">
            Aucune analyse ne correspond à ce filtre pour le moment.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 min-[1400px]:grid-cols-3">
            {filtered.map(({ bundle, proposal, candidate, theme }) => (
              <MeasureAnalysisSummaryCard
                key={bundle.analysis.id}
                bundle={bundle}
                proposal={proposal}
                candidate={candidate}
                theme={theme}
              />
            ))}
          </div>
        )}

        <ReadingGuide className="lg:sticky lg:top-6" />
      </div>
    </div>
  );
}
