"use client";

import { useMemo, useState } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { PollCard } from "@/components/polls/poll-card";
import { cn } from "@/lib/utils";
import type { Candidate, Poll, PollResult, PollScenario } from "@/lib/types";

type Round = "premier_tour" | "second_tour";
type SortOrder = "recent" | "old";

export function PollFilters({
  polls,
  scenariosByPoll,
  resultsByScenario,
  candidates,
  defaultRound,
}: {
  polls: Poll[];
  scenariosByPoll: Record<string, PollScenario[]>;
  resultsByScenario: Record<string, PollResult[]>;
  candidates: Candidate[];
  defaultRound: Round;
}) {
  const [round, setRound] = useState<Round>(defaultRound);
  const [sortOrder, setSortOrder] = useState<SortOrder>("recent");
  const [scenarioFilter, setScenarioFilter] = useState<string | null>(null);
  const [sortOpen, setSortOpen] = useState(false);
  const [scenarioOpen, setScenarioOpen] = useState(false);

  const roundCounts = useMemo(() => {
    let premierTour = 0;
    let secondTour = 0;
    for (const poll of polls) {
      const rounds = new Set((scenariosByPoll[poll.id] ?? []).map((s) => s.round));
      if (rounds.has("premier_tour")) premierTour++;
      if (rounds.has("second_tour")) secondTour++;
    }
    return { premier_tour: premierTour, second_tour: secondTour };
  }, [polls, scenariosByPoll]);

  const scenarioLabels = useMemo(() => {
    const labels = new Set<string>();
    for (const poll of polls) {
      for (const s of scenariosByPoll[poll.id] ?? []) {
        if (s.round === round) labels.add(s.label);
      }
    }
    return [...labels];
  }, [polls, scenariosByPoll, round]);

  const visiblePolls = useMemo(() => {
    const filtered = polls.filter((poll) => {
      const roundScenarios = (scenariosByPoll[poll.id] ?? []).filter((s) => s.round === round);
      if (roundScenarios.length === 0) return false;
      if (scenarioFilter && !roundScenarios.some((s) => s.label === scenarioFilter)) return false;
      return true;
    });
    return [...filtered].sort((a, b) =>
      sortOrder === "recent"
        ? b.published_at.localeCompare(a.published_at)
        : a.published_at.localeCompare(b.published_at)
    );
  }, [polls, scenariosByPoll, round, scenarioFilter, sortOrder]);

  function changeRound(r: Round) {
    setRound(r);
    setScenarioFilter(null);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-xl bg-surface p-1">
          {(["premier_tour", "second_tour"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => changeRound(r)}
              className={cn(
                "focus-ring rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                round === r ? "bg-card shadow-sm" : "text-muted hover:text-foreground"
              )}
            >
              {r === "premier_tour" ? "Premier tour" : "Second tour"}
              <span className="ml-1.5 text-xs text-muted-2">({roundCounts[r]})</span>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Dropdown
            label={sortOrder === "recent" ? "Plus récents" : "Plus anciens"}
            open={sortOpen}
            onToggle={() => setSortOpen((v) => !v)}
          >
            {(["recent", "old"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setSortOrder(s);
                  setSortOpen(false);
                }}
                className={cn(
                  "block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-surface",
                  sortOrder === s && "font-semibold text-primary"
                )}
              >
                {s === "recent" ? "Plus récents" : "Plus anciens"}
              </button>
            ))}
          </Dropdown>

          <Dropdown
            label={`Scénario : ${scenarioFilter ?? "Tous les scénarios"}`}
            icon={<SlidersHorizontal size={13} />}
            open={scenarioOpen}
            onToggle={() => setScenarioOpen((v) => !v)}
            menuClassName="max-h-64 w-64 overflow-y-auto"
          >
            <button
              type="button"
              onClick={() => {
                setScenarioFilter(null);
                setScenarioOpen(false);
              }}
              className={cn(
                "block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-surface",
                !scenarioFilter && "font-semibold text-primary"
              )}
            >
              Tous les scénarios
            </button>
            {scenarioLabels.map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => {
                  setScenarioFilter(label);
                  setScenarioOpen(false);
                }}
                className={cn(
                  "block w-full truncate rounded-lg px-3 py-2 text-left text-sm hover:bg-surface",
                  scenarioFilter === label && "font-semibold text-primary"
                )}
              >
                {label}
              </button>
            ))}
          </Dropdown>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {visiblePolls.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border-strong py-12 text-center text-sm text-muted-2">
            {round === "premier_tour"
              ? "Aucun sondage de premier tour publié pour l'instant."
              : "Aucun sondage de second tour publié pour l'instant."}
          </p>
        ) : (
          visiblePolls.map((poll) => {
            const roundScenarios = (scenariosByPoll[poll.id] ?? [])
              .filter((s) => s.round === round)
              .filter((s) => !scenarioFilter || s.label === scenarioFilter)
              .sort((a, b) => a.order_index - b.order_index);
            return (
              <PollCard
                key={poll.id}
                poll={poll}
                scenarios={roundScenarios}
                resultsByScenario={resultsByScenario}
                candidates={candidates}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

function Dropdown({
  label,
  icon,
  open,
  onToggle,
  children,
  menuClassName,
}: {
  label: string;
  icon?: React.ReactNode;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  menuClassName?: string;
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="focus-ring flex items-center gap-1.5 rounded-lg border border-border-strong bg-card px-3 py-2 text-sm font-medium hover:bg-surface"
      >
        {icon}
        <span className="max-w-[160px] truncate">{label}</span>
        <ChevronDown size={14} className={cn("transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <>
          <button
            type="button"
            aria-label="Fermer"
            onClick={onToggle}
            className="fixed inset-0 z-10 cursor-default"
          />
          <div
            className={cn(
              "absolute right-0 z-20 mt-1.5 min-w-[180px] rounded-xl border border-border bg-card p-1.5 shadow-lg",
              menuClassName
            )}
          >
            {children}
          </div>
        </>
      )}
    </div>
  );
}
