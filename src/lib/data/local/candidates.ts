import type { Candidate } from "@/lib/types";
import { activeElection } from "./elections";

/**
 * The main declared candidates to the 2027 French presidential election, as
 * of September 2026. This list is necessarily a snapshot: candidacies keep
 * being announced and the field (already 25+ names) will keep changing
 * until the Conseil constitutionnel publishes the official list shortly
 * before the first round. Biographical facts below are sourced from
 * Wikipedia, the Assemblée nationale/Sénat, and mainstream French press —
 * see each candidate's proposals for individually sourced policy positions.
 */
export const candidates: Candidate[] = [
  {
    id: "candidate-jean-luc-melenchon",
    slug: "jean-luc-melenchon",
    name: "Jean-Luc Mélenchon",
    photo_url: "/candidates/jean-luc-melenchon.jpg",
    party_id: "party-lfi",
    biography:
      "Né le 19 août 1951 à Tanger, Jean-Luc Mélenchon est ancien sénateur (1986-2009) et ministre de l'Enseignement professionnel (2000-2002). Fondateur de La France insoumise en 2016, il a été candidat à la présidentielle en 2012, 2017 et 2022 et député des Bouches-du-Rhône de 2017 à 2022.",
    official_website: "https://melenchon2027.fr/",
    election_id: activeElection.id,
    is_demo: false,
    birth_date: "1951-08-19",
    birth_place: "Tanger (Maroc)",
    current_role: "Fondateur de La France insoumise",
    current_role_detail: "depuis 2016",
    order_index: 1,
  },
  {
    id: "candidate-francois-ruffin",
    slug: "francois-ruffin",
    name: "François Ruffin",
    photo_url: "/candidates/francois-ruffin.jpg",
    party_id: "party-debout",
    biography:
      "Né le 18 octobre 1975 à Calais, François Ruffin est journaliste, fondateur du journal Fakir en 1999 et réalisateur du documentaire « Merci patron ! » (2016). Député de la Somme depuis 2017, il a quitté La France insoumise en 2024 et préside le mouvement Debout ! depuis juin 2025.",
    official_website: "https://francoisruffin.fr/",
    election_id: activeElection.id,
    is_demo: false,
    birth_date: "1975-10-18",
    birth_place: "Calais",
    current_role: "Député de la Somme",
    current_role_detail: "depuis 2017",
    order_index: 2,
  },
  {
    id: "candidate-marine-tondelier",
    slug: "marine-tondelier",
    name: "Marine Tondelier",
    photo_url: "/candidates/marine-tondelier.jpg",
    party_id: "party-ecologistes",
    biography:
      "Née le 23 août 1986 à Bois-Bernard, Marine Tondelier est diplômée de Sciences Po Lille. Élue régionale des Hauts-de-France depuis 2021, elle est secrétaire nationale des Écologistes depuis décembre 2022, réélue à ce poste avec 90,8 % des voix.",
    official_website: "https://marinetondelier.fr/",
    election_id: activeElection.id,
    is_demo: false,
    birth_date: "1986-08-23",
    birth_place: "Bois-Bernard",
    current_role: "Secrétaire nationale des Écologistes",
    current_role_detail: "depuis décembre 2022",
    order_index: 3,
  },
  {
    id: "candidate-raphael-glucksmann",
    slug: "raphael-glucksmann",
    name: "Raphaël Glucksmann",
    photo_url: "/candidates/raphael-glucksmann.jpg",
    party_id: "party-place-publique",
    biography:
      "Né le 15 octobre 1979 à Boulogne-Billancourt, Raphaël Glucksmann est journaliste et documentariste de formation. Cofondateur du parti Place publique en 2018, il est député européen depuis juillet 2019 et co-président du mouvement depuis décembre 2022.",
    official_website: "https://glucks2027.fr/",
    election_id: activeElection.id,
    is_demo: false,
    birth_date: "1979-10-15",
    birth_place: "Boulogne-Billancourt",
    current_role: "Député européen",
    current_role_detail: "depuis juillet 2019",
    order_index: 4,
  },
  {
    id: "candidate-gabriel-attal",
    slug: "gabriel-attal",
    name: "Gabriel Attal",
    photo_url: "/candidates/gabriel-attal.jpg",
    party_id: "party-renaissance",
    biography:
      "Né le 16 mars 1989 à Clamart, Gabriel Attal a occupé plusieurs postes ministériels avant de devenir Premier ministre de janvier à septembre 2024, plus jeune chef de gouvernement de la Ve République. Il est secrétaire général du parti Renaissance depuis décembre 2024 et préside le groupe Ensemble pour la République à l'Assemblée nationale.",
    official_website: "https://attalpresident.fr/",
    election_id: activeElection.id,
    is_demo: false,
    birth_date: "1989-03-16",
    birth_place: "Clamart",
    current_role: "Secrétaire général de Renaissance",
    current_role_detail: "depuis décembre 2024",
    order_index: 5,
  },
  {
    id: "candidate-edouard-philippe",
    slug: "edouard-philippe",
    name: "Édouard Philippe",
    photo_url: "/candidates/edouard-philippe.jpg",
    party_id: "party-horizons",
    biography:
      "Né le 28 novembre 1970 à Rouen, Édouard Philippe est diplômé de Sciences Po et de l'ENA. Maire du Havre depuis 2010, il a été Premier ministre de mai 2017 à juillet 2020, avant de fonder le parti Horizons en 2021, qu'il préside.",
    official_website: "https://www.edouardphilippe.fr/",
    election_id: activeElection.id,
    is_demo: false,
    birth_date: "1970-11-28",
    birth_place: "Rouen",
    current_role: "Maire du Havre",
    current_role_detail: "depuis 2010",
    order_index: 6,
  },
  {
    id: "candidate-xavier-bertrand",
    slug: "xavier-bertrand",
    name: "Xavier Bertrand",
    photo_url: "/candidates/xavier-bertrand.jpg",
    party_id: "party-sans-etiquette-droite",
    biography:
      "Né le 21 mars 1965 à Châlons-en-Champagne, Xavier Bertrand a été ministre de la Santé (2005-2007) puis du Travail (2007-2012). Président du conseil régional des Hauts-de-France depuis 2016, il a quitté Les Républicains en 2017 et se présente via son mouvement personnel « Nous France ».",
    official_website: null,
    election_id: activeElection.id,
    is_demo: false,
    birth_date: "1965-03-21",
    birth_place: "Châlons-en-Champagne",
    current_role: "Président du conseil régional",
    current_role_detail: "Hauts-de-France, depuis 2016",
    order_index: 7,
  },
  {
    id: "candidate-bruno-retailleau",
    slug: "bruno-retailleau",
    name: "Bruno Retailleau",
    photo_url: "/candidates/bruno-retailleau.jpg",
    party_id: "party-lr",
    biography:
      "Né en 1960 à Cholet, Bruno Retailleau est sénateur de la Vendée depuis 2004 et a présidé le conseil régional des Pays de la Loire (2016-2017). Ministre de l'Intérieur de septembre 2024 à octobre 2025, il préside le parti Les Républicains depuis mai 2025.",
    official_website: "https://republicains.fr",
    election_id: activeElection.id,
    is_demo: false,
    birth_date: "1960",
    birth_place: "Cholet",
    current_role: "Sénateur de la Vendée",
    current_role_detail: "depuis 2004",
    order_index: 8,
  },
  {
    id: "candidate-marine-le-pen",
    slug: "marine-le-pen",
    name: "Marine Le Pen",
    photo_url: "/candidates/marine-le-pen.jpg",
    party_id: "party-rn",
    biography:
      // Les affaires judiciaires ne sont jamais mentionnées dans une
      // biographie : elles ont leur rubrique dédiée (« Affaires &
      // controverses »), avec le vocabulaire procédural exact, le statut à
      // jour et les sources. Les redoubler ici reviendrait à pondérer deux
      // fois la même information pour certains candidats seulement — donc à
      // rompre l'égalité de traitement que la méthodologie garantit.
      "Née le 5 août 1968 à Neuilly-sur-Seine, Marine Le Pen est avocate de formation. Présidente du Front National puis du Rassemblement National de 2011 à 2021, elle est députée du Pas-de-Calais et préside le groupe RN à l'Assemblée nationale depuis 2022. Elle a été candidate à la présidentielle en 2012, 2017 et 2022.",
    official_website: "https://rassemblementnational.fr/membre/marine-le-pen",
    election_id: activeElection.id,
    is_demo: false,
    birth_date: "1968-08-05",
    birth_place: "Neuilly-sur-Seine",
    current_role: "Députée du Pas-de-Calais",
    current_role_detail: null,
    order_index: 9,
  },
  {
    id: "candidate-david-lisnard",
    slug: "david-lisnard",
    name: "David Lisnard",
    photo_url: "/candidates/david-lisnard.jpg",
    party_id: "party-nouvelle-energie",
    biography:
      "Né le 2 février 1969 à Limoges, David Lisnard est diplômé de l'Institut d'études politiques de Bordeaux. Maire de Cannes depuis 2014 et président de l'Association des maires de France depuis 2021, il a quitté Les Républicains le 31 mars 2026 pour se présenter à la présidentielle de 2027 via le mouvement Nouvelle Énergie, qu'il préside.",
    official_website: "https://www.unenouvelleenergie.fr/",
    election_id: activeElection.id,
    is_demo: false,
    birth_date: "1969-02-02",
    birth_place: "Limoges",
    current_role: "Maire de Cannes",
    current_role_detail: "depuis 2014",
    order_index: 10,
  },
  {
    id: "candidate-fabien-roussel",
    slug: "fabien-roussel",
    name: "Fabien Roussel",
    photo_url: "/candidates/fabien-roussel.jpg",
    party_id: "party-pcf",
    biography:
      "Né le 16 avril 1969 à Béthune, Fabien Roussel a d'abord été journaliste avant de devenir secrétaire national du Parti communiste français depuis novembre 2018. Ancien député du Nord (2017-2024), il est maire de Saint-Amand-les-Eaux depuis janvier 2025. Candidat à la présidentielle en 2022 (2,28 %, 8e place), il se représente en 2027.",
    official_website: "http://www.fabienroussel2027.fr/",
    election_id: activeElection.id,
    is_demo: false,
    birth_date: "1969-04-16",
    birth_place: "Béthune",
    current_role: "Maire de Saint-Amand-les-Eaux",
    current_role_detail: "depuis janvier 2025",
    order_index: 11,
  },
  {
    id: "candidate-nathalie-arthaud",
    slug: "nathalie-arthaud",
    name: "Nathalie Arthaud",
    photo_url: "/candidates/nathalie-arthaud.jpg",
    party_id: "party-lo",
    biography:
      "Née le 23 février 1970 à Peyrins (Drôme), Nathalie Arthaud est professeure agrégée d'économie-gestion. Porte-parole de Lutte Ouvrière depuis décembre 2008, elle a succédé à Arlette Laguiller comme visage du parti. Candidate à la présidentielle en 2012, 2017 et 2022 (autour de 0,6 % à chaque fois), elle se présente pour la quatrième fois en 2027.",
    official_website: "https://www.lutte-ouvriere.org/",
    election_id: activeElection.id,
    is_demo: false,
    birth_date: "1970-02-23",
    birth_place: "Peyrins (Drôme)",
    current_role: "Porte-parole de Lutte Ouvrière",
    current_role_detail: "depuis décembre 2008",
    order_index: 12,
  },
  {
    id: "candidate-nicolas-dupont-aignan",
    slug: "nicolas-dupont-aignan",
    name: "Nicolas Dupont-Aignan",
    photo_url: "/candidates/nicolas-dupont-aignan.jpg",
    party_id: "party-dlf",
    biography:
      "Né le 7 mars 1961 à Paris, Nicolas Dupont-Aignan est diplômé de Sciences Po Paris et de l'ENA. Ancien membre du RPR puis de l'UMP, il fonde Debout la France en 2008, qu'il préside depuis. Maire de Yerres (1995-2017, puis à nouveau depuis 2020) et ancien député de l'Essonne (1997-2024), il a été candidat à la présidentielle en 2012, 2017 (4,7 %) et 2022, et se présente pour la cinquième fois en 2027.",
    official_website: "https://www.debout-la-france.fr/",
    election_id: activeElection.id,
    is_demo: false,
    birth_date: "1961-03-07",
    birth_place: "Paris",
    current_role: "Maire de Yerres",
    current_role_detail: "depuis 2020",
    order_index: 13,
  },
];

export function getCandidateBySlug(slug: string) {
  return candidates.find((c) => c.slug === slug);
}
