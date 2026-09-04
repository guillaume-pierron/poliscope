export type EmploymentStatus =
  | "prive"
  | "public"
  | "independant"
  | "retraite"
  | "etudiant"
  | "sans_emploi";

export type HouseholdType = "seul" | "couple";
export type HousingStatus = "locataire" | "proprietaire" | "heberge";

export interface UserProfile {
  /** Salaire (ou pension) net mensuel, en euros. */
  netMonthlyIncome: number;
  employmentStatus: EmploymentStatus;
  /** Enseignant : certaines mesures visent spécifiquement ce corps. */
  isTeacher: boolean;
  household: HouseholdType;
  childrenCount: number;
  housing: HousingStatus;
  monthlyRent: number;
  /** Logement classé F ou G au DPE (« passoire énergétique »). */
  isPoorlyInsulated: boolean;
  hasCar: boolean;
  kmPerYear: number;
  /** Dépense mensuelle électricité + gaz, en euros. */
  monthlyEnergySpend: number;
}

export const DEFAULT_PROFILE: UserProfile = {
  netMonthlyIncome: 2000,
  employmentStatus: "prive",
  isTeacher: false,
  household: "seul",
  childrenCount: 0,
  housing: "locataire",
  monthlyRent: 750,
  isPoorlyInsulated: false,
  hasCar: true,
  kmPerYear: 12000,
  monthlyEnergySpend: 100,
};

/**
 * Hypothèses de conversion, affichées à l'utilisateur partout où elles
 * entrent dans un calcul. Elles ne viennent d'aucun candidat : ce sont des
 * ordres de grandeur techniques nécessaires pour passer d'une mesure à un
 * montant, et l'utilisateur doit pouvoir les repérer.
 */
export const ASSUMPTIONS = {
  fuelLitresPer100km: 6.5,
  fuelPricePerLitre: 1.75,
  /** Passage brut → net, salarié non-cadre du privé (~22 % de cotisations). */
  netFromGross: 0.78,
  /** Économie de TVA en passant de 20 % à 5,5 % sur un prix TTC. */
  vatSavingRate: 1 - 1.055 / 1.2,
} as const;

export type Direction = "gain" | "perte" | "incertain";

export interface MeasureOutcome {
  /** Montant mensuel estimé, ou null si la mesure vous concerne sans être chiffrable. */
  monthlyEuro: number | null;
  direction: Direction;
  /** Détail du calcul ou raison de l'absence de chiffrage, en clair. */
  detail: string;
}

export interface SimulatorMeasure {
  id: string;
  candidateSlug: string;
  /** Intitulé de la proposition sourcée (voir src/lib/data/local/proposals.ts). */
  title: string;
  themeSlug: string;
  sourceName: string;
  sourceUrl: string;
  /** Renvoie null quand la mesure ne concerne pas ce profil. */
  evaluate: (profile: UserProfile) => MeasureOutcome | null;
}

export interface CandidateImpact {
  candidateSlug: string;
  quantified: { measure: SimulatorMeasure; outcome: MeasureOutcome }[];
  unquantified: { measure: SimulatorMeasure; outcome: MeasureOutcome }[];
  /** Somme des seules mesures chiffrables — jamais « l'impact du programme ». */
  quantifiedMonthlyTotal: number;
}
