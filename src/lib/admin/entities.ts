export type EntityKey =
  | "themes"
  | "parties"
  | "candidats"
  | "propositions"
  | "questions"
  | "positions"
  | "analyses"
  | "budgets"
  | "impacts"
  | "hypotheses";

export type FieldType = "text" | "textarea" | "number" | "url" | "date" | "select" | "boolean" | "json";

export interface EntityField {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  /** For "select" fields: name of the entity to resolve options from. */
  relation?: EntityKey;
  /** For "select" fields with a fixed, small option set. */
  options?: { value: string; label: string }[];
  help?: string;
}

export interface EntityConfig {
  key: EntityKey;
  table: string;
  label: string;
  labelPlural: string;
  titleField: string;
  fields: EntityField[];
}

export const ENTITIES: Record<EntityKey, EntityConfig> = {
  themes: {
    key: "themes",
    table: "themes",
    label: "Thème",
    labelPlural: "Thèmes",
    titleField: "name",
    fields: [
      { name: "name", label: "Nom", type: "text", required: true },
      { name: "slug", label: "Slug (URL)", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "icon", label: "Icône (lucide, ex: leaf)", type: "text" },
      { name: "order_index", label: "Ordre d'affichage", type: "number" },
    ],
  },
  parties: {
    key: "parties",
    table: "parties",
    label: "Parti",
    labelPlural: "Partis",
    titleField: "name",
    fields: [
      { name: "name", label: "Nom", type: "text", required: true },
      { name: "short_name", label: "Sigle", type: "text" },
      {
        name: "orientation",
        label: "Orientation",
        type: "select",
        options: [
          { value: "gauche", label: "Gauche" },
          { value: "centre-gauche", label: "Centre gauche" },
          { value: "centre", label: "Centre" },
          { value: "centre-droit", label: "Centre droit" },
          { value: "droite", label: "Droite" },
          { value: "extreme-gauche", label: "Extrême gauche" },
          { value: "extreme-droite", label: "Extrême droite" },
          { value: "non-partisan", label: "Non partisan" },
        ],
      },
      { name: "color", label: "Couleur (hex)", type: "text" },
    ],
  },
  candidats: {
    key: "candidats",
    table: "candidates",
    label: "Candidat",
    labelPlural: "Candidats",
    titleField: "name",
    fields: [
      { name: "name", label: "Nom", type: "text", required: true },
      { name: "slug", label: "Slug (URL)", type: "text", required: true },
      { name: "party_id", label: "Parti", type: "select", relation: "parties" },
      { name: "biography", label: "Biographie", type: "textarea" },
      // Date en texte libre : certaines sources ne donnent que l'année.
      { name: "birth_date", label: "Naissance (AAAA-MM-JJ ou AAAA)", type: "text" },
      { name: "birth_place", label: "Lieu de naissance", type: "text" },
      { name: "current_role", label: "Fonction actuelle", type: "text" },
      { name: "current_role_detail", label: "Précision de la fonction", type: "text" },
      { name: "official_website", label: "Site officiel", type: "url" },
      { name: "photo_url", label: "Photo (URL)", type: "url" },
      { name: "order_index", label: "Ordre d'affichage", type: "number" },
    ],
  },
  propositions: {
    key: "propositions",
    table: "proposals",
    label: "Proposition",
    labelPlural: "Propositions",
    titleField: "title",
    fields: [
      { name: "candidate_id", label: "Candidat", type: "select", relation: "candidats", required: true },
      { name: "theme_id", label: "Thème", type: "select", relation: "themes", required: true },
      { name: "title", label: "Titre", type: "text", required: true },
      { name: "summary", label: "Résumé court", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "source_name", label: "Nom de la source", type: "text" },
      { name: "source_url", label: "URL de la source", type: "url", required: true },
      { name: "published_at", label: "Date de publication", type: "date" },
      { name: "verified_at", label: "Date de vérification", type: "date" },
      {
        name: "tags",
        label: "Tags (séparés par des virgules)",
        type: "text",
        help: "Ex. « SMIC, Prix » — alimente les filtres de la page thème.",
      },
      {
        name: "status",
        label: "Statut",
        type: "select",
        options: [
          { value: "annonce", label: "Annonce" },
          { value: "proposition_officielle", label: "Proposition officielle" },
          { value: "programme", label: "Programme" },
          { value: "precision_ulterieure", label: "Précision apportée ultérieurement" },
        ],
      },
    ],
  },
  questions: {
    key: "questions",
    table: "questions",
    label: "Question",
    labelPlural: "Questions du Match",
    titleField: "question",
    fields: [
      { name: "question", label: "Question", type: "text", required: true },
      { name: "theme_id", label: "Thème", type: "select", relation: "themes", required: true },
      { name: "description", label: "Précision (optionnelle, toujours visible)", type: "textarea" },
      {
        name: "context",
        label: "Contexte (« Pourquoi cette question ? », masqué par défaut)",
        type: "textarea",
        help: "2-4 lignes neutres qui expliquent l'enjeu — jamais un argument pour une réponse, jamais la position d'un candidat.",
      },
      {
        name: "answer_type",
        label: "Type de réponse",
        type: "select",
        options: [
          { value: "likert", label: "Échelle d'opinion (5 niveaux, -2 à 2)" },
          { value: "choice", label: "Arbitrage entre politiques (non ordonné)" },
          { value: "priority", label: "Priorité de l'utilisateur (jamais comparée à un candidat)" },
        ],
      },
      {
        name: "options",
        label: "Réponses possibles (JSON)",
        type: "json",
        required: true,
        help: 'Tableau de { "id", "label", "value"?, "description"?, "theme_id"? }. "value" (-2..2) uniquement pour les questions "likert" ; "theme_id" uniquement pour les questions "priority".',
      },
      { name: "weight", label: "Poids", type: "number", help: "Champ conservé pour compatibilité, non utilisé par le calcul (voir méthodologie)." },
      { name: "order_index", label: "Ordre d'affichage", type: "number" },
      {
        name: "is_active",
        label: "Active dans le questionnaire",
        type: "boolean",
        help: "Une question peut être prête (sourcée, typée) sans être encore posée en V1.",
      },
    ],
  },
  positions: {
    key: "positions",
    table: "candidate_positions",
    label: "Position",
    labelPlural: "Positions des candidats",
    titleField: "id",
    fields: [
      { name: "candidate_id", label: "Candidat", type: "select", relation: "candidats", required: true },
      { name: "question_id", label: "Question", type: "select", relation: "questions", required: true },
      {
        name: "answer_type",
        label: "Type de réponse",
        type: "select",
        options: [
          { value: "likert", label: "Échelle d'opinion" },
          { value: "choice", label: "Arbitrage entre politiques" },
        ],
        help: "Doit correspondre au type de la question choisie ci-dessus.",
      },
      {
        name: "numeric_score",
        label: "Position sur l'échelle (-2 à 2, vide = non renseignée)",
        type: "number",
        help: "Uniquement pour une question de type « échelle d'opinion ».",
      },
      {
        name: "option_id",
        label: "Identifiant de l'option choisie (vide = non renseignée)",
        type: "text",
        help: "Uniquement pour une question de type « arbitrage » — doit correspondre à un « id » du champ Réponses possibles de la question.",
      },
      { name: "explanation", label: "Explication courte", type: "textarea" },
      { name: "source_url", label: "URL de la source", type: "url" },
      { name: "source_name", label: "Nom de la source", type: "text", help: "Ex. « Le JDD », « Programme officiel »." },
      { name: "verified_at", label: "Date de dernière vérification", type: "date" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // "Passage au réel" — faisabilité et impact des mesures. Un brouillon
  // (in_progress / review_required) n'est jamais visible publiquement : voir
  // la RLS de 0009_passage_au_reel.sql. Changer `status` ici est la seule
  // action de publication/dépublication — pas de bouton séparé.
  // ─────────────────────────────────────────────────────────────────────
  analyses: {
    key: "analyses",
    table: "measure_analyses",
    label: "Analyse",
    labelPlural: "Faisabilité & impact — Analyses",
    titleField: "id",
    fields: [
      { name: "proposal_id", label: "Mesure (proposition)", type: "select", relation: "propositions", required: true },
      {
        name: "status",
        label: "Statut",
        type: "select",
        options: [
          { value: "in_progress", label: "Brouillon" },
          { value: "review_required", label: "À valider" },
          { value: "published", label: "Publiée" },
          { value: "outdated", label: "À actualiser" },
        ],
        help: "Seule « Publiée » est visible sur le site public.",
      },
      { name: "summary", label: "Résumé (2-4 phrases neutres)", type: "textarea" },
      {
        name: "feasibility_status",
        label: "Faisabilité",
        type: "select",
        options: [
          { value: "faisable_parametres_connus", label: "Faisable avec paramètres connus" },
          { value: "faisable_sous_conditions", label: "Faisable sous conditions" },
          { value: "mise_en_oeuvre_complexe", label: "Mise en œuvre complexe" },
          { value: "informations_insuffisantes", label: "Informations insuffisantes" },
          { value: "obstacle_juridique_majeur", label: "Obstacle juridique majeur identifié" },
        ],
      },
      {
        name: "precision_level",
        label: "Niveau de précision",
        type: "select",
        options: [
          { value: "precise", label: "Précise" },
          { value: "partiellement_precis", label: "Partiellement précise" },
          { value: "insuffisant", label: "Insuffisamment détaillée" },
        ],
      },
      {
        name: "confidence_level",
        label: "Confiance",
        type: "select",
        options: [
          { value: "elevee", label: "Élevée" },
          { value: "moyenne", label: "Moyenne" },
          { value: "faible", label: "Faible" },
        ],
        help: "Reflète la qualité des données disponibles — jamais une probabilité de succès politique.",
      },
      {
        name: "legal_path",
        label: "Acte juridique nécessaire",
        type: "select",
        options: [
          { value: "decret", label: "Décret" },
          { value: "loi_ordinaire", label: "Loi ordinaire" },
          { value: "loi_organique", label: "Loi organique" },
          { value: "loi_finances", label: "Loi de finances" },
          { value: "referendum", label: "Référendum" },
          { value: "revision_constitutionnelle", label: "Révision constitutionnelle" },
          { value: "negociation_europeenne", label: "Négociation / modification européenne" },
          { value: "autre", label: "Autre" },
        ],
      },
      { name: "legal_constitutional_change_required", label: "Révision constitutionnelle nécessaire", type: "boolean" },
      { name: "legal_eu_change_required", label: "Modification du droit européen nécessaire", type: "boolean" },
      { name: "legal_notes", label: "Notes juridiques", type: "textarea" },
      { name: "legal_implementation_delay_min_months", label: "Délai de mise en œuvre min (mois)", type: "number" },
      { name: "legal_implementation_delay_max_months", label: "Délai de mise en œuvre max (mois)", type: "number" },
      {
        name: "implementation_existing_administration",
        label: "Administration existante",
        type: "select",
        options: [
          { value: "oui", label: "Oui" },
          { value: "non", label: "Non" },
          { value: "incertain", label: "Incertain" },
          { value: "non_documente", label: "Non documenté" },
        ],
      },
      {
        name: "implementation_new_recruitment_needed",
        label: "Recrutements supplémentaires nécessaires",
        type: "select",
        options: [
          { value: "oui", label: "Oui" },
          { value: "non", label: "Non" },
          { value: "incertain", label: "Incertain" },
          { value: "non_documente", label: "Non documenté" },
        ],
      },
      { name: "implementation_notes", label: "Notes de mise en œuvre", type: "textarea" },
      {
        name: "beneficiaries_groups",
        label: "Groupes concernés (JSON)",
        type: "json",
        help: 'Tableau de chaînes, ex. ["Salariés au SMIC", "Retraités"].',
      },
      { name: "beneficiaries_description", label: "Description des bénéficiaires", type: "textarea" },
      { name: "beneficiaries_count_min", label: "Effectif concerné — min", type: "number" },
      { name: "beneficiaries_count_central", label: "Effectif concerné — central", type: "number" },
      { name: "beneficiaries_count_max", label: "Effectif concerné — max", type: "number" },
      { name: "beneficiaries_source_name", label: "Source de l'effectif", type: "text" },
      { name: "beneficiaries_source_url", label: "URL de la source de l'effectif", type: "url" },
      {
        name: "simulator_measure_id",
        label: "Id de la mesure dans le Simulateur (optionnel)",
        type: "text",
        help: "Doit correspondre à un SimulatorMeasure.id existant dans lib/simulator/measures.ts — jamais deviné.",
      },
      { name: "reviewed_at", label: "Dernière vérification", type: "date" },
      { name: "reviewed_by", label: "Vérifiée par", type: "text" },
      { name: "published_at", label: "Date de publication", type: "date" },
    ],
  },
  budgets: {
    key: "budgets",
    table: "measure_budget_estimates",
    label: "Chiffrage budgétaire",
    labelPlural: "Faisabilité & impact — Budgets",
    titleField: "source_name",
    fields: [
      { name: "measure_analysis_id", label: "Analyse", type: "select", relation: "analyses", required: true },
      {
        name: "source_type",
        label: "Type de source",
        type: "select",
        options: [
          { value: "candidate", label: "Chiffrage du candidat" },
          { value: "independent_body", label: "Organisme indépendant" },
          { value: "academic", label: "Étude académique" },
          { value: "other", label: "Autre source" },
        ],
        required: true,
      },
      { name: "source_name", label: "Nom de la source", type: "text", required: true },
      { name: "source_url", label: "URL de la source", type: "url" },
      { name: "annual_cost_min", label: "Coût annuel min (Md€)", type: "number" },
      { name: "annual_cost_central", label: "Coût annuel central (Md€)", type: "number" },
      { name: "annual_cost_max", label: "Coût annuel max (Md€)", type: "number" },
      { name: "annual_revenue_min", label: "Recettes annuelles min (Md€)", type: "number" },
      { name: "annual_revenue_central", label: "Recettes annuelles central (Md€)", type: "number" },
      { name: "annual_revenue_max", label: "Recettes annuelles max (Md€)", type: "number" },
      { name: "currency", label: "Unité", type: "text", help: "Par défaut « Md€ »." },
      { name: "reference_year", label: "Année de référence", type: "number" },
      {
        name: "financing_identified",
        label: "Financement identifié",
        type: "select",
        options: [
          { value: "oui", label: "Oui" },
          { value: "non", label: "Non" },
          { value: "incertain", label: "Incertain" },
          { value: "non_documente", label: "Non documenté" },
        ],
      },
      { name: "notes", label: "Notes", type: "textarea" },
    ],
  },
  impacts: {
    key: "impacts",
    table: "measure_impacts",
    label: "Impact",
    labelPlural: "Faisabilité & impact — Impacts",
    titleField: "impact_type",
    fields: [
      { name: "measure_analysis_id", label: "Analyse", type: "select", relation: "analyses", required: true },
      {
        name: "impact_type",
        label: "Catégorie d'impact",
        type: "select",
        options: [
          { value: "revenu_menages", label: "Revenu des ménages" },
          { value: "finances_publiques", label: "Finances publiques" },
          { value: "emploi", label: "Emploi" },
          { value: "pib", label: "PIB" },
          { value: "inflation", label: "Inflation" },
          { value: "investissement", label: "Investissement" },
          { value: "consommation", label: "Consommation" },
          { value: "dette_publique", label: "Dette publique" },
          { value: "balance_commerciale", label: "Balance commerciale" },
          { value: "emissions_co2", label: "Émissions de CO2" },
          { value: "energie", label: "Énergie" },
          { value: "logement", label: "Logement" },
          { value: "sante", label: "Santé" },
          { value: "inegalites", label: "Inégalités" },
          { value: "autre", label: "Autre" },
        ],
        required: true,
      },
      {
        name: "horizon",
        label: "Horizon",
        type: "select",
        options: [
          { value: "court", label: "Court terme (0-2 ans)" },
          { value: "moyen", label: "Moyen terme (3-5 ans)" },
          { value: "long", label: "Long terme (6-10 ans)" },
        ],
        required: true,
      },
      {
        name: "scenario",
        label: "Scénario",
        type: "select",
        options: [
          { value: "unique", label: "Estimation unique" },
          { value: "prudent", label: "Prudent" },
          { value: "central", label: "Central" },
          { value: "favorable", label: "Favorable" },
        ],
        help: 'Laisser "Estimation unique" tant qu\'une seule source fiable existe — ne jamais créer 3 scénarios pour remplir l\'interface.',
      },
      { name: "population", label: "Population concernée (texte libre)", type: "text" },
      { name: "value_min", label: "Valeur min", type: "number" },
      { name: "value_central", label: "Valeur centrale", type: "number" },
      { name: "value_max", label: "Valeur max", type: "number" },
      { name: "unit", label: "Unité", type: "text", required: true, help: "Ex. « €/mois », « Md€ », « % de PIB »." },
      {
        name: "confidence_level",
        label: "Confiance",
        type: "select",
        options: [
          { value: "elevee", label: "Élevée" },
          { value: "moyenne", label: "Moyenne" },
          { value: "faible", label: "Faible" },
        ],
        required: true,
      },
      { name: "method", label: "Méthode / modèle utilisé", type: "textarea", required: true },
      { name: "source_name", label: "Nom de la source", type: "text" },
      { name: "source_url", label: "URL de la source", type: "url" },
      { name: "scenario_assumptions", label: "Hypothèses propres à ce scénario", type: "textarea" },
      { name: "publication_date", label: "Date de publication", type: "date" },
    ],
  },
  hypotheses: {
    key: "hypotheses",
    table: "measure_assumptions",
    label: "Hypothèse",
    labelPlural: "Faisabilité & impact — Hypothèses",
    titleField: "name",
    fields: [
      { name: "measure_analysis_id", label: "Analyse", type: "select", relation: "analyses", required: true },
      { name: "name", label: "Nom de l'hypothèse", type: "text", required: true },
      { name: "value", label: "Valeur", type: "text", required: true },
      { name: "unit", label: "Unité", type: "text" },
      {
        name: "assumption_type",
        label: "Type",
        type: "select",
        options: [
          { value: "official", label: "Donnée officielle" },
          { value: "candidate", label: "Chiffrage du candidat" },
          { value: "model", label: "Résultat de modèle" },
          { value: "external_study", label: "Étude externe" },
          { value: "manual_assumption", label: "Hypothèse Poliscope" },
        ],
        required: true,
        help: '"Hypothèse Poliscope" doit être utilisé chaque fois que Poliscope pose l\'hypothèse elle-même, faute de source.',
      },
      { name: "justification", label: "Justification", type: "textarea" },
      { name: "source_name", label: "Nom de la source", type: "text" },
      { name: "source_url", label: "URL de la source", type: "url" },
    ],
  },
};

export const ENTITY_KEYS = Object.keys(ENTITIES) as EntityKey[];
