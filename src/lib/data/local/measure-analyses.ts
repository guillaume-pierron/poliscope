import type {
  ImplementationAnswer,
  MeasureAnalysis,
  MeasureAnalysisBundle,
  MeasureAssumption,
  MeasureBudgetEstimate,
  MeasureImpact,
} from "@/lib/types";
import { candidates } from "./candidates";
import { proposals } from "./proposals";

/**
 * "Passage au réel" — analyses pilotes. Volontairement peu nombreuses (voir
 * /methodologie et le README de l'équipe) : mieux vaut un petit nombre
 * d'analyses solides, sourcées et honnêtes sur ce qui reste incertain,
 * qu'un grand nombre d'analyses approximatives. Chaque champ vide ou
 * "non documenté" est un choix délibéré — jamais un oubli à combler par une
 * estimation inventée.
 *
 * Chaque analyse est rattachée à une proposition déjà sourcée dans
 * proposals.ts (jamais un nouveau fait inventé pour l'occasion) ; on la
 * retrouve ici par candidat + intitulé exact plutôt que par un id positionnel
 * fragile.
 */
function findProposal(candidateSlug: string, title: string) {
  const candidate = candidates.find((c) => c.slug === candidateSlug);
  if (!candidate) throw new Error(`measure-analyses.ts: candidat inconnu "${candidateSlug}"`);
  const proposal = proposals.find((p) => p.candidate_id === candidate.id && p.title === title);
  if (!proposal) {
    throw new Error(`measure-analyses.ts: proposition introuvable pour "${candidateSlug}" / "${title}"`);
  }
  return proposal;
}

const NON_DOC: ImplementationAnswer = "non_documente";

type PilotDefinition = {
  key: string;
  candidateSlug: string;
  proposalTitle: string;
  analysis: Omit<MeasureAnalysis, "id" | "proposal_id" | "created_at" | "updated_at">;
  budgetEstimates: Omit<MeasureBudgetEstimate, "id" | "measure_analysis_id">[];
  impacts: Omit<MeasureImpact, "id" | "measure_analysis_id">[];
  assumptions: Omit<MeasureAssumption, "id" | "measure_analysis_id">[];
};

const PILOTS: PilotDefinition[] = [
  // ─────────────────────────────────────────────────────────────────────
  // Pilote 1 — Marine Le Pen : baisse de la TVA à 5,5 % sur l'énergie.
  // Mécanisme précis, deux chiffrages indépendants qui divergent (exactement
  // le cas "afficher une plage" plutôt qu'un faux chiffre unique), déjà
  // modélisée dans le Simulateur d'impact (lepen-tva-energie).
  // ─────────────────────────────────────────────────────────────────────
  {
    key: "lepen-tva-energie",
    candidateSlug: "marine-le-pen",
    proposalTitle: "Baisse de la TVA à 5,5 % sur l'énergie",
    analysis: {
      status: "published",
      summary:
        "Le mécanisme (taux de TVA, produits concernés) est précisément défini par la source. Deux chiffrages indépendants existent et divergent selon les hypothèses retenues sur la réaction de la consommation à la baisse de prix — ils sont présentés côte à côte plutôt que fondus en une moyenne. Aucun effet macroéconomique (emploi, PIB, inflation) n'a été estimé par une source publique identifiée à ce jour.",
      feasibility_status: "faisable_sous_conditions",
      precision_level: "precise",
      confidence_level: "moyenne",
      legal_path: "loi_finances",
      legal_constitutional_change_required: false,
      legal_eu_change_required: false,
      legal_notes:
        "Un changement de taux de TVA relève du domaine de la loi de finances (article 34 de la Constitution) et peut être voté en loi de finances initiale ou rectificative. La source ne précise aucune mesure de compensation de la perte de recettes.",
      legal_implementation_delay_min_months: 1,
      legal_implementation_delay_max_months: 12,
      implementation_existing_administration: "oui",
      implementation_new_recruitment_needed: "non",
      implementation_notes:
        "La DGFiP applique déjà des taux de TVA différenciés selon les produits ; un changement de taux ne nécessite pas de nouvelle structure administrative ni de recrutement identifié par la source.",
      beneficiaries_groups: ["Ménages consommant gaz, fioul ou électricité", "Automobilistes"],
      beneficiaries_description:
        "Concerne la quasi-totalité des ménages français, à des degrés très variables selon leur consommation d'énergie et de carburant.",
      beneficiaries_count_min: null,
      beneficiaries_count_central: null,
      beneficiaries_count_max: null,
      beneficiaries_source_name: null,
      beneficiaries_source_url: null,
      simulator_measure_id: "lepen-tva-energie",
      reviewed_at: "2026-09-04",
      reviewed_by: "Équipe éditoriale Poliscope",
      published_at: "2026-09-05",
    },
    budgetEstimates: [
      {
        source_type: "independent_body",
        source_name: "Ministère de l'Économie et des Finances (chiffrage cité par Public Sénat)",
        source_url:
          "https://www.publicsenat.fr/actualites/politique/baisse-de-la-tva-sur-lenergie-proposee-par-le-rn-une-mesure-chiffree-a-17-milliards-selon-bercy",
        annual_cost_min: 16.8,
        annual_cost_central: 16.8,
        annual_cost_max: 16.8,
        annual_revenue_min: null,
        annual_revenue_central: null,
        annual_revenue_max: null,
        currency: "Md€",
        reference_year: 2026,
        financing_identified: "non",
        notes:
          "Détail du chiffrage : électricité 4,5 Md€ + gaz 2,3 Md€ + carburants 10 Md€ = 16,8 Md€. Couvre l'ensemble des postes visés par la mesure.",
      },
      {
        source_type: "other",
        source_name: "Institut Montaigne (think tank libéral)",
        source_url:
          "https://www.institutmontaigne.org/legislatives-2024/rassemblement-national/baisser-la-tva-de-20-a-55-pour-les-carburants-lelectricite-le-gaz-et-le-fioul-domestique/",
        annual_cost_min: 9,
        annual_cost_central: 11.5,
        annual_cost_max: 14,
        annual_revenue_min: null,
        annual_revenue_central: null,
        annual_revenue_max: null,
        currency: "Md€",
        reference_year: 2024,
        financing_identified: "non",
        notes:
          "Estimation republiée à l'occasion des législatives 2024 (une estimation antérieure du même institut, en 2022, chiffrait la mesure à 10 Md€/an). L'écart avec le chiffrage de Bercy tient notamment aux hypothèses retenues sur la réaction de la consommation à la baisse de prix.",
      },
    ],
    impacts: [
      {
        impact_type: "revenu_menages",
        horizon: "court",
        scenario: "unique",
        population: "Ménage selon son profil de consommation d'énergie et de carburant",
        value_min: 7,
        value_central: 26,
        value_max: 41,
        unit: "€/mois",
        confidence_level: "moyenne",
        method:
          "Calcul direct : application du nouveau taux de TVA à la dépense d'énergie et de carburant déclarée (voir Simulateur d'impact de Poliscope). Fourchette illustrative entre un profil faiblement et fortement consommateur ; ne prend pas en compte un éventuel effet sur les prix hors taxe.",
        source_name: null,
        source_url: null,
        scenario_assumptions: null,
        publication_date: "2026-09-04",
      },
    ],
    assumptions: [
      {
        name: "Taux de TVA cible",
        value: "5,5",
        unit: "%",
        assumption_type: "candidate",
        justification: "Taux annoncé par la source pour l'électricité, le gaz, le fioul et les carburants.",
        source_name: "CNEWS (amendement RN au budget 2026)",
        source_url:
          "https://www.cnews.fr/france/2025-10-21/abaissement-de-la-tva-55-quels-produits-sont-concernes-par-lamendement-depose-par",
      },
      {
        name: "Consommation de carburant (calcul individuel)",
        value: "6,5",
        unit: "L/100 km",
        assumption_type: "manual_assumption",
        justification:
          "Hypothèse technique déjà utilisée par le Simulateur d'impact de Poliscope pour convertir un kilométrage annuel en dépense de carburant.",
        source_name: null,
        source_url: null,
      },
      {
        name: "Délai de mise en œuvre législative",
        value: "1 à 12",
        unit: "mois",
        assumption_type: "manual_assumption",
        justification:
          "Estimation Poliscope fondée sur le calendrier budgétaire français : une mesure de ce type peut être intégrée à une loi de finances rectificative en cours d'année, ou attendre la loi de finances initiale suivante.",
        source_name: null,
        source_url: null,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // Pilote 2 — Jean-Luc Mélenchon : SMIC à 1 600 € net (volet salaire
  // uniquement — le volet "blocage des prix" de la même proposition n'est
  // pas assez détaillé par la source pour être analysé). Budget non chiffré
  // par une source identifiée : illustre l'état "coût non documenté".
  // ─────────────────────────────────────────────────────────────────────
  {
    key: "melenchon-smic-1600",
    candidateSlug: "jean-luc-melenchon",
    proposalTitle: "SMIC à 1 600 euros net et blocage des prix",
    analysis: {
      status: "published",
      summary:
        "Le volet « hausse du SMIC » est un mécanisme clair (revalorisation à un montant net cible), déjà modélisé par le Simulateur d'impact de Poliscope. Le volet « blocage des prix » n'est pas suffisamment défini par la source (produits concernés, durée, mécanisme de contrôle) pour être analysé séparément : cette fiche ne porte donc que sur la revalorisation du SMIC. Aucune source indépendante ne chiffre le coût budgétaire de cette mesure.",
      feasibility_status: "faisable_parametres_connus",
      precision_level: "partiellement_precis",
      confidence_level: "moyenne",
      legal_path: "decret",
      legal_constitutional_change_required: false,
      legal_eu_change_required: false,
      legal_notes:
        "Le montant du SMIC est fixé par décret pris en Conseil des ministres (article L3231-2 du code du travail), après avis de la Commission nationale de la négociation collective. Ce volet ne nécessite pas de loi.",
      legal_implementation_delay_min_months: 1,
      legal_implementation_delay_max_months: 3,
      implementation_existing_administration: "oui",
      implementation_new_recruitment_needed: "non",
      implementation_notes:
        "Le mécanisme de revalorisation du SMIC est un dispositif existant et récurrent (des revalorisations anticipées ont déjà été pratiquées par le passé).",
      beneficiaries_groups: ["Salariés rémunérés au SMIC"],
      beneficiaries_description:
        "Salariés dont la rémunération nette est actuellement inférieure au seuil proposé de 1 600 €. Le chiffre ci-dessous porte sur les seuls salariés déjà au SMIC ; ceux situés entre le SMIC actuel et 1 600 € net ne sont pas comptabilisés, faute de source les isolant.",
      beneficiaries_count_min: null,
      beneficiaries_count_central: 2_200_000,
      beneficiaries_count_max: null,
      beneficiaries_source_name: "DARES",
      beneficiaries_source_url: "https://dares.travail-emploi.gouv.fr/publication/combien-de-salaries-sont-remuneres-au-smic",
      simulator_measure_id: "melenchon-smic-1600",
      reviewed_at: "2026-09-04",
      reviewed_by: "Équipe éditoriale Poliscope",
      published_at: "2026-09-05",
    },
    budgetEstimates: [],
    impacts: [
      {
        impact_type: "revenu_menages",
        horizon: "court",
        scenario: "unique",
        population: "Salarié actuellement rémunéré entre le SMIC et 1 600 € net",
        value_min: 50,
        value_central: null,
        value_max: 300,
        unit: "€/mois",
        confidence_level: "moyenne",
        method:
          "Calcul direct : 1 600 € − salaire net actuel déclaré, pour les salariés rémunérés en dessous de ce seuil (voir Simulateur d'impact de Poliscope). Pas de scénario central pertinent : le gain dépend entièrement du salaire de départ.",
        source_name: null,
        source_url: null,
        scenario_assumptions: null,
        publication_date: "2026-09-04",
      },
    ],
    assumptions: [
      {
        name: "Seuil de revalorisation du SMIC",
        value: "1 600",
        unit: "€ net/mois",
        assumption_type: "candidate",
        justification: "Montant annoncé par la source.",
        source_name: "Programme « L'Avenir en commun » 2025 — chapitre 9",
        source_url: "https://melenchon2027.fr/programme2025/livre/chapitre9/s1/",
      },
      {
        name: "Effectif des salariés au SMIC",
        value: "2,2",
        unit: "millions",
        assumption_type: "official",
        justification:
          "Salariés ayant directement bénéficié de la revalorisation du SMIC au 1er novembre 2024, selon la DARES — sert de borne basse : les salariés situés entre le SMIC actuel et 1 600 € net s'y ajouteraient sans être chiffrés par une source identifiée.",
        source_name: "DARES",
        source_url: "https://dares.travail-emploi.gouv.fr/publication/combien-de-salaries-sont-remuneres-au-smic",
      },
      {
        name: "Délai de mise en œuvre par décret",
        value: "1 à 3",
        unit: "mois",
        assumption_type: "manual_assumption",
        justification:
          "Estimation Poliscope : un décret de revalorisation du SMIC peut être pris rapidement une fois la décision actée, sur le modèle des revalorisations anticipées déjà pratiquées.",
        source_name: null,
        source_url: null,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // Pilote 3 — Marine Le Pen : référendum « Citoyenneté-Identité-
  // Immigration ». Illustre l'obstacle juridique majeur documenté et le
  // contenu insuffisamment détaillé — donc, honnêtement, presque aucun
  // champ chiffrable : budget et impact restent vides plutôt qu'inventés.
  // ─────────────────────────────────────────────────────────────────────
  {
    key: "lepen-referendum-c2i",
    candidateSlug: "marine-le-pen",
    proposalTitle: "Référendum « Citoyenneté-Identité-Immigration »",
    analysis: {
      status: "published",
      summary:
        "Le mécanisme proposé (un référendum sur un texte encadrant l'immigration) soulève une question juridique documentée et non tranchée par le Conseil constitutionnel : l'article 11 de la Constitution, qui définit les sujets pouvant être soumis à référendum, ne mentionne pas explicitement la politique migratoire parmi les matières autorisées. Le contenu précis du texte qui serait soumis au vote (barème, critères, calendrier) n'est en outre pas détaillé par la source.",
      feasibility_status: "obstacle_juridique_majeur",
      precision_level: "insuffisant",
      confidence_level: "moyenne",
      legal_path: "referendum",
      legal_constitutional_change_required: true,
      legal_eu_change_required: false,
      legal_notes:
        "L'article 11 de la Constitution limite les sujets pouvant être soumis à référendum (organisation des pouvoirs publics, réformes relatives à la politique économique, sociale ou environnementale, ratification de traités) ; la politique migratoire n'y figure pas explicitement. Plusieurs constitutionnalistes cités par la source estiment qu'une révision constitutionnelle serait nécessaire au préalable. Ce point fait débat et n'a pas été tranché par une décision du Conseil constitutionnel à ce jour.",
      legal_implementation_delay_min_months: null,
      legal_implementation_delay_max_months: null,
      implementation_existing_administration: NON_DOC,
      implementation_new_recruitment_needed: NON_DOC,
      implementation_notes: null,
      beneficiaries_groups: [],
      beneficiaries_description: null,
      beneficiaries_count_min: null,
      beneficiaries_count_central: null,
      beneficiaries_count_max: null,
      beneficiaries_source_name: null,
      beneficiaries_source_url: null,
      simulator_measure_id: null,
      reviewed_at: "2026-09-04",
      reviewed_by: "Équipe éditoriale Poliscope",
      published_at: "2026-09-05",
    },
    budgetEstimates: [],
    impacts: [],
    assumptions: [
      {
        name: "Cadre constitutionnel applicable",
        value: "Article 11",
        unit: null,
        assumption_type: "official",
        justification: "Texte constitutionnel définissant les matières pouvant être soumises à référendum.",
        source_name: "Public Sénat",
        source_url:
          "https://www.publicsenat.fr/actualites/politique/immigration-le-referendum-voulu-par-marine-le-pen-est-il-constitutionnel-190598",
      },
    ],
  },
];

export const measureAnalysisBundles: MeasureAnalysisBundle[] = PILOTS.map((pilot, index) => {
  const proposal = findProposal(pilot.candidateSlug, pilot.proposalTitle);
  const analysisId = `measure-analysis-${index + 1}`;
  const now = "2026-09-05T00:00:00.000Z";

  const analysis: MeasureAnalysis = {
    id: analysisId,
    proposal_id: proposal.id,
    created_at: now,
    updated_at: now,
    ...pilot.analysis,
  };

  return {
    analysis,
    budgetEstimates: pilot.budgetEstimates.map((b, i) => ({
      id: `${analysisId}-budget-${i + 1}`,
      measure_analysis_id: analysisId,
      ...b,
    })),
    impacts: pilot.impacts.map((imp, i) => ({
      id: `${analysisId}-impact-${i + 1}`,
      measure_analysis_id: analysisId,
      ...imp,
    })),
    assumptions: pilot.assumptions.map((a, i) => ({
      id: `${analysisId}-assumption-${i + 1}`,
      measure_analysis_id: analysisId,
      ...a,
    })),
  } satisfies MeasureAnalysisBundle;
});

export function getMeasureAnalysisBundleForProposal(proposalId: string): MeasureAnalysisBundle | null {
  return measureAnalysisBundles.find((b) => b.analysis.proposal_id === proposalId) ?? null;
}

// Flat views over the same bundles — for the generic admin CRUD (one table
// per entity) and for the Supabase local-fallback shape, which mirror the
// four real tables rather than the nested bundle used by the public pages.
export const measureAnalyses: MeasureAnalysis[] = measureAnalysisBundles.map((b) => b.analysis);
export const measureBudgetEstimates: MeasureBudgetEstimate[] = measureAnalysisBundles.flatMap(
  (b) => b.budgetEstimates
);
export const measureImpacts: MeasureImpact[] = measureAnalysisBundles.flatMap((b) => b.impacts);
export const measureAssumptions: MeasureAssumption[] = measureAnalysisBundles.flatMap((b) => b.assumptions);
