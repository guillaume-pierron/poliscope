"use client";

import { useMemo, useState } from "react";
import { EyeOff, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CandidateAvatar } from "@/components/candidates/candidate-avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { VERDICT_LABELS, type ThemeVerdict } from "@/lib/compare";
import type { Candidate, Proposal, Theme } from "@/lib/types";

const VERDICT_BADGE: Record<ThemeVerdict, "success" | "danger" | "default" | "outline"> = {
  accord: "success",
  desaccord: "danger",
  nuance: "default",
  inconnu: "outline",
};

export interface ThemeRow {
  theme: Theme;
  verdict: ThemeVerdict;
  proposalsA: Proposal[];
  proposalsB: Proposal[];
}

export function CompareTable({
  candidateA,
  candidateB,
  rows,
}: {
  candidateA: Candidate;
  candidateB: Candidate;
  rows: ThemeRow[];
}) {
  const [onlyDifferences, setOnlyDifferences] = useState(false);
  const [activeThemes, setActiveThemes] = useState<Set<string>>(new Set());

  const visibleRows = useMemo(() => {
    return rows.filter((row) => {
      if (onlyDifferences && row.verdict === "accord") return false;
      if (activeThemes.size > 0 && !activeThemes.has(row.theme.id)) return false;
      return true;
    });
  }, [rows, onlyDifferences, activeThemes]);

  function toggleTheme(id: string) {
    setActiveThemes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {rows.map(({ theme }) => (
            <button
              key={theme.id}
              type="button"
              onClick={() => toggleTheme(theme.id)}
              className={cn(
                "focus-ring rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                activeThemes.has(theme.id)
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-border-strong text-muted hover:bg-surface"
              )}
            >
              {theme.name}
            </button>
          ))}
        </div>

        <Button
          variant={onlyDifferences ? "primary" : "outline"}
          size="sm"
          onClick={() => setOnlyDifferences((v) => !v)}
          className="shrink-0"
        >
          {onlyDifferences ? <Eye size={16} /> : <EyeOff size={16} />}
          Voir uniquement leurs différences
        </Button>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:sticky sm:top-16 sm:z-10 sm:bg-background/90 sm:py-3 sm:backdrop-blur">
        <CandidateHeader candidate={candidateA} />
        <CandidateHeader candidate={candidateB} />
      </div>

      <div className="mt-4 space-y-8">
        {visibleRows.length === 0 && (
          <p className="py-12 text-center text-muted">
            Aucun thème ne correspond aux filtres sélectionnés.
          </p>
        )}

        {visibleRows.map((row) => (
          <section key={row.theme.id}>
            <div className="mb-3 flex items-center gap-2">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-2">
                {row.theme.name}
              </h3>
              <Badge variant={VERDICT_BADGE[row.verdict]}>{VERDICT_LABELS[row.verdict]}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <ProposalColumn proposals={row.proposalsA} />
              <ProposalColumn proposals={row.proposalsB} />
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function CandidateHeader({ candidate }: { candidate: Candidate }) {
  return (
    <div className="flex items-center gap-3">
      <CandidateAvatar name={candidate.name} color={candidate.party?.color} size="sm" />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">{candidate.name}</p>
        <p className="truncate text-xs text-muted">{candidate.party?.name}</p>
      </div>
    </div>
  );
}

function ProposalColumn({ proposals }: { proposals: Proposal[] }) {
  if (proposals.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-2">
        Position non renseignée.
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {proposals.map((p) => (
        <div key={p.id} className="rounded-lg border border-border bg-background p-4">
          <p className="text-sm font-medium">{p.title}</p>
          <p className="mt-1 text-sm text-muted">{p.summary}</p>
        </div>
      ))}
    </div>
  );
}
