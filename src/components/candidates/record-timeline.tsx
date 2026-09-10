import { ExternalLink } from "lucide-react";
import { SourceTypeLabel } from "./record-badges";
import type { RecordSourceType } from "@/lib/types";

export interface TimelineEntry {
  id: string;
  title: string;
  subtitle: string;
  /** Ex. territoire, secteur, parti à l'époque — affiché en petite ligne secondaire. */
  meta?: string | null;
  start: string | null;
  end: string | null;
  isOngoing: boolean;
  description?: string | null;
  sourceName?: string | null;
  sourceUrl?: string | null;
  sourceType?: RecordSourceType | null;
}

/** "1998 → 2004", "depuis 2017", ou "Période non précisée" — jamais un jour inventé faute de source précise. */
function periodLabel(entry: TimelineEntry): string {
  if (entry.isOngoing) return entry.start ? `Depuis ${entry.start}` : "En cours";
  if (entry.start && entry.end) return `${entry.start} → ${entry.end}`;
  if (entry.start) return `Depuis ${entry.start}`;
  if (entry.end) return `Jusqu'en ${entry.end}`;
  return "Période non précisée";
}

/** Tri les entrées les plus récentes/en cours en premier, sans jamais fabriquer d'ordre pour celles sans date. */
export function sortTimelineEntries(entries: TimelineEntry[]): TimelineEntry[] {
  return [...entries].sort((a, b) => {
    if (a.isOngoing !== b.isOngoing) return a.isOngoing ? -1 : 1;
    const aKey = a.end ?? a.start ?? "";
    const bKey = b.end ?? b.start ?? "";
    return aKey < bKey ? 1 : aKey > bKey ? -1 : 0;
  });
}

/** Chronologie verticale compacte — parcours professionnel et mandats partagent ce même composant. */
export function RecordTimeline({ entries }: { entries: TimelineEntry[] }) {
  if (entries.length === 0) return null;

  return (
    <ol className="relative space-y-5 border-l border-border pl-6">
      {entries.map((entry) => (
        <li key={entry.id} className="relative">
          <span className="absolute -left-[1.65rem] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-primary" />
          <p className="text-xs font-medium uppercase tracking-wide text-muted-2">{periodLabel(entry)}</p>
          <p className="mt-1 font-semibold text-foreground">{entry.title}</p>
          <p className="text-sm text-muted">
            {entry.subtitle}
            {entry.meta ? ` · ${entry.meta}` : ""}
          </p>
          {entry.description && <p className="mt-1.5 text-sm leading-relaxed text-foreground/85">{entry.description}</p>}
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
            {entry.sourceUrl && (
              <a
                href={entry.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                {entry.sourceName || "Voir la source"}
                <ExternalLink size={13} />
              </a>
            )}
            <SourceTypeLabel type={entry.sourceType ?? null} />
          </div>
        </li>
      ))}
    </ol>
  );
}
