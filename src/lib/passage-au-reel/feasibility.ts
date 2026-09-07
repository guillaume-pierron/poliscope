import type { MeasureAnalysis, MeasureAnalysisBundle } from "@/lib/types";

/**
 * The feasibility_status itself is always a curated, human-set editorial
 * field (like Proposal.status) — never computed from a formula, because it
 * would otherwise smuggle in exactly the kind of unstated judgment call this
 * feature exists to avoid. What IS legitimate to compute is the checklist
 * that explains *why* a status was given, purely from what's actually
 * documented on the analysis. That's what this module does.
 */

export type ChecklistState = "ok" | "warning" | "unknown";

export interface ChecklistItem {
  label: string;
  state: ChecklistState;
}

/**
 * Never color-only: each item always carries this glyph alongside its own
 * text label, so the meaning survives being read aloud or printed in
 * grayscale (see /methodologie, accessibilité).
 */
export const CHECKLIST_GLYPH: Record<ChecklistState, string> = {
  ok: "✓",
  warning: "⚠",
  unknown: "?",
};

/**
 * Builds the "✓ cadre juridique identifié / ⚠ financement partiellement
 * documenté / …" list shown under a feasibility status. Every line is
 * derived from a field that's actually filled in on the analysis — an
 * absent field always reads as "unknown", never silently as "ok".
 */
export function deriveFeasibilityChecklist(bundle: MeasureAnalysisBundle): ChecklistItem[] {
  const { analysis, budgetEstimates, impacts } = bundle;
  const items: ChecklistItem[] = [];

  items.push(
    analysis.legal_path
      ? { label: `Cadre juridique identifié (${analysis.legal_path.replaceAll("_", " ")})`, state: "ok" }
      : { label: "Cadre juridique non identifié", state: "unknown" }
  );

  if (analysis.legal_constitutional_change_required) {
    items.push({ label: "Révision constitutionnelle nécessaire", state: "warning" });
  }
  if (analysis.legal_eu_change_required) {
    items.push({ label: "Modification du droit européen nécessaire", state: "warning" });
  }

  if (budgetEstimates.length === 0) {
    items.push({ label: "Financement non chiffré par une source identifiée", state: "unknown" });
  } else {
    const allFinanced = budgetEstimates.every((b) => b.financing_identified === "oui");
    const noneFinanced = budgetEstimates.every(
      (b) => b.financing_identified === "non" || b.financing_identified === "non_documente"
    );
    items.push(
      allFinanced
        ? { label: "Financement identifié", state: "ok" }
        : noneFinanced
          ? { label: "Financement non identifié par la source", state: "warning" }
          : { label: "Financement partiellement documenté", state: "warning" }
    );
  }

  items.push(
    analysis.implementation_existing_administration === "oui"
      ? { label: "Administration existante", state: "ok" }
      : analysis.implementation_existing_administration === "non"
        ? { label: "Nouvelle structure administrative nécessaire", state: "warning" }
        : { label: "Capacité administrative non documentée", state: "unknown" }
  );

  const hasMacroImpact = impacts.some((i) =>
    (["pib", "emploi", "inflation", "dette_publique", "balance_commerciale"] as const).includes(
      i.impact_type as "pib" | "emploi" | "inflation" | "dette_publique" | "balance_commerciale"
    )
  );
  items.push(
    hasMacroImpact
      ? { label: "Effets macroéconomiques estimés par au moins une source", state: "ok" }
      : { label: "Effets économiques d'ensemble incertains ou non estimés", state: "warning" }
  );

  items.push(
    analysis.precision_level === "precise"
      ? { label: "Mesure suffisamment précise pour être modélisée", state: "ok" }
      : analysis.precision_level === "partiellement_precis"
        ? { label: "Mesure partiellement précise", state: "warning" }
        : { label: "Mesure insuffisamment détaillée pour une modélisation fiable", state: "warning" }
  );

  return items;
}

/**
 * True when an analysis should be flagged "à actualiser" in listings — a
 * thin, honest heuristic (age of the last review), not a claim that
 * anything has actually changed. The admin can always set status ==
 * "outdated" directly for a documented reason (new source, changed
 * program…), which always takes precedence over this heuristic.
 */
export function isReviewStale(analysis: MeasureAnalysis, referenceDate: Date = new Date()): boolean {
  if (analysis.status === "outdated") return true;
  if (!analysis.reviewed_at) return false;
  const reviewed = new Date(analysis.reviewed_at);
  const monthsSinceReview =
    (referenceDate.getFullYear() - reviewed.getFullYear()) * 12 +
    (referenceDate.getMonth() - reviewed.getMonth());
  return monthsSinceReview >= 12;
}
