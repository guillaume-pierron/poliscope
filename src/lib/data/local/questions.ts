import type { Question, QuestionOption } from "@/lib/types";
import { themes } from "./themes";

/**
 * 18 questions spanning the 12 themes, in three shapes chosen to match the
 * actual structure of each question rather than forcing everything into a
 * single format — see the QuestionAnswerType doc in lib/types.ts:
 *
 *   - 12 "likert" — an opinion or intensity scale, -2..2. User answers and
 *     candidate_positions.numeric_score share this same scale so they're
 *     directly comparable.
 *   - 4 "choice" — an arbitrage between mutually exclusive policy
 *     directions that are NOT reducible to one continuum. Compared against
 *     candidate_positions.option_id; never scored by an invented distance.
 *   - 2 "priority" — which topics matter most to the visitor. Never
 *     compared to a candidate (no position exists for these); they instead
 *     weight the visitor's own theme scores (see
 *     computeThemeWeightsFromPriorityAnswers in lib/scoring.ts).
 *
 * All wording was reviewed against three rules (see /methodologie):
 * neutral (no emotional or accusatory framing, no baked-in presupposition),
 * single-barreled (one political dimension per question — q3/q4/q5 were
 * split or merged for this reason, see the note above the old q4/q8), and
 * "objective vs means" kept distinct where mixing them would hide which
 * dimension is actually measured.
 */

/** Shared by every plain agreement-wording likert question, most-favorable first. */
const AGREEMENT_OPTIONS: QuestionOption[] = [
  { id: "favorable-fort", label: "Tout à fait favorable", value: 2 },
  { id: "favorable", label: "Plutôt favorable", value: 1 },
  { id: "neutre", label: "Neutre", value: 0 },
  { id: "oppose", label: "Plutôt opposé", value: -1 },
  { id: "oppose-fort", label: "Totalement opposé", value: -2 },
];

/**
 * Shared shape for every intensity-wording likert question (reduce↔increase,
 * ease off↔tighten…). Fixed sign convention used everywhere in this file:
 * -2/-1 = less/reduce, 0 = maintain, +1/+2 = more/increase — so a reader
 * never has to check per-question which direction is positive.
 */
function intensityOptions(
  fortementMoins: string,
  moins: string,
  maintenir: string,
  plus: string,
  fortementPlus: string
): QuestionOption[] {
  return [
    { id: "fortement-moins", label: fortementMoins, value: -2 },
    { id: "moins", label: moins, value: -1 },
    { id: "maintenir", label: maintenir, value: 0 },
    { id: "plus", label: plus, value: 1 },
    { id: "fortement-plus", label: fortementPlus, value: 2 },
  ];
}

export const questions: Question[] = [
  {
    id: "q1",
    theme_id: "theme-retraites",
    question: "Faut-il repousser l'âge légal de départ à la retraite au-delà de 64 ans ?",
    description: "Pour équilibrer le financement du système par répartition.",
    context:
      "L'âge légal de départ à la retraite détermine l'âge minimum à partir duquel une personne peut demander sa retraite, sous réserve des autres conditions applicables (durée de cotisation notamment).",
    weight: 1.5,
    answer_type: "likert",
    order_index: 1,
    is_active: true,
    options: AGREEMENT_OPTIONS,
  },
  {
    id: "q2",
    theme_id: "theme-retraites",
    question:
      "Les personnes ayant eu une carrière longue ou un métier pénible devraient-elles pouvoir partir à la retraite avant l'âge légal ?",
    description: null,
    context:
      "Certains dispositifs permettent un départ anticipé pour les carrières commencées tôt ou pour les métiers reconnus comme pénibles, indépendamment de l'âge légal général.",
    weight: 1,
    answer_type: "likert",
    order_index: 2,
    is_active: true,
    options: AGREEMENT_OPTIONS,
  },
  {
    id: "q3",
    theme_id: "theme-economie",
    question: "Pour redresser les finances publiques, quelle approche vous semble la plus prioritaire ?",
    description: "Choisissez la position la plus proche de la vôtre.",
    context:
      "Le déficit public correspond à l'écart entre les dépenses et les recettes de l'État sur une année ; la dette publique est l'accumulation de ces déficits dans le temps.",
    weight: 1,
    answer_type: "choice",
    order_index: 3,
    is_active: true,
    options: [
      { id: "reduire-depenses", label: "Réduire les dépenses publiques" },
      { id: "augmenter-impots", label: "Augmenter les impôts, en particulier pour les plus favorisés" },
      { id: "relancer-croissance", label: "Relancer la croissance pour augmenter les recettes, sans changer les taux" },
      { id: "pas-prioritaire", label: "Ne pas en faire une priorité immédiate" },
    ],
  },
  {
    id: "q5",
    theme_id: "theme-pouvoir-achat",
    question: "Pour améliorer le pouvoir d'achat, quelle politique devrait être prioritaire selon vous ?",
    description: "Choisissez la position la plus proche de la vôtre.",
    context:
      "Le pouvoir d'achat dépend à la fois du niveau des salaires, du niveau des prix, des prélèvements obligatoires et des aides sociales — plusieurs leviers distincts permettent d'agir dessus.",
    weight: 1,
    answer_type: "choice",
    order_index: 4,
    is_active: true,
    options: [
      { id: "augmenter-salaires", label: "Augmenter les salaires" },
      { id: "reduire-taxes", label: "Réduire les taxes et prélèvements sur le travail" },
      { id: "encadrer-prix", label: "Bloquer ou encadrer certains prix" },
      { id: "renforcer-aides", label: "Renforcer les aides ciblées aux ménages modestes" },
    ],
  },
  {
    id: "q6",
    theme_id: "theme-immigration",
    question: "Quel niveau d'immigration légale la France devrait-elle viser ?",
    description: null,
    context:
      "L'immigration légale recouvre plusieurs canaux distincts (travail, famille, études, asile) encadrés par la loi, par opposition à l'entrée ou au séjour irréguliers.",
    weight: 1.5,
    answer_type: "likert",
    order_index: 5,
    is_active: true,
    options: intensityOptions("Fortement réduire", "Réduire", "Maintenir", "Augmenter", "Fortement augmenter"),
  },
  {
    id: "q7",
    theme_id: "theme-immigration",
    question: "Faut-il faciliter la régularisation des travailleurs sans papiers dans les métiers en tension ?",
    description: null,
    context:
      "Un métier « en tension » est un métier pour lequel les employeurs peinent à recruter, faute de candidats suffisants sur le marché du travail.",
    weight: 1,
    answer_type: "likert",
    order_index: 6,
    is_active: true,
    options: AGREEMENT_OPTIONS,
  },
  {
    id: "q9",
    theme_id: "theme-securite",
    question: "Quelle doit être la priorité en matière de justice pénale ?",
    description: "Choisissez la position la plus proche de la vôtre.",
    context:
      "La justice pénale peut privilégier la sanction (peines plus sévères, plus rapides) ou la prévention (traitement des causes de la délinquance, réinsertion) — la plupart des politiques combinent les deux à des degrés différents.",
    weight: 1,
    // Genuinely ordinal (one sanction↔prévention axis), so it's scored like
    // any other likert — see the file header note on why this isn't "choice".
    answer_type: "likert",
    order_index: 7,
    is_active: true,
    options: [
      { id: "sanction-fort", label: "Sanctionner plus sévèrement et plus vite", value: 2 },
      { id: "sanction", label: "Plutôt renforcer la sanction", value: 1 },
      { id: "equilibre", label: "Un équilibre entre sanction et prévention", value: 0 },
      { id: "prevention", label: "Plutôt renforcer la prévention", value: -1 },
      { id: "prevention-fort", label: "Développer les peines alternatives et la prévention", value: -2 },
    ],
  },
  {
    id: "q10",
    theme_id: "theme-sante",
    question: "Comment devrait évoluer le budget de l'hôpital public et les effectifs de soignants ?",
    description: null,
    context:
      "Le budget de l'hôpital public conditionne notamment le nombre de lits ouverts et les effectifs de soignants (médecins, infirmiers, aides-soignants) en poste.",
    weight: 1,
    answer_type: "likert",
    order_index: 8,
    is_active: true,
    options: intensityOptions(
      "Fortement diminuer",
      "Diminuer",
      "Maintenir au niveau actuel",
      "Augmenter",
      "Fortement augmenter"
    ),
  },
  {
    id: "q11",
    theme_id: "theme-sante",
    question:
      "Pour réduire les délais d'attente et améliorer l'accès aux soins, quelle approche vous semble la plus prioritaire ?",
    description: "Choisissez la position la plus proche de la vôtre.",
    context:
      "L'accès aux soins peut se heurter à des délais d'attente, à des « déserts médicaux » dans certains territoires, ou aux capacités d'accueil des établissements publics et privés.",
    weight: 1,
    answer_type: "choice",
    order_index: 9,
    is_active: true,
    options: [
      { id: "renforcer-public", label: "Renforcer et recruter davantage dans l'hôpital public" },
      { id: "developper-prive", label: "Développer davantage l'offre de soins privée" },
      { id: "repartition-territoriale", label: "Mieux répartir l'offre de soins sur le territoire" },
      { id: "prevention-telemedecine", label: "Développer la prévention et la télémédecine" },
    ],
  },
  {
    id: "q12",
    theme_id: "theme-education",
    question: "Faut-il donner plus d'autonomie pédagogique et budgétaire aux établissements scolaires ?",
    description: null,
    context:
      "L'autonomie des établissements scolaires porte sur leur capacité à adapter leurs méthodes pédagogiques et à gérer une partie de leur budget, par rapport à un cadre national uniforme.",
    weight: 1,
    answer_type: "likert",
    order_index: 10,
    is_active: true,
    options: AGREEMENT_OPTIONS,
  },
  {
    id: "q13",
    theme_id: "theme-education",
    question: "Comment devrait évoluer la rémunération des enseignants ?",
    description: null,
    context:
      "Le salaire des enseignants en France se compare à celui d'autres pays européens et à celui d'autres professions à niveau de qualification équivalent.",
    weight: 1,
    answer_type: "likert",
    order_index: 11,
    is_active: true,
    options: intensityOptions("Fortement diminuer", "Diminuer", "Rester stable", "Augmenter", "Fortement augmenter"),
  },
  {
    id: "q14",
    theme_id: "theme-ecologie",
    question: "Les normes environnementales imposées aux entreprises devraient-elles être renforcées, maintenues ou allégées ?",
    description: null,
    context:
      "Les normes environnementales imposées aux entreprises (émissions, usage de produits, obligations de reporting…) ont un coût de mise en conformité, mais visent à limiter leur impact écologique.",
    weight: 1.5,
    answer_type: "likert",
    order_index: 12,
    is_active: true,
    options: intensityOptions("Fortement allégées", "Allégées", "Maintenues au niveau actuel", "Renforcées", "Fortement renforcées"),
  },
  {
    id: "q15",
    theme_id: "theme-energie",
    question: "Concernant la production d'électricité, quelle priorité vous paraît la plus importante ?",
    description: "Choisissez la position la plus proche de la vôtre.",
    context:
      "Le mix énergétique français combine aujourd'hui principalement le nucléaire et les énergies renouvelables (hydraulique, éolien, solaire) pour produire de l'électricité.",
    weight: 1,
    answer_type: "choice",
    order_index: 13,
    is_active: true,
    options: [
      { id: "nucleaire", label: "Développer principalement le nucléaire" },
      { id: "renouvelables", label: "Développer principalement les renouvelables" },
      { id: "sobriete", label: "Réduire prioritairement la consommation" },
      { id: "mix", label: "Conserver un mix énergétique diversifié" },
    ],
  },
  {
    id: "q16",
    theme_id: "theme-europe",
    question:
      "Quel niveau d'intégration européenne (transfert de compétences nationales à l'Union européenne) vous semble souhaitable ?",
    description: null,
    context:
      "L'Union européenne exerce aujourd'hui des compétences dans des domaines variés (commerce, concurrence, une partie de l'agriculture…), à des degrés différents selon les sujets.",
    weight: 1,
    answer_type: "likert",
    order_index: 14,
    is_active: true,
    options: intensityOptions(
      "Fortement réduire l'intégration (rapatrier des compétences)",
      "Réduire l'intégration",
      "Statu quo",
      "Renforcer l'intégration",
      "Fortement renforcer l'intégration"
    ),
  },
  {
    id: "q17",
    theme_id: "theme-international",
    question:
      "La France devrait-elle renforcer son autonomie stratégique et militaire vis-à-vis de ses alliances actuelles (dont l'OTAN), ou continuer de s'appuyer sur elles ?",
    description: null,
    context:
      "L'OTAN est une alliance militaire entre pays nord-américains et européens ; l'autonomie stratégique désigne la capacité d'un pays à agir militairement sans dépendre de ses alliés.",
    weight: 1,
    answer_type: "likert",
    order_index: 15,
    is_active: true,
    options: intensityOptions(
      "Fortement vers plus d'intégration dans les alliances actuelles",
      "Plutôt vers plus d'intégration",
      "Statu quo",
      "Plutôt vers plus d'autonomie",
      "Fortement vers plus d'autonomie stratégique"
    ),
  },
  {
    id: "q18",
    theme_id: "theme-logement",
    question: "L'encadrement des loyers dans les zones tendues devrait-il être renforcé, maintenu, ou levé ?",
    description: null,
    context:
      "Une « zone tendue » est un secteur où la demande de logements dépasse fortement l'offre disponible ; l'encadrement des loyers y plafonne les loyers pratiqués à la relocation.",
    weight: 1,
    answer_type: "likert",
    order_index: 16,
    is_active: true,
    options: intensityOptions(
      "Totalement levé",
      "Plutôt allégé",
      "Maintenu au niveau actuel",
      "Plutôt renforcé",
      "Fortement renforcé, étendu à tout le territoire"
    ),
  },
  {
    id: "q19",
    // Not a real theme membership — a "priority" question spans all 12
    // themes (see its `options` below), it doesn't belong to one. theme_id
    // is only a required technical field here; the UI never shows a theme
    // badge for a "priority" question (see Questionnaire) so this never
    // surfaces as "this is an Économie question".
    theme_id: "theme-economie",
    question: "Parmi ces grands sujets, lequel est pour vous le plus prioritaire pour le prochain quinquennat ?",
    description: "Ce choix ne vous compare à aucun candidat.",
    context:
      "Vos réponses sur ce sujet compteront un peu plus dans le calcul de votre proximité avec chaque candidat — cela ne change jamais les positions des candidats eux-mêmes, ni la façon dont elles sont notées.",
    weight: 1,
    answer_type: "priority",
    order_index: 17,
    is_active: true,
    options: themes.map((t): QuestionOption => ({ id: t.slug, label: t.name, theme_id: t.id })),
  },
  {
    id: "q20",
    theme_id: "theme-economie",
    question: "Et en second choix, quel autre sujet compte aussi beaucoup pour vous ?",
    description: "Optionnel — ce choix ne vous compare à aucun candidat.",
    context:
      "Comme pour la question précédente, ce second choix ajuste seulement la pondération de vos propres résultats, avec un effet un peu plus léger que votre premier choix.",
    weight: 1,
    answer_type: "priority",
    order_index: 18,
    is_active: true,
    options: themes.map((t): QuestionOption => ({ id: t.slug, label: t.name, theme_id: t.id })),
  },
];

/**
 * "Neutre" (0) is a real answer and counts in the score like any other —
 * it is genuinely different from skipping via "Passer" (value: null), which
 * excludes the question entirely. Never conflate the two.
 */
export const LIKERT_OPTIONS = AGREEMENT_OPTIONS;
