import { describe, expect, it } from "vitest";
import { deriveFeasibilityChecklist, isReviewStale } from "./feasibility";
import type {
  MeasureAnalysis,
  MeasureAnalysisBundle,
  MeasureAssumption,
  MeasureBudgetEstimate,
  MeasureImpact,
} from "@/lib/types";

function baseAnalysis(overrides: Partial<MeasureAnalysis> = {}): MeasureAnalysis {
  return {
    id: "analysis-1",
    proposal_id: "proposal-1",
    status: "published",
    summary: null,
    feasibility_status: null,
    precision_level: null,
    confidence_level: null,
    legal_path: null,
    legal_constitutional_change_required: false,
    legal_eu_change_required: false,
    legal_notes: null,
    legal_implementation_delay_min_months: null,
    legal_implementation_delay_max_months: null,
    implementation_existing_administration: "non_documente",
    implementation_new_recruitment_needed: "non_documente",
    implementation_notes: null,
    beneficiaries_groups: [],
    beneficiaries_description: null,
    beneficiaries_count_min: null,
    beneficiaries_count_central: null,
    beneficiaries_count_max: null,
    beneficiaries_source_name: null,
    beneficiaries_source_url: null,
    simulator_measure_id: null,
    reviewed_at: null,
    reviewed_by: null,
    published_at: null,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

function bundle(
  analysis: MeasureAnalysis,
  extra: { budgetEstimates?: MeasureBudgetEstimate[]; impacts?: MeasureImpact[]; assumptions?: MeasureAssumption[] } = {}
): MeasureAnalysisBundle {
  return {
    analysis,
    budgetEstimates: extra.budgetEstimates ?? [],
    impacts: extra.impacts ?? [],
    assumptions: extra.assumptions ?? [],
  };
}

const budgetEstimate = (overrides: Partial<MeasureBudgetEstimate> = {}): MeasureBudgetEstimate => ({
  id: "b1",
  measure_analysis_id: "analysis-1",
  source_type: "independent_body",
  source_name: "Test",
  source_url: null,
  annual_cost_min: 1,
  annual_cost_central: 1,
  annual_cost_max: 1,
  annual_revenue_min: null,
  annual_revenue_central: null,
  annual_revenue_max: null,
  currency: "Md€",
  reference_year: 2026,
  financing_identified: "non_documente",
  notes: null,
  ...overrides,
});

describe("deriveFeasibilityChecklist", () => {
  it("mesure totalement documentée : tout est 'ok'", () => {
    const analysis = baseAnalysis({
      legal_path: "decret",
      implementation_existing_administration: "oui",
      precision_level: "precise",
    });
    const items = deriveFeasibilityChecklist(
      bundle(analysis, {
        budgetEstimates: [budgetEstimate({ financing_identified: "oui" })],
        impacts: [
          {
            id: "i1",
            measure_analysis_id: "analysis-1",
            impact_type: "pib",
            horizon: "moyen",
            scenario: "unique",
            population: null,
            value_min: 0.1,
            value_central: 0.3,
            value_max: 0.6,
            unit: "% PIB",
            confidence_level: "moyenne",
            method: "Étude X",
            source_name: "Étude X",
            source_url: null,
            scenario_assumptions: null,
            publication_date: null,
          },
        ],
      })
    );
    expect(items.every((i) => i.state === "ok")).toBe(true);
  });

  it("mesure sans coût : le financement ressort comme non chiffré, jamais silencieusement 'ok'", () => {
    const items = deriveFeasibilityChecklist(bundle(baseAnalysis(), { budgetEstimates: [] }));
    const financing = items.find((i) => i.label.includes("Financement"));
    expect(financing?.state).toBe("unknown");
  });

  it("mesure sans impact macro calculable : jamais affiché comme 'ok'", () => {
    const items = deriveFeasibilityChecklist(bundle(baseAnalysis(), { impacts: [] }));
    const macro = items.find((i) => i.label.toLowerCase().includes("macroéconomique") || i.label.includes("incertains"));
    expect(macro?.state).not.toBe("ok");
  });

  it("mesure juridiquement complexe : révision constitutionnelle signalée en avertissement", () => {
    const items = deriveFeasibilityChecklist(
      bundle(baseAnalysis({ legal_path: "referendum", legal_constitutional_change_required: true }))
    );
    const constitutional = items.find((i) => i.label.includes("constitutionnelle"));
    expect(constitutional?.state).toBe("warning");
  });

  it("mesure insuffisamment détaillée : jamais présentée comme 'ok'", () => {
    const items = deriveFeasibilityChecklist(bundle(baseAnalysis({ precision_level: "insuffisant" })));
    const precision = items.find((i) => i.label.toLowerCase().includes("détaillée"));
    expect(precision?.state).toBe("warning");
  });

  it("cadre juridique non identifié : état 'unknown', jamais deviné", () => {
    const items = deriveFeasibilityChecklist(bundle(baseAnalysis({ legal_path: null })));
    const legal = items.find((i) => i.label.includes("juridique"));
    expect(legal?.state).toBe("unknown");
  });
});

describe("isReviewStale", () => {
  it("une analyse marquée 'outdated' est toujours considérée obsolète", () => {
    expect(isReviewStale(baseAnalysis({ status: "outdated", reviewed_at: "2026-01-01" }))).toBe(true);
  });

  it("une analyse jamais vérifiée n'est pas signalée obsolète par défaut (pas de fausse alerte)", () => {
    expect(isReviewStale(baseAnalysis({ reviewed_at: null }))).toBe(false);
  });

  it("une analyse vérifiée il y a plus d'un an est signalée obsolète", () => {
    const analysis = baseAnalysis({ reviewed_at: "2025-01-01" });
    expect(isReviewStale(analysis, new Date("2026-06-01"))).toBe(true);
  });

  it("une analyse vérifiée récemment n'est pas signalée obsolète", () => {
    const analysis = baseAnalysis({ reviewed_at: "2026-05-01" });
    expect(isReviewStale(analysis, new Date("2026-06-01"))).toBe(false);
  });
});
