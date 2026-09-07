import type { ReactNode } from "react";
import { ExternalLink } from "lucide-react";
import { formatCentral, formatCount, formatRange } from "@/lib/passage-au-reel/format";
import { cn } from "@/lib/utils";
import {
  ASSUMPTION_TYPE_LABELS,
  BUDGET_SOURCE_TYPE_LABELS,
  IMPACT_CATEGORY_LABELS,
  IMPACT_HORIZON_LABELS,
  IMPACT_SCENARIO_LABELS,
  IMPLEMENTATION_ANSWER_LABELS,
  LEGAL_PATH_LABELS,
  type ImpactHorizon,
  type MeasureAnalysis,
  type MeasureAnalysisBundle,
  type MeasureAssumption,
  type MeasureBudgetEstimate,
  type MeasureImpact,
} from "@/lib/types";

function SectionShell({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-2xl border border-border bg-card p-5", className)}>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-2">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function EmptyState({ children }: { children: ReactNode }) {
  return <p className="text-sm italic text-muted-2">{children}</p>;
}

function SourceLink({ name, url }: { name: string; url: string | null }) {
  if (!url) return <span>{name}</span>;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="focus-ring inline-flex items-center gap-1 text-primary hover:underline"
    >
      {name}
      <ExternalLink size={11} />
    </a>
  );
}

export function LegalSection({ analysis }: { analysis: MeasureAnalysis }) {
  return (
    <SectionShell title="Cadre juridique">
      {analysis.legal_path ? (
        <>
          <p className="text-base font-medium">{LEGAL_PATH_LABELS[analysis.legal_path]}</p>
          <ul className="mt-2 space-y-1 text-sm text-muted">
            {analysis.legal_constitutional_change_required && <li>Révision constitutionnelle nécessaire.</li>}
            {analysis.legal_eu_change_required && <li>Modification du droit européen nécessaire.</li>}
            {(analysis.legal_implementation_delay_min_months !== null ||
              analysis.legal_implementation_delay_max_months !== null) && (
              <li>
                Délai de mise en œuvre estimé :{" "}
                {formatRange(
                  analysis.legal_implementation_delay_min_months,
                  null,
                  analysis.legal_implementation_delay_max_months,
                  "mois"
                )}
              </li>
            )}
          </ul>
          {analysis.legal_notes && <p className="mt-3 text-sm leading-relaxed text-foreground/85">{analysis.legal_notes}</p>}
        </>
      ) : (
        <EmptyState>Cadre juridique non identifié pour le moment.</EmptyState>
      )}
    </SectionShell>
  );
}

export function ImplementationSection({ analysis }: { analysis: MeasureAnalysis }) {
  const hasContent =
    analysis.implementation_existing_administration !== "non_documente" ||
    analysis.implementation_new_recruitment_needed !== "non_documente" ||
    !!analysis.implementation_notes;

  return (
    <SectionShell title="Mise en œuvre">
      {hasContent ? (
        <>
          <ul className="space-y-1.5 text-sm">
            <li>
              <span className="text-muted">Administration existante : </span>
              <span className="font-medium">
                {IMPLEMENTATION_ANSWER_LABELS[analysis.implementation_existing_administration]}
              </span>
            </li>
            <li>
              <span className="text-muted">Recrutements supplémentaires nécessaires : </span>
              <span className="font-medium">
                {IMPLEMENTATION_ANSWER_LABELS[analysis.implementation_new_recruitment_needed]}
              </span>
            </li>
          </ul>
          {analysis.implementation_notes && (
            <p className="mt-3 text-sm leading-relaxed text-foreground/85">{analysis.implementation_notes}</p>
          )}
        </>
      ) : (
        <EmptyState>Éléments de mise en œuvre non documentés par une source identifiée.</EmptyState>
      )}
    </SectionShell>
  );
}

export function PrecisionSection({ analysis }: { analysis: MeasureAnalysis }) {
  const labels: Record<NonNullable<MeasureAnalysis["precision_level"]>, string> = {
    precise: "Montant, bénéficiaires et mécanisme sont définis par la source.",
    partiellement_precis: "Le principe est clair mais certains paramètres restent incomplets.",
    insuffisant: "La source ne donne pas assez d'éléments pour une modélisation fiable sans hypothèses importantes.",
  };
  return (
    <SectionShell title="Niveau de précision">
      {analysis.precision_level ? (
        <p className="text-sm text-foreground/85">{labels[analysis.precision_level]}</p>
      ) : (
        <EmptyState>Non évalué.</EmptyState>
      )}
    </SectionShell>
  );
}

export function BeneficiariesSection({ analysis }: { analysis: MeasureAnalysis }) {
  const count = formatRange(
    analysis.beneficiaries_count_min,
    analysis.beneficiaries_count_central,
    analysis.beneficiaries_count_max,
    ""
  );
  const hasContent = analysis.beneficiaries_groups.length > 0 || !!analysis.beneficiaries_description || !!count;

  return (
    <SectionShell title="Qui est concerné ?">
      {hasContent ? (
        <>
          {analysis.beneficiaries_groups.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {analysis.beneficiaries_groups.map((g) => (
                <span key={g} className="rounded-full bg-surface px-2.5 py-1 text-xs font-medium text-muted">
                  {g}
                </span>
              ))}
            </div>
          )}
          {count && (
            <p className="mt-2.5 font-serif text-xl font-semibold tabular-nums">
              {formatCount(analysis.beneficiaries_count_min ?? analysis.beneficiaries_count_central)}
              {analysis.beneficiaries_count_max &&
              analysis.beneficiaries_count_max !== analysis.beneficiaries_count_min
                ? ` à ${formatCount(analysis.beneficiaries_count_max)}`
                : ""}{" "}
              personnes
              {analysis.beneficiaries_source_name && (
                <span className="ml-2 text-xs font-normal text-muted-2">
                  (<SourceLink name={analysis.beneficiaries_source_name} url={analysis.beneficiaries_source_url} />)
                </span>
              )}
            </p>
          )}
          {analysis.beneficiaries_description && (
            <p className="mt-2 text-sm leading-relaxed text-muted">{analysis.beneficiaries_description}</p>
          )}
        </>
      ) : (
        <EmptyState>Population concernée non chiffrée par une source identifiée.</EmptyState>
      )}
    </SectionShell>
  );
}

export function BudgetSection({ estimates }: { estimates: MeasureBudgetEstimate[] }) {
  return (
    <SectionShell title="Budget">
      {estimates.length === 0 ? (
        <EmptyState>Coût non chiffré par une source identifiée.</EmptyState>
      ) : (
        <ul className="space-y-4">
          {estimates.map((e) => {
            const cost = formatRange(e.annual_cost_min, e.annual_cost_central, e.annual_cost_max, e.currency + "/an");
            const revenue = formatRange(
              e.annual_revenue_min,
              e.annual_revenue_central,
              e.annual_revenue_max,
              e.currency + "/an"
            );
            const central = formatCentral(e.annual_cost_central, e.currency + "/an");
            return (
              <li key={e.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
                <p className="text-xs font-medium uppercase tracking-wide text-primary">
                  {BUDGET_SOURCE_TYPE_LABELS[e.source_type]}
                </p>
                {cost ? (
                  <p className="mt-1 font-serif text-xl font-semibold tabular-nums">Coût : {cost}</p>
                ) : (
                  <p className="mt-1 text-sm text-muted-2">Coût non chiffré par cette source.</p>
                )}
                {central && e.annual_cost_min !== e.annual_cost_max && (
                  <p className="text-xs text-muted">Scénario central : {central}</p>
                )}
                {revenue && <p className="mt-0.5 text-sm text-muted">Recettes éventuelles : {revenue}</p>}
                <p className="mt-1 text-xs text-muted">
                  Financement identifié : {IMPLEMENTATION_ANSWER_LABELS[e.financing_identified]}
                  {e.reference_year && ` · Référence ${e.reference_year}`}
                </p>
                {e.notes && <p className="mt-1.5 text-sm leading-relaxed text-foreground/85">{e.notes}</p>}
                <p className="mt-1.5 text-xs text-muted-2">
                  Source : <SourceLink name={e.source_name} url={e.source_url} />
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </SectionShell>
  );
}

const HORIZON_ORDER: ImpactHorizon[] = ["court", "moyen", "long"];

export function ImpactSection({ impacts }: { impacts: MeasureImpact[] }) {
  const byHorizon = HORIZON_ORDER.map((h) => ({ horizon: h, items: impacts.filter((i) => i.horizon === h) })).filter(
    (g) => g.items.length > 0
  );

  return (
    <SectionShell title="Impact">
      {byHorizon.length === 0 ? (
        <EmptyState>Impact non estimé par une source identifiée à ce jour.</EmptyState>
      ) : (
        <div className="space-y-5">
          {byHorizon.map(({ horizon, items }) => (
            <div key={horizon}>
              <p className="text-sm font-semibold text-foreground">{IMPACT_HORIZON_LABELS[horizon]}</p>
              <ul className="mt-2 space-y-3">
                {items.map((impact) => {
                  const range = formatRange(impact.value_min, impact.value_central, impact.value_max, impact.unit, {
                    signed: true,
                  });
                  return (
                    <li key={impact.id} className="rounded-xl bg-surface p-3.5">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <span className="text-sm font-medium">{IMPACT_CATEGORY_LABELS[impact.impact_type]}</span>
                        {impact.scenario !== "unique" && (
                          <span className="rounded-full bg-primary-soft px-2 py-0.5 text-xs font-medium text-primary">
                            {IMPACT_SCENARIO_LABELS[impact.scenario]}
                          </span>
                        )}
                      </div>
                      {impact.population && <p className="mt-0.5 text-xs text-muted">{impact.population}</p>}
                      {range ? (
                        <p className="mt-1.5 font-serif text-lg font-semibold tabular-nums">{range}</p>
                      ) : (
                        <p className="mt-1.5 text-sm text-muted-2">Non estimé.</p>
                      )}
                      {impact.value_central !== null && impact.value_min !== impact.value_max && (
                        <p className="text-xs text-muted">
                          Scénario central : {formatCentral(impact.value_central, impact.unit, { signed: true })}
                        </p>
                      )}
                      {impact.scenario_assumptions && (
                        <p className="mt-1 text-xs text-muted">{impact.scenario_assumptions}</p>
                      )}
                      <p className="mt-1.5 text-xs leading-relaxed text-muted-2">{impact.method}</p>
                      {impact.source_name && (
                        <p className="mt-1 text-xs text-muted-2">
                          Source : <SourceLink name={impact.source_name} url={impact.source_url} />
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </SectionShell>
  );
}

export function AssumptionsSection({ assumptions }: { assumptions: MeasureAssumption[] }) {
  return (
    <SectionShell title="Hypothèses utilisées">
      {assumptions.length === 0 ? (
        <EmptyState>Aucune hypothèse supplémentaire n&apos;a été nécessaire pour cette analyse.</EmptyState>
      ) : (
        <ul className="space-y-3">
          {assumptions.map((a) => (
            <li key={a.id} className="flex flex-wrap items-start justify-between gap-2 border-b border-border pb-3 last:border-0 last:pb-0">
              <div className="min-w-0">
                <p className="text-sm font-medium">{a.name}</p>
                {a.justification && <p className="mt-0.5 text-xs text-muted">{a.justification}</p>}
                {a.source_name && (
                  <p className="mt-0.5 text-xs text-muted-2">
                    Source : <SourceLink name={a.source_name} url={a.source_url} />
                  </p>
                )}
              </div>
              <div className="shrink-0 text-right">
                <p className="font-mono text-sm font-semibold tabular-nums">
                  {a.value}
                  {a.unit ? ` ${a.unit}` : ""}
                </p>
                <span
                  className={cn(
                    "mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium",
                    a.assumption_type === "manual_assumption"
                      ? "bg-accent-soft text-accent"
                      : "bg-surface-strong text-muted"
                  )}
                >
                  {ASSUMPTION_TYPE_LABELS[a.assumption_type]}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </SectionShell>
  );
}

/** Aggregates every distinct source cited across the whole analysis — the traçabilité "d'où vient ce chiffre" list. */
export function SourcesSection({ bundle }: { bundle: MeasureAnalysisBundle }) {
  const { analysis, budgetEstimates, impacts, assumptions } = bundle;
  const sources = new Map<string, { name: string; url: string | null }>();
  const add = (name: string | null, url: string | null) => {
    if (!name) return;
    sources.set(`${name}::${url ?? ""}`, { name, url });
  };

  add(analysis.beneficiaries_source_name, analysis.beneficiaries_source_url);
  for (const b of budgetEstimates) add(b.source_name, b.source_url);
  for (const i of impacts) add(i.source_name, i.source_url);
  for (const a of assumptions) add(a.source_name, a.source_url);

  const list = [...sources.values()];

  return (
    <SectionShell title="Sources">
      {list.length === 0 ? (
        <EmptyState>Voir la source originale de la proposition ci-dessus.</EmptyState>
      ) : (
        <ul className="space-y-1.5 text-sm">
          {list.map((s) => (
            <li key={`${s.name}-${s.url}`}>
              <SourceLink name={s.name} url={s.url} />
            </li>
          ))}
        </ul>
      )}
    </SectionShell>
  );
}
