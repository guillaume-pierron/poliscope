import { ExternalLink, History } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { CandidatePositionEvolution, CandidatePositionHistoryEntry, Theme } from "@/lib/types";
import { EvolutionTypeBadge } from "./record-badges";

interface EvolutionGroup {
  evolution: CandidatePositionEvolution;
  theme?: Theme;
  history: CandidatePositionHistoryEntry[];
}

/**
 * "Évolution des positions" — une mini chronologie avant/après par sujet,
 * suivie de la lecture éditoriale neutre (jamais "a retourné sa veste").
 * L'explication du candidat, si sourcée, est affichée séparément et jamais
 * fondue dans le résumé Polysia.
 */
export function CandidatePositionEvolutionSection({
  evolutions,
  positionHistory,
  themes,
}: {
  evolutions: CandidatePositionEvolution[];
  positionHistory: CandidatePositionHistoryEntry[];
  themes: Theme[];
}) {
  const groups: EvolutionGroup[] = evolutions.map((evolution) => ({
    evolution,
    theme: themes.find((t) => t.id === evolution.theme_id),
    history: positionHistory
      .filter((h) => h.subject === evolution.subject && h.theme_id === evolution.theme_id)
      .filter((h) => h.date)
      .sort((a, b) => (a.date! < b.date! ? -1 : 1)),
  }));

  return (
    <div>
      <h2 id="evolution-positions" className="scroll-mt-24 flex items-center gap-2 text-2xl font-semibold tracking-tight">
        <History size={20} className="text-primary" />
        Évolution des positions
      </h2>
      <p className="mt-2 text-sm text-muted">
        Comment ses positions sur un sujet ont été exprimées dans le temps, avec leurs sources — Polysia
        distingue une évolution documentée d&apos;une contradiction confirmée, et ne qualifie jamais
        automatiquement deux citations différentes de contradiction.
      </p>

      {groups.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-border p-5 text-sm text-muted-2">
          Aucune évolution de position documentée dans Polysia pour ce candidat à ce stade.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {groups.map(({ evolution, theme, history }) => (
            <article key={evolution.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-2">
                  {theme?.name ?? evolution.subject}
                </p>
                <EvolutionTypeBadge type={evolution.evolution_type} />
              </div>
              <h3 className="mt-1 font-medium">{evolution.subject}</h3>

              {history.length > 0 && (
                <ol className="mt-4 space-y-3 border-l border-border pl-5">
                  {history.map((entry) => (
                    <li key={entry.id} className="relative">
                      <span className="absolute -left-[1.4rem] top-1.5 h-2 w-2 rounded-full border-2 border-card bg-primary" />
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-2">
                        {entry.date ? formatDate(entry.date) : "Date non précisée"}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-foreground/85">
                        {entry.quote ? `« ${entry.quote} »` : entry.position_summary}
                      </p>
                      {entry.source_url && (
                        <a
                          href={entry.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="focus-ring mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                        >
                          {entry.source_name || "Source"}
                          <ExternalLink size={11} />
                        </a>
                      )}
                    </li>
                  ))}
                </ol>
              )}

              <div className="mt-4 rounded-xl border border-border bg-surface p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-2">Évolution documentée</p>
                <p className="mt-1.5 text-sm leading-relaxed text-foreground/85">{evolution.summary}</p>
              </div>

              {evolution.candidate_explanation && (
                <div className="mt-3 rounded-xl border border-primary/20 bg-primary-soft/40 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                    Explication donnée par le candidat
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-foreground/85">{evolution.candidate_explanation}</p>
                  {evolution.candidate_explanation_source_url && (
                    <a
                      href={evolution.candidate_explanation_source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="focus-ring mt-1.5 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                    >
                      Voir la source
                      <ExternalLink size={11} />
                    </a>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
