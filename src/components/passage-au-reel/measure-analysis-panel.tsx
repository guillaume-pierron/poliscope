import Link from "next/link";
import { AlertTriangle, Calculator, Sparkle } from "lucide-react";
import { deriveFeasibilityChecklist } from "@/lib/passage-au-reel/feasibility";
import { formatDate } from "@/lib/utils";
import { ConfidenceBadge, FeasibilityBadge, FeasibilityChecklist } from "./badges";
import {
  AssumptionsSection,
  BeneficiariesSection,
  BudgetSection,
  ImpactSection,
  ImplementationSection,
  LegalSection,
  PrecisionSection,
  SourcesSection,
} from "./sections";
import type { MeasureAnalysisBundle } from "@/lib/types";

/**
 * Full "Passage au réel" panel for one measure's fiche — the layout
 * described in the feature spec: faisabilité en tête, puis le détail
 * juridique/mise en œuvre/précision, bénéficiaires, budget, impact,
 * hypothèses, sources, date de mise à jour.
 */
export function MeasureAnalysisPanel({ bundle }: { bundle: MeasureAnalysisBundle }) {
  const { analysis } = bundle;
  const checklist = deriveFeasibilityChecklist(bundle);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkle className="h-4 w-4 text-primary" />
        <h2 className="font-serif text-xl font-semibold tracking-tight">Passage au réel</h2>
      </div>

      {analysis.status === "outdated" && (
        <div className="flex items-start gap-2.5 rounded-2xl border border-accent/30 bg-accent-soft px-4 py-3 text-sm text-accent">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          <p>
            Cette analyse est signalée <strong>à actualiser</strong> — un élément (programme, source ou paramètre
            économique) a changé depuis la dernière vérification. Les informations ci-dessous restent affichées à
            titre indicatif.
          </p>
        </div>
      )}

      <section className="rounded-2xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-2">Faisabilité</h3>
        {analysis.feasibility_status ? (
          <>
            <div className="mt-2">
              <FeasibilityBadge status={analysis.feasibility_status} />
            </div>
            <FeasibilityChecklist items={checklist} className="mt-3" />
          </>
        ) : (
          <p className="mt-2 text-sm italic text-muted-2">Analyse en cours.</p>
        )}
        {analysis.confidence_level && <ConfidenceBadge level={analysis.confidence_level} className="mt-3" />}
        {analysis.summary && (
          <p className="mt-3 border-t border-border pt-3 text-sm leading-relaxed text-foreground/85">
            {analysis.summary}
          </p>
        )}
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <LegalSection analysis={analysis} />
        <ImplementationSection analysis={analysis} />
      </div>
      <PrecisionSection analysis={analysis} />
      <BeneficiariesSection analysis={analysis} />
      <BudgetSection estimates={bundle.budgetEstimates} />
      <ImpactSection impacts={bundle.impacts} />

      {analysis.simulator_measure_id && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-primary/20 bg-primary-soft/50 px-4 py-3.5">
          <p className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Calculator size={16} className="shrink-0 text-primary" />
            Cette mesure peut concerner votre situation personnelle.
          </p>
          <Link
            href="/simulateur"
            className="focus-ring shrink-0 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Voir son impact sur ma situation
          </Link>
        </div>
      )}

      <AssumptionsSection assumptions={bundle.assumptions} />
      <SourcesSection bundle={bundle} />

      <p className="text-xs text-muted-2">
        Mise à jour le {formatDate(analysis.updated_at)}
        {analysis.reviewed_by && ` · Vérifiée par ${analysis.reviewed_by}`}
        {analysis.reviewed_at && ` le ${formatDate(analysis.reviewed_at)}`}
      </p>
    </div>
  );
}
