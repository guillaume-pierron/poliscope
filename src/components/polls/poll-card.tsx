"use client";

import { useState } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CandidateAvatar } from "@/components/candidates/candidate-avatar";
import { cn, formatDate } from "@/lib/utils";
import type { Candidate, Poll, PollScenario, PollResult } from "@/lib/types";

const LOGO_PALETTE = ["#f97316", "#ef4444", "#0d9488", "#4338ca", "#0284c7", "#a855f7"];

function instituteColor(institute: string) {
  let hash = 0;
  for (let i = 0; i < institute.length; i++) hash = (hash * 31 + institute.charCodeAt(i)) >>> 0;
  return LOGO_PALETTE[hash % LOGO_PALETTE.length];
}

export function PollCard({
  poll,
  scenarios,
  resultsByScenario,
  candidates,
}: {
  poll: Poll;
  /** Les scénarios de CE sondage, pour le round actif uniquement, déjà triés par order_index. */
  scenarios: PollScenario[];
  resultsByScenario: Record<string, PollResult[]>;
  candidates: Candidate[];
}) {
  const [scenarioId, setScenarioId] = useState(scenarios[0]?.id);
  const [switcherOpen, setSwitcherOpen] = useState(true);
  const scenario = scenarios.find((s) => s.id === scenarioId) ?? scenarios[0];
  const results = scenario ? (resultsByScenario[scenario.id] ?? []) : [];
  const sorted = [...results].sort((a, b) => b.value - a.value);
  const maxValue = Math.max(...results.map((r) => r.value), 1);
  const isPrincipal = scenario?.id === scenarios[0]?.id;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
            style={{ background: instituteColor(poll.institute) }}
            aria-hidden="true"
          >
            {poll.institute.slice(0, 2).toUpperCase()}
          </span>
          <div>
            <p className="font-semibold">{poll.institute}</p>
            <p className="text-sm text-muted">
              Publié le {formatDate(poll.published_at)}
              {poll.sponsor ? ` · Commanditaire : ${poll.sponsor}` : ""}
            </p>
          </div>
        </div>
        <p className="text-xs text-muted-2">
          Terrain du {formatDate(poll.field_start)} au {formatDate(poll.field_end)} · Échantillon :{" "}
          {poll.sample_size.toLocaleString("fr-FR")} personnes
        </p>
      </div>

      {scenarios.length > 1 && (
        <div className="mt-4 rounded-xl border border-border bg-surface p-3">
          <button
            type="button"
            onClick={() => setSwitcherOpen((v) => !v)}
            className="focus-ring flex w-full items-center justify-between text-xs font-medium text-muted-2"
          >
            Autres scénarios testés
            <ChevronDown size={14} className={cn("transition-transform", switcherOpen && "rotate-180")} />
          </button>
          {switcherOpen && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {scenarios.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setScenarioId(s.id)}
                  className={cn(
                    "focus-ring rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors",
                    s.id === scenario?.id
                      ? "border-primary bg-primary-soft text-primary"
                      : "border-border-strong bg-card hover:bg-surface-strong"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {scenario ? (
        <>
          <div className="mt-4 flex items-center gap-2">
            {isPrincipal && scenarios.length > 1 && <Badge variant="primary">Scénario principal</Badge>}
            <p className="text-sm font-medium text-foreground/85">{scenario.label}</p>
          </div>

          <div className="mt-3 space-y-3">
            {sorted.map((result) => {
              const candidate = candidates.find((c) => c.id === result.candidate_id);
              if (!candidate) return null;
              return (
                <div key={result.id} className="flex items-center gap-3">
                  <CandidateAvatar
                    name={candidate.name}
                    color={candidate.party?.color}
                    photoUrl={candidate.photo_url}
                    size="sm"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <p
                        className="truncate text-sm font-medium"
                        style={{ color: candidate.party?.color }}
                      >
                        {candidate.name}
                      </p>
                      <p className="font-mono text-sm font-semibold tabular-nums">
                        {result.value}%
                        {result.low !== null && result.high !== null && (
                          <span className="ml-1 text-xs font-normal text-muted-2">
                            ({result.low}–{result.high})
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-strong">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(result.value / maxValue) * 100}%`,
                          background: candidate.party?.color ?? "var(--primary)",
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <p className="mt-4 text-sm text-muted-2">Aucun scénario chiffré pour ce sondage.</p>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-border pt-4 text-xs text-muted-2">
        <p>{poll.method}</p>
        <a
          href={poll.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-border-strong bg-card px-3 py-1.5 font-medium text-primary transition-colors hover:bg-surface"
        >
          Voir la source
          <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
}
