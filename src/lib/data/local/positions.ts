import type { CandidatePosition } from "@/lib/types";
import { candidates } from "./candidates";

type Row = [
  candidateSlug: string,
  questionId: string,
  score: number | null,
  explanation: string | null,
];

// prettier-ignore
const rows: Row[] = [
  // Camille Martin — centre réformiste
  ["camille-martin", "q1", 1, "Un allongement progressif et négocié, avec des exceptions pour la pénibilité."],
  ["camille-martin", "q2", 1, "Favorable à des aménagements ciblés pour les carrières longues."],
  ["camille-martin", "q3", 1, "Priorité à la maîtrise de la dépense, sans coupe brutale."],
  ["camille-martin", "q4", 0, "Ouverte à des ajustements ciblés plutôt qu'une hausse générale."],
  ["camille-martin", "q5", 1, "Soutient une indexation partielle des prestations les plus sensibles à l'inflation."],
  ["camille-martin", "q6", 0, "Privilégie une gestion différenciée selon les filières économiques."],
  ["camille-martin", "q7", 1, "Favorable à des régularisations ciblées dans les métiers en tension."],
  ["camille-martin", "q8", 1, "Soutient un renforcement raisonné des effectifs de police de proximité."],
  ["camille-martin", "q9", 0, "Défend un équilibre entre sanction rapide et prévention."],
  ["camille-martin", "q10", 1, "Priorité budgétaire donnée à l'hôpital public dans son programme."],
  ["camille-martin", "q11", 0, "Ouverte à un rôle complémentaire du privé, sans le généraliser."],
  ["camille-martin", "q12", 1, "Favorable à davantage d'autonomie encadrée pour les établissements."],
  ["camille-martin", "q13", 1, "Propose une revalorisation progressive liée à des missions élargies."],
  ["camille-martin", "q14", 1, "Soutient un durcissement progressif accompagné des entreprises."],
  ["camille-martin", "q15", 0, "Défend un mix équilibré nucléaire / renouvelables."],
  ["camille-martin", "q16", 2, "Portage fort de l'intégration européenne comme axe central du programme."],
  ["camille-martin", "q17", -1, "Privilégie l'ancrage dans l'OTAN plutôt qu'une autonomie isolée."],
  ["camille-martin", "q18", 0, "Propose un encadrement ciblé plutôt que généralisé des loyers."],

  // Alexandre Leroy — droite conservatrice, souverainiste
  ["alexandre-leroy", "q1", 2, "Défend un report à 65 ans pour équilibrer durablement le système."],
  ["alexandre-leroy", "q2", -1, "Souhaite limiter les dérogations pour ne pas fragiliser l'équilibre financier."],
  ["alexandre-leroy", "q3", 2, "Priorité affichée à la baisse des dépenses et de la fiscalité de production."],
  ["alexandre-leroy", "q4", -2, "S'oppose à toute hausse de la fiscalité du capital et des entreprises."],
  ["alexandre-leroy", "q5", -1, "Privilégie la baisse des charges plutôt que l'indexation des prestations."],
  ["alexandre-leroy", "q6", 2, "Propose une réduction ferme des quotas d'immigration légale."],
  ["alexandre-leroy", "q7", -2, "S'oppose à toute forme de régularisation, y compris ciblée."],
  ["alexandre-leroy", "q8", 2, "Programme axé sur un renforcement massif des effectifs de sécurité."],
  ["alexandre-leroy", "q9", 2, "Défend des peines plus sévères et une exécution plus rapide."],
  ["alexandre-leroy", "q10", -1, "Priorise la réduction des déficits sur la hausse du budget hospitalier."],
  ["alexandre-leroy", "q11", 2, "Favorable à un rôle accru du secteur privé pour réduire les délais."],
  ["alexandre-leroy", "q12", 1, "Soutient une autonomie accrue des établissements."],
  ["alexandre-leroy", "q13", null, "Position non renseignée sur ce point précis à ce stade."],
  ["alexandre-leroy", "q14", -2, "Juge prioritaire de ne pas alourdir les normes pesant sur les entreprises."],
  ["alexandre-leroy", "q15", 2, "Défend une relance massive du programme nucléaire civil."],
  ["alexandre-leroy", "q16", -2, "S'oppose à tout nouveau transfert de souveraineté vers l'UE."],
  ["alexandre-leroy", "q17", 1, "Favorable à un renforcement de l'autonomie stratégique française."],
  ["alexandre-leroy", "q18", -2, "S'oppose à l'encadrement des loyers, jugé contre-productif."],

  // Sarah Moreau — écologiste de gauche
  ["sarah-moreau", "q1", -1, "S'oppose à un nouveau report et propose d'autres leviers de financement."],
  ["sarah-moreau", "q2", 2, "Défend l'élargissement des départs anticipés pour la pénibilité."],
  ["sarah-moreau", "q3", -2, "S'oppose à une baisse de la dépense publique dans son programme."],
  ["sarah-moreau", "q4", 2, "Propose une hausse ciblée de la fiscalité des grands patrimoines."],
  ["sarah-moreau", "q5", 2, "Défend une indexation systématique des prestations sur l'inflation."],
  ["sarah-moreau", "q6", -2, "Défend une politique migratoire plus ouverte et humaniste."],
  ["sarah-moreau", "q7", 2, "Propose une régularisation large dans les métiers en tension."],
  ["sarah-moreau", "q8", 0, "Soutient des moyens humains, en priorisant la police de proximité."],
  ["sarah-moreau", "q9", -1, "Priorise la prévention et les peines alternatives."],
  ["sarah-moreau", "q10", 2, "Fait de l'hôpital public une priorité budgétaire majeure."],
  ["sarah-moreau", "q11", -2, "S'oppose au développement de l'offre de soins privée lucrative."],
  ["sarah-moreau", "q12", -1, "Préfère un cadre national fort à une autonomie large des établissements."],
  ["sarah-moreau", "q13", 2, "Propose une revalorisation immédiate et significative des salaires."],
  ["sarah-moreau", "q14", 2, "Axe central du programme : durcissement des normes environnementales."],
  ["sarah-moreau", "q15", -2, "Priorité totale donnée aux énergies renouvelables."],
  ["sarah-moreau", "q16", 2, "Défend une intégration européenne renforcée, notamment sur le climat."],
  ["sarah-moreau", "q17", null, "Position non renseignée sur ce point précis à ce stade."],
  ["sarah-moreau", "q18", 1, "Favorable à un encadrement des loyers dans les zones tendues."],

  // Thomas Bernard — gauche sociale
  ["thomas-bernard", "q1", -2, "Propose un retour à 60 ans financé par d'autres recettes."],
  ["thomas-bernard", "q2", 2, "Défend un départ anticipé large pour la pénibilité et les carrières longues."],
  ["thomas-bernard", "q3", -2, "S'oppose fermement à toute baisse de la dépense publique."],
  ["thomas-bernard", "q4", 2, "Propose une hausse forte de la fiscalité des grandes entreprises et du capital."],
  ["thomas-bernard", "q5", 2, "Défend une indexation automatique des salaires et prestations."],
  ["thomas-bernard", "q6", -1, "Privilégie une politique migratoire fondée sur l'accueil et le droit d'asile."],
  ["thomas-bernard", "q7", 2, "Propose une régularisation large des travailleurs sans papiers."],
  ["thomas-bernard", "q8", 0, "Soutient les effectifs, en insistant sur la formation et la médiation."],
  ["thomas-bernard", "q9", -2, "Priorise fortement la prévention sur la répression."],
  ["thomas-bernard", "q10", 2, "Fait du service public hospitalier une priorité absolue de son programme."],
  ["thomas-bernard", "q11", -2, "S'oppose au développement du secteur privé lucratif en santé."],
  ["thomas-bernard", "q12", -2, "Défend un cadre national unifié plutôt qu'une autonomie des établissements."],
  ["thomas-bernard", "q13", 2, "Propose une revalorisation immédiate des salaires enseignants."],
  ["thomas-bernard", "q14", 1, "Favorable à un durcissement des normes, avec accompagnement des salariés."],
  ["thomas-bernard", "q15", -1, "Priorité aux renouvelables, sans fermer la porte au nucléaire existant."],
  ["thomas-bernard", "q16", -2, "Défend une ligne souverainiste de gauche, opposée à de nouveaux transferts."],
  ["thomas-bernard", "q17", 2, "Défend une sortie du commandement intégré de l'OTAN."],
  ["thomas-bernard", "q18", 2, "Propose un encadrement strict des loyers sur tout le territoire."],

  // Nina Laurent — centre-droit libéral
  ["nina-laurent", "q1", 2, "Défend un report progressif combiné à plus de flexibilité individuelle."],
  ["nina-laurent", "q2", -1, "Souhaite limiter les exceptions pour préserver l'équilibre du système."],
  ["nina-laurent", "q3", 2, "Priorité assumée à la baisse de la dépense publique et des impôts de production."],
  ["nina-laurent", "q4", -2, "S'oppose à une hausse de la fiscalité du capital, jugée contre-productive."],
  ["nina-laurent", "q5", -1, "Privilégie la baisse des charges à l'indexation des prestations."],
  ["nina-laurent", "q6", 1, "Favorable à une immigration choisie, davantage liée aux besoins économiques."],
  ["nina-laurent", "q7", null, "Position non renseignée sur ce point précis à ce stade."],
  ["nina-laurent", "q8", 1, "Soutient un renforcement ciblé des moyens de sécurité."],
  ["nina-laurent", "q9", 1, "Penche pour une réponse pénale plus ferme et plus rapide."],
  ["nina-laurent", "q10", -1, "Priorise la maîtrise budgétaire sur la hausse générale des dépenses de santé."],
  ["nina-laurent", "q11", 2, "Défend un rôle accru du secteur privé pour réduire les délais d'attente."],
  ["nina-laurent", "q12", 2, "Défend une autonomie large des établissements scolaires."],
  ["nina-laurent", "q13", 0, "Ouverte à une revalorisation ciblée liée à la performance."],
  ["nina-laurent", "q14", -1, "Souhaite concilier ambition environnementale et compétitivité des entreprises."],
  ["nina-laurent", "q15", 2, "Défend la relance du nucléaire comme priorité énergétique."],
  ["nina-laurent", "q16", 1, "Favorable à l'intégration du marché unique, plus réservée sur le reste."],
  ["nina-laurent", "q17", null, "Position non renseignée sur ce point précis à ce stade."],
  ["nina-laurent", "q18", -2, "S'oppose à l'encadrement des loyers, favorable à une régulation par l'offre."],
];

export const candidatePositions: CandidatePosition[] = rows.map(
  ([candidateSlug, questionId, score, explanation], index) => {
    const candidate = candidates.find((c) => c.slug === candidateSlug)!;
    return {
      id: `pos-${candidateSlug}-${questionId}-${index}`,
      candidate_id: candidate.id,
      question_id: questionId,
      score,
      explanation,
      source_url: score !== null ? "https://example.org/sources/programme-demo" : null,
    };
  }
);

export function getPositionsForCandidate(candidateId: string) {
  return candidatePositions.filter((p) => p.candidate_id === candidateId);
}
