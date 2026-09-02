import type { Proposal, ProposalStatus } from "@/lib/types";
import { candidates } from "./candidates";
import { getThemeBySlug } from "./themes";

interface Raw {
  candidateSlug: string;
  themeSlug: string;
  title: string;
  summary: string;
  description: string;
  status: ProposalStatus;
  publishedAt: string;
}

// prettier-ignore
const raw: Raw[] = [
  // Camille Martin
  { candidateSlug: "camille-martin", themeSlug: "economie", title: "Trajectoire de réduction du déficit sur 5 ans", summary: "Ramener le déficit public sous 3 % du PIB d'ici la fin du mandat.", description: "Plan de maîtrise progressive de la dépense publique, sans coupe brutale, combiné à une stabilisation de la fiscalité des entreprises.", status: "programme", publishedAt: "2026-09-01" },
  { candidateSlug: "camille-martin", themeSlug: "pouvoir-achat", title: "Indexation partielle des prestations sociales", summary: "Revaloriser chaque année les prestations les plus sensibles à l'inflation.", description: "Mécanisme d'indexation automatique ciblé sur les minima sociaux et les aides au logement.", status: "programme", publishedAt: "2026-08-15" },
  { candidateSlug: "camille-martin", themeSlug: "retraites", title: "Départ à 64 ans avec clause de pénibilité élargie", summary: "Maintenir l'âge légal à 64 ans en élargissant les critères de pénibilité.", description: "Conserver la borne d'âge actuelle tout en ouvrant de nouveaux critères de départ anticipé pour les métiers exposés.", status: "programme", publishedAt: "2026-07-20" },
  { candidateSlug: "camille-martin", themeSlug: "immigration", title: "Titres de séjour « métiers en tension »", summary: "Créer un titre de séjour dédié aux secteurs en tension de recrutement.", description: "Simplifier la régularisation temporaire dans le bâtiment, la restauration et l'aide à domicile, sous condition d'emploi.", status: "proposition_officielle", publishedAt: "2026-06-10" },
  { candidateSlug: "camille-martin", themeSlug: "securite", title: "10 000 policiers de proximité supplémentaires", summary: "Renforcer la présence policière de proximité sur cinq ans.", description: "Recrutement progressif d'effectifs affectés prioritairement aux quartiers en tension et aux zones rurales sous-dotées.", status: "programme", publishedAt: "2026-08-02" },
  { candidateSlug: "camille-martin", themeSlug: "sante", title: "Plan hôpital public 2027-2032", summary: "Sanctuariser le budget hospitalier et recruter des soignants.", description: "Augmentation progressive du budget des hôpitaux publics et revalorisation des carrières paramédicales.", status: "programme", publishedAt: "2026-05-18" },
  { candidateSlug: "camille-martin", themeSlug: "education", title: "Autonomie encadrée des établissements", summary: "Donner plus de marges de manœuvre pédagogique aux établissements.", description: "Extension des expérimentations pédagogiques locales sous contrôle d'un cadre national de résultats.", status: "programme", publishedAt: "2026-04-22" },
  { candidateSlug: "camille-martin", themeSlug: "ecologie", title: "Trajectoire carbone progressive pour l'industrie", summary: "Durcir les normes environnementales avec accompagnement financier.", description: "Calendrier de durcissement des normes couplé à un fonds de transition pour les PME industrielles.", status: "programme", publishedAt: "2026-03-30" },
  { candidateSlug: "camille-martin", themeSlug: "energie", title: "Mix énergétique équilibré nucléaire-renouvelables", summary: "Poursuivre le nucléaire existant tout en accélérant les renouvelables.", description: "Prolongation du parc nucléaire actuel et accélération de l'éolien en mer et du solaire.", status: "programme", publishedAt: "2026-02-14" },
  { candidateSlug: "camille-martin", themeSlug: "europe", title: "Union européenne de la défense et du climat", summary: "Renforcer l'intégration européenne sur la défense et le climat.", description: "Proposition de fonds européens communs pour la défense et la transition énergétique.", status: "proposition_officielle", publishedAt: "2026-01-25" },

  // Alexandre Leroy
  { candidateSlug: "alexandre-leroy", themeSlug: "economie", title: "Baisse de 20 % des impôts de production", summary: "Réduire fortement les impôts de production des entreprises.", description: "Suppression progressive de plusieurs impôts de production financée par une baisse de la dépense publique.", status: "programme", publishedAt: "2026-08-28" },
  { candidateSlug: "alexandre-leroy", themeSlug: "retraites", title: "Âge légal à 65 ans", summary: "Porter l'âge légal de départ à 65 ans dès le début du mandat.", description: "Réforme accélérée de l'âge légal pour rétablir l'équilibre financier du système de retraites.", status: "programme", publishedAt: "2026-07-11" },
  { candidateSlug: "alexandre-leroy", themeSlug: "immigration", title: "Réduction des quotas d'immigration légale", summary: "Fixer des quotas annuels d'immigration votés par le Parlement.", description: "Instauration de quotas annuels par filière, avec un objectif de réduction de moitié en cinq ans.", status: "proposition_officielle", publishedAt: "2026-06-05" },
  { candidateSlug: "alexandre-leroy", themeSlug: "securite", title: "Plan « tolérance zéro »", summary: "Doubler les effectifs de police dans les zones les plus touchées.", description: "Redéploiement massif d'effectifs et durcissement des peines pour les atteintes aux personnes et aux biens.", status: "programme", publishedAt: "2026-08-19" },
  { candidateSlug: "alexandre-leroy", themeSlug: "sante", title: "Partenariats public-privé hospitaliers", summary: "Développer des partenariats avec des cliniques privées.", description: "Ouverture de conventionnements pour réduire les délais d'attente sur les actes programmés.", status: "annonce", publishedAt: "2026-05-02" },
  { candidateSlug: "alexandre-leroy", themeSlug: "ecologie", title: "Moratoire sur les nouvelles normes environnementales", summary: "Geler toute nouvelle norme environnementale pesant sur les entreprises.", description: "Moratoire de deux ans sur les nouvelles réglementations environnementales nationales et un réexamen des normes existantes.", status: "annonce", publishedAt: "2026-04-14" },
  { candidateSlug: "alexandre-leroy", themeSlug: "energie", title: "Relance massive du nucléaire civil", summary: "Lancer la construction de nouveaux réacteurs EPR.", description: "Programme de construction accélérée de six nouveaux réacteurs et prolongation du parc existant.", status: "proposition_officielle", publishedAt: "2026-03-09" },
  { candidateSlug: "alexandre-leroy", themeSlug: "europe", title: "Renégociation des compétences européennes", summary: "Rapatrier certaines compétences nationales depuis Bruxelles.", description: "Renégociation des traités pour restreindre le champ des directives européennes sur l'agriculture et l'immigration.", status: "programme", publishedAt: "2026-02-20" },
  { candidateSlug: "alexandre-leroy", themeSlug: "international", title: "Révision du positionnement au sein de l'OTAN", summary: "Renforcer l'autonomie stratégique française au sein de l'Alliance.", description: "Proposition de renforcer les capacités de dissuasion nationale tout en restant membre de l'OTAN.", status: "precision_ulterieure", publishedAt: "2026-01-12" },
  { candidateSlug: "alexandre-leroy", themeSlug: "logement", title: "Suppression de l'encadrement des loyers", summary: "Mettre fin à l'encadrement des loyers dans les zones tendues.", description: "Remplacement de l'encadrement par des incitations fiscales à la construction pour augmenter l'offre.", status: "programme", publishedAt: "2025-12-18" },

  // Sarah Moreau
  { candidateSlug: "sarah-moreau", themeSlug: "economie", title: "Conditionnalité écologique et sociale des aides publiques", summary: "Conditionner les aides aux entreprises à des critères sociaux et environnementaux.", description: "Toute aide publique aux entreprises serait conditionnée à des engagements vérifiables en matière d'emploi et d'empreinte carbone.", status: "programme", publishedAt: "2026-08-25" },
  { candidateSlug: "sarah-moreau", themeSlug: "pouvoir-achat", title: "Indexation automatique des salaires et prestations", summary: "Indexer automatiquement le SMIC et les prestations sur l'inflation.", description: "Mécanisme légal de revalorisation automatique annuelle du SMIC et des principales prestations sociales.", status: "proposition_officielle", publishedAt: "2026-07-30" },
  { candidateSlug: "sarah-moreau", themeSlug: "retraites", title: "Financement des retraites par les revenus financiers", summary: "Élargir l'assiette de cotisation aux revenus financiers des entreprises.", description: "Nouvelle contribution des revenus financiers des grandes entreprises pour financer le système par répartition sans reculer l'âge légal.", status: "programme", publishedAt: "2026-06-22" },
  { candidateSlug: "sarah-moreau", themeSlug: "immigration", title: "Régularisation par le travail élargie", summary: "Faciliter la régularisation des travailleurs sans papiers en emploi.", description: "Procédure administrative simplifiée pour les travailleurs occupant un emploi depuis plus d'un an dans un secteur en tension.", status: "programme", publishedAt: "2026-05-14" },
  { candidateSlug: "sarah-moreau", themeSlug: "sante", title: "Recrutement massif dans l'hôpital public", summary: "Recruter 50 000 soignants supplémentaires sur le quinquennat.", description: "Plan de recrutement et de revalorisation salariale pour mettre fin aux fermetures de lits faute de personnel.", status: "proposition_officielle", publishedAt: "2026-08-08" },
  { candidateSlug: "sarah-moreau", themeSlug: "education", title: "Revalorisation immédiate des enseignants", summary: "Augmenter les salaires des enseignants dès la rentrée suivante.", description: "Revalorisation salariale financée par une réforme de la fiscalité du patrimoine, sans contrepartie de temps de travail.", status: "programme", publishedAt: "2026-04-11" },
  { candidateSlug: "sarah-moreau", themeSlug: "ecologie", title: "Loi de programmation climatique contraignante", summary: "Inscrire des objectifs climatiques contraignants dans la loi.", description: "Fixation d'objectifs sectoriels contraignants de réduction des émissions avec sanctions en cas de non-respect.", status: "proposition_officielle", publishedAt: "2026-03-19" },
  { candidateSlug: "sarah-moreau", themeSlug: "energie", title: "Sortie progressive du nucléaire", summary: "Réduire la part du nucléaire au profit des renouvelables.", description: "Plan de fermeture progressive des réacteurs les plus anciens, compensée par un développement accéléré du solaire et de l'éolien.", status: "programme", publishedAt: "2026-02-27" },
  { candidateSlug: "sarah-moreau", themeSlug: "europe", title: "Green Deal européen renforcé", summary: "Porter un renforcement du pacte vert européen.", description: "Proposition d'un budget européen dédié à la transition énergétique et à la protection de la biodiversité.", status: "programme", publishedAt: "2026-01-30" },
  { candidateSlug: "sarah-moreau", themeSlug: "logement", title: "Encadrement des loyers généralisé", summary: "Étendre l'encadrement des loyers à toutes les zones tendues.", description: "Généralisation du dispositif d'encadrement des loyers avec sanctions renforcées en cas de dépassement.", status: "programme", publishedAt: "2025-12-05" },

  // Thomas Bernard
  { candidateSlug: "thomas-bernard", themeSlug: "economie", title: "Plan de relance par la demande", summary: "Relancer l'économie par la hausse des salaires et de l'investissement public.", description: "Augmentation des dépenses publiques d'investissement financée par une réforme de la fiscalité du capital.", status: "programme", publishedAt: "2026-08-21" },
  { candidateSlug: "thomas-bernard", themeSlug: "pouvoir-achat", title: "Hausse du SMIC à 1600 € net", summary: "Porter le SMIC net à 1600 € dès le début du mandat.", description: "Revalorisation immédiate du salaire minimum accompagnée d'un encadrement des marges de la grande distribution.", status: "proposition_officielle", publishedAt: "2026-07-15" },
  { candidateSlug: "thomas-bernard", themeSlug: "retraites", title: "Retour de la retraite à 60 ans", summary: "Rétablir l'âge légal de départ à 60 ans.", description: "Retour à 60 ans financé par une hausse des cotisations patronales et la taxation des revenus financiers.", status: "proposition_officielle", publishedAt: "2026-06-18" },
  { candidateSlug: "thomas-bernard", themeSlug: "immigration", title: "Régularisation par le travail et titre pluriannuel", summary: "Créer un titre de séjour pluriannuel pour les travailleurs sans papiers.", description: "Régularisation facilitée et sécurisée sur plusieurs années pour les travailleurs occupant un emploi stable.", status: "programme", publishedAt: "2026-05-09" },
  { candidateSlug: "thomas-bernard", themeSlug: "securite", title: "Police de proximité et médiation sociale", summary: "Recréer une police de proximité articulée avec la médiation sociale.", description: "Redéploiement des effectifs vers la proximité et création de postes de médiateurs sociaux dans les quartiers.", status: "programme", publishedAt: "2026-08-11" },
  { candidateSlug: "thomas-bernard", themeSlug: "sante", title: "Interdiction des dépassements d'honoraires", summary: "Interdire les dépassements d'honoraires dans le secteur public.", description: "Suppression progressive des dépassements d'honoraires et renforcement du financement de l'hôpital public.", status: "programme", publishedAt: "2026-04-26" },
  { candidateSlug: "thomas-bernard", themeSlug: "education", title: "Recrutement massif d'enseignants titulaires", summary: "Mettre fin au recours aux contractuels dans l'Éducation nationale.", description: "Plan pluriannuel de recrutement de titulaires pour supprimer le recours structurel aux contractuels non formés.", status: "programme", publishedAt: "2026-03-15" },
  { candidateSlug: "thomas-bernard", themeSlug: "ecologie", title: "Planification écologique par filière", summary: "Décliner la transition écologique filière par filière avec l'État actionnaire.", description: "L'État prendrait des participations dans les filières stratégiques pour piloter directement leur décarbonation.", status: "programme", publishedAt: "2026-02-08" },
  { candidateSlug: "thomas-bernard", themeSlug: "international", title: "Sortie du commandement intégré de l'OTAN", summary: "Sortir la France du commandement militaire intégré de l'OTAN.", description: "Retour à une posture d'indépendance stratégique inspirée de la position française d'avant 2009.", status: "proposition_officielle", publishedAt: "2026-01-16" },
  { candidateSlug: "thomas-bernard", themeSlug: "logement", title: "Encadrement strict des loyers et réquisitions", summary: "Encadrer strictement les loyers et réquisitionner les logements vacants.", description: "Extension du contrôle des loyers à tout le territoire et réquisition des logements vacants depuis plus de deux ans.", status: "programme", publishedAt: "2025-12-20" },

  // Nina Laurent
  { candidateSlug: "nina-laurent", themeSlug: "economie", title: "Choc de simplification pour les entreprises", summary: "Supprimer 30 % des normes administratives pesant sur les entreprises.", description: "Programme de simplification administrative et de baisse ciblée des impôts de production pour restaurer la compétitivité.", status: "programme", publishedAt: "2026-08-30" },
  { candidateSlug: "nina-laurent", themeSlug: "pouvoir-achat", title: "Baisse des charges plutôt que des aides", summary: "Réduire les charges sur les bas salaires plutôt qu'augmenter les aides.", description: "Baisse ciblée des cotisations sociales sur les salaires proches du SMIC pour augmenter le salaire net sans alourdir le coût du travail.", status: "programme", publishedAt: "2026-07-24" },
  { candidateSlug: "nina-laurent", themeSlug: "retraites", title: "Retraite à points et liberté de départ", summary: "Instaurer un système à points avec liberté de choix de l'âge de départ.", description: "Passage progressif à un régime à points permettant à chacun de choisir son âge de départ selon ses droits accumulés.", status: "programme", publishedAt: "2026-06-27" },
  { candidateSlug: "nina-laurent", themeSlug: "securite", title: "Vidéoprotection et cyber-sécurité renforcées", summary: "Doubler les capacités de vidéoprotection dans les grandes villes.", description: "Investissement dans la vidéoprotection intelligente et création d'une unité dédiée à la cybercriminalité.", status: "programme", publishedAt: "2026-08-16" },
  { candidateSlug: "nina-laurent", themeSlug: "sante", title: "Ouverture du conventionnement au secteur privé", summary: "Élargir le conventionnement des cliniques privées pour réduire les délais.", description: "Extension des conventionnements avec le secteur privé pour absorber les listes d'attente sur les actes programmés.", status: "programme", publishedAt: "2026-05-06" },
  { candidateSlug: "nina-laurent", themeSlug: "education", title: "Établissements autonomes sous contrat d'objectifs", summary: "Généraliser l'autonomie de gestion des établissements scolaires.", description: "Chaque établissement gérerait une part de son budget et de son recrutement sous un contrat d'objectifs national.", status: "programme", publishedAt: "2026-04-01" },
  { candidateSlug: "nina-laurent", themeSlug: "ecologie", title: "Marché carbone plutôt que normes", summary: "Privilégier les incitations de marché aux normes contraignantes.", description: "Extension du marché carbone européen plutôt que la multiplication de normes sectorielles nationales.", status: "programme", publishedAt: "2026-03-05" },
  { candidateSlug: "nina-laurent", themeSlug: "energie", title: "Relance du nucléaire et simplification des autorisations", summary: "Accélérer les autorisations pour la construction de nouveaux réacteurs.", description: "Simplification des procédures administratives pour réduire les délais de construction des nouveaux réacteurs nucléaires.", status: "programme", publishedAt: "2026-02-11" },
  { candidateSlug: "nina-laurent", themeSlug: "europe", title: "Approfondissement du marché unique", summary: "Approfondir le marché unique européen pour les services et le numérique.", description: "Priorité donnée à l'intégration économique européenne plutôt qu'à de nouveaux transferts de compétences politiques.", status: "programme", publishedAt: "2026-01-20" },
  { candidateSlug: "nina-laurent", themeSlug: "international", title: "Renforcement des partenariats commerciaux", summary: "Diversifier les partenariats commerciaux stratégiques de la France.", description: "Négociation de nouveaux accords commerciaux bilatéraux pour réduire la dépendance à certains fournisseurs critiques.", status: "annonce", publishedAt: "2025-12-28" },
];

export const proposals: Proposal[] = raw.map((r, index) => {
  const candidate = candidates.find((c) => c.slug === r.candidateSlug)!;
  const theme = getThemeBySlug(r.themeSlug)!;
  return {
    id: `proposal-${index + 1}`,
    candidate_id: candidate.id,
    theme_id: theme.id,
    theme,
    title: r.title,
    summary: r.summary,
    description: r.description,
    source_name: "Programme de campagne (démonstration)",
    source_url: "https://example.org/sources/programme-demo",
    published_at: r.publishedAt,
    verified_at: r.publishedAt,
    status: r.status,
  };
});

export function getProposalsForCandidate(candidateId: string) {
  return proposals.filter((p) => p.candidate_id === candidateId);
}
