"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CandidateCard } from "./candidate-card";
import { ORIENTATION_LABELS, type Candidate, type Orientation } from "@/lib/types";
import { cn } from "@/lib/utils";

export function CandidatesGrid({ candidates }: { candidates: Candidate[] }) {
  const [query, setQuery] = useState("");
  const [orientation, setOrientation] = useState<Orientation | "all">("all");

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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-2" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un candidat ou un parti…"
            className="pl-10"
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
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
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
        "focus-ring whitespace-nowrap rounded-full border px-3.5 py-2 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary-soft text-primary"
          : "border-border-strong text-muted hover:bg-surface"
      )}
    >
      {children}
    </button>
  );
}
