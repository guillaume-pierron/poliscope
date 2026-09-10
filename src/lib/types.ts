/**
 * Domain types shared across the app. These mirror the Postgres schema
 * defined in supabase/migrations/0001_init.sql so the local demo dataset
 * and a real Supabase-backed dataset are interchangeable.
 */

export type Orientation =
  | "gauche"
  | "centre-gauche"
  | "centre"
  | "centre-droit"
  | "droite"
  | "extreme-droite"
  | "extreme-gauche"
  | "non-partisan";

export type ProposalStatus =
  | "annonce"
  | "proposition_officielle"
  | "programme"
  | "precision_ulterieure";

/**
 * Three question shapes, chosen to match the actual structure of the
 * underlying political question rather than forcing everything into a
 * single format:
 *
 * - "likert": an opinion or intensity scale, -2..2. Two wordings share this
 *   type ("Tout à fait favorable...Totalement opposé" for agreement,
 *   "Fortement réduire...Fortement augmenter" for intensity) because both
 *   are genuinely ordinal — a single continuum where a numeric distance is
 *   methodologically meaningful. See calculateQuestionSimilarity.
 * - "choice": an arbitrage between mutually exclusive policy directions
 *   that are NOT reducible to one continuum (e.g. "nucléaire" vs
 *   "renouvelables" vs "réduire la consommation" — no natural ordering).
 *   Never scored by numeric distance; see calculateChoiceSimilarity.
 * - "priority": which topics matter most to the visitor. Never compared to
 *   a candidate (no candidate_position ever exists for these) — instead it
 *   sets a per-theme score weight for this visitor only. Excluded from
 *   comparableQuestions/coverage entirely.
 */
export type QuestionAnswerType = "likert" | "choice" | "priority";

export interface QuestionOption {
  /** Stable slug, e.g. "nucleaire" — never a raw index, so it survives reordering. */
  id: string;
  label: string;
  /** One-line clarification shown under the label, e.g. for a "choice" option. */
  description?: string | null;
  /**
   * likert only: the -2..2 point this option represents. Every likert
   * question carries exactly 5 options spanning the full scale.
   */
  value?: number;
  /**
   * priority only: the theme this option boosts when picked. Absent for
   * likert/choice options, which don't set a weight.
   */
  theme_id?: string;
}

export interface Election {
  id: string;
  slug: string;
  name: string;
  kind: "presidentielle" | "legislatives" | "municipales" | "europeennes" | "autre";
  round_date: string | null;
  second_round_date: string | null;
  is_active: boolean;
}

export interface Party {
  id: string;
  name: string;
  short_name: string | null;
  orientation: Orientation;
  color: string;
}

export interface Candidate {
  id: string;
  slug: string;
  name: string;
  photo_url: string | null;
  party_id: string | null;
  party?: Party;
  biography: string;
  official_website: string | null;
  election_id: string;
  is_demo: boolean;
  order_index: number;
  /**
   * État civil et fonction en cours. Ces champs ne sont pas une recherche
   * indépendante : ils extraient ce que la biographie sourcée ci-dessus
   * énonce déjà en prose, pour pouvoir l'afficher en repères lisibles.
   *
   * Optionnels à dessein : une base Supabase antérieure à la migration 0018
   * ne les renvoie pas, et l'affichage omet alors le repère plutôt que de
   * le combler.
   */
  /** ISO complet ("1951-08-19"), ou année seule ("1960") quand la source ne donne pas le jour. */
  birth_date?: string | null;
  birth_place?: string | null;
  /** Fonction actuellement exercée, telle que la biographie l'énonce. */
  current_role?: string | null;
  /** Précision de rattachement (territoire, date de prise de fonction). */
  current_role_detail?: string | null;
}

export interface Theme {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  order_index: number;
}

export interface Question {
  id: string;
  theme_id: string;
  theme?: Theme;
  question: string;
  /** Short subtitle always visible under the question — distinct from `context` below. */
  description: string | null;
  /**
   * A neutral, 2-4 line explainer shown only behind a "Pourquoi cette
   * question ?" toggle. Must explain the stakes, never argue for an answer,
   * never hint at a candidate's position — see /methodologie.
   */
  context: string | null;
  /** Kept for schema compatibility — no longer used by scoring, which weighs every theme equally by default unless a themeWeights map is given (see calculateCandidateScore). */
  weight: number;
  answer_type: QuestionAnswerType;
  order_index: number;
  /**
   * Whether this question is asked in the V1 questionnaire. A question can
   * be prepared (sourced, typed, ready) without being active yet — the
   * engine already supports a variable question count for a future
   * "Affiner mon Match" that unlocks more questions per theme.
   */
  is_active: boolean;
  /**
   * likert: exactly 5 entries spanning -2..2. choice/priority: 2-6 mutually
   * exclusive entries with no implied order.
   */
  options: QuestionOption[];
  /**
   * choice only, optional: an explicit, publicly documented intermediate
   * compatibility rule between two options (0..1), e.g. "nucléaire" vs
   * "mix" might be defined as 0.5-compatible by a stated methodology. Absent
   * means the default binary rule applies — same option 1, different 0 —
   * never a guessed/subjective closeness. See calculateChoiceSimilarity.
   */
  compatibility?: Record<string, Record<string, number>>;
}

export interface Source {
  id: string;
  name: string;
  url: string;
  is_demo: boolean;
}

export interface CandidatePosition {
  id: string;
  candidate_id: string;
  question_id: string;
  /** Must match the question's answer_type — a likert position never carries an option_id, a choice/priority position never carries a numeric_score. */
  answer_type: QuestionAnswerType;
  /** likert only: -2..2, or null when the candidate's position is not documented ("Position non renseignée"). */
  numeric_score: number | null;
  /** choice only: the id of the QuestionOption the candidate has taken, or null when not documented. */
  option_id: string | null;
  /** Reserved for a future multi-select format; unused in V1 — see /methodologie and the data-model note in AGENTS work log. */
  option_ids?: string[] | null;
  explanation: string | null;
  source_url: string | null;
  /** Outlet or publication the source_url belongs to — derived from the URL, never guessed content. */
  source_name: string | null;
  /** ISO date this specific position was last checked against its source, or null when not tracked. */
  verified_at: string | null;
}

export interface Proposal {
  id: string;
  candidate_id: string;
  theme_id: string;
  theme?: Theme;
  title: string;
  summary: string;
  description: string;
  source_name: string;
  source_url: string;
  published_at: string | null;
  verified_at: string | null;
  status: ProposalStatus;
  /** Comma-separated topic tags (e.g. "SMIC, Prix") — parse with parseTags(). */
  tags: string | null;
}

export interface Poll {
  id: string;
  election_id: string;
  institute: string;
  sponsor: string | null;
  field_start: string;
  field_end: string;
  sample_size: number;
  method: string;
  /** Nom affiché du lien source (institut ou média qui publie les chiffres). */
  source_name: string;
  /** URL de la source primaire — jamais un agrégateur. Toujours renseignée. */
  source_url: string;
  published_at: string;
  is_demo: boolean;
}

/**
 * Un sondage teste souvent plusieurs hypothèses de premier tour (rosters de
 * candidats différents) ou plusieurs duels de second tour. Chaque hypothèse
 * est un scénario distinct avec ses propres résultats : on ne mélange jamais
 * les chiffres de deux scénarios, y compris au sein d'un même sondage.
 */
export interface PollScenario {
  id: string;
  poll_id: string;
  /** Ex. « Hypothèse Attal + Philippe », « Second tour : Le Pen face à Philippe ». */
  label: string;
  round: "premier_tour" | "second_tour";
  order_index: number;
}

export interface PollResult {
  id: string;
  scenario_id: string;
  candidate_id: string;
  value: number;
  low: number | null;
  high: number | null;
}

/**
 * A user's answer captured client-side only. Never persisted server-side.
 * `value: 0` is a genuine "Neutre" answer and counts in the score like any
 * other; `value: null` is "Sans opinion" / skipped and is excluded entirely
 * — the two must never be conflated.
 */
export interface UserAnswer {
  question_id: string;
  /**
   * likert: -2..2 (0 = Neutre, a real answer). choice/priority: the id of
   * the chosen QuestionOption. `null` means skipped ("Sans opinion" / no
   * pick) and excludes the question entirely — never conflate with 0 or
   * with a genuine option pick.
   */
  value: number | string | null;
}

export type CoverageLevel = "elevee" | "moyenne" | "faible";

export const COVERAGE_LEVEL_LABELS: Record<CoverageLevel, string> = {
  elevee: "Couverture élevée",
  moyenne: "Couverture moyenne",
  faible: "Couverture faible",
};

/** A candidate's score on one theme — themes are always weighted equally by default. */
export interface ThemeMatchScore {
  theme: Theme;
  /** 0-100, rounded — the mean similarity of that theme's comparable questions. */
  score: number;
  comparableQuestions: number;
}

/**
 * Optional per-theme weight multipliers. Omitted (or a theme absent from
 * the map) means weight 1 — every theme counts equally by default, with no
 * hidden editorial weighting. In practice this is populated from the
 * visitor's own answers to the "priority" questions (see
 * computeThemeWeightsFromPriorityAnswers) — never set editorially.
 */
export type ThemeWeightMap = Record<string, number>;

/**
 * How much documented candidate positions actually diverge on one
 * question — always computed from real positions on file, never
 * hardcoded per question. `null` when too few candidates have a
 * documented, comparable position to say anything meaningful (see
 * calculateQuestionDiscrimination), or when the question is a "priority"
 * type (no candidate ever has a position on those).
 */
export type QuestionDiscrimination = "departage" | "proches" | null;

export const QUESTION_DISCRIMINATION_LABELS: Record<Exclude<QuestionDiscrimination, null>, string> = {
  departage: "Cette question départage fortement les candidats.",
  proches: "Les candidats sont plutôt proches sur ce sujet.",
};

export interface CandidateMatchResult {
  candidate: Candidate;
  /** 0-100, or null if no theme was comparable at all for this candidate. */
  score: number | null;
  /** Count of the user's answered likert/choice questions — "priority" answers are never candidate-comparable, so they never enter this count. */
  answeredQuestions: number;
  comparableQuestions: number;
  /**
   * comparableQuestions / answeredQuestions — how much of the user's answers
   * this candidate's score actually rests on. Null only when the user
   * answered nothing at all.
   */
  coverage: number | null;
  coverageLevel: CoverageLevel | null;
  /** Per-theme breakdown, highest score first. */
  themeScores: ThemeMatchScore[];
  agreements: { question: Question; similarity: number; position: CandidatePosition }[];
  disagreements: { question: Question; similarity: number; position: CandidatePosition }[];
  /** Distinct themes behind the agreements above, strongest first. */
  agreementThemes: Theme[];
}

export const PROPOSAL_STATUS_LABELS: Record<ProposalStatus, string> = {
  annonce: "Annonce",
  proposition_officielle: "Proposition officielle",
  programme: "Programme",
  precision_ulterieure: "Précision apportée ultérieurement",
};

// =============================================================================
// "Passage au réel" — faisabilité et impact réel des mesures.
//
// Règle absolue de tout ce domaine : aucun chiffre inventé, aucune hypothèse
// cachée, aucun jugement politique présenté comme un fait. Un champ vide (ou
// une valeur "non_estime"/"non_documente") est toujours préférable à une
// estimation qu'on ne pourrait pas défendre auprès d'un lecteur qui demande
// "d'où vient ce chiffre ?". Voir /methodologie pour l'explication publique.
// =============================================================================

/** Le texte source d'une loi/mesure précise l'acte juridique nécessaire — jamais une estimation de la probabilité que ce texte soit voté. */
export type LegalPath =
  | "decret"
  | "loi_ordinaire"
  | "loi_organique"
  | "loi_finances"
  | "referendum"
  | "revision_constitutionnelle"
  | "negociation_europeenne"
  | "autre";

export const LEGAL_PATH_LABELS: Record<LegalPath, string> = {
  decret: "Décret",
  loi_ordinaire: "Loi ordinaire",
  loi_organique: "Loi organique",
  loi_finances: "Loi de finances",
  referendum: "Référendum",
  revision_constitutionnelle: "Révision constitutionnelle",
  negociation_europeenne: "Négociation / modification européenne",
  autre: "Autre",
};

/**
 * Quantité d'information disponible pour modéliser sérieusement la mesure —
 * jamais un jugement sur sa qualité politique. Une mesure peut être
 * "insuffisamment détaillée" et par ailleurs très populaire ou très solide
 * politiquement : ce n'est pas ce que ce champ mesure.
 */
export type PrecisionLevel = "precise" | "partiellement_precis" | "insuffisant";

export const PRECISION_LEVEL_LABELS: Record<PrecisionLevel, string> = {
  precise: "Précise",
  partiellement_precis: "Partiellement précise",
  insuffisant: "Insuffisamment détaillée",
};

/**
 * Catégorie de faisabilité — jamais un pourcentage unique. Un statut est
 * toujours accompagné d'un `feasibility_checklist` dérivé (voir
 * lib/passage-au-reel/feasibility.ts) qui explique le "pourquoi".
 */
export type FeasibilityStatus =
  | "faisable_parametres_connus"
  | "faisable_sous_conditions"
  | "mise_en_oeuvre_complexe"
  | "informations_insuffisantes"
  | "obstacle_juridique_majeur";

export const FEASIBILITY_STATUS_LABELS: Record<FeasibilityStatus, string> = {
  faisable_parametres_connus: "Faisable avec paramètres connus",
  faisable_sous_conditions: "Faisable sous conditions",
  mise_en_oeuvre_complexe: "Mise en œuvre complexe",
  informations_insuffisantes: "Informations insuffisantes",
  obstacle_juridique_majeur: "Obstacle juridique majeur identifié",
};

/**
 * Reflète la qualité et la quantité des données disponibles pour analyser la
 * mesure — jamais la probabilité que la mesure soit adoptée ou réussisse
 * politiquement. Mêmes trois niveaux que la couverture du Match, par
 * cohérence avec le reste du site (voir CoverageLevel).
 */
export type ConfidenceLevel = "elevee" | "moyenne" | "faible";

export const CONFIDENCE_LEVEL_LABELS: Record<ConfidenceLevel, string> = {
  elevee: "Confiance élevée",
  moyenne: "Confiance moyenne",
  faible: "Confiance faible",
};

/** Réponse tri-état pour un fait de mise en œuvre — jamais "oui/non" forcé quand la source ne permet pas de trancher. */
export type ImplementationAnswer = "oui" | "non" | "incertain" | "non_documente";

export const IMPLEMENTATION_ANSWER_LABELS: Record<ImplementationAnswer, string> = {
  oui: "Oui",
  non: "Non",
  incertain: "Incertain",
  non_documente: "Non documenté",
};

/**
 * Statut de publication d'une analyse. "not_analyzed" n'est jamais stocké en
 * base : c'est l'état par défaut d'une proposition pour laquelle aucune ligne
 * measure_analyses n'existe encore (voir getMeasureAnalysisBundle). Les
 * quatre autres sont les valeurs réellement stockées.
 */
export type AnalysisStatus = "not_analyzed" | "in_progress" | "review_required" | "published" | "outdated";

export const ANALYSIS_STATUS_LABELS: Record<AnalysisStatus, string> = {
  not_analyzed: "Non analysée",
  in_progress: "Brouillon",
  review_required: "À valider",
  published: "Publiée",
  outdated: "À actualiser",
};

export type ImpactHorizon = "court" | "moyen" | "long";

export const IMPACT_HORIZON_LABELS: Record<ImpactHorizon, string> = {
  court: "Court terme (0-2 ans)",
  moyen: "Moyen terme (3-5 ans)",
  long: "Long terme (6-10 ans)",
};

/** "unique" : une seule estimation fiable existe — ne jamais fabriquer 3 scénarios pour remplir l'interface quand il n'y en a qu'un. */
export type ImpactScenario = "unique" | "prudent" | "central" | "favorable";

export const IMPACT_SCENARIO_LABELS: Record<ImpactScenario, string> = {
  unique: "Estimation disponible",
  prudent: "Scénario prudent",
  central: "Scénario central",
  favorable: "Scénario favorable",
};

export type ImpactCategory =
  | "revenu_menages"
  | "finances_publiques"
  | "emploi"
  | "pib"
  | "inflation"
  | "investissement"
  | "consommation"
  | "dette_publique"
  | "balance_commerciale"
  | "emissions_co2"
  | "energie"
  | "logement"
  | "sante"
  | "inegalites"
  | "autre";

export const IMPACT_CATEGORY_LABELS: Record<ImpactCategory, string> = {
  revenu_menages: "Revenu des ménages",
  finances_publiques: "Finances publiques",
  emploi: "Emploi",
  pib: "PIB",
  inflation: "Inflation",
  investissement: "Investissement",
  consommation: "Consommation",
  dette_publique: "Dette publique",
  balance_commerciale: "Balance commerciale",
  emissions_co2: "Émissions de CO2",
  energie: "Énergie",
  logement: "Logement",
  sante: "Santé",
  inegalites: "Inégalités",
  autre: "Autre",
};

/** D'où vient une hypothèse — une hypothèse posée par Polysia faute de source doit toujours être étiquetée "manual_assumption" et affichée comme telle. */
export type AssumptionType = "official" | "candidate" | "model" | "external_study" | "manual_assumption";

export const ASSUMPTION_TYPE_LABELS: Record<AssumptionType, string> = {
  official: "Donnée officielle",
  candidate: "Chiffrage du candidat",
  model: "Résultat de modèle",
  external_study: "Étude externe",
  manual_assumption: "Hypothèse Polysia",
};

/** D'où vient un chiffrage budgétaire — jamais présenté comme "neutre" quand c'est le candidat lui-même qui l'annonce. */
export type BudgetSourceType = "candidate" | "independent_body" | "academic" | "other";

export const BUDGET_SOURCE_TYPE_LABELS: Record<BudgetSourceType, string> = {
  candidate: "Chiffrage du candidat",
  independent_body: "Organisme indépendant",
  academic: "Étude académique",
  other: "Autre source",
};

/**
 * L'analyse "Passage au réel" d'une mesure (`proposals.id`). Regroupe le
 * volet juridique et le volet mise en œuvre directement (peu de champs
 * chacun) — budget, impacts et hypothèses vivent dans leurs propres tables
 * car ce sont naturellement des listes, pas des champs uniques.
 */
export interface MeasureAnalysis {
  id: string;
  proposal_id: string;
  status: Exclude<AnalysisStatus, "not_analyzed">;
  /** 2-4 phrases neutres résumant ce qu'on sait, ce qu'on peut calculer, ce qui reste incertain. */
  summary: string | null;

  // --- Faisabilité globale ---
  feasibility_status: FeasibilityStatus | null;
  precision_level: PrecisionLevel | null;
  confidence_level: ConfidenceLevel | null;

  // --- Juridique ---
  legal_path: LegalPath | null;
  legal_constitutional_change_required: boolean;
  legal_eu_change_required: boolean;
  /** Dépendances institutionnelles ou obstacles identifiés, en clair. */
  legal_notes: string | null;
  legal_implementation_delay_min_months: number | null;
  legal_implementation_delay_max_months: number | null;

  // --- Mise en œuvre opérationnelle ---
  implementation_existing_administration: ImplementationAnswer;
  implementation_new_recruitment_needed: ImplementationAnswer;
  implementation_notes: string | null;

  // --- Bénéficiaires ("qui est concerné ?") ---
  /** Ex. ["Salariés au SMIC", "Retraités"] — descriptif, jamais un score. */
  beneficiaries_groups: string[];
  beneficiaries_description: string | null;
  beneficiaries_count_min: number | null;
  beneficiaries_count_central: number | null;
  beneficiaries_count_max: number | null;
  beneficiaries_source_name: string | null;
  beneficiaries_source_url: string | null;

  /** Id d'une SimulatorMeasure (lib/simulator/measures.ts) quand une mesure équivalente y est déjà modélisée — jamais deviné, toujours posé à la main par l'admin. */
  simulator_measure_id: string | null;

  reviewed_at: string | null;
  reviewed_by: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Un chiffrage budgétaire, une ligne par source. Plusieurs lignes pour une
 * même analyse sont attendues et normales (ex. chiffrage du candidat ET
 * d'un organisme indépendant qui ne sont pas d'accord) — l'UI les affiche
 * toutes plutôt que de les fondre en une fausse moyenne.
 */
export interface MeasureBudgetEstimate {
  id: string;
  measure_analysis_id: string;
  source_type: BudgetSourceType;
  source_name: string;
  source_url: string | null;
  annual_cost_min: number | null;
  annual_cost_central: number | null;
  annual_cost_max: number | null;
  annual_revenue_min: number | null;
  annual_revenue_central: number | null;
  annual_revenue_max: number | null;
  currency: string;
  reference_year: number | null;
  financing_identified: ImplementationAnswer;
  notes: string | null;
}

/**
 * Un impact chiffré (ou non) pour un horizon et un scénario donnés. `scenario`
 * vaut "unique" tant qu'une seule estimation fiable existe — ne jamais créer
 * prudent/central/favorable artificiellement pour remplir l'UI.
 */
export interface MeasureImpact {
  id: string;
  measure_analysis_id: string;
  impact_type: ImpactCategory;
  horizon: ImpactHorizon;
  scenario: ImpactScenario;
  /** Une phrase libre si l'ampleur dépend du profil (ex. "salariés au SMIC") plutôt qu'un chiffre national. */
  population: string | null;
  value_min: number | null;
  value_central: number | null;
  value_max: number | null;
  unit: string;
  confidence_level: ConfidenceLevel;
  /** Modèle/méthode utilisé, en clair (ex. "Calcul direct à partir du barème annoncé", "Étude X (2025)"). Jamais vide pour une ligne publiée. */
  method: string;
  source_name: string | null;
  source_url: string | null;
  /** Hypothèses qui changent d'un scénario à l'autre — obligatoire dès que scenario != "unique". */
  scenario_assumptions: string | null;
  publication_date: string | null;
}

/** Une hypothèse utilisée par un calcul de cette analyse (budget, impact, ou bénéficiaires). */
export interface MeasureAssumption {
  id: string;
  measure_analysis_id: string;
  name: string;
  value: string;
  unit: string | null;
  assumption_type: AssumptionType;
  justification: string | null;
  source_name: string | null;
  source_url: string | null;
}

/** Le paquet complet nécessaire pour afficher une fiche "Passage au réel" — jamais assemblé partiellement. */
export interface MeasureAnalysisBundle {
  analysis: MeasureAnalysis;
  budgetEstimates: MeasureBudgetEstimate[];
  impacts: MeasureImpact[];
  assumptions: MeasureAssumption[];
}

// =============================================================================
// "Parcours & actes" — le parcours réel des candidats : métiers exercés,
// mandats, votes parlementaires, évolution des positions, affaires
// judiciaires, controverses documentées et transparence.
//
// Même règle absolue que "Passage au réel" ci-dessus : aucune information
// inventée, aucun jugement ("ment", "corrompu", "a retourné sa veste")
// généré automatiquement. Polysia montre les faits sourcés et laisse
// l'utilisateur juger. Un statut `not_documented` n'est jamais stocké : une
// rubrique vide se lit "aucun·e [x] documenté·e dans Polysia", jamais
// "aucun·e [x]" — voir /methodologie.
// =============================================================================

/** Chaîne de publication commune à toutes les tables "Parcours & actes" — identique à AnalysisStatus. */
export type RecordStatus = "draft" | "review_required" | "published" | "outdated";

export const RECORD_STATUS_LABELS: Record<RecordStatus, string> = {
  draft: "Brouillon",
  review_required: "À valider",
  published: "Publié",
  outdated: "À actualiser",
};

/** D'où vient une information — priorité de fiabilité décroissante, voir /methodologie. */
export type RecordSourceType = "official" | "court" | "parliament" | "candidate" | "media" | "institution" | "other";

export const RECORD_SOURCE_TYPE_LABELS: Record<RecordSourceType, string> = {
  official: "Source officielle",
  court: "Décision de justice",
  parliament: "Assemblée / Sénat / Parlement européen",
  candidate: "Déclaration du candidat",
  media: "Média",
  institution: "Institution publique",
  other: "Autre source",
};

/**
 * Une expérience professionnelle (avant ou en parallèle de la politique).
 * `start_date`/`end_date` sont du texte libre (année seule acceptée, comme
 * `Candidate.birth_date`) : jamais un jour inventé faute de source précise.
 * `is_ongoing` distingue explicitement "poste toujours occupé" de "date de
 * fin inconnue" — les deux ne doivent jamais être confondus.
 */
export interface CandidateCareer {
  id: string;
  candidate_id: string;
  title: string;
  organization: string;
  sector: string | null;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  is_ongoing: boolean;
  source_name: string | null;
  source_url: string | null;
  source_type: RecordSourceType | null;
  status: RecordStatus;
  verified_at: string | null;
}

/** Un mandat ou une fonction politique. Mêmes conventions de date que CandidateCareer. */
export interface CandidateMandate {
  id: string;
  candidate_id: string;
  title: string;
  institution: string;
  territory: string | null;
  appointment_type: "elu" | "nomme";
  party_at_time: string | null;
  start_date: string | null;
  end_date: string | null;
  is_ongoing: boolean;
  source_name: string | null;
  source_url: string | null;
  source_type: RecordSourceType | null;
  status: RecordStatus;
  verified_at: string | null;
}

export const APPOINTMENT_TYPE_LABELS: Record<CandidateMandate["appointment_type"], string> = {
  elu: "Élu",
  nomme: "Nommé",
};

export type VoteInstitution = "assemblee_nationale" | "senat" | "parlement_europeen";

export const VOTE_INSTITUTION_LABELS: Record<VoteInstitution, string> = {
  assemblee_nationale: "Assemblée nationale",
  senat: "Sénat",
  parlement_europeen: "Parlement européen",
};

/**
 * "absent" et "did_not_vote" ne doivent jamais être affichés comme une
 * abstention politique — voir CANDIDATE_VOTE_LABELS et le composant de vote.
 */
export type CandidateVoteValue = "for" | "against" | "abstention" | "did_not_vote" | "absent" | "not_available";

export const CANDIDATE_VOTE_LABELS: Record<CandidateVoteValue, string> = {
  for: "Pour",
  against: "Contre",
  abstention: "Abstention",
  did_not_vote: "N'a pas pris part au vote",
  absent: "Absent",
  not_available: "Non disponible",
};

export type VoteImportance = "secondary" | "important" | "major";

export const VOTE_IMPORTANCE_LABELS: Record<VoteImportance, string> = {
  secondary: "Secondaire",
  important: "Important",
  major: "Structurant",
};

/** Un vote individuel documenté sur un scrutin public. */
export interface CandidateVote {
  id: string;
  candidate_id: string;
  institution: VoteInstitution;
  legislature: string | null;
  official_vote_id: string | null;
  title: string;
  /** Description factuelle du texte soumis au vote — jamais une interprétation politique du vote lui-même. */
  description: string | null;
  theme_id: string | null;
  theme?: Theme;
  vote_date: string;
  candidate_vote: CandidateVoteValue;
  importance_level: VoteImportance;
  /** Sélection manuelle par l'admin, selon une méthodologie publique — jamais un choix automatique des votes les plus polémiques. */
  featured: boolean;
  source_name: string | null;
  source_url: string;
  source_type: RecordSourceType | null;
  status: RecordStatus;
  verified_at: string | null;
}

/** Une déclaration/position datée et sourcée sur un sujet — brique de base d'une timeline avant/après. */
export interface CandidatePositionHistoryEntry {
  id: string;
  candidate_id: string;
  theme_id: string | null;
  theme?: Theme;
  subject: string;
  position_summary: string;
  quote: string | null;
  date: string | null;
  source_name: string | null;
  source_url: string | null;
  source_type: RecordSourceType | null;
  status: RecordStatus;
  verified_at: string | null;
}

/**
 * Statut éditorial neutre d'un changement documenté — jamais
 * "retournement de veste". Voir POSITION_EVOLUTION_TYPE_LABELS.
 */
export type PositionEvolutionType =
  | "position_maintained"
  | "position_evolved"
  | "position_clarified"
  | "position_reversed"
  | "insufficient_context";

export const POSITION_EVOLUTION_TYPE_LABELS: Record<PositionEvolutionType, string> = {
  position_maintained: "Position maintenue",
  position_evolved: "Position évoluée",
  position_clarified: "Position précisée",
  position_reversed: "Changement de position",
  insufficient_context: "Contexte insuffisant",
};

/**
 * Nuance interne, distincte de `evolution_type` — jamais affichée seule comme
 * un verdict. Une "confirmed_contradiction" exige une validation humaine
 * avant publication (voir migration : status par défaut 'review_required').
 */
export type PositionConfidence =
  | "compatible"
  | "nuanced"
  | "evolved"
  | "apparently_contradictory"
  | "confirmed_contradiction"
  | "insufficient_context";

export const POSITION_CONFIDENCE_LABELS: Record<PositionConfidence, string> = {
  compatible: "Positions compatibles",
  nuanced: "Position nuancée",
  evolved: "Évolution documentée",
  apparently_contradictory: "Contradiction apparente",
  confirmed_contradiction: "Contradiction confirmée",
  insufficient_context: "Contexte insuffisant",
};

/** La lecture éditoriale d'un changement documenté sur un thème donné. */
export interface CandidatePositionEvolution {
  id: string;
  candidate_id: string;
  theme_id: string | null;
  theme?: Theme;
  subject: string;
  evolution_type: PositionEvolutionType;
  confidence: PositionConfidence;
  summary: string;
  /** Explication donnée par le candidat lui-même, si sourcée — jamais une raison inventée par Polysia. */
  candidate_explanation: string | null;
  candidate_explanation_source_url: string | null;
  status: RecordStatus;
  verified_at: string | null;
}

/**
 * Vocabulaire procédural français strict — ne jamais afficher "condamné"
 * hors convicted_first_instance/convicted_final, ne jamais présenter une
 * mise en examen (indicted) comme une culpabilité établie.
 */
export type LegalCaseStatus =
  | "investigation"
  | "questioned"
  | "indicted"
  | "charged"
  | "trial_pending"
  | "convicted_first_instance"
  | "appeal_pending"
  | "convicted_on_appeal"
  | "convicted_final"
  | "acquitted"
  | "dismissed"
  | "closed_without_action";

export const LEGAL_CASE_STATUS_LABELS: Record<LegalCaseStatus, string> = {
  investigation: "Enquête préliminaire",
  questioned: "Auditionné(e)",
  indicted: "Mis(e) en examen",
  charged: "Poursuites engagées",
  trial_pending: "Procès à venir",
  convicted_first_instance: "Condamné(e) en première instance",
  appeal_pending: "Appel en cours",
  // La cour d'appel a statué et confirmé une condamnation, mais un pourvoi en
  // cassation reste possible/en cours : distinct de "appeal_pending" (pas
  // encore jugé) et de "convicted_final" (plus aucun recours possible).
  convicted_on_appeal: "Condamné(e) en appel (pourvoi en cassation possible)",
  convicted_final: "Condamné(e) définitivement",
  acquitted: "Relaxé(e) / Acquitté(e)",
  dismissed: "Non-lieu",
  closed_without_action: "Classé(e) sans suite",
};

/** Une affaire judiciaire documentée. */
export interface CandidateLegalCase {
  id: string;
  candidate_id: string;
  title: string;
  case_type: string;
  summary: string;
  legal_status: LegalCaseStatus;
  jurisdiction: string | null;
  start_date: string | null;
  decision_date: string | null;
  last_updated: string;
  next_review_at: string | null;
  source_name: string | null;
  source_url: string | null;
  source_type: RecordSourceType | null;
  status: RecordStatus;
}

export type ControversyStatus = "documented" | "disputed" | "resolved" | "context_needed";

export const CONTROVERSY_STATUS_LABELS: Record<ControversyStatus, string> = {
  documented: "Documentée",
  disputed: "Contestée",
  resolved: "Résolue",
  context_needed: "Contexte nécessaire",
};

/** Une polémique publique documentée — distincte d'une affaire judiciaire par construction (table séparée). */
export interface CandidateControversy {
  id: string;
  candidate_id: string;
  title: string;
  summary: string;
  event_date: string | null;
  context: string | null;
  candidate_response: string | null;
  candidate_response_source_url: string | null;
  controversy_status: ControversyStatus;
  last_updated: string;
  next_review_at: string | null;
  source_name: string | null;
  source_url: string | null;
  source_type: RecordSourceType | null;
  status: RecordStatus;
}

export type TransparencyRecordType =
  | "declaration_interets"
  | "declaration_patrimoine"
  | "fonctions_declarees"
  | "activites_professionnelles"
  | "mandats_declares"
  | "participations"
  | "autre";

export const TRANSPARENCY_RECORD_TYPE_LABELS: Record<TransparencyRecordType, string> = {
  declaration_interets: "Déclaration d'intérêts",
  declaration_patrimoine: "Déclaration de patrimoine",
  fonctions_declarees: "Fonctions déclarées",
  activites_professionnelles: "Activités professionnelles",
  mandats_declares: "Mandats déclarés",
  participations: "Participations",
  autre: "Autre document",
};

/** Un document de transparence référencé (HATVP et assimilés). L'absence de ligne se lit "non documenté", jamais "n'existe pas". */
export interface CandidateTransparencyRecord {
  id: string;
  candidate_id: string;
  record_type: TransparencyRecordType;
  title: string;
  publication_date: string | null;
  source_name: string | null;
  source_url: string | null;
  source_type: RecordSourceType | null;
  status: RecordStatus;
  verified_at: string | null;
}

/** Le paquet "Parcours & actes" complet d'un candidat, pour la fiche et le bloc de synthèse. */
export interface CandidateRecordBundle {
  careers: CandidateCareer[];
  mandates: CandidateMandate[];
  votes: CandidateVote[];
  positionHistory: CandidatePositionHistoryEntry[];
  positionEvolutions: CandidatePositionEvolution[];
  legalCases: CandidateLegalCase[];
  controversies: CandidateControversy[];
  transparencyRecords: CandidateTransparencyRecord[];
}

export const ORIENTATION_LABELS: Record<Orientation, string> = {
  gauche: "Gauche",
  "centre-gauche": "Centre gauche",
  centre: "Centre",
  "centre-droit": "Centre droit",
  droite: "Droite",
  "extreme-droite": "Extrême droite",
  "extreme-gauche": "Extrême gauche",
  "non-partisan": "Non partisan",
};
