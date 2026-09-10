import { ExternalLink, ShieldCheck } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { TRANSPARENCY_RECORD_TYPE_LABELS, type CandidateTransparencyRecord, type TransparencyRecordType } from "@/lib/types";

/** Les deux documents les plus attendus s'affichent toujours, même absents — le reste n'apparaît que si documenté. */
const ALWAYS_SHOWN: TransparencyRecordType[] = ["declaration_interets", "declaration_patrimoine"];

/**
 * "Transparence" — référence des déclarations publiques (HATVP et
 * assimilées), jamais une analyse du patrimoine. L'absence d'un document se
 * lit "non documenté dans Polysia", jamais "n'existe pas" : Polysia ne peut
 * garantir l'exhaustivité de ce qu'elle référence.
 */
export function CandidateTransparencySection({ records }: { records: CandidateTransparencyRecord[] }) {
  const byType = new Map<TransparencyRecordType, CandidateTransparencyRecord[]>();
  for (const record of records) {
    const list = byType.get(record.record_type) ?? [];
    list.push(record);
    byType.set(record.record_type, list);
  }

  const types = [...new Set([...ALWAYS_SHOWN, ...byType.keys()])];

  return (
    <div>
      <h2 id="transparence" className="scroll-mt-24 flex items-center gap-2 text-2xl font-semibold tracking-tight">
        <ShieldCheck size={20} className="text-primary" />
        Transparence
      </h2>
      <p className="mt-2 text-sm text-muted">
        Les déclarations publiques référencées pour ce candidat — jamais une analyse du patrimoine ou des
        intérêts déclarés, seulement un accès aux documents officiels.
      </p>

      <ul className="mt-6 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
        {types.map((type) => {
          const entries = byType.get(type) ?? [];
          return (
            <li key={type} className="p-4">
              <p className="text-sm font-semibold">{TRANSPARENCY_RECORD_TYPE_LABELS[type]}</p>
              {entries.length === 0 ? (
                <p className="mt-1 text-sm text-muted-2">Non documenté</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {entries.map((entry) => (
                    <li key={entry.id} className="flex flex-wrap items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm text-foreground/85">{entry.title}</p>
                        {entry.publication_date && (
                          <p className="text-xs text-muted-2">Dernière déclaration : {formatDate(entry.publication_date)}</p>
                        )}
                      </div>
                      {entry.source_url && (
                        <a
                          href={entry.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="focus-ring inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                        >
                          Consulter le document officiel
                          <ExternalLink size={13} />
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
