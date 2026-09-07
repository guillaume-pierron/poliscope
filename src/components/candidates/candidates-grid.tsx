"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CandidateCard } from "./candidate-card";
import { loadAnswers } from "@/lib/match-storage";
import { computeMatchResults, computeThemeWeightsFromPriorityAnswers } from "@/lib/scoring";
import {
  ORIENTATION_LABELS,
  type Candidate,
  type CandidatePosition,
  type Orientation,
  type Question,
} from "@/lib/types";
import { cn } from "@/lib/utils";

export function CandidatesGrid({
  candidates,
  proposalCounts,
  themeCounts,
}: {
  candidates: Candidate[];
  /** Décomptes réels, calculés côté serveur à partir des propositions. */
  proposalCounts: Record<string, number>;
  themeCounts: Record<string, number>;
}) {
  const [query, setQuery] = useState("");
  const [orientation, setOrientation] = useState<Orientation | "all">("all");
  const [proximity, setProximity] = useState<Record<string, number>>({});

  // Les réponses du visiteur ne quittent pas son appareil : seul le jeu de
  // données public est récupéré, et tous les scores sont calculés d'un coup
  // plutôt qu'avec une requête par carte.
  useEffect(() => {
    const answers = loadAnswers();
    if (!answers.some((a) => a.value !== null)) return;
    fetch("/api/match-data")
      .then((res) => res.json())
      .then((data: { positions: CandidatePosition[]; questions: Question[] }) => {
        const weights = computeThemeWeightsFromPriorityAnswers(answers, data.questions);
        const results = computeMatchResults(
          answers,
          candidates,
          data.positions,
          data.questions,
          weights
        );
        const map: Record<string, number> = {};
        for (const r of results) {
          if (r.score !== null) map[r.candidate.id] = r.score;
        }
        setProximity(map);
      })
      .catch(() => setProximity({}));
  }, [candidates]);

  const orientations = useMemo(() => {
    const set = new Set<Orientation>();
    candidates.forEach((c) => c.party && set.add(c.party.orientation));
    return Array.from(set);
  }, [candidates]);

  const filtered = candidates.filter((c) => {
    const matchesQuery =
      query.trim().length === 0 ||
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.party?.name.toLowerCase().includes(query.toLowerCase());
    const matchesOrientation = orientation === "all" || c.party?.orientation === orientation;
    return matchesQuery && matchesOrientation;
  });

  return (
    <div>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative lg:w-[22rem]">
          <Search
            size={16}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-2"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un candidat ou un parti…"
            className="rounded-full pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <FilterChip active={orientation === "all"} onClick={() => setOrientation("all")}>
            Tous
          </FilterChip>
          {orientations.map((o) => (
            <FilterChip key={o} active={orientation === o} onClick={() => setOrientation(o)}>
              {ORIENTATION_LABELS[o]}
            </FilterChip>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              proposalCount={proposalCounts[candidate.id] ?? 0}
              themeCount={themeCounts[candidate.id] ?? 0}
              proximity={proximity[candidate.id] ?? null}
            />
          ))}
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-center text-center">
          <p className="text-muted">Aucun candidat ne correspond à votre recherche.</p>
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "focus-ring whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary-soft text-primary"
          : "border-border-strong bg-card text-muted hover:bg-surface"
      )}
    >
      {children}
    </button>
  );
}
