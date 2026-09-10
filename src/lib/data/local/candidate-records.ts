import type {
  CandidateCareer,
  CandidateControversy,
  CandidateLegalCase,
  CandidatePositionEvolution,
  CandidatePositionHistoryEntry,
  CandidateMandate,
  CandidateTransparencyRecord,
  CandidateVote,
  CandidateVoteValue,
  ControversyStatus,
  LegalCaseStatus,
  PositionConfidence,
  PositionEvolutionType,
  RecordSourceType,
  RecordStatus,
  VoteImportance,
  VoteInstitution,
} from "@/lib/types";
import { candidates } from "./candidates";
import { getThemeBySlug } from "./themes";

/**
 * "Parcours & actes" — jeu de données local. Contrairement aux autres jeux
 * de données locaux (candidats, propositions...), ces huit tables couvrent
 * des faits sensibles (votes, affaires judiciaires, controverses) qui
 * exigent une vérification source par source : mieux vaut une rubrique vide
 * qu'une donnée approximative inventée pour remplir la démo.
 *
 * Les entrées ci-dessous (affaires judiciaires, une controverse, des votes
 * parlementaires, les mandats politiques) ont été recherchées et recoupées
 * individuellement contre des sources identifiables (voir chaque
 * `sourceUrl`) en septembre 2026 — sources officielles (Assemblée nationale,
 * Sénat, Parlement européen) quand elles existaient, Wikipédia sinon (voir
 * `sourceType`). Parcours professionnel, historique des positions,
 * évolutions de positions et transparence restent vides : aucune recherche
 * fiable n'a encore été menée sur ces rubriques pour cette V1.
 */

// ---------------------------------------------------------------------------
// candidate_careers — vide pour l'instant, voir note ci-dessus.
// ---------------------------------------------------------------------------
export const candidateCareers: CandidateCareer[] = [];

// ---------------------------------------------------------------------------
// candidate_mandates
// ---------------------------------------------------------------------------
interface RawMandate {
  candidateSlug: string;
  title: string;
  institution: string;
  territory: string | null;
  appointmentType: "elu" | "nomme";
  partyAtTime: string | null;
  start: string | null;
  end: string | null;
  ongoing: boolean;
  sourceName: string;
  sourceUrl: string;
  sourceType: RecordSourceType;
}

const WIKIPEDIA = (slug: string, sourceUrl: string): Pick<RawMandate, "sourceName" | "sourceUrl" | "sourceType"> => ({
  sourceName: "Wikipédia",
  sourceUrl,
  sourceType: "other",
});

// prettier-ignore
const rawMandates: RawMandate[] = [
  // --- Jean-Luc Mélenchon ---
  { candidateSlug: "jean-luc-melenchon", title: "Conseiller général", institution: "Conseil général de l'Essonne", territory: "Canton de Massy-Ouest", appointmentType: "elu", partyAtTime: "Parti socialiste", start: "1985-03-23", end: "1992-04-02", ongoing: false, ...WIKIPEDIA("jean-luc-melenchon", "https://fr.wikipedia.org/wiki/Jean-Luc_M%C3%A9lenchon") },
  { candidateSlug: "jean-luc-melenchon", title: "Adjoint au maire de Massy", institution: "Mairie de Massy", territory: null, appointmentType: "elu", partyAtTime: "Parti socialiste", start: "1989-03-20", end: "1995-06-11", ongoing: false, ...WIKIPEDIA("jean-luc-melenchon", "https://fr.wikipedia.org/wiki/Jean-Luc_M%C3%A9lenchon") },
  { candidateSlug: "jean-luc-melenchon", title: "Sénateur", institution: "Sénat", territory: "Essonne", appointmentType: "elu", partyAtTime: "Parti socialiste", start: "1986-10-02", end: "2000-04-27", ongoing: false, sourceName: "Sénat", sourceUrl: "https://www.senat.fr/senateur/melenchon_jean_luc86039k.html", sourceType: "parliament" },
  { candidateSlug: "jean-luc-melenchon", title: "Conseiller général", institution: "Conseil général de l'Essonne", territory: "Canton de Massy-Ouest", appointmentType: "elu", partyAtTime: "Parti socialiste", start: "1998-03-23", end: "2004-04-02", ongoing: false, ...WIKIPEDIA("jean-luc-melenchon", "https://fr.wikipedia.org/wiki/Jean-Luc_M%C3%A9lenchon") },
  { candidateSlug: "jean-luc-melenchon", title: "Président délégué du conseil général de l'Essonne", institution: "Conseil général de l'Essonne", territory: null, appointmentType: "elu", partyAtTime: "Parti socialiste", start: "1998-03-23", end: "2004-04-02", ongoing: false, ...WIKIPEDIA("jean-luc-melenchon", "https://fr.wikipedia.org/wiki/Jean-Luc_M%C3%A9lenchon") },
  { candidateSlug: "jean-luc-melenchon", title: "Ministre délégué à l'Enseignement professionnel", institution: "Gouvernement (Jospin)", territory: null, appointmentType: "nomme", partyAtTime: "Parti socialiste", start: "2000-03-27", end: "2002-05-06", ongoing: false, ...WIKIPEDIA("jean-luc-melenchon", "https://fr.wikipedia.org/wiki/Jean-Luc_M%C3%A9lenchon") },
  { candidateSlug: "jean-luc-melenchon", title: "Sénateur", institution: "Sénat", territory: "Essonne", appointmentType: "elu", partyAtTime: "Parti socialiste", start: "2004-10-01", end: "2010-01-07", ongoing: false, sourceName: "Sénat", sourceUrl: "https://www.senat.fr/senateur/melenchon_jean_luc86039k.html", sourceType: "parliament" },
  { candidateSlug: "jean-luc-melenchon", title: "Coprésident du Parti de Gauche", institution: "Parti de Gauche", territory: null, appointmentType: "elu", partyAtTime: "Parti de Gauche", start: "2009-02-01", end: "2014-08-22", ongoing: false, ...WIKIPEDIA("jean-luc-melenchon", "https://fr.wikipedia.org/wiki/Jean-Luc_M%C3%A9lenchon") },
  { candidateSlug: "jean-luc-melenchon", title: "Député européen", institution: "Parlement européen", territory: null, appointmentType: "elu", partyAtTime: "Parti de Gauche", start: "2009-07-14", end: "2017-06-18", ongoing: false, ...WIKIPEDIA("jean-luc-melenchon", "https://fr.wikipedia.org/wiki/Jean-Luc_M%C3%A9lenchon") },
  { candidateSlug: "jean-luc-melenchon", title: "Président du groupe La France insoumise", institution: "Assemblée nationale", territory: null, appointmentType: "elu", partyAtTime: "La France insoumise", start: "2017-06-27", end: "2021-10-12", ongoing: false, ...WIKIPEDIA("jean-luc-melenchon", "https://fr.wikipedia.org/wiki/Jean-Luc_M%C3%A9lenchon") },
  { candidateSlug: "jean-luc-melenchon", title: "Député", institution: "Assemblée nationale", territory: "Bouches-du-Rhône (4e circonscription)", appointmentType: "elu", partyAtTime: "La France insoumise", start: "2017-06-21", end: "2022-06-21", ongoing: false, ...WIKIPEDIA("jean-luc-melenchon", "https://fr.wikipedia.org/wiki/Jean-Luc_M%C3%A9lenchon") },

  // --- Marine Le Pen ---
  { candidateSlug: "marine-le-pen", title: "Conseillère régionale", institution: "Conseil régional", territory: "Nord-Pas-de-Calais", appointmentType: "elu", partyAtTime: "Front national", start: "1998-03-21", end: "2004-03-28", ongoing: false, ...WIKIPEDIA("marine-le-pen", "https://fr.wikipedia.org/wiki/Marine_Le_Pen") },
  { candidateSlug: "marine-le-pen", title: "Conseillère régionale", institution: "Conseil régional", territory: "Île-de-France", appointmentType: "elu", partyAtTime: "Front national", start: "2004-03-28", end: "2010-03-21", ongoing: false, ...WIKIPEDIA("marine-le-pen", "https://fr.wikipedia.org/wiki/Marine_Le_Pen") },
  { candidateSlug: "marine-le-pen", title: "Députée européenne", institution: "Parlement européen", territory: null, appointmentType: "elu", partyAtTime: "Front national", start: "2004-07-20", end: "2017-06-18", ongoing: false, sourceName: "Parlement européen", sourceUrl: "https://www.europarl.europa.eu/meps/fr/28210/MARINE_LE+PEN/history/8", sourceType: "parliament" },
  { candidateSlug: "marine-le-pen", title: "Conseillère régionale", institution: "Conseil régional", territory: "Nord-Pas-de-Calais puis Hauts-de-France", appointmentType: "elu", partyAtTime: "Front national puis Rassemblement national", start: "2010-03-26", end: "2021-07-02", ongoing: false, ...WIKIPEDIA("marine-le-pen", "https://fr.wikipedia.org/wiki/Marine_Le_Pen") },
  { candidateSlug: "marine-le-pen", title: "Présidente du Front national (Rassemblement national à partir de 2018)", institution: "Front national / Rassemblement national", territory: null, appointmentType: "elu", partyAtTime: null, start: "2011-01-16", end: "2021-09-13", ongoing: false, ...WIKIPEDIA("marine-le-pen", "https://fr.wikipedia.org/wiki/Marine_Le_Pen") },
  { candidateSlug: "marine-le-pen", title: "Députée", institution: "Assemblée nationale", territory: "Pas-de-Calais (11e circonscription)", appointmentType: "elu", partyAtTime: "Front national puis Rassemblement national", start: "2017-06-21", end: null, ongoing: true, sourceName: "Assemblée nationale", sourceUrl: "https://www.assemblee-nationale.fr/dyn/deputes/PA720614/fonctions", sourceType: "parliament" },
  { candidateSlug: "marine-le-pen", title: "Conseillère départementale", institution: "Conseil départemental du Pas-de-Calais", territory: "Canton d'Hénin-Beaumont-2", appointmentType: "elu", partyAtTime: "Rassemblement national", start: "2021-07-11", end: "2025-11-10", ongoing: false, ...WIKIPEDIA("marine-le-pen", "https://fr.wikipedia.org/wiki/Marine_Le_Pen") },
  { candidateSlug: "marine-le-pen", title: "Présidente du groupe Rassemblement National", institution: "Assemblée nationale", territory: null, appointmentType: "elu", partyAtTime: "Rassemblement national", start: "2022-06-29", end: "2024-06-09", ongoing: false, sourceName: "Assemblée nationale", sourceUrl: "https://www.assemblee-nationale.fr/dyn/deputes/PA720614/fonctions?archive=oui", sourceType: "parliament" },
  { candidateSlug: "marine-le-pen", title: "Présidente du groupe Rassemblement National", institution: "Assemblée nationale", territory: null, appointmentType: "elu", partyAtTime: "Rassemblement national", start: "2024-07-19", end: null, ongoing: true, sourceName: "Assemblée nationale", sourceUrl: "https://www.assemblee-nationale.fr/dyn/deputes/PA720614/fonctions", sourceType: "parliament" },

  // --- Édouard Philippe ---
  { candidateSlug: "edouard-philippe", title: "Conseiller régional", institution: "Conseil régional", territory: "Haute-Normandie", appointmentType: "elu", partyAtTime: "UMP", start: "2004-04-02", end: "2008-03-18", ongoing: false, ...WIKIPEDIA("edouard-philippe", "https://fr.wikipedia.org/wiki/%C3%89douard_Philippe") },
  { candidateSlug: "edouard-philippe", title: "Conseiller général", institution: "Conseil général", territory: "Canton du Havre-5", appointmentType: "elu", partyAtTime: "UMP", start: "2008-03-16", end: "2012-04-22", ongoing: false, ...WIKIPEDIA("edouard-philippe", "https://fr.wikipedia.org/wiki/%C3%89douard_Philippe") },
  { candidateSlug: "edouard-philippe", title: "Maire du Havre", institution: "Mairie du Havre", territory: null, appointmentType: "elu", partyAtTime: "UMP", start: "2010-10-24", end: "2017-05-20", ongoing: false, ...WIKIPEDIA("edouard-philippe", "https://fr.wikipedia.org/wiki/%C3%89douard_Philippe") },
  { candidateSlug: "edouard-philippe", title: "Président de la communauté de l'agglomération havraise", institution: "Communauté de l'agglomération havraise", territory: null, appointmentType: "elu", partyAtTime: "UMP", start: "2010-12-18", end: "2017-06-25", ongoing: false, ...WIKIPEDIA("edouard-philippe", "https://fr.wikipedia.org/wiki/%C3%89douard_Philippe") },
  { candidateSlug: "edouard-philippe", title: "Député", institution: "Assemblée nationale", territory: "Seine-Maritime (7e circonscription)", appointmentType: "elu", partyAtTime: "Les Républicains", start: "2012-03-24", end: "2017-06-15", ongoing: false, ...WIKIPEDIA("edouard-philippe", "https://fr.wikipedia.org/wiki/%C3%89douard_Philippe") },
  { candidateSlug: "edouard-philippe", title: "Premier ministre", institution: "Gouvernement", territory: null, appointmentType: "nomme", partyAtTime: null, start: "2017-05-15", end: "2020-07-03", ongoing: false, ...WIKIPEDIA("edouard-philippe", "https://fr.wikipedia.org/wiki/%C3%89douard_Philippe") },
  { candidateSlug: "edouard-philippe", title: "Maire du Havre", institution: "Mairie du Havre", territory: null, appointmentType: "elu", partyAtTime: "Horizons", start: "2020-07-05", end: null, ongoing: true, ...WIKIPEDIA("edouard-philippe", "https://fr.wikipedia.org/wiki/%C3%89douard_Philippe") },
  { candidateSlug: "edouard-philippe", title: "Président du Havre Seine Métropole", institution: "Havre Seine Métropole", territory: null, appointmentType: "elu", partyAtTime: "Horizons", start: "2020-07-15", end: null, ongoing: true, ...WIKIPEDIA("edouard-philippe", "https://fr.wikipedia.org/wiki/%C3%89douard_Philippe") },
  { candidateSlug: "edouard-philippe", title: "Président d'Horizons", institution: "Horizons", territory: null, appointmentType: "elu", partyAtTime: null, start: "2021-10-09", end: null, ongoing: true, ...WIKIPEDIA("edouard-philippe", "https://fr.wikipedia.org/wiki/%C3%89douard_Philippe") },

  // --- Xavier Bertrand ---
  { candidateSlug: "xavier-bertrand", title: "Député", institution: "Assemblée nationale", territory: "Aisne (2e circonscription)", appointmentType: "elu", partyAtTime: "UMP", start: "2002-06-19", end: "2004-04-30", ongoing: false, ...WIKIPEDIA("xavier-bertrand", "https://fr.wikipedia.org/wiki/Xavier_Bertrand") },
  { candidateSlug: "xavier-bertrand", title: "Secrétaire d'État chargé de l'Assurance maladie", institution: "Gouvernement", territory: null, appointmentType: "nomme", partyAtTime: null, start: "2004-03-31", end: "2005-05-31", ongoing: false, ...WIKIPEDIA("xavier-bertrand", "https://fr.wikipedia.org/wiki/Xavier_Bertrand") },
  { candidateSlug: "xavier-bertrand", title: "Ministre de la Santé et des Solidarités", institution: "Gouvernement", territory: null, appointmentType: "nomme", partyAtTime: null, start: "2005-06-02", end: "2007-03-26", ongoing: false, ...WIKIPEDIA("xavier-bertrand", "https://fr.wikipedia.org/wiki/Xavier_Bertrand") },
  { candidateSlug: "xavier-bertrand", title: "Député", institution: "Assemblée nationale", territory: "Aisne (2e circonscription)", appointmentType: "elu", partyAtTime: "UMP", start: "2007-06-20", end: "2007-07-19", ongoing: false, ...WIKIPEDIA("xavier-bertrand", "https://fr.wikipedia.org/wiki/Xavier_Bertrand") },
  { candidateSlug: "xavier-bertrand", title: "Ministre du Travail", institution: "Gouvernement", territory: null, appointmentType: "nomme", partyAtTime: null, start: "2007-05-18", end: "2009-01-15", ongoing: false, ...WIKIPEDIA("xavier-bertrand", "https://fr.wikipedia.org/wiki/Xavier_Bertrand") },
  { candidateSlug: "xavier-bertrand", title: "Secrétaire général de l'UMP", institution: "UMP", territory: null, appointmentType: "nomme", partyAtTime: "UMP", start: "2009-01-24", end: "2010-11-17", ongoing: false, ...WIKIPEDIA("xavier-bertrand", "https://fr.wikipedia.org/wiki/Xavier_Bertrand") },
  { candidateSlug: "xavier-bertrand", title: "Député", institution: "Assemblée nationale", territory: "Aisne (2e circonscription)", appointmentType: "elu", partyAtTime: "UMP", start: "2009-02-15", end: "2010-12-14", ongoing: false, ...WIKIPEDIA("xavier-bertrand", "https://fr.wikipedia.org/wiki/Xavier_Bertrand") },
  { candidateSlug: "xavier-bertrand", title: "Ministre du Travail, de l'Emploi et de la Santé", institution: "Gouvernement", territory: null, appointmentType: "nomme", partyAtTime: null, start: "2010-11-14", end: "2012-05-10", ongoing: false, ...WIKIPEDIA("xavier-bertrand", "https://fr.wikipedia.org/wiki/Xavier_Bertrand") },
  { candidateSlug: "xavier-bertrand", title: "Maire de Saint-Quentin", institution: "Mairie de Saint-Quentin", territory: null, appointmentType: "elu", partyAtTime: "UMP", start: "2010-10-04", end: "2016-01-14", ongoing: false, ...WIKIPEDIA("xavier-bertrand", "https://fr.wikipedia.org/wiki/Xavier_Bertrand") },
  { candidateSlug: "xavier-bertrand", title: "Député", institution: "Assemblée nationale", territory: "Aisne (2e circonscription)", appointmentType: "elu", partyAtTime: "UMP puis Les Républicains", start: "2012-06-20", end: "2016-01-14", ongoing: false, ...WIKIPEDIA("xavier-bertrand", "https://fr.wikipedia.org/wiki/Xavier_Bertrand") },
  { candidateSlug: "xavier-bertrand", title: "Président du conseil régional des Hauts-de-France", institution: "Conseil régional des Hauts-de-France", territory: null, appointmentType: "elu", partyAtTime: "Sans étiquette", start: "2016-01-04", end: null, ongoing: true, ...WIKIPEDIA("xavier-bertrand", "https://fr.wikipedia.org/wiki/Xavier_Bertrand") },

  // --- Bruno Retailleau ---
  { candidateSlug: "bruno-retailleau", title: "Député", institution: "Assemblée nationale", territory: "Vendée", appointmentType: "elu", partyAtTime: "RPR", start: "1994-11-27", end: "1997-04-21", ongoing: false, ...WIKIPEDIA("bruno-retailleau", "https://fr.wikipedia.org/wiki/Bruno_Retailleau") },
  { candidateSlug: "bruno-retailleau", title: "Vice-président du conseil régional des Pays de la Loire", institution: "Conseil régional des Pays de la Loire", territory: null, appointmentType: "elu", partyAtTime: "RPR", start: "1998-03-28", end: "2004-04-02", ongoing: false, ...WIKIPEDIA("bruno-retailleau", "https://fr.wikipedia.org/wiki/Bruno_Retailleau") },
  { candidateSlug: "bruno-retailleau", title: "Sénateur", institution: "Sénat", territory: "Vendée", appointmentType: "elu", partyAtTime: "UMP", start: "2004-10-01", end: "2024-10-20", ongoing: false, ...WIKIPEDIA("bruno-retailleau", "https://fr.wikipedia.org/wiki/Bruno_Retailleau") },
  { candidateSlug: "bruno-retailleau", title: "Président du conseil général de la Vendée", institution: "Conseil général de la Vendée", territory: null, appointmentType: "elu", partyAtTime: "UMP", start: "2010-10-31", end: "2015-04-01", ongoing: false, ...WIKIPEDIA("bruno-retailleau", "https://fr.wikipedia.org/wiki/Bruno_Retailleau") },
  { candidateSlug: "bruno-retailleau", title: "Président du groupe UMP puis Les Républicains", institution: "Sénat", territory: null, appointmentType: "elu", partyAtTime: "UMP puis Les Républicains", start: "2014-10-07", end: "2024-09-30", ongoing: false, ...WIKIPEDIA("bruno-retailleau", "https://fr.wikipedia.org/wiki/Bruno_Retailleau") },
  { candidateSlug: "bruno-retailleau", title: "Président du conseil régional des Pays de la Loire", institution: "Conseil régional des Pays de la Loire", territory: null, appointmentType: "elu", partyAtTime: "Les Républicains", start: "2016-01-04", end: "2017-09-30", ongoing: false, ...WIKIPEDIA("bruno-retailleau", "https://fr.wikipedia.org/wiki/Bruno_Retailleau") },
  { candidateSlug: "bruno-retailleau", title: "Ministre de l'Intérieur", institution: "Gouvernement", territory: null, appointmentType: "nomme", partyAtTime: null, start: "2024-09-21", end: "2025-10-12", ongoing: false, ...WIKIPEDIA("bruno-retailleau", "https://fr.wikipedia.org/wiki/Bruno_Retailleau") },
  { candidateSlug: "bruno-retailleau", title: "Sénateur", institution: "Sénat", territory: "Vendée", appointmentType: "elu", partyAtTime: "Les Républicains", start: "2025-11-13", end: null, ongoing: true, ...WIKIPEDIA("bruno-retailleau", "https://fr.wikipedia.org/wiki/Bruno_Retailleau") },
  { candidateSlug: "bruno-retailleau", title: "Président des Républicains", institution: "Les Républicains", territory: null, appointmentType: "elu", partyAtTime: null, start: "2025-05-18", end: null, ongoing: true, ...WIKIPEDIA("bruno-retailleau", "https://fr.wikipedia.org/wiki/Bruno_Retailleau") },

  // --- Gabriel Attal ---
  { candidateSlug: "gabriel-attal", title: "Député", institution: "Assemblée nationale", territory: "Hauts-de-Seine (10e circonscription)", appointmentType: "elu", partyAtTime: "La République en marche", start: "2017-06-21", end: "2018-11-16", ongoing: false, ...WIKIPEDIA("gabriel-attal", "https://fr.wikipedia.org/wiki/Gabriel_Attal") },
  { candidateSlug: "gabriel-attal", title: "Porte-parole de La République en marche", institution: "La République en marche", territory: null, appointmentType: "nomme", partyAtTime: "La République en marche", start: "2018-01-04", end: "2018-10-16", ongoing: false, ...WIKIPEDIA("gabriel-attal", "https://fr.wikipedia.org/wiki/Gabriel_Attal") },
  { candidateSlug: "gabriel-attal", title: "Secrétaire d'État auprès du ministre de l'Éducation nationale", institution: "Gouvernement", territory: null, appointmentType: "nomme", partyAtTime: null, start: "2018-10-16", end: "2020-07-06", ongoing: false, ...WIKIPEDIA("gabriel-attal", "https://fr.wikipedia.org/wiki/Gabriel_Attal") },
  { candidateSlug: "gabriel-attal", title: "Secrétaire d'État, porte-parole du gouvernement", institution: "Gouvernement", territory: null, appointmentType: "nomme", partyAtTime: null, start: "2020-07-06", end: "2022-05-20", ongoing: false, ...WIKIPEDIA("gabriel-attal", "https://fr.wikipedia.org/wiki/Gabriel_Attal") },
  { candidateSlug: "gabriel-attal", title: "Député", institution: "Assemblée nationale", territory: "Hauts-de-Seine (10e circonscription)", appointmentType: "elu", partyAtTime: "Renaissance", start: "2022-06-22", end: "2022-07-22", ongoing: false, ...WIKIPEDIA("gabriel-attal", "https://fr.wikipedia.org/wiki/Gabriel_Attal") },
  { candidateSlug: "gabriel-attal", title: "Ministre délégué chargé des Comptes publics", institution: "Gouvernement", territory: null, appointmentType: "nomme", partyAtTime: null, start: "2022-05-20", end: "2023-07-20", ongoing: false, ...WIKIPEDIA("gabriel-attal", "https://fr.wikipedia.org/wiki/Gabriel_Attal") },
  { candidateSlug: "gabriel-attal", title: "Ministre de l'Éducation nationale et de la Jeunesse", institution: "Gouvernement", territory: null, appointmentType: "nomme", partyAtTime: null, start: "2023-07-20", end: "2024-01-11", ongoing: false, ...WIKIPEDIA("gabriel-attal", "https://fr.wikipedia.org/wiki/Gabriel_Attal") },
  { candidateSlug: "gabriel-attal", title: "Premier ministre", institution: "Gouvernement", territory: null, appointmentType: "nomme", partyAtTime: null, start: "2024-01-09", end: "2024-09-05", ongoing: false, ...WIKIPEDIA("gabriel-attal", "https://fr.wikipedia.org/wiki/Gabriel_Attal") },
  { candidateSlug: "gabriel-attal", title: "Député", institution: "Assemblée nationale", territory: "Hauts-de-Seine (10e circonscription)", appointmentType: "elu", partyAtTime: "Renaissance", start: "2024-07-08", end: null, ongoing: true, ...WIKIPEDIA("gabriel-attal", "https://fr.wikipedia.org/wiki/Gabriel_Attal") },
  { candidateSlug: "gabriel-attal", title: "Secrétaire général de Renaissance", institution: "Renaissance", territory: null, appointmentType: "nomme", partyAtTime: "Renaissance", start: "2024-12-08", end: null, ongoing: true, ...WIKIPEDIA("gabriel-attal", "https://fr.wikipedia.org/wiki/Gabriel_Attal") },

  // --- Raphaël Glucksmann ---
  { candidateSlug: "raphael-glucksmann", title: "Député européen", institution: "Parlement européen", territory: null, appointmentType: "elu", partyAtTime: "Place publique", start: "2019-07-02", end: null, ongoing: true, ...WIKIPEDIA("raphael-glucksmann", "https://fr.wikipedia.org/wiki/Rapha%C3%ABl_Glucksmann") },
  { candidateSlug: "raphael-glucksmann", title: "Coprésident de Place publique", institution: "Place publique", territory: null, appointmentType: "elu", partyAtTime: "Place publique", start: "2022-12-16", end: null, ongoing: true, ...WIKIPEDIA("raphael-glucksmann", "https://fr.wikipedia.org/wiki/Rapha%C3%ABl_Glucksmann") },

  // --- Nicolas Dupont-Aignan ---
  { candidateSlug: "nicolas-dupont-aignan", title: "Maire de Yerres", institution: "Mairie de Yerres", territory: null, appointmentType: "elu", partyAtTime: "RPR puis indépendant", start: "1995-06-25", end: "2017-07-23", ongoing: false, ...WIKIPEDIA("nicolas-dupont-aignan", "https://fr.wikipedia.org/wiki/Nicolas_Dupont-Aignan") },
  { candidateSlug: "nicolas-dupont-aignan", title: "Président de la communauté du Val d'Yerres", institution: "Communauté du Val d'Yerres", territory: null, appointmentType: "elu", partyAtTime: null, start: "2002-03-22", end: "2015-12-31", ongoing: false, ...WIKIPEDIA("nicolas-dupont-aignan", "https://fr.wikipedia.org/wiki/Nicolas_Dupont-Aignan") },
  { candidateSlug: "nicolas-dupont-aignan", title: "Député", institution: "Assemblée nationale", territory: "Essonne (8e circonscription)", appointmentType: "elu", partyAtTime: "Debout la France", start: "1997-06-12", end: "2024-06-09", ongoing: false, ...WIKIPEDIA("nicolas-dupont-aignan", "https://fr.wikipedia.org/wiki/Nicolas_Dupont-Aignan") },
  { candidateSlug: "nicolas-dupont-aignan", title: "Président de Debout la France", institution: "Debout la France", territory: null, appointmentType: "elu", partyAtTime: "Debout la France", start: "2008-11-22", end: null, ongoing: true, ...WIKIPEDIA("nicolas-dupont-aignan", "https://fr.wikipedia.org/wiki/Nicolas_Dupont-Aignan") },
  { candidateSlug: "nicolas-dupont-aignan", title: "Président de la communauté Val d'Yerres Val de Seine", institution: "Communauté Val d'Yerres Val de Seine", territory: null, appointmentType: "elu", partyAtTime: null, start: "2016-03-09", end: "2017-07-25", ongoing: false, ...WIKIPEDIA("nicolas-dupont-aignan", "https://fr.wikipedia.org/wiki/Nicolas_Dupont-Aignan") },
  { candidateSlug: "nicolas-dupont-aignan", title: "Maire de Yerres", institution: "Mairie de Yerres", territory: null, appointmentType: "elu", partyAtTime: "Debout la France", start: "2026-03-22", end: null, ongoing: true, ...WIKIPEDIA("nicolas-dupont-aignan", "https://fr.wikipedia.org/wiki/Nicolas_Dupont-Aignan") },

  // --- Fabien Roussel ---
  { candidateSlug: "fabien-roussel", title: "Conseiller municipal", institution: "Mairie de Saint-Amand-les-Eaux", territory: null, appointmentType: "elu", partyAtTime: "Parti communiste français", start: "2014-03-24", end: null, ongoing: true, ...WIKIPEDIA("fabien-roussel", "https://fr.wikipedia.org/wiki/Fabien_Roussel") },
  { candidateSlug: "fabien-roussel", title: "Député", institution: "Assemblée nationale", territory: "Nord (20e circonscription)", appointmentType: "elu", partyAtTime: "Parti communiste français", start: "2017-06-21", end: "2024-06-09", ongoing: false, ...WIKIPEDIA("fabien-roussel", "https://fr.wikipedia.org/wiki/Fabien_Roussel") },
  { candidateSlug: "fabien-roussel", title: "Secrétaire national du Parti communiste français", institution: "Parti communiste français", territory: null, appointmentType: "elu", partyAtTime: "Parti communiste français", start: "2018-11-25", end: null, ongoing: true, ...WIKIPEDIA("fabien-roussel", "https://fr.wikipedia.org/wiki/Fabien_Roussel") },
  { candidateSlug: "fabien-roussel", title: "Maire de Saint-Amand-les-Eaux", institution: "Mairie de Saint-Amand-les-Eaux", territory: null, appointmentType: "elu", partyAtTime: "Parti communiste français", start: "2025-01-30", end: null, ongoing: true, ...WIKIPEDIA("fabien-roussel", "https://fr.wikipedia.org/wiki/Fabien_Roussel") },

  // --- François Ruffin ---
  { candidateSlug: "francois-ruffin", title: "Député", institution: "Assemblée nationale", territory: "Somme (1re circonscription)", appointmentType: "elu", partyAtTime: "La France insoumise, puis Écologiste et Social", start: "2017-06-21", end: null, ongoing: true, ...WIKIPEDIA("francois-ruffin", "https://fr.wikipedia.org/wiki/Fran%C3%A7ois_Ruffin") },
  { candidateSlug: "francois-ruffin", title: "Porte-parole de Picardie debout !", institution: "Picardie debout !", territory: null, appointmentType: "nomme", partyAtTime: null, start: "2017-02-17", end: "2025-06-28", ongoing: false, ...WIKIPEDIA("francois-ruffin", "https://fr.wikipedia.org/wiki/Fran%C3%A7ois_Ruffin") },
  { candidateSlug: "francois-ruffin", title: "Président de Debout !", institution: "Debout !", territory: null, appointmentType: "elu", partyAtTime: "Debout !", start: "2025-06-28", end: null, ongoing: true, ...WIKIPEDIA("francois-ruffin", "https://fr.wikipedia.org/wiki/Fran%C3%A7ois_Ruffin") },

  // --- Marine Tondelier ---
  { candidateSlug: "marine-tondelier", title: "Conseillère municipale", institution: "Mairie d'Hénin-Beaumont", territory: null, appointmentType: "elu", partyAtTime: "Europe Écologie Les Verts", start: "2014-03-30", end: "2026-03-22", ongoing: false, ...WIKIPEDIA("marine-tondelier", "https://fr.wikipedia.org/wiki/Marine_Tondelier") },
  { candidateSlug: "marine-tondelier", title: "Conseillère communautaire", institution: "Communauté d'agglomération d'Hénin-Carvin", territory: null, appointmentType: "elu", partyAtTime: "Europe Écologie Les Verts", start: "2014-04-17", end: "2026-03-22", ongoing: false, ...WIKIPEDIA("marine-tondelier", "https://fr.wikipedia.org/wiki/Marine_Tondelier") },
  { candidateSlug: "marine-tondelier", title: "Conseillère régionale", institution: "Conseil régional des Hauts-de-France", territory: null, appointmentType: "elu", partyAtTime: "Europe Écologie Les Verts", start: "2021-07-02", end: null, ongoing: true, ...WIKIPEDIA("marine-tondelier", "https://fr.wikipedia.org/wiki/Marine_Tondelier") },
  { candidateSlug: "marine-tondelier", title: "Secrétaire nationale des Écologistes", institution: "Les Écologistes (ex-EELV)", territory: null, appointmentType: "elu", partyAtTime: "Les Écologistes", start: "2022-12-10", end: null, ongoing: true, ...WIKIPEDIA("marine-tondelier", "https://fr.wikipedia.org/wiki/Marine_Tondelier") },

  // --- David Lisnard ---
  { candidateSlug: "david-lisnard", title: "Conseiller départemental", institution: "Conseil départemental des Alpes-Maritimes", territory: null, appointmentType: "elu", partyAtTime: "UMP puis Les Républicains", start: "2008-03-16", end: null, ongoing: true, ...WIKIPEDIA("david-lisnard", "https://fr.wikipedia.org/wiki/David_Lisnard") },
  { candidateSlug: "david-lisnard", title: "Maire de Cannes", institution: "Mairie de Cannes", territory: null, appointmentType: "elu", partyAtTime: "Les Républicains", start: "2014-04-05", end: null, ongoing: true, ...WIKIPEDIA("david-lisnard", "https://fr.wikipedia.org/wiki/David_Lisnard") },
  { candidateSlug: "david-lisnard", title: "Président de la communauté d'agglomération Cannes Pays de Lérins", institution: "Communauté d'agglomération Cannes Pays de Lérins", territory: null, appointmentType: "elu", partyAtTime: "Les Républicains", start: "2017-07-20", end: null, ongoing: true, ...WIKIPEDIA("david-lisnard", "https://fr.wikipedia.org/wiki/David_Lisnard") },
  { candidateSlug: "david-lisnard", title: "Vice-président du conseil départemental des Alpes-Maritimes", institution: "Conseil départemental des Alpes-Maritimes", territory: null, appointmentType: "elu", partyAtTime: "Les Républicains", start: "2021-07-01", end: null, ongoing: true, ...WIKIPEDIA("david-lisnard", "https://fr.wikipedia.org/wiki/David_Lisnard") },
  { candidateSlug: "david-lisnard", title: "Président de l'Association des maires de France", institution: "Association des maires de France", territory: null, appointmentType: "elu", partyAtTime: null, start: "2021-11-17", end: null, ongoing: true, ...WIKIPEDIA("david-lisnard", "https://fr.wikipedia.org/wiki/David_Lisnard") },

  // --- Nathalie Arthaud ---
  { candidateSlug: "nathalie-arthaud", title: "Conseillère municipale", institution: "Mairie de Vaulx-en-Velin", territory: null, appointmentType: "elu", partyAtTime: "Lutte Ouvrière", start: "2008-03-21", end: "2014-04-04", ongoing: false, ...WIKIPEDIA("nathalie-arthaud", "https://fr.wikipedia.org/wiki/Nathalie_Arthaud") },
  { candidateSlug: "nathalie-arthaud", title: "Porte-parole de Lutte Ouvrière", institution: "Lutte Ouvrière", territory: null, appointmentType: "elu", partyAtTime: "Lutte Ouvrière", start: "2008-12-08", end: null, ongoing: true, ...WIKIPEDIA("nathalie-arthaud", "https://fr.wikipedia.org/wiki/Nathalie_Arthaud") },
];

export const candidateMandates: CandidateMandate[] = rawMandates.map((m, index) => {
  const candidate = candidates.find((c) => c.slug === m.candidateSlug)!;
  return {
    id: `candidate-mandate-${index + 1}`,
    candidate_id: candidate.id,
    title: m.title,
    institution: m.institution,
    territory: m.territory,
    appointment_type: m.appointmentType,
    party_at_time: m.partyAtTime,
    start_date: m.start,
    end_date: m.end,
    is_ongoing: m.ongoing,
    source_name: m.sourceName,
    source_url: m.sourceUrl,
    source_type: m.sourceType,
    status: "published",
    verified_at: "2026-09-10",
  };
});

// ---------------------------------------------------------------------------
// candidate_votes
// ---------------------------------------------------------------------------
interface RawVote {
  candidateSlug: string;
  institution: VoteInstitution;
  legislature: string;
  officialVoteId: string | null;
  title: string;
  description: string;
  themeSlug: string | null;
  voteDate: string;
  vote: CandidateVoteValue;
  importance: VoteImportance;
  featured: boolean;
  sourceUrl: string;
}

// prettier-ignore
const rawVotes: RawVote[] = [
  // Scrutin n°519 (17e législature) — motion de censure contre le gouvernement
  // Barnier, déposée après l'engagement de sa responsabilité (49.3) sur le
  // PLFSS 2025. Adoptée le 4 décembre 2024 avec 331 voix, elle a renversé le
  // gouvernement. Source : Assemblée nationale (analyse officielle du scrutin).
  { candidateSlug: "marine-le-pen", institution: "assemblee_nationale", legislature: "17e législature", officialVoteId: "519", title: "Motion de censure contre le gouvernement Michel Barnier", description: "Motion déposée par les groupes du Nouveau Front populaire après l'engagement de la responsabilité du gouvernement (article 49, alinéa 3) sur le projet de loi de financement de la Sécurité sociale pour 2025. Son adoption entraîne la démission du gouvernement.", themeSlug: null, voteDate: "2024-12-04", vote: "for", importance: "major", featured: true, sourceUrl: "https://www.assemblee-nationale.fr/dyn/17/scrutins/519" },
  { candidateSlug: "francois-ruffin", institution: "assemblee_nationale", legislature: "17e législature", officialVoteId: "519", title: "Motion de censure contre le gouvernement Michel Barnier", description: "Motion déposée par les groupes du Nouveau Front populaire après l'engagement de la responsabilité du gouvernement (article 49, alinéa 3) sur le projet de loi de financement de la Sécurité sociale pour 2025. Son adoption entraîne la démission du gouvernement.", themeSlug: null, voteDate: "2024-12-04", vote: "for", importance: "major", featured: true, sourceUrl: "https://www.assemblee-nationale.fr/dyn/17/scrutins/519" },

  // Scrutin n°3213 (16e législature) — adoption définitive du projet de loi
  // "pour contrôler l'immigration, améliorer l'intégration" (texte de la
  // commission mixte paritaire), le 19 décembre 2023. Source : Assemblée
  // nationale (analyse officielle du scrutin).
  { candidateSlug: "marine-le-pen", institution: "assemblee_nationale", legislature: "16e législature", officialVoteId: "3213", title: "Adoption de la loi « pour contrôler l'immigration, améliorer l'intégration »", description: "Vote sur l'ensemble du texte issu de la commission mixte paritaire, après son rejet en première lecture le 11 décembre 2023. Texte durci par rapport à la version initiale du gouvernement.", themeSlug: "immigration", voteDate: "2023-12-19", vote: "for", importance: "major", featured: true, sourceUrl: "https://www.assemblee-nationale.fr/dyn/16/scrutins/3213" },
  { candidateSlug: "francois-ruffin", institution: "assemblee_nationale", legislature: "16e législature", officialVoteId: "3213", title: "Adoption de la loi « pour contrôler l'immigration, améliorer l'intégration »", description: "Vote sur l'ensemble du texte issu de la commission mixte paritaire, après son rejet en première lecture le 11 décembre 2023. Texte durci par rapport à la version initiale du gouvernement.", themeSlug: "immigration", voteDate: "2023-12-19", vote: "against", importance: "major", featured: true, sourceUrl: "https://www.assemblee-nationale.fr/dyn/16/scrutins/3213" },
  { candidateSlug: "nicolas-dupont-aignan", institution: "assemblee_nationale", legislature: "16e législature", officialVoteId: "3213", title: "Adoption de la loi « pour contrôler l'immigration, améliorer l'intégration »", description: "Vote sur l'ensemble du texte issu de la commission mixte paritaire, après son rejet en première lecture le 11 décembre 2023. Texte durci par rapport à la version initiale du gouvernement.", themeSlug: "immigration", voteDate: "2023-12-19", vote: "abstention", importance: "major", featured: true, sourceUrl: "https://www.assemblee-nationale.fr/dyn/16/scrutins/3213" },
  { candidateSlug: "fabien-roussel", institution: "assemblee_nationale", legislature: "16e législature", officialVoteId: "3213", title: "Adoption de la loi « pour contrôler l'immigration, améliorer l'intégration »", description: "Vote sur l'ensemble du texte issu de la commission mixte paritaire, après son rejet en première lecture le 11 décembre 2023. Texte durci par rapport à la version initiale du gouvernement.", themeSlug: "immigration", voteDate: "2023-12-19", vote: "against", importance: "major", featured: true, sourceUrl: "https://www.assemblee-nationale.fr/dyn/16/scrutins/3213" },

  // Scrutin n°1240 (16e législature) — motion de censure transpartisane
  // déposée par Bertrand Pancher (LIOT) et 90 de ses collègues après le
  // recours au 49.3 sur la réforme des retraites. Rejetée le 20 mars 2023 :
  // 278 voix pour, soit 9 de moins que la majorité absolue requise.
  { candidateSlug: "marine-le-pen", institution: "assemblee_nationale", legislature: "16e législature", officialVoteId: "1240", title: "Motion de censure transpartisane après le 49.3 sur la réforme des retraites", description: "Motion déposée par Bertrand Pancher (groupe LIOT) et 90 de ses collègues, après l'engagement de la responsabilité du gouvernement d'Élisabeth Borne sur la réforme des retraites. Son adoption aurait entraîné la démission du gouvernement et le rejet du texte.", themeSlug: "retraites", voteDate: "2023-03-20", vote: "for", importance: "major", featured: true, sourceUrl: "https://www.assemblee-nationale.fr/dyn/16/scrutins/1240" },
  { candidateSlug: "francois-ruffin", institution: "assemblee_nationale", legislature: "16e législature", officialVoteId: "1240", title: "Motion de censure transpartisane après le 49.3 sur la réforme des retraites", description: "Motion déposée par Bertrand Pancher (groupe LIOT) et 90 de ses collègues, après l'engagement de la responsabilité du gouvernement d'Élisabeth Borne sur la réforme des retraites. Son adoption aurait entraîné la démission du gouvernement et le rejet du texte.", themeSlug: "retraites", voteDate: "2023-03-20", vote: "for", importance: "major", featured: true, sourceUrl: "https://www.assemblee-nationale.fr/dyn/16/scrutins/1240" },
  { candidateSlug: "fabien-roussel", institution: "assemblee_nationale", legislature: "16e législature", officialVoteId: "1240", title: "Motion de censure transpartisane après le 49.3 sur la réforme des retraites", description: "Motion déposée par Bertrand Pancher (groupe LIOT) et 90 de ses collègues, après l'engagement de la responsabilité du gouvernement d'Élisabeth Borne sur la réforme des retraites. Son adoption aurait entraîné la démission du gouvernement et le rejet du texte.", themeSlug: "retraites", voteDate: "2023-03-20", vote: "for", importance: "major", featured: true, sourceUrl: "https://www.assemblee-nationale.fr/dyn/16/scrutins/1240" },
  { candidateSlug: "nicolas-dupont-aignan", institution: "assemblee_nationale", legislature: "16e législature", officialVoteId: "1240", title: "Motion de censure transpartisane après le 49.3 sur la réforme des retraites", description: "Motion déposée par Bertrand Pancher (groupe LIOT) et 90 de ses collègues, après l'engagement de la responsabilité du gouvernement d'Élisabeth Borne sur la réforme des retraites. Son adoption aurait entraîné la démission du gouvernement et le rejet du texte.", themeSlug: "retraites", voteDate: "2023-03-20", vote: "for", importance: "major", featured: true, sourceUrl: "https://www.assemblee-nationale.fr/dyn/16/scrutins/1240" },

  // Scrutin n°578 (15e législature) — adoption en première lecture de la loi
  // « pour une immigration maîtrisée, un droit d'asile effectif et une
  // intégration réussie », le 22 avril 2018.
  { candidateSlug: "jean-luc-melenchon", institution: "assemblee_nationale", legislature: "15e législature", officialVoteId: "578", title: "Adoption de la loi « pour une immigration maîtrisée, un droit d'asile effectif et une intégration réussie » (1re lecture)", description: "Vote sur l'ensemble du texte en première lecture, après une semaine de débats et l'examen d'environ un millier d'amendements.", themeSlug: "immigration", voteDate: "2018-04-22", vote: "against", importance: "major", featured: true, sourceUrl: "https://www.assemblee-nationale.fr/dyn/15/scrutins/578" },

  // Scrutin n°511 (14e législature) — adoption définitive de la loi ouvrant
  // le mariage aux couples de personnes de même sexe (« mariage pour
  // tous »), le 23 avril 2013.
  { candidateSlug: "edouard-philippe", institution: "assemblee_nationale", legislature: "14e législature", officialVoteId: "511", title: "Adoption de la loi ouvrant le mariage aux couples de personnes de même sexe", description: "Vote définitif sur l'ensemble du texte, en deuxième lecture, après son adoption par le Sénat.", themeSlug: null, voteDate: "2013-04-23", vote: "abstention", importance: "major", featured: true, sourceUrl: "https://www.assemblee-nationale.fr/14/scrutins/jo0511.asp" },

  // Scrutin n°1109 (14e législature) — adoption en première lecture de la
  // loi relative au renseignement, le 5 mai 2015.
  { candidateSlug: "edouard-philippe", institution: "assemblee_nationale", legislature: "14e législature", officialVoteId: "1109", title: "Adoption de la loi relative au renseignement (1re lecture)", description: "Vote sur l'ensemble du texte encadrant les techniques de renseignement et leur contrôle, en première lecture.", themeSlug: "securite", voteDate: "2015-05-05", vote: "against", importance: "major", featured: true, sourceUrl: "https://www.assemblee-nationale.fr/dyn/14/scrutins/1109" },

  // Motion de censure contre le gouvernement Michel Barnier (voir scrutin
  // n°519 ci-dessus) : les groupes qui s'opposent à une motion de censure ne
  // prennent traditionnellement pas part à ce vote plutôt que de voter
  // « contre » — Gabriel Attal (groupe Ensemble pour la République) ne
  // figure dans aucune liste de votants de ce scrutin.
  { candidateSlug: "gabriel-attal", institution: "assemblee_nationale", legislature: "17e législature", officialVoteId: "519", title: "Motion de censure contre le gouvernement Michel Barnier", description: "Motion déposée par les groupes du Nouveau Front populaire après l'engagement de la responsabilité du gouvernement (article 49, alinéa 3) sur le projet de loi de financement de la Sécurité sociale pour 2025. Son adoption entraîne la démission du gouvernement.", themeSlug: null, voteDate: "2024-12-04", vote: "did_not_vote", importance: "major", featured: true, sourceUrl: "https://www.assemblee-nationale.fr/dyn/17/scrutins/519" },

  // Autorisation de la prolongation des opérations aériennes françaises en
  // Syrie, le 25 novembre 2015 (dans le contexte des attentats du 13
  // novembre) — adoptée à une très large majorité (515 voix contre 4).
  // Identifiant de scrutin officiel non retrouvé : source = page officielle
  // "Positions de vote" de Xavier Bertrand sur le site de l'Assemblée nationale.
  { candidateSlug: "xavier-bertrand", institution: "assemblee_nationale", legislature: "14e législature", officialVoteId: null, title: "Autorisation de la prolongation des opérations aériennes françaises en Syrie", description: "Déclaration du Gouvernement sur la prolongation de l'engagement des forces armées françaises en Syrie, suivie d'un vote, dans le contexte des attentats du 13 novembre 2015.", themeSlug: "international", voteDate: "2015-11-25", vote: "for", importance: "major", featured: true, sourceUrl: "https://www.assemblee-nationale.fr/dyn/deputes/PA267080/positions-de-vote?legislature=archive" },
];

export const candidateVotes: CandidateVote[] = rawVotes.map((v, index) => {
  const candidate = candidates.find((c) => c.slug === v.candidateSlug)!;
  const theme = v.themeSlug ? getThemeBySlug(v.themeSlug) : undefined;
  return {
    id: `candidate-vote-${index + 1}`,
    candidate_id: candidate.id,
    institution: v.institution,
    legislature: v.legislature,
    official_vote_id: v.officialVoteId,
    title: v.title,
    description: v.description,
    theme_id: theme?.id ?? null,
    theme,
    vote_date: v.voteDate,
    candidate_vote: v.vote,
    importance_level: v.importance,
    featured: v.featured,
    source_name: "Assemblée nationale",
    source_url: v.sourceUrl,
    source_type: "parliament" as RecordSourceType,
    status: "published",
    verified_at: "2026-09-10",
  };
});

// ---------------------------------------------------------------------------
// candidate_position_history
//
// Chaque évolution documentée ci-dessous repose sur au moins deux
// déclarations datées et sourcées individuellement — jamais une conclusion
// tirée d'une seule citation. Quand le candidat a lui-même donné une
// explication sourcée de son changement, elle est reportée telle quelle
// (`candidate_explanation`) — jamais une raison devinée par Polysia.
// ---------------------------------------------------------------------------
interface RawPositionHistory {
  candidateSlug: string;
  themeSlug: string | null;
  subject: string;
  positionSummary: string;
  quote: string | null;
  date: string | null;
  sourceName: string;
  sourceUrl: string;
  sourceType: RecordSourceType;
}

// prettier-ignore
const rawPositionHistory: RawPositionHistory[] = [
  // --- Jean-Luc Mélenchon — port du voile islamique ---
  // Note : la citation de 2010 porte spécifiquement sur le voile intégral
  // (niqab/burqa), une question distincte de l'opposition plus générale au
  // port du voile exprimée en 2017 — les deux ne doivent pas être fondues
  // l'une dans l'autre malgré leur proximité de sujet.
  { candidateSlug: "jean-luc-melenchon", themeSlug: null, subject: "Port du voile islamique", positionSummary: "Sur son blog, à propos du voile intégral (niqab/burqa), il décrit son port comme un traitement dégradant pour la femme qui le porte et plaide pour son interdiction dans l'espace public.", quote: "Mon point de départ est que le port de ce voile est un traitement dégradant pour la personne qui s'y soumet.", date: "2010-01-07", sourceName: "Blog de Jean-Luc Mélenchon", sourceUrl: "https://melenchon.fr/2010/01/07/je-parle-du-voile-integral/", sourceType: "candidate" },
  { candidateSlug: "jean-luc-melenchon", themeSlug: null, subject: "Port du voile islamique", positionSummary: "Interrogé sur le port du voile islamique dans « L'Émission politique » (France 2), il dit ne pas en comprendre le sens religieux et affirme son opposition à l'ensemble des signes religieux.", quote: "Je ne vois pas en quoi Dieu serait intéressé par un chiffon sur la tête.", date: "2017-02-23", sourceName: "Franceinfo", sourceUrl: "https://www.franceinfo.fr/politique/j-ai-fait-une-erreur-terrible-jean-luc-melenchon-admet-avoir-change-d-avis-sur-le-port-du-voile-islamique_8175281.html", sourceType: "media" },
  { candidateSlug: "jean-luc-melenchon", themeSlug: null, subject: "Port du voile islamique", positionSummary: "Il déclare publiquement avoir changé d'avis sur le port du voile islamique, qualifiant ses positions passées d'« erreur terrible », après avoir échangé avec des femmes concernées.", quote: "J'ai rencontré des femmes qui portaient le voile [...] j'ai été convaincu et j'ai changé d'avis. Je me suis dit que j'ai fait une erreur terrible.", date: "2026-09-02", sourceName: "Franceinfo", sourceUrl: "https://www.franceinfo.fr/politique/j-ai-fait-une-erreur-terrible-jean-luc-melenchon-admet-avoir-change-d-avis-sur-le-port-du-voile-islamique_8175281.html", sourceType: "media" },

  // --- Marine Le Pen — sortie de l'euro ---
  { candidateSlug: "marine-le-pen", themeSlug: null, subject: "Sortie de l'euro", positionSummary: "Lors de la présentation de ses « 144 engagements présidentiels » aux assises de Lyon, elle défend le rétablissement d'une monnaie nationale, présenté comme un levier de compétitivité économique.", quote: "rétablissement d'une monnaie nationale adaptée à notre économie, levier de notre compétitivité", date: "2017-02-05", sourceName: "Public Sénat", sourceUrl: "https://www.publicsenat.fr/actualites/non-classe/sur-l-europe-marine-le-pen-a-t-elle-vraiment-change-202482", sourceType: "media" },
  { candidateSlug: "marine-le-pen", themeSlug: null, subject: "Sortie de l'euro", positionSummary: "Lors de ses vœux à la presse, elle affirme que sortir de l'euro n'est plus une priorité, tout en continuant à qualifier la monnaie unique de problématique pour la France.", quote: "Incontestablement, l'euro est un boulet pour la France, [...] en sortir n'est plus une priorité.", date: "2019-01-17", sourceName: "Public Sénat", sourceUrl: "https://www.publicsenat.fr/actualites/non-classe/sur-l-europe-marine-le-pen-a-t-elle-vraiment-change-202482", sourceType: "media" },
];

export const candidatePositionHistory: CandidatePositionHistoryEntry[] = rawPositionHistory.map((p, index) => {
  const candidate = candidates.find((c) => c.slug === p.candidateSlug)!;
  const theme = p.themeSlug ? getThemeBySlug(p.themeSlug) : undefined;
  return {
    id: `candidate-position-history-${index + 1}`,
    candidate_id: candidate.id,
    theme_id: theme?.id ?? null,
    theme,
    subject: p.subject,
    position_summary: p.positionSummary,
    quote: p.quote,
    date: p.date,
    source_name: p.sourceName,
    source_url: p.sourceUrl,
    source_type: p.sourceType,
    status: "published",
    verified_at: "2026-09-10",
  };
});

// ---------------------------------------------------------------------------
// candidate_position_evolutions
// ---------------------------------------------------------------------------
interface RawPositionEvolution {
  candidateSlug: string;
  themeSlug: string | null;
  subject: string;
  evolutionType: PositionEvolutionType;
  confidence: PositionConfidence;
  summary: string;
  candidateExplanation: string | null;
  candidateExplanationSourceUrl: string | null;
}

// prettier-ignore
const rawPositionEvolutions: RawPositionEvolution[] = [
  {
    candidateSlug: "jean-luc-melenchon",
    themeSlug: null,
    subject: "Port du voile islamique",
    evolutionType: "position_reversed",
    confidence: "evolved",
    summary: "Jean-Luc Mélenchon a publiquement reconnu avoir changé d'avis sur le port du voile islamique : après avoir qualifié le voile intégral de « traitement dégradant » en 2010 et le port du voile en général de « chiffon sur la tête » en 2017, il affirme désormais que sa position passée était une erreur. Sa déclaration de 2010 portait spécifiquement sur le voile intégral (niqab/burqa) ; celle de 2017 sur le port du voile de façon plus générale.",
    candidateExplanation: "« J'ai rencontré des femmes qui portaient le voile [...] j'ai été convaincu et j'ai changé d'avis. Je me suis dit que j'ai fait une erreur terrible. »",
    candidateExplanationSourceUrl: "https://www.franceinfo.fr/politique/j-ai-fait-une-erreur-terrible-jean-luc-melenchon-admet-avoir-change-d-avis-sur-le-port-du-voile-islamique_8175281.html",
  },
  {
    candidateSlug: "marine-le-pen",
    themeSlug: null,
    subject: "Sortie de l'euro",
    evolutionType: "position_reversed",
    confidence: "evolved",
    summary: "Marine Le Pen a abandonné sa proposition de sortie de l'euro entre sa campagne présidentielle de 2017, où elle défendait le rétablissement d'une monnaie nationale, et janvier 2019, où elle a déclaré que sortir de l'euro n'était plus une priorité — tout en continuant à qualifier l'euro de problématique pour la France.",
    candidateExplanation: "Elle a évoqué une proposition « perçue comme brutale » ayant entraîné « une véritable crainte », plaidant depuis pour une reconquête de la souveraineté « progressive » plutôt que brutale.",
    candidateExplanationSourceUrl: "https://www.publicsenat.fr/actualites/non-classe/sur-l-europe-marine-le-pen-a-t-elle-vraiment-change-202482",
  },
];

export const candidatePositionEvolutions: CandidatePositionEvolution[] = rawPositionEvolutions.map((e, index) => {
  const candidate = candidates.find((c) => c.slug === e.candidateSlug)!;
  const theme = e.themeSlug ? getThemeBySlug(e.themeSlug) : undefined;
  return {
    id: `candidate-position-evolution-${index + 1}`,
    candidate_id: candidate.id,
    theme_id: theme?.id ?? null,
    theme,
    subject: e.subject,
    evolution_type: e.evolutionType,
    confidence: e.confidence,
    summary: e.summary,
    candidate_explanation: e.candidateExplanation,
    candidate_explanation_source_url: e.candidateExplanationSourceUrl,
    status: "published",
    verified_at: "2026-09-10",
  };
});

// ---------------------------------------------------------------------------
// candidate_legal_cases
// ---------------------------------------------------------------------------
interface RawLegalCase {
  candidateSlug: string;
  title: string;
  caseType: string;
  summary: string;
  legalStatus: LegalCaseStatus;
  jurisdiction: string | null;
  startDate: string | null;
  decisionDate: string | null;
  sourceName: string;
  sourceUrl: string;
  sourceType: RecordSourceType;
}

// prettier-ignore
const rawLegalCases: RawLegalCase[] = [
  {
    candidateSlug: "marine-le-pen",
    title: "Affaire des assistants parlementaires du RN au Parlement européen",
    caseType: "Détournement de fonds publics",
    summary: "Marine Le Pen a été condamnée le 31 mars 2025 par le tribunal correctionnel de Paris à 4 ans de prison (dont 2 ans aménageables sous surveillance électronique, 2 ans avec sursis), 100 000 € d'amende et 5 ans d'inéligibilité exécutoire immédiatement, pour détournement de fonds publics dans l'affaire des emplois d'assistants parlementaires du Front national/Rassemblement national au Parlement européen (faits visés : 2004-2016). En appel, la cour d'appel de Paris l'a condamnée à nouveau le 7 juillet 2026, avec une peine réduite : 3 ans de prison (dont 1 an ferme aménageable sous bracelet électronique, 2 ans avec sursis), 100 000 € d'amende et 45 mois d'inéligibilité (dont 30 mois avec sursis). Elle a annoncé se pourvoir en cassation.",
    legalStatus: "convicted_on_appeal",
    jurisdiction: "Cour d'appel de Paris",
    startDate: null,
    decisionDate: "2026-07-07",
    sourceName: "Toute l'Europe",
    sourceUrl: "https://www.touteleurope.eu/vie-politique-des-etats-membres/proces-des-assistants-du-rn-marine-le-pen-condamnee-en-appel-mais-eligible-a-l-election-presidentielle-2027/",
    sourceType: "media",
  },
  {
    candidateSlug: "jean-luc-melenchon",
    title: "Perquisition houleuse au siège de La France insoumise (2018)",
    caseType: "Intimidation envers un magistrat et un dépositaire de l'autorité publique, rébellion, provocation",
    summary: "Le 16 octobre 2018, lors d'une perquisition au siège de La France insoumise et à son domicile menée dans le cadre d'enquêtes sur des emplois présumés fictifs d'assistants parlementaires européens et sur les comptes de campagne de 2017, Jean-Luc Mélenchon a bousculé des représentants du parquet et forcé le passage. Il a été condamné le 9 décembre 2019 par le tribunal correctionnel de Bobigny à trois mois de prison avec sursis et 8 000 € d'amende. Il a annoncé publiquement ne pas faire appel.",
    legalStatus: "convicted_final",
    jurisdiction: "Tribunal correctionnel de Bobigny",
    startDate: "2018-10-16",
    decisionDate: "2019-12-09",
    sourceName: "Franceinfo",
    sourceUrl: "https://www.franceinfo.fr/politique/melenchon/perquisition-mouvementee-a-la-france-insoumise-jean-luc-melenchon-condamne-a-trois-mois-de-prison-avec-sursis-et-8-000-euros-d-amende_3737089.html",
    sourceType: "media",
  },
  {
    candidateSlug: "jean-luc-melenchon",
    title: "Enquête sur les assistants parlementaires de La France insoumise au Parlement européen",
    caseType: "Soupçon d'emploi fictif d'assistants parlementaires",
    summary: "Jean-Luc Mélenchon et d'anciens assistants parlementaires étaient visés, depuis un signalement de l'Office européen de lutte antifraude (OLAF) en 2017 puis une enquête judiciaire française ouverte en 2018, par des soupçons d'avoir employé des assistants du Parlement européen pour soutenir principalement son activité politique nationale — un mécanisme similaire à celui jugé dans l'affaire visant le Rassemblement national. Après huit ans d'instruction, les juges ont clos le dossier le 26 mai 2026 sans mise en examen de Jean-Luc Mélenchon. Deux anciens assistants restent sous statut de témoin assisté.",
    legalStatus: "closed_without_action",
    jurisdiction: null,
    startDate: null,
    decisionDate: "2026-05-26",
    sourceName: "Franceinfo",
    sourceUrl: "https://www.franceinfo.fr/politique/la-france-insoumise/enquete-sur-les-assistants-parlementaires-de-lfi-l-instruction-est-close-sans-mise-en-examen_8029814.html",
    sourceType: "media",
  },
  {
    candidateSlug: "xavier-bertrand",
    title: "Diffamation envers Mediapart",
    caseType: "Diffamation",
    summary: "Le 6 juillet 2010, en marge d'un meeting au Raincy, Xavier Bertrand, alors secrétaire général de l'UMP, avait accusé le site Mediapart d'utiliser des « méthodes fascisantes » à propos de ses révélations dans l'affaire Bettencourt. Mediapart avait porté plainte pour diffamation. Le tribunal correctionnel de Paris l'a relaxé le 26 mars 2013, jugeant que ses propos ne visaient pas un fait précis. Mediapart avait indiqué vouloir poursuivre le débat judiciaire ; Polysia n'a pas trouvé de confirmation sourcée d'une décision d'appel.",
    legalStatus: "acquitted",
    jurisdiction: "Tribunal correctionnel de Paris",
    startDate: null,
    decisionDate: "2013-03-26",
    sourceName: "Le Nouvelliste",
    sourceUrl: "https://www.lenouvelliste.ch/monde/xavier-bertrand-relaxe-des-poursuites-de-mediapart-264658",
    sourceType: "media",
  },
  {
    candidateSlug: "edouard-philippe",
    title: "Mise en cause pour la gestion de la crise du Covid-19",
    caseType: "Mise en cause devant la Cour de justice de la République",
    summary: "Une information judiciaire a été ouverte en 2020 devant la Cour de justice de la République (CJR), seule juridiction compétente pour juger les membres du gouvernement pour des actes commis dans l'exercice de leurs fonctions, visant notamment l'ancien Premier ministre Édouard Philippe pour « mise en danger de la vie d'autrui » et « abstention volontaire de combattre un sinistre » dans la gestion de la crise sanitaire. Entendu en octobre 2022, il a été placé sous le statut de témoin assisté, sans mise en examen. La CJR a prononcé un non-lieu à son égard le 7 juillet 2025.",
    legalStatus: "dismissed",
    jurisdiction: "Cour de justice de la République",
    startDate: null,
    decisionDate: "2025-07-07",
    sourceName: "Le Club des Juristes",
    sourceUrl: "https://www.leclubdesjuristes.com/en-bref/gestion-du-covid-19-la-cjr-prononce-un-non-lieu-a-lencontre-de-edouard-philippe-agnes-buzyn-et-olivier-veran-11443/",
    sourceType: "media",
  },
  {
    candidateSlug: "nicolas-dupont-aignan",
    title: "Propos sur l'« invasion migratoire » (tweet de 2017)",
    caseType: "Provocation à la haine ou à la discrimination",
    summary: "Après un tweet du 17 janvier 2017 évoquant une « invasion migratoire », la Licra avait porté plainte contre Nicolas Dupont-Aignan pour provocation à la haine ou à la discrimination. Le tribunal de Paris (17e chambre correctionnelle) l'a relaxé le 6 juin 2018, estimant que l'infraction n'était pas caractérisée ; ses avocats invoquaient par ailleurs l'immunité parlementaire, argument que le tribunal n'a pas retenu.",
    legalStatus: "acquitted",
    jurisdiction: "Tribunal de Paris (17e chambre correctionnelle)",
    startDate: null,
    decisionDate: "2018-06-06",
    sourceName: "Public Sénat",
    sourceUrl: "https://www.publicsenat.fr/actualites/politique/dupont-aignan-relaxe-pour-ses-propos-sur-l-invasion-migratoire-en-france-86680",
    sourceType: "media",
  },
  {
    candidateSlug: "marine-le-pen",
    title: "Propos comparant les prières de rue à l'Occupation",
    caseType: "Provocation à la discrimination, à la haine ou à la violence en raison de la religion",
    summary: "En décembre 2010, lors d'une réunion publique à Lyon, Marine Le Pen avait comparé les prières de rue de fidèles musulmans à une « occupation ». Poursuivie à partir de 2012 pour provocation à la discrimination, à la haine ou à la violence en raison de la religion, après la levée de son immunité de députée européenne, elle a été jugée le 20 octobre 2015 par le tribunal correctionnel de Lyon. Le ministère public avait lui-même requis la relaxe. Elle a été relaxée le 15 décembre 2015.",
    legalStatus: "acquitted",
    jurisdiction: "Tribunal correctionnel de Lyon",
    startDate: null,
    decisionDate: "2015-12-15",
    sourceName: "France 24",
    sourceUrl: "https://www.france24.com/fr/20151215-marine-le-pen-relaxe-prieres-rue-musulman-occupation-nazie-france",
    sourceType: "media",
  },
  {
    candidateSlug: "fabien-roussel",
    title: "Poursuites du Rassemblement national pour diffamation",
    caseType: "Diffamation (poursuites engagées par le Rassemblement national)",
    summary: "En octobre 2019, après avoir mis en cause l'implication de militants d'extrême droite dans des actions violentes, dont l'attaque de la mosquée de Bayonne, sur le plateau des « 4 vérités » (France 2), Fabien Roussel a été poursuivi pour diffamation par le Rassemblement national devant le tribunal correctionnel de Paris. Il a été relaxé le 27 janvier 2022, le tribunal retenant l'excuse de bonne foi. La cour d'appel de Paris a confirmé cette relaxe le 15 décembre 2022 et débouté le RN de l'ensemble de ses demandes.",
    legalStatus: "acquitted",
    jurisdiction: "Cour d'appel de Paris",
    startDate: null,
    decisionDate: "2022-12-15",
    sourceName: "PCF (compte-rendu de la décision)",
    sourceUrl: "https://www.pcf.fr/le_rassemblement_national_d_bout_de_son_action_en_justice_contre_fabien_roussel",
    sourceType: "candidate",
  },
  {
    candidateSlug: "fabien-roussel",
    title: "Soupçon d'emploi fictif comme assistant parlementaire",
    caseType: "Soupçon d'emploi fictif d'assistant parlementaire",
    summary: "Selon Mediapart, Fabien Roussel aurait occupé un emploi fictif d'assistant parlementaire auprès du député Jean-Jacques Candelier entre 2009 et 2014, pour un salaire mensuel de 3 000 €. Il conteste les accusations, affirmant avoir réellement suivi les dossiers du Douaisis pour ce mandat. Le Parquet national financier a ouvert une enquête préliminaire en mars 2022 ; elle était toujours en cours à la dernière vérification publique de ce dossier (21 février 2026), sans mise en examen ni décision de justice à ce stade.",
    legalStatus: "investigation",
    jurisdiction: "Parquet national financier",
    startDate: null,
    decisionDate: null,
    sourceName: "Poligraph",
    sourceUrl: "https://poligraph.fr/affaires/fabien-roussel-soupcons-d-emploi-fictif-comme-assistant-parlementaire",
    sourceType: "media",
  },
  {
    candidateSlug: "francois-ruffin",
    title: "Diffamation envers un habitant d'Amiens Nord (livre « Quartier Nord »)",
    caseType: "Diffamation",
    summary: "Dans son livre « Quartier Nord » (2006), François Ruffin avait désigné sous un pseudonyme un habitant du quartier, Nourédine Gaham, avec des formules dégradantes et des accusations non étayées. Ce dernier a porté plainte pour diffamation ; le tribunal correctionnel d'Amiens a condamné François Ruffin le 23 avril 2008. Polysia n'a pas trouvé de source confirmant un appel de cette décision.",
    legalStatus: "convicted_final",
    jurisdiction: "Tribunal correctionnel d'Amiens",
    startDate: null,
    decisionDate: "2008-04-23",
    sourceName: "Franceinfo",
    sourceUrl: "https://www.franceinfo.fr/societe/nuit-debout/journalisme-engage-critique-des-medias-et-france-peripherique-qui-est-francois-ruffin-l-inspirateur-de-nuit-debout_1413979.html",
    sourceType: "media",
  },
];

export const candidateLegalCases: CandidateLegalCase[] = rawLegalCases.map((c, index) => {
  const candidate = candidates.find((cand) => cand.slug === c.candidateSlug)!;
  return {
    id: `candidate-legal-case-${index + 1}`,
    candidate_id: candidate.id,
    title: c.title,
    case_type: c.caseType,
    summary: c.summary,
    legal_status: c.legalStatus,
    jurisdiction: c.jurisdiction,
    start_date: c.startDate,
    decision_date: c.decisionDate,
    last_updated: "2026-09-10",
    next_review_at: null,
    source_name: c.sourceName,
    source_url: c.sourceUrl,
    source_type: c.sourceType,
    status: "published",
  };
});

// ---------------------------------------------------------------------------
// candidate_controversies
// ---------------------------------------------------------------------------
interface RawControversy {
  candidateSlug: string;
  title: string;
  summary: string;
  eventDate: string | null;
  context: string | null;
  /** Réponse publique du candidat, citée telle quelle — jamais reformulée. */
  candidateResponse: string | null;
  candidateResponseSourceUrl: string | null;
  controversyStatus: ControversyStatus;
  /**
   * `review_required` (et non `published`) pour les sujets les plus
   * politiquement inflammables, où la qualification même des faits est
   * contestée : c'est précisément le cas que le circuit de validation
   * humaine prévu par la méthodologie est fait pour arbitrer.
   */
  status: RecordStatus;
  sourceName: string;
  sourceUrl: string;
  sourceType: RecordSourceType;
}

// prettier-ignore
const rawControversies: RawControversy[] = [
  {
    candidateSlug: "nicolas-dupont-aignan",
    title: "Sanctionné par l'Assemblée nationale pour avoir voté à la place d'un collègue absent",
    summary: "Lors d'un vote sur un projet de loi relatif à la gestion de la crise sanitaire, fin juillet 2021, Nicolas Dupont-Aignan a voté depuis le boîtier de son collègue José Évrard, absent. Le Bureau de l'Assemblée nationale l'a sanctionné le 13 octobre 2021 pour « fraude au scrutin » : rappel au règlement et retrait d'un quart de son indemnité parlementaire pour un mois.",
    eventDate: "2021-10-13",
    context: "Nicolas Dupont-Aignan a récusé le terme de « fraude », évoquant une « erreur » et un « quiproquo administratif » : il affirme avoir reçu une délégation de vote de José Évrard, mais qu'un document nécessaire à la procédure n'aurait pas été transmis à temps.",
    candidateResponse: null,
    candidateResponseSourceUrl: null,
    controversyStatus: "disputed",
    status: "published",
    sourceName: "LCP — Assemblée nationale",
    sourceUrl: "https://lcp.fr/actualites/nicolas-dupont-aignan-sanctionne-par-l-assemblee-le-depute-recuse-la-fraude-et-concede",
    sourceType: "media",
  },
  {
    candidateSlug: "david-lisnard",
    title: "Arrêté municipal interdisant le burkini sur les plages de Cannes",
    summary: "Le 28 juillet 2016, quelques jours après l'attentat de Nice, David Lisnard, maire de Cannes, a pris un arrêté municipal interdisant le port de tenues manifestant de façon ostensible une appartenance religieuse sur les plages de la commune — mesure connue sous le nom d'« arrêté anti-burkini ». Plusieurs arrêtés municipaux comparables ont été pris dans d'autres communes du littoral. Le Conseil d'État a jugé le 26 août 2016, sur un arrêté similaire de Villeneuve-Loubet, qu'une telle interdiction portait une atteinte grave et illégale aux libertés fondamentales ; l'arrêté cannois a ensuite été suspendu.",
    eventDate: "2016-07-28",
    context: "L'arrêté a été contesté en justice par le Collectif contre l'islamophobie en France (CCIF) et critiqué par SOS Racisme. David Lisnard l'a défendu au nom de l'ordre public dans le contexte des attentats de 2016 ; ses détracteurs y ont vu une stigmatisation des musulmans.",
    candidateResponse: null,
    candidateResponseSourceUrl: null,
    controversyStatus: "documented",
    status: "published",
    sourceName: "France 24",
    sourceUrl: "https://www.france24.com/fr/20160812-arrete-burkini-cannes-deux-associations-poursuivre-maire-cannes-justice-islam",
    sourceType: "media",
  },
  {
    candidateSlug: "bruno-retailleau",
    title: "Propos sur l'État de droit « ni intangible, ni sacré »",
    summary: "Dans un entretien au Journal du dimanche publié le 29 septembre 2024, alors ministre de l'Intérieur, Bruno Retailleau déclare : « L'État de droit, ça n'est pas intangible, ni sacré », ajoutant que « la source de l'État de droit, c'est la démocratie, c'est le peuple souverain ». La formule provoque une controverse politique et institutionnelle immédiate.",
    eventDate: "2024-09-29",
    context: "Parmi les réactions critiques : la présidente de l'Assemblée nationale Yaël Braun-Pivet, l'ancienne Première ministre Élisabeth Borne, le Syndicat de la magistrature et la Ligue des droits de l'Homme. Une motion de censure visant notamment ces propos a été déposée le 4 octobre 2024 par des députés du Nouveau Front populaire. Des parlementaires Les Républicains ont au contraire soutenu le ministre, affirmant qu'il évoquait « l'état du droit » et non « l'État de droit ».",
    candidateResponse: "Dans un communiqué publié le 1er octobre 2024, il dénonce de « faux débats » et affirme : « Bien sûr qu'il ne peut y avoir de démocratie sans État de droit. C'est là le fondement de notre République. »",
    candidateResponseSourceUrl: "https://www.franceinfo.fr/politique/bruno-retailleau-regrette-de-faux-debats-au-sujet-de-ses-propos-sur-l-etat-de-droit-fondement-de-notre-republique_6811960.html",
    controversyStatus: "disputed",
    status: "published",
    sourceName: "Franceinfo",
    sourceUrl: "https://www.franceinfo.fr/politique/gouvernement-de-michel-barnier/l-etat-de-droit-ca-n-est-pas-intangible-ni-sacre-pourquoi-les-propos-du-ministre-de-l-interieur-bruno-retailleau-font-polemique_6810349.html",
    sourceType: "media",
  },
  {
    candidateSlug: "fabien-roussel",
    title: "Débat à gauche après ses propos sur « un bon vin, une bonne viande »",
    summary: "En janvier 2022, pendant la campagne présidentielle, Fabien Roussel déclare qu'« un bon vin, une bonne viande, un bon fromage, c'est la gastronomie française » et défend l'accès de tous à une alimentation de qualité. La formule déclenche un débat au sein de la gauche sur l'articulation entre culture populaire, écologie et régimes alimentaires.",
    eventDate: null,
    context: "L'écologiste Sandrine Rousseau lui a notamment répondu que la gastronomie française inclut aussi « des raclettes suisses » et des sushis. Le directeur de campagne de Fabien Roussel a défendu des propos portant selon lui sur la hausse des salaires permettant d'accéder à une alimentation de qualité.",
    candidateResponse: null,
    candidateResponseSourceUrl: null,
    controversyStatus: "documented",
    status: "published",
    sourceName: "Slate.fr",
    sourceUrl: "https://www.slate.fr/politique/2022-la-fabrique-dune-election/episode-38-fabien-roussel-viande-argument-electoral-carnisme-salvini-trump-johnson",
    sourceType: "media",
  },
  {
    candidateSlug: "jean-luc-melenchon",
    title: "Qualification des attaques du 7 octobre 2023 et accusations d'antisémitisme",
    summary: "Le 7 octobre 2023, La France insoumise qualifie les attaques du Hamas contre Israël d'« offensive armée de forces palestiniennes » et estime qu'elles doivent être replacées « dans leur contexte », sans employer le terme d'attaque terroriste. La formulation, puis les prises de position de Jean-Luc Mélenchon dans les mois suivants — dont son refus de participer à la marche contre l'antisémitisme du 12 novembre 2023 — lui valent des accusations d'entretenir l'antisémitisme, qu'il conteste.",
    eventDate: "2023-10-07",
    context: "Le président du CRIF l'a qualifié d'« ennemi de la République » et sa position d'« abjecte ». Jean-Luc Mélenchon a justifié son absence à la marche du 12 novembre en la décrivant comme un rassemblement des « amis du soutien inconditionnel au massacre » à Gaza.",
    candidateResponse: "Il rappelle avoir appelé au cessez-le-feu dès le 7 octobre et affirme : « Nous n'avons jamais contesté le fait que des actes puissent être de nature terroriste. » Il maintient par ailleurs que l'action d'Israël à Gaza relève selon lui d'un « génocide » et non de la légitime défense.",
    candidateResponseSourceUrl: "https://www.franceinfo.fr/monde/proche-orient/israel-palestine/guerre-israel-hamas-jean-luc-melenchon-se-defend-face-aux-accusations-d-antisemitisme_6229194.html",
    controversyStatus: "disputed",
    // Volontairement non publiée : la qualification même des faits est
    // contestée et politiquement inflammable. C'est exactement le cas que le
    // circuit de validation humaine est censé arbitrer avant publication.
    status: "review_required",
    sourceName: "Franceinfo",
    sourceUrl: "https://www.franceinfo.fr/monde/proche-orient/israel-palestine/guerre-israel-hamas-jean-luc-melenchon-se-defend-face-aux-accusations-d-antisemitisme_6229194.html",
    sourceType: "media",
  },
];

export const candidateControversies: CandidateControversy[] = rawControversies.map((c, index) => {
  const candidate = candidates.find((cand) => cand.slug === c.candidateSlug)!;
  return {
    id: `candidate-controversy-${index + 1}`,
    candidate_id: candidate.id,
    title: c.title,
    summary: c.summary,
    event_date: c.eventDate,
    context: c.context,
    candidate_response: c.candidateResponse,
    candidate_response_source_url: c.candidateResponseSourceUrl,
    controversy_status: c.controversyStatus,
    last_updated: "2026-09-11",
    next_review_at: null,
    source_name: c.sourceName,
    source_url: c.sourceUrl,
    source_type: c.sourceType,
    status: c.status,
  };
});

// ---------------------------------------------------------------------------
// candidate_transparency_records — vide pour l'instant, voir note ci-dessus.
// ---------------------------------------------------------------------------
export const candidateTransparencyRecords: CandidateTransparencyRecord[] = [];
