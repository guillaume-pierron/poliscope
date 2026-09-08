import { MEASURES } from "@/lib/simulator/measures";
import type { MeasureOutcome, UserProfile } from "@/lib/simulator/types";
import type { MeasureAnalysisBundle } from "@/lib/types";

/**
 * Abstraction over "what can compute a personal impact number for this
 * measure". The point of this interface is that Polysia works completely
 * without OpenFisca (or any other external engine) today, and gains one
 * later by registering an adapter here — never by faking a result in the
 * meantime. See /methodologie.
 */
export interface ImpactEngineResult {
  available: true;
  monthlyEuro: number | null;
  direction: "gain" | "perte" | "incertain";
  detail: string;
  engineId: string;
}

export interface ImpactEngineUnavailable {
  available: false;
  /** Always shown to the user as-is — never swallowed into a generic error. */
  reason: string;
  engineId: string;
}

export type ImpactEngineOutcome = ImpactEngineResult | ImpactEngineUnavailable;

export interface ImpactEngine {
  id: string;
  label: string;
  canEvaluate(bundle: MeasureAnalysisBundle): boolean;
  evaluate(bundle: MeasureAnalysisBundle, profile: UserProfile): ImpactEngineOutcome;
}

function fromSimulatorOutcome(engineId: string, outcome: MeasureOutcome): ImpactEngineResult {
  return {
    available: true,
    monthlyEuro: outcome.monthlyEuro,
    direction: outcome.direction,
    detail: outcome.detail,
    engineId,
  };
}

/**
 * Bridges to the existing Simulateur d'impact catalog (lib/simulator) —
 * the one engine that actually runs a calculation today. Only usable when
 * the analysis was explicitly linked to a SimulatorMeasure by an admin
 * (`simulator_measure_id`); never guessed by matching titles or themes.
 */
export const DirectCalculationEngine: ImpactEngine = {
  id: "direct-calculation",
  label: "Calcul direct (Simulateur d'impact Polysia)",
  canEvaluate(bundle) {
    return (
      !!bundle.analysis.simulator_measure_id &&
      MEASURES.some((m) => m.id === bundle.analysis.simulator_measure_id)
    );
  },
  evaluate(bundle, profile) {
    const measure = MEASURES.find((m) => m.id === bundle.analysis.simulator_measure_id);
    if (!measure) {
      return { available: false, reason: "Mesure non reliée au Simulateur d'impact.", engineId: this.id };
    }
    const outcome = measure.evaluate(profile);
    if (!outcome) {
      return {
        available: false,
        reason: "Cette mesure ne concerne pas le profil renseigné.",
        engineId: this.id,
      };
    }
    return fromSimulatorOutcome(this.id, outcome);
  },
};

/**
 * Wraps the analysis's own curated `measure_impacts` rows — human-sourced
 * estimates, not a live calculation. Always available as a fallback
 * description even when no engine can compute a personal number.
 */
export const ManualEvidenceEngine: ImpactEngine = {
  id: "manual-evidence",
  label: "Estimation documentée (sources publiques)",
  canEvaluate(bundle) {
    return bundle.impacts.length > 0;
  },
  evaluate(bundle) {
    if (bundle.impacts.length === 0) {
      return { available: false, reason: "Aucune estimation documentée pour cette mesure.", engineId: this.id };
    }
    return {
      available: false,
      reason:
        "Une estimation existe mais concerne une population ou un agrégat national — voir la section Impact de la fiche, pas un calcul individuel.",
      engineId: this.id,
    };
  },
};

/**
 * NOT CONNECTED. OpenFisca (impôt sur le revenu, prestations, cotisations,
 * effets redistributifs...) is not wired to any real API today. This
 * adapter exists purely so the architecture has a slot ready for it —
 * `canEvaluate` always returns false, and `evaluate` never fabricates a
 * result. Wiring a real OpenFisca instance later means implementing this
 * class's body, not restructuring the app.
 */
export const OpenFiscaImpactEngine: ImpactEngine = {
  id: "openfisca",
  label: "OpenFisca (socio-fiscal)",
  canEvaluate() {
    return false;
  },
  evaluate() {
    return { available: false, reason: "OpenFisca n'est pas connecté à Polysia pour le moment.", engineId: this.id };
  },
};

/** Tried in order; the first engine that can evaluate the measure wins. */
export const IMPACT_ENGINES: ImpactEngine[] = [DirectCalculationEngine, OpenFiscaImpactEngine, ManualEvidenceEngine];

export function evaluateWithAvailableEngine(
  bundle: MeasureAnalysisBundle,
  profile: UserProfile
): ImpactEngineOutcome {
  const engine = IMPACT_ENGINES.find((e) => e.canEvaluate(bundle));
  if (!engine) {
    return {
      available: false,
      reason: "Aucun moteur disponible ne peut évaluer cette mesure pour un profil individuel.",
      engineId: "none",
    };
  }
  return engine.evaluate(bundle, profile);
}

/**
 * Domain-specific engines the architecture is prepared for but that don't
 * exist yet — never instantiated, never called. Purely documentation of
 * intent so a future integration has an obvious place to land (see
 * /methodologie and section 12 of the feature spec). Do not read `status`
 * as a promise of a timeline.
 */
export interface SpecializedEngineDescriptor {
  domain: string;
  label: string;
  intendedSource: string;
  status: "not_connected";
}

export const SPECIALIZED_ENGINES: SpecializedEngineDescriptor[] = [
  { domain: "socio-fiscal", label: "Impôt, prestations, cotisations", intendedSource: "OpenFisca", status: "not_connected" },
  { domain: "retraites", label: "Simulation de pension", intendedSource: "Données publiques (CNAV, DREES)", status: "not_connected" },
  { domain: "macroeconomie", label: "PIB, emploi, inflation, dette", intendedSource: "Modèles reconnus (OFCE, Insee, Trésor…)", status: "not_connected" },
  { domain: "energie", label: "Scénarios de production et de consommation", intendedSource: "RTE, ADEME", status: "not_connected" },
  { domain: "sante", label: "Dépenses et accès aux soins", intendedSource: "DREES, Assurance Maladie", status: "not_connected" },
  { domain: "logement", label: "Construction, loyers, marché du logement", intendedSource: "INSEE, SDES", status: "not_connected" },
];
