import { ExternalLink } from "lucide-react";
import type { Proposal } from "@/lib/types";

/** Nom d'hôte lisible, sans « www. » — jamais le chemin complet, illisible en liste. */
function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/**
 * Toutes les sources citées par les propositions du candidat, regroupées par
 * URL. Le compte affiché est celui des propositions qui s'y adossent : c'est
 * ce qui permet de vérifier qu'aucune proposition ne flotte sans source.
 */
export function CandidateSourcesSection({ proposals }: { proposals: Proposal[] }) {
  const byUrl = new Map<string, { name: string; count: number }>();
  for (const proposal of proposals) {
    if (!proposal.source_url) continue;
    const existing = byUrl.get(proposal.source_url);
    if (existing) {
      existing.count += 1;
    } else {
      byUrl.set(proposal.source_url, { name: proposal.source_name, count: 1 });
    }
  }

  const sources = [...byUrl.entries()].sort((a, b) => b[1].count - a[1].count);

  return (
    <div>
      <h2 id="sources" className="scroll-mt-24 text-2xl font-semibold tracking-tight">
        Ses sources
      </h2>
      <p className="mt-2 text-sm text-muted">
        Chaque proposition de cette fiche renvoie à l&apos;un de ces documents. Aucun chiffre n&apos;est
        avancé sans l&apos;un d&apos;eux.
      </p>

      {sources.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-border p-5 text-sm text-muted-2">
          Aucune source enregistrée pour ce candidat à ce stade.
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {sources.map(([url, { name, count }]) => (
            <li key={url}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-surface"
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{name}</span>
                  <span className="block truncate text-xs text-muted-2">{hostOf(url)}</span>
                </span>
                <span className="shrink-0 text-xs text-muted">
                  {count} proposition{count > 1 ? "s" : ""}
                </span>
                <ExternalLink size={15} className="shrink-0 text-muted-2" />
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
