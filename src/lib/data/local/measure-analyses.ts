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

  // ─────────────────────────────────────────────────────────────────────
  // Pilote 4 — Jean-Luc Mélenchon : abrogation et retraite à 60 ans.
  // Deux chiffrages du même institut à deux périmètres différents : le
  // composant qui correspond exactement à la mesure, et l'ensemble du volet
  // retraites dont il fait partie — pour ne pas laisser croire que le total
  // porte sur cette seule proposition.
  // ─────────────────────────────────────────────────────────────────────
  {
    key: "melenchon-retraite-60",
    candidateSlug: "jean-luc-melenchon",
    proposalTitle: "Abroger la réforme Macron et retraite à 60 ans",
    analysis: {
      status: "published",
      summary:
        "Les paramètres sont clairement posés par la source : âge légal ramené à 60 ans, 40 annuités pour une carrière complète, pensions portées au niveau du SMIC revalorisé. Le chiffrage disponible émane d'un seul institut et couvre un périmètre plus large que cette proposition : ses composantes sont donc présentées séparément. Aucune source publique identifiée ne chiffre les effets de retour attendus par le candidat (baisse du chômage, hausse des cotisations).",
      feasibility_status: "faisable_parametres_connus",
      precision_level: "precise",
      confidence_level: "moyenne",
      legal_path: "loi_ordinaire",
      legal_constitutional_change_required: false,
      legal_eu_change_required: false,
      legal_notes:
        "L'âge légal et la durée de cotisation relèvent de la loi ordinaire — la réforme de 2023 a elle-même été portée par une loi de financement rectificative de la sécurité sociale. Aucune révision constitutionnelle ni négociation européenne n'est requise.",
      legal_implementation_delay_min_months: 6,
      legal_implementation_delay_max_months: 24,
      implementation_existing_administration: "oui",
      implementation_new_recruitment_needed: NON_DOC,
      implementation_notes:
        "Les caisses de retraite appliquent déjà des paramètres d'âge et de durée ; leur modification ne suppose pas de nouvelle structure. Le volume de dossiers à traiter augmenterait fortement l'année de la bascule, sans que la source ne documente les moyens correspondants.",
      beneficiaries_groups: ["Actifs proches de l'âge de départ", "Carrières longues"],
      beneficiaries_description:
        "Concerne l'ensemble des actifs du secteur privé et public, avec un effet immédiat pour les générations proches de 60 ans. Aucune source identifiée ne chiffre le nombre exact de personnes concernées année par année.",
      beneficiaries_count_min: null,
      beneficiaries_count_central: null,
      beneficiaries_count_max: null,
      beneficiaries_source_name: null,
      beneficiaries_source_url: null,
      simulator_measure_id: "melenchon-retraite-60",
      reviewed_at: "2026-09-08",
      reviewed_by: "Équipe éditoriale Poliscope",
      published_at: "2026-09-08",
    },
    budgetEstimates: [
      {
        source_type: "independent_body",
        source_name: "Institut Montaigne — composante « retour à l'âge de 60 ans »",
        source_url:
          "https://www.institutmontaigne.org/legislatives-2024/nouveau-front-populaire/abroger-la-reforme-des-retraites-restaurer-la-retraite-a-60-ans-en-prenant-en-compte-le-rsa-en-portant-le-minimum-contributif-au-smic/",
        annual_cost_min: null,
        annual_cost_central: 27,
        annual_cost_max: null,
        annual_revenue_min: null,
        annual_revenue_central: null,
        annual_revenue_max: null,
        currency: "Md€",
        reference_year: 2027,
        financing_identified: "non",
        notes:
          "Composante isolée par l'institut au sein d'un chiffrage plus large : le retour à 60 ans (annulation de la réforme de 2010) est évalué à 27 Md€, l'abrogation de la réforme de 2023 à 8,2 Md€ supplémentaires. C'est la ligne qui correspond le plus directement à cette proposition.",
      },
      {
        source_type: "independent_body",
        source_name: "Institut Montaigne — ensemble du volet retraites chiffré",
        source_url:
          "https://www.institutmontaigne.org/legislatives-2024/nouveau-front-populaire/abroger-la-reforme-des-retraites-restaurer-la-retraite-a-60-ans-en-prenant-en-compte-le-rsa-en-portant-le-minimum-contributif-au-smic/",
        annual_cost_min: 49,
        annual_cost_central: 58,
        annual_cost_max: 67,
        annual_revenue_min: null,
        annual_revenue_central: null,
        annual_revenue_max: null,
        currency: "Md€",
        reference_year: 2027,
        financing_identified: "non",
        notes:
          "Périmètre plus large que cette proposition : au retour à 60 ans et à l'abrogation de 2023 s'ajoutent la revalorisation du minimum contributif au SMIC (13,9 Md€), celle du minimum vieillesse (0,7 Md€) et la prise en compte des années de RSA (8,4 Md€). La fourchette reflète une marge de ±15 % appliquée par l'institut. Chiffrage limité au régime de retraite, sans les autres effets sur les finances sociales.",
      },
    ],
    impacts: [],
    assumptions: [
      {
        name: "Âge légal de départ visé",
        value: "60",
        unit: "ans",
        assumption_type: "candidate",
        justification: "Âge annoncé par le programme pour une carrière complète de 40 annuités.",
        source_name: "Programme « L'Avenir en commun » 2025 — chapitre 8",
        source_url: "https://melenchon2027.fr/programme2025/livre/chapitre8/s8/",
      },
      {
        name: "Durée de cotisation pour une carrière complète",
        value: "40",
        unit: "annuités",
        assumption_type: "candidate",
        justification: "Durée annoncée par le programme, contre 43 annuités dans le droit en vigueur.",
        source_name: "Programme « L'Avenir en commun » 2025 — chapitre 8",
        source_url: "https://melenchon2027.fr/programme2025/livre/chapitre8/s8/",
      },
      {
        name: "Délai de mise en œuvre législative",
        value: "6 à 24",
        unit: "mois",
        assumption_type: "manual_assumption",
        justification:
          "Estimation Poliscope : une réforme paramétrique des retraites suppose un vote puis une adaptation des systèmes de liquidation des caisses, sans que la source ne fixe de calendrier.",
        source_name: null,
        source_url: null,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // Pilote 5 — Marine Le Pen : retour à 62 ans, 60 ans pour carrières
  // longues. Chiffrage indépendant précis, avec une fourchette large — et
  // une proportion de population concernée documentée, à défaut d'un
  // effectif.
  // ─────────────────────────────────────────────────────────────────────
  {
    key: "lepen-retraite-62",
    candidateSlug: "marine-le-pen",
    proposalTitle: "Retour à la retraite à 62 ans, 60 ans pour carrières longues",
    analysis: {
      status: "published",
      summary:
        "La mesure combine un âge légal ramené à 62 ans et un départ anticipé à 60 ans pour les carrières commencées tôt. Un institut indépendant en propose un chiffrage détaillé, avec une fourchette large qui traduit l'incertitude sur le nombre de personnes éligibles au départ anticipé. Aucun plan de financement n'est identifié par la source.",
      feasibility_status: "faisable_parametres_connus",
      precision_level: "partiellement_precis",
      confidence_level: "moyenne",
      legal_path: "loi_ordinaire",
      legal_constitutional_change_required: false,
      legal_eu_change_required: false,
      legal_notes:
        "Comme toute modification de l'âge légal et de la durée de cotisation, la mesure relève de la loi ordinaire ou d'une loi de financement de la sécurité sociale. La source ne précise pas le véhicule législatif retenu.",
      legal_implementation_delay_min_months: 6,
      legal_implementation_delay_max_months: 24,
      implementation_existing_administration: "oui",
      implementation_new_recruitment_needed: NON_DOC,
      implementation_notes:
        "Le dispositif « carrières longues » existe déjà dans le droit en vigueur : son élargissement s'appuierait sur des règles de liquidation connues des caisses, sans création de structure nouvelle documentée.",
      beneficiaries_groups: ["Actifs proches de 62 ans", "Personnes ayant commencé à travailler avant 20 ans"],
      beneficiaries_description:
        "Selon l'institut ayant chiffré la mesure, environ 57 % de la génération 1962 avait validé des trimestres avant 20 ans et relèverait donc du volet « carrières longues ». Cette proportion ne peut pas être convertie en un effectif annuel sans hypothèse supplémentaire, qui n'est pas documentée.",
      beneficiaries_count_min: null,
      beneficiaries_count_central: null,
      beneficiaries_count_max: null,
      beneficiaries_source_name: "Institut Montaigne",
      beneficiaries_source_url:
        "https://www.institutmontaigne.org/legislatives-2024/rassemblement-national/abroger-la-reforme-des-retraites-et-pour-ceux-ayant-commence-a-travailler-avant-20-ans-partir-a-40-annuites-de-cotisations/",
      simulator_measure_id: "lepen-retraite-62",
      reviewed_at: "2026-09-08",
      reviewed_by: "Équipe éditoriale Poliscope",
      published_at: "2026-09-08",
    },
    budgetEstimates: [
      {
        source_type: "independent_body",
        source_name: "Institut Montaigne",
        source_url:
          "https://www.institutmontaigne.org/legislatives-2024/rassemblement-national/abroger-la-reforme-des-retraites-et-pour-ceux-ayant-commence-a-travailler-avant-20-ans-partir-a-40-annuites-de-cotisations/",
        annual_cost_min: 31.5,
        annual_cost_central: 34.7,
        annual_cost_max: 44.7,
        annual_revenue_min: null,
        annual_revenue_central: null,
        annual_revenue_max: null,
        currency: "Md€",
        reference_year: 2027,
        financing_identified: "non",
        notes:
          "Chiffrage portant sur l'abrogation de la réforme de 2023 et le retour partiel sur les réformes de 2003 à 2014. L'ampleur de la fourchette tient à la part de la population éligible au départ anticipé : l'institut retient environ 57 % de la génération 1962 ayant validé des trimestres avant 20 ans.",
      },
    ],
    impacts: [],
    assumptions: [
      {
        name: "Âge légal de départ visé",
        value: "62",
        unit: "ans",
        assumption_type: "candidate",
        justification: "Âge réaffirmé par la candidate, avec un départ à 60 ans pour les carrières longues.",
        source_name: "Public Sénat",
        source_url:
          "https://www.publicsenat.fr/actualites/politique/au-rn-la-reforme-des-retraites-divise-jordan-bardella-et-marine-le-pen-sur-le-programme-pour-la-presidentielle-2027",
      },
      {
        name: "Part de la génération concernée par le départ anticipé",
        value: "57",
        unit: "%",
        assumption_type: "external_study",
        justification:
          "Proportion de la génération 1962 ayant validé des trimestres avant 20 ans, retenue par l'institut pour expliquer le coût de la mesure.",
        source_name: "Institut Montaigne",
        source_url:
          "https://www.institutmontaigne.org/legislatives-2024/rassemblement-national/abroger-la-reforme-des-retraites-et-pour-ceux-ayant-commence-a-travailler-avant-20-ans-partir-a-40-annuites-de-cotisations/",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // Pilote 6 — Édouard Philippe : +20 % pour les enseignants. Cas inverse
  // des deux précédents : les bénéficiaires sont précisément dénombrés par
  // une source officielle, mais aucun chiffrage indépendant du coût n'a été
  // trouvé — y compris pour vérifier l'affirmation du candidat selon
  // laquelle la baisse démographique suffirait à financer la mesure.
  // ─────────────────────────────────────────────────────────────────────
  {
    key: "philippe-enseignants",
    candidateSlug: "edouard-philippe",
    proposalTitle: "Hausse de 20 % de la rémunération des enseignants",
    analysis: {
      status: "published",
      summary:
        "La cible est claire — 20 % de hausse de la rémunération moyenne sur un quinquennat — et la population concernée est précisément dénombrée par la statistique publique. En revanche, aucun chiffrage indépendant du coût n'a pu être identifié, pas même pour éprouver l'affirmation du candidat selon laquelle la baisse du nombre d'élèves suffirait à financer la mesure sans dégrader les finances publiques. Le coût est donc affiché comme non chiffré plutôt qu'estimé.",
      feasibility_status: "faisable_sous_conditions",
      precision_level: "partiellement_precis",
      confidence_level: "faible",
      legal_path: "loi_finances",
      legal_constitutional_change_required: false,
      legal_eu_change_required: false,
      legal_notes:
        "La rémunération des enseignants titulaires relève du statut de la fonction publique : une revalorisation générale passe par décret indiciaire, mais son financement suppose une inscription en loi de finances. La source ne détaille ni la ventilation entre point d'indice, primes et heures supplémentaires, ni le calendrier annuel.",
      legal_implementation_delay_min_months: 12,
      legal_implementation_delay_max_months: 60,
      implementation_existing_administration: "oui",
      implementation_new_recruitment_needed: "non",
      implementation_notes:
        "La mesure porte sur la rémunération d'agents déjà en poste : elle ne suppose ni structure nouvelle, ni recrutement. Le candidat mentionne en revanche de « nouvelles conditions professionnelles » en contrepartie, sans que leur contenu soit précisé.",
      beneficiaries_groups: ["Enseignants du public", "Enseignants du privé sous contrat"],
      beneficiaries_description:
        "L'ensemble des enseignants de l'enseignement scolaire. La source ne précise pas si le privé sous contrat, dont les maîtres sont rémunérés par l'État, est inclus dans le périmètre.",
      beneficiaries_count_min: 712800,
      beneficiaries_count_central: 852800,
      beneficiaries_count_max: 852800,
      beneficiaries_source_name: "DEPP — L'éducation nationale en chiffres, édition 2025",
      beneficiaries_source_url:
        "https://www.education.gouv.fr/sites/default/files/2025-08/l-ducation-nationale-en-chiffres-dition-2025-441804.pdf",
      simulator_measure_id: "philippe-enseignants",
      reviewed_at: "2026-09-08",
      reviewed_by: "Équipe éditoriale Poliscope",
      published_at: "2026-09-08",
    },
    budgetEstimates: [],
    impacts: [],
    assumptions: [
      {
        name: "Hausse visée de la rémunération moyenne",
        value: "20",
        unit: "%",
        assumption_type: "candidate",
        justification:
          "Objectif annoncé sur un quinquennat, présenté comme devant porter les salaires au moins au niveau de la moyenne européenne, en particulier en milieu de carrière.",
        source_name: "franceinfo",
        source_url:
          "https://www.franceinfo.fr/elections/presidentielle/presidentielle-2027-le-candidat-horizons-edouard-philippe-veut-augmenter-de-20-la-remuneration-moyenne-des-enseignants-sur-un-quinquennat_8159927.html",
      },
      {
        name: "Enseignants de l'enseignement scolaire",
        value: "852 800",
        unit: "personnes",
        assumption_type: "official",
        justification:
          "Dont 712 800 dans le public et 140 000 dans le privé sous contrat, à la rentrée 2024. La borne basse retenue pour les bénéficiaires correspond au seul secteur public, périmètre non tranché par la source.",
        source_name: "DEPP — L'éducation nationale en chiffres, édition 2025",
        source_url:
          "https://www.education.gouv.fr/sites/default/files/2025-08/l-ducation-nationale-en-chiffres-dition-2025-441804.pdf",
      },
      {
        name: "Financement par la baisse démographique",
        value: "non vérifié",
        unit: null,
        assumption_type: "candidate",
        justification:
          "Le candidat affirme que la baisse du nombre d'élèves dégage les marges nécessaires. Aucune source indépendante identifiée ne confronte ce montant à celui de la revalorisation : l'affirmation est rapportée, pas validée.",
        source_name: "franceinfo",
        source_url:
          "https://www.franceinfo.fr/elections/presidentielle/presidentielle-2027-le-candidat-horizons-edouard-philippe-veut-augmenter-de-20-la-remuneration-moyenne-des-enseignants-sur-un-quinquennat_8159927.html",
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
