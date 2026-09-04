import type { CandidatePosition } from "@/lib/types";
import { candidates } from "./candidates";

type Row = [
  candidateSlug: string,
  questionId: string,
  score: number,
  explanation: string,
  sourceUrl: string,
];

/**
 * Each row is derived from one of the sourced proposals in proposals.ts —
 * never guessed. A question is simply absent for a candidate when no
 * sourced proposal answers it clearly; the Match then excludes that
 * question for that candidate rather than assuming a position (see
 * /methodologie). Explanations paraphrase the sourced proposal; consult the
 * source_url (also shown on the candidate's page) for the original.
 */
// prettier-ignore
const rows: Row[] = [
  // Jean-Luc Mélenchon
  ["jean-luc-melenchon", "q1", -2, "Propose d'abroger la réforme de 2023 et de revenir à un départ à 60 ans.", "https://melenchon2027.fr/programme2025/livre/chapitre8/s8/"],
  ["jean-luc-melenchon", "q2", 2, "Propose un départ à 60 ans pour toute carrière complète, avec prise en compte de la pénibilité.", "https://melenchon2027.fr/programme2025/livre/chapitre8/s8/"],
  ["jean-luc-melenchon", "q3", -2, "Son programme d'« urgence sociale » prévoit une hausse des dépenses sociales, pas une baisse de la dépense publique.", "https://melenchon2027.fr/programme2025/livre/chapitre9/s1/"],
  ["jean-luc-melenchon", "q5", 2, "Propose une hausse immédiate du SMIC et des minima sociaux et un blocage des prix de première nécessité.", "https://melenchon2027.fr/programme2025/livre/chapitre9/s1/"],
  ["jean-luc-melenchon", "q6", -2, "Son programme migratoire vise à faciliter l'accès aux visas et à suspendre le règlement de Dublin, pas à réduire l'immigration légale.", "https://melenchon2027.fr/programme2025/livre/chapitre16/s7/"],
  ["jean-luc-melenchon", "q7", 2, "Propose de régulariser les travailleurs, étudiants et parents d'enfants scolarisés sans papiers.", "https://melenchon2027.fr/programme2025/livre/chapitre16/s7/"],
  ["jean-luc-melenchon", "q9", -2, "Sa réforme policière privilégie la formation et interdit plusieurs techniques et armes jugées dangereuses, plutôt que le durcissement pénal.", "https://melenchon2027.fr/programme2025/livre/chapitre4/s3/"],
  ["jean-luc-melenchon", "q10", 2, "Propose un plan pluriannuel de recrutement de soignants pour l'hôpital public.", "https://melenchon2027.fr/programme2025/livre/chapitre15/s2/"],
  ["jean-luc-melenchon", "q11", -2, "Son programme vise un système à 100 % Sécurité sociale plutôt qu'un développement de l'offre privée.", "https://melenchon2027.fr/programme2025/livre/chapitre15/s2/"],
  ["jean-luc-melenchon", "q13", 2, "Propose une revalorisation salariale des enseignants dans le cadre de sa réforme de l'école.", "https://melenchon2027.fr/programme2025/livre/chapitre5/s3/"],
  ["jean-luc-melenchon", "q14", 2, "Son plan « 100 % renouvelables d'ici 2050 » implique un durcissement assumé des normes environnementales.", "https://melenchon2027.fr/programme2025/livre/chapitre13/s3/"],
  ["jean-luc-melenchon", "q15", -2, "Propose une sortie planifiée du nucléaire au profit des énergies renouvelables.", "https://melenchon2027.fr/programme2025/livre/chapitre13/s3/"],
  ["jean-luc-melenchon", "q16", -2, "Défend une désobéissance aux traités européens et une récupération de la souveraineté budgétaire nationale.", "https://melenchon2027.fr/programme2025/livre/chapitre17/"],
  ["jean-luc-melenchon", "q18", 2, "Propose d'encadrer les loyers sur tout le territoire, en complément de la construction de logements publics.", "https://melenchon2027.fr/programme2025/livre/chapitre7/s5/"],

  // François Ruffin
  ["francois-ruffin", "q2", 2, "Propose un départ à la retraite anticipé pour les métiers pénibles.", "https://actu.orange.fr/france/presidentielle-2027-francois-ruffin-lance-sa-campagne-en-se-posant-en-defenseur-des-travailleurs-essentiels-magic-CNT000002oTqjw.html"],
  ["francois-ruffin", "q5", 2, "Propose une indexation stricte des bas salaires sur l'inflation, avec un SMIC porté à 1 700 € nets.", "https://actu.orange.fr/france/presidentielle-2027-francois-ruffin-lance-sa-campagne-en-se-posant-en-defenseur-des-travailleurs-essentiels-magic-CNT000002oTqjw.html"],
  ["francois-ruffin", "q6", 1, "Se déclare hostile à l'immigration de travail, en particulier dans les services et la santé.", "https://www.lejdd.fr/politique/presidentielle-2027-francois-ruffin-se-dit-hostile-a-limmigration-de-travail-172605"],
  ["francois-ruffin", "q7", -2, "S'oppose à l'immigration de travail comme réponse aux métiers en tension, plaidant pour revaloriser ces métiers afin d'attirer une main-d'œuvre locale.", "https://www.lejdd.fr/politique/presidentielle-2027-francois-ruffin-se-dit-hostile-a-limmigration-de-travail-172605"],
  ["francois-ruffin", "q14", 2, "Défend une « économie de guerre climatique » avec un investissement massif pour la rénovation thermique.", "https://vert.eco/articles/francois-ruffin-il-nous-faut-une-economie-de-guerre-climatique"],
  ["francois-ruffin", "q15", -1, "Souhaite orienter la recherche publique vers les énergies renouvelables, sans trancher unilatéralement sur le nucléaire.", "https://vert.eco/articles/francois-ruffin-il-nous-faut-une-economie-de-guerre-climatique"],

  // Marine Tondelier
  ["marine-tondelier", "q1", -2, "S'oppose à la réforme portant l'âge légal de départ de 62 à 64 ans.", "https://www.publicsenat.fr/actualites/politique/mobilisation-contre-la-reforme-des-retraites-pour-marine-tondelier-eelv-une"],
  ["marine-tondelier", "q5", 1, "Défend une revalorisation du SMIC à 2 000 € brut, présentée comme un enjeu de pouvoir d'achat.", "https://www.france24.com/fr/france/20260827-premier-d%C3%A9bat-de-la-pr%C3%A9sidentielle-2027-les-principales-propositions-des-candidats"],
  ["marine-tondelier", "q6", -2, "Réfute tout lien entre immigration et délinquance et pointe la précarité comme facteur explicatif, plutôt que l'immigration elle-même.", "https://www.lejdd.fr/politique/pas-de-lien-entre-immigration-et-delinquance-vif-echange-entre-marine-tondelier-et-marion-marechal-165165"],
  ["marine-tondelier", "q17", -1, "Son soutien à l'Ukraine et sa méfiance envers la Russie s'inscrivent dans le cadre de la coopération de sécurité occidentale existante.", "https://www.franceinfo.fr/politique/guerre-en-ukraine-on-ne-peut-pas-faire-confiance-a-poutine-estime-marine-tondelier_7125150.html"],
  ["marine-tondelier", "q18", 2, "Réclame un encadrement strict des loyers, avec une baisse de 30 % pour les logements énergivores reloués.", "https://www.connaissancedesenergies.org/afp/location-de-passoires-energetiques-marine-tondelier-plaide-pour-des-loyers-30-moins-chers-260426"],

  // Raphaël Glucksmann
  ["raphael-glucksmann", "q1", 0, "Propose de moduler l'âge de départ selon la pénibilité et l'espérance de vie en bonne santé, plutôt qu'un relèvement ou un retour uniforme.", "https://www.publicsenat.fr/actualites/politique/fiscalite-ecole-immigration-ce-que-propose-raphael-glucksmann"],
  ["raphael-glucksmann", "q2", 2, "Propose un départ plus précoce pour les carrières hachées et les métiers pénibles à espérance de vie réduite.", "https://www.publicsenat.fr/actualites/politique/fiscalite-ecole-immigration-ce-que-propose-raphael-glucksmann"],
  ["raphael-glucksmann", "q5", 1, "Propose de baisser les prélèvements sociaux sur les salaires nets, financé par une taxe sur les très gros héritages.", "https://www.publicsenat.fr/actualites/politique/fiscalite-ecole-immigration-ce-que-propose-raphael-glucksmann"],
  ["raphael-glucksmann", "q6", -2, "Rejette l'idée d'une « immigration zéro » et propose une convention citoyenne plutôt qu'une réduction des niveaux d'immigration.", "https://www.publicsenat.fr/actualites/politique/fiscalite-ecole-immigration-ce-que-propose-raphael-glucksmann"],
  ["raphael-glucksmann", "q13", 2, "Priorité affichée à la hausse de la rémunération des enseignants dans son plan pour l'école.", "https://www.publicsenat.fr/actualites/politique/fiscalite-ecole-immigration-ce-que-propose-raphael-glucksmann"],
  ["raphael-glucksmann", "q16", 2, "Propose de supprimer le droit de veto national dans certaines décisions du Conseil européen.", "https://lcp.fr/actualites/presidentielle-raphael-glucksmann-devoile-les-premieres-lignes-de-son-possible-programme"],

  // Gabriel Attal
  ["gabriel-attal", "q1", 1, "Propose de remplacer l'âge légal fixe par la seule durée de cotisation, ce qui tend à repousser l'âge effectif de départ.", "https://placement.meilleurtaux.com/retraite/actualites/2026-mai/plan-de-gabriel-attal-retraites-supprimer-age-legal-instaurer-place-modele-hybride.html"],
  ["gabriel-attal", "q3", 2, "Son plan de 120 à 150 milliards d'euros d'économies vise le retour à l'équilibre budgétaire avant toute nouvelle mesure fiscale.", "https://www.lejdd.fr/politique/presidentielle-le-plan-de-gabriel-attal-pour-redresser-les-finances-publiques-177987"],
  ["gabriel-attal", "q6", 1, "Propose des quotas migratoires votés par le Parlement selon le slogan « accueillir moins pour accueillir mieux », tout en excluant une immigration zéro.", "https://www.lejdd.fr/politique/immigration-gabriel-attal-propose-des-quotas-par-metier-et-par-origine-geographique-180879"],
  ["gabriel-attal", "q13", 2, "Propose une revalorisation salariale des enseignants de 200 à 500 € nets par mois.", "https://lcp.fr/actualites/presidentielle-retour-du-certificat-d-etudes-revalorisation-des-salaires-ce-que-propose"],
  ["gabriel-attal", "q14", 0, "Son « écologie du contrat » maintient les ZFE mais privilégie la négociation à la contrainte réglementaire.", "https://presseagence.fr/strasbourg-gabriel-attal-une-nouvelle-donne-economique-et-climatique-pour-la-france/"],
  ["gabriel-attal", "q15", 0, "Défend un mix équilibré nucléaire-renouvelables pour la souveraineté énergétique.", "https://presseagence.fr/strasbourg-gabriel-attal-une-nouvelle-donne-economique-et-climatique-pour-la-france/"],

  // Édouard Philippe
  ["edouard-philippe", "q1", 2, "Plaide pour poursuivre le relèvement de l'âge légal au-delà des 64 ans, potentiellement à 65-67 ans.", "https://www.boursorama.com/epargne/retraite/actualites/reforme-des-retraites-les-propositions-d-edouard-philippe-aux-partenaires-sociaux-696742779bab5b90918b3b69dc9b1a02"],
  ["edouard-philippe", "q6", 1, "Propose des quotas annuels d'immigration de travail votés par le Parlement et un durcissement du regroupement familial.", "https://www.europe1.fr/politique/immigration-edouard-philippe-confirme-linstauration-dobjectifs-qualitatifs-ou-de-quotas-3929658"],
  ["edouard-philippe", "q12", 1, "Souhaite donner aux chefs d'établissement « les moyens d'être des patrons », impliquant davantage d'autonomie.", "https://www.timefrance.fr/politique/presidentielle-2027-edouard-philippe-entre-en-campagne-et-place-lecole-au-coeur-de-ses-priorites/"],
  ["edouard-philippe", "q13", 2, "Propose une hausse de 20 % de la rémunération moyenne des enseignants sur un quinquennat.", "https://www.franceinfo.fr/elections/presidentielle/presidentielle-2027-le-candidat-horizons-edouard-philippe-veut-augmenter-de-20-la-remuneration-moyenne-des-enseignants-sur-un-quinquennat_8159927.html"],
  ["edouard-philippe", "q15", 0, "Promet « plus de nucléaire, plus de renouvelables », sans opposer les deux filières.", "https://x.com/EPhilippe_LH/status/2044857410607583437"],
  ["edouard-philippe", "q18", -2, "S'est prononcé contre l'encadrement des loyers devant le congrès de la Fnaim.", "https://www.immomatin.com/franchise/reseaux-franchise/renforcer-le-droit-du-proprietaire-pour-fluidifier-le-marche-edouard-philippe-congres-fnaim-2025.html"],

  // Bruno Retailleau
  ["bruno-retailleau", "q1", 2, "Propose d'indexer progressivement l'âge de départ sur l'espérance de vie, ce qui tend à le relever dans la durée.", "https://www.franceinfo.fr/elections/presidentielle/dette-publique-retraites-reindustrialisation-ce-qu-il-faut-retenir-du-premier-debat-des-principaux-candidats-a-la-presidentielle_8165342.html"],
  ["bruno-retailleau", "q3", 2, "S'engage sur 120 milliards d'euros d'économies budgétaires d'ici 2032 comme préalable à toute baisse d'impôts.", "https://contrepoints.org/flat-tax-aides-aux-entreprises-assurances-sociales-calendrier-des-reformes-bruno-retailleau-repond-a-nos-questions/"],
  ["bruno-retailleau", "q5", -1, "Son plan « Travail gagnant » conditionne les aides sociales à une activité et plafonne leur cumul à 70 % du SMIC, plutôt que de les indexer.", "https://fr.finance.yahoo.com/actualites/travail-gagnant-propositions-chocs-bruno-182132757.html"],
  ["bruno-retailleau", "q6", 2, "Propose une révision constitutionnelle par référendum pour durcir significativement le cadre de l'immigration.", "https://www.epochtimes.fr/presidentielle-bruno-retailleau-veut-donner-le-dernier-mot-aux-francais-par-referendum-3339141.html"],
  ["bruno-retailleau", "q7", -2, "Sa révision constitutionnelle vise un durcissement global de l'immigration, non une facilitation des régularisations.", "https://www.epochtimes.fr/presidentielle-bruno-retailleau-veut-donner-le-dernier-mot-aux-francais-par-referendum-3339141.html"],
  ["bruno-retailleau", "q8", 2, "En tant que ministre de l'Intérieur, a annoncé un renforcement des effectifs à Marseille et une cellule nationale contre le narcotrafic.", "https://www.franceinfo.fr/societe/drogue/direct-lutte-contre-le-narcotrafic-les-ministres-bruno-retailleau-et-didier-migaud-a-marseille-pour-annoncer-des-mesures_6884903.html"],
  ["bruno-retailleau", "q9", 2, "Son plan pénal prévoit saisies administratives, expulsions et coordination judiciaire renforcée contre la criminalité organisée.", "https://www.franceinfo.fr/societe/drogue/direct-lutte-contre-le-narcotrafic-les-ministres-bruno-retailleau-et-didier-migaud-a-marseille-pour-annoncer-des-mesures_6884903.html"],
  ["bruno-retailleau", "q12", 2, "Propose la création de 1 000 écoles publiques « libres » disposant d'une autonomie accrue.", "https://www.publicsenat.fr/actualites/politique/presidentielle-2027-bruno-retailleau-veut-refonder-lecole-autour-de-quatre-axes-principaux"],
  ["bruno-retailleau", "q13", 2, "Propose une revalorisation salariale des enseignants pour se rapprocher de la moyenne européenne.", "https://www.publicsenat.fr/actualites/politique/presidentielle-2027-bruno-retailleau-veut-refonder-lecole-autour-de-quatre-axes-principaux"],
  ["bruno-retailleau", "q14", -2, "Défend une « écologie de l'adaptation » plutôt qu'un durcissement des normes environnementales, jugé « punitif ».", "https://republicains.fr/actualites/2026/08/09/face-au-rechauffement-climatique-adapter-la-france-plutot-que-punir/"],
  ["bruno-retailleau", "q15", 2, "Appelle à mettre fin aux subventions à l'éolien et au photovoltaïque et à reconstruire un parc nucléaire.", "https://www.publicsenat.fr/actualites/politique/fin-des-subventions-aux-eoliennes-et-au-photovoltaique-la-tribune-de-bruno-retailleau-met-le-socle-commun-en-surchauffe"],
  ["bruno-retailleau", "q16", -2, "Propose de réserver la libre circulation Schengen aux ressortissants européens, plutôt que d'élargir les compétences de l'UE.", "https://republicains.fr/actualites/2026/08/02/lespace-schengen-doit-etre-reserve-aux-europeens/"],
  ["bruno-retailleau", "q18", -2, "Son plan logement prévoit la fin de l'encadrement des loyers et des interdictions liées au DPE.", "https://www.journaldelagence.com/1411841-presidentielle-2027-les-propositions-de-bruno-retailleau-pour-relancer-le-logement"],

  // Xavier Bertrand
  ["xavier-bertrand", "q4", 1, "Propose de taxer plus fortement les géants du numérique (GAFA) pour financer une baisse des charges et impôts des Français.", "https://www.ici.fr/infos/politique/xavier-bertrand-invite-de-dimanche-en-politique-1547295534"],
  ["xavier-bertrand", "q6", 2, "Propose des quotas migratoires annuels votés par le Parlement et la fin des régularisations.", "https://www.europe1.fr/politique/xavier-bertrand-devoile-ses-propositions-pour-reprendre-le-controle-de-limmigration-4075260"],
  ["xavier-bertrand", "q7", -2, "Propose la fin des régularisations dans le cadre de son plan de reprise en main de l'immigration.", "https://www.europe1.fr/politique/xavier-bertrand-devoile-ses-propositions-pour-reprendre-le-controle-de-limmigration-4075260"],
  ["xavier-bertrand", "q9", 2, "Propose des peines automatiques et plancher, ainsi qu'un abaissement de la majorité pénale à 15 ans.", "https://www.publicsenat.fr/actualites/politique/apres-le-beauvau-de-la-securite-xavier-bertrand-repond-a-emmanuel-macron-en"],
  ["xavier-bertrand", "q15", 2, "Refuse de réduire la part du nucléaire à 50 % et défend la construction de nouveaux réacteurs.", "https://www.franceinfo.fr/environnement/energie/video-energie-je-ne-descendrai-pas-la-part-du-nucleaire-a-50-assure-xavier-bertrand_4794405.html"],

  // Marine Le Pen
  ["marine-le-pen", "q1", -2, "Défend un retour à la retraite à 62 ans, voire 60 ans pour les carrières longues.", "https://www.publicsenat.fr/actualites/politique/au-rn-la-reforme-des-retraites-divise-jordan-bardella-et-marine-le-pen-sur-le-programme-pour-la-presidentielle-2027"],
  ["marine-le-pen", "q2", 2, "Propose un départ à 60 ans pour les carrières longues.", "https://www.publicsenat.fr/actualites/politique/au-rn-la-reforme-des-retraites-divise-jordan-bardella-et-marine-le-pen-sur-le-programme-pour-la-presidentielle-2027"],
  ["marine-le-pen", "q5", 1, "Propose de baisser la TVA de 20 % à 5,5 % sur l'énergie pour créer un « choc de pouvoir d'achat ».", "https://www.cnews.fr/france/2025-10-21/abaissement-de-la-tva-55-quels-produits-sont-concernes-par-lamendement-depose-par"],
  ["marine-le-pen", "q6", 2, "Son projet de référendum « C2i » vise une réduction significative de l'immigration et la fin du regroupement familial.", "https://www.publicsenat.fr/actualites/politique/immigration-le-referendum-voulu-par-marine-le-pen-est-il-constitutionnel-190598"],
  ["marine-le-pen", "q7", -2, "Son projet « C2i » prévoit l'interdiction de toute régularisation.", "https://www.publicsenat.fr/actualites/politique/immigration-le-referendum-voulu-par-marine-le-pen-est-il-constitutionnel-190598"],
  ["marine-le-pen", "q10", 2, "Propose un moratoire sur la fermeture de lits d'hôpitaux publics et une enveloppe pour les salaires des soignants.", "https://rassemblementnational.fr/discours/sante-protegeons-les-francais-discours-de-marine-le-pen"],
  ["marine-le-pen", "q15", 2, "Propose un moratoire sur l'éolien et défend le nucléaire comme pilier de la politique énergétique.", "https://www.tucoenergie.fr/blog/marine-le-pen-bfmtv"],
];

export const candidatePositions: CandidatePosition[] = rows.map(
  ([candidateSlug, questionId, score, explanation, sourceUrl], index) => {
    const candidate = candidates.find((c) => c.slug === candidateSlug)!;
    return {
      id: `pos-${candidateSlug}-${questionId}-${index}`,
      candidate_id: candidate.id,
      question_id: questionId,
      score,
      explanation,
      source_url: sourceUrl,
    };
  }
);

export function getPositionsForCandidate(candidateId: string) {
  return candidatePositions.filter((p) => p.candidate_id === candidateId);
}
