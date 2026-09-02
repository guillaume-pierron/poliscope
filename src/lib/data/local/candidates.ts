import type { Candidate } from "@/lib/types";
import { activeElection } from "./elections";

export const candidates: Candidate[] = [
  {
    id: "candidate-camille-martin",
    slug: "camille-martin",
    name: "Camille Martin",
    photo_url: null,
    party_id: "party-renaissance-citoyenne",
    biography:
      "Ancienne haute fonctionnaire et élue locale, Camille Martin défend une ligne réformiste centriste : équilibre des finances publiques, investissement dans l'école et approfondissement du projet européen. Personnage fictif créé à des fins de démonstration.",
    official_website: "https://example.org/candidats/camille-martin",
    election_id: activeElection.id,
    is_demo: true,
    order_index: 1,
  },
  {
    id: "candidate-alexandre-leroy",
    slug: "alexandre-leroy",
    name: "Alexandre Leroy",
    photo_url: null,
    party_id: "party-alliance-nationale",
    biography:
      "Ancien chef d'entreprise et parlementaire, Alexandre Leroy porte un programme axé sur la baisse des dépenses publiques, la fermeté migratoire et la souveraineté nationale. Personnage fictif créé à des fins de démonstration.",
    official_website: "https://example.org/candidats/alexandre-leroy",
    election_id: activeElection.id,
    is_demo: true,
    order_index: 2,
  },
  {
    id: "candidate-sarah-moreau",
    slug: "sarah-moreau",
    name: "Sarah Moreau",
    photo_url: null,
    party_id: "party-generation-verte",
    biography:
      "Ingénieure devenue élue régionale, Sarah Moreau porte un projet écologiste : transition énergétique accélérée, justice fiscale et renforcement des services publics. Personnage fictif créé à des fins de démonstration.",
    official_website: "https://example.org/candidats/sarah-moreau",
    election_id: activeElection.id,
    is_demo: true,
    order_index: 3,
  },
  {
    id: "candidate-thomas-bernard",
    slug: "thomas-bernard",
    name: "Thomas Bernard",
    photo_url: null,
    party_id: "party-union-populaire-demo",
    biography:
      "Ancien syndicaliste et député, Thomas Bernard défend une ligne sociale : hausse des salaires, retour de la retraite à 60 ans et renforcement des services publics. Personnage fictif créé à des fins de démonstration.",
    official_website: "https://example.org/candidats/thomas-bernard",
    election_id: activeElection.id,
    is_demo: true,
    order_index: 4,
  },
  {
    id: "candidate-nina-laurent",
    slug: "nina-laurent",
    name: "Nina Laurent",
    photo_url: null,
    party_id: "party-horizon-liberal",
    biography:
      "Entrepreneuse et économiste, Nina Laurent promeut une ligne libérale : baisse des charges, simplification administrative et attractivité économique de la France. Personnage fictif créé à des fins de démonstration.",
    official_website: "https://example.org/candidats/nina-laurent",
    election_id: activeElection.id,
    is_demo: true,
    order_index: 5,
  },
];

export function getCandidateBySlug(slug: string) {
  return candidates.find((c) => c.slug === slug);
}
