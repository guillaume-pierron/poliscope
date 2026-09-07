import { describe, expect, it } from "vitest";
import {
  DirectCalculationEngine,
  ManualEvidenceEngine,
  OpenFiscaImpactEngine,
  evaluateWithAvailableEngine,
} from "./impact-engine";
import { DEFAULT_PROFILE } from "@/lib/simulator/types";
import type { MeasureAnalysis, MeasureAnalysisBundle, MeasureImpact } from "@/lib/types";

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

function bundle(analysis: MeasureAnalysis, impacts: MeasureImpact[] = []): MeasureAnalysisBundle {
  return { analysis, budgetEstimates: [], impacts, assumptions: [] };
}

describe("DirectCalculationEngine", () => {
  it("reuses the real Simulateur d'impact calculation when linked to a known measure", () => {
    const b = bundle(baseAnalysis({ simulator_measure_id: "lepen-tva-energie" }));
    expect(DirectCalculationEngine.canEvaluate(b)).toBe(true);
    const outcome = DirectCalculationEngine.evaluate(b, DEFAULT_PROFILE);
    expect(outcome.available).toBe(true);
    if (outcome.available) {
      expect(typeof outcome.monthlyEuro).toBe("number");
    }
  });

  it("is unavailable when no simulator_measure_id is set — never guesses a match", () => {
    const b = bundle(baseAnalysis({ simulator_measure_id: null }));
    expect(DirectCalculationEngine.canEvaluate(b)).toBe(false);
  });

  it("is unavailable when simulator_measure_id doesn't match any real SimulatorMeasure", () => {
    const b = bundle(baseAnalysis({ simulator_measure_id: "does-not-exist" }));
    expect(DirectCalculationEngine.canEvaluate(b)).toBe(false);
    const outcome = DirectCalculationEngine.evaluate(b, DEFAULT_PROFILE);
    expect(outcome.available).toBe(false);
  });
});

describe("OpenFiscaImpactEngine", () => {
  it("is never available — not connected to any real API today", () => {
    const b = bundle(baseAnalysis({ simulator_measure_id: "lepen-tva-energie" }));
    expect(OpenFiscaImpactEngine.canEvaluate(b)).toBe(false);
    const outcome = OpenFiscaImpactEngine.evaluate(b, DEFAULT_PROFILE);
    expect(outcome.available).toBe(false);
    if (!outcome.available) {
      expect(outcome.reason).toMatch(/OpenFisca/);
    }
  });
});

describe("ManualEvidenceEngine", () => {
  it("recognizes documented impacts exist, but never returns a fabricated personal number", () => {
    const impact: MeasureImpact = {
      id: "i1",
      measure_analysis_id: "analysis-1",
      impact_type: "revenu_menages",
      horizon: "court",
      scenario: "unique",
      population: null,
      value_min: 7,
      value_central: 26,
      value_max: 41,
      unit: "€/mois",
      confidence_level: "moyenne",
      method: "Calcul direct",
      source_name: null,
      source_url: null,
      scenario_assumptions: null,
      publication_date: null,
    };
    const b = bundle(baseAnalysis(), [impact]);
    expect(ManualEvidenceEngine.canEvaluate(b)).toBe(true);
    // Documented impacts are national/aggregate estimates, never converted
    // into a fabricated personal number by this engine.
    expect(ManualEvidenceEngine.evaluate(b, DEFAULT_PROFILE).available).toBe(false);
  });

  it("mesure sans impact calculable : jamais disponible", () => {
    const b = bundle(baseAnalysis(), []);
    expect(ManualEvidenceEngine.canEvaluate(b)).toBe(false);
  });
});

describe("evaluateWithAvailableEngine", () => {
  it("picks the direct-calculation engine first when a simulator link exists", () => {
    const b = bundle(baseAnalysis({ simulator_measure_id: "lepen-tva-energie" }));
    const outcome = evaluateWithAvailableEngine(b, DEFAULT_PROFILE);
    expect(outcome.available).toBe(true);
    expect(outcome.engineId).toBe("direct-calculation");
  });

  it("returns an honest 'unavailable' outcome, never a NaN or invented value, when nothing can evaluate", () => {
    const b = bundle(baseAnalysis());
    const outcome = evaluateWithAvailableEngine(b, DEFAULT_PROFILE);
    expect(outcome.available).toBe(false);
    if (!outcome.available) {
      expect(outcome.reason.length).toBeGreaterThan(0);
    }
  });
});
