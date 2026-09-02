import type { Theme } from "@/lib/types";

export const themes: Theme[] = [
  {
    id: "theme-economie",
    slug: "economie",
    name: "Économie",
    description: "Croissance, fiscalité, dépense publique et compétitivité.",
    icon: "line-chart",
    order_index: 1,
  },
  {
    id: "theme-pouvoir-achat",
    slug: "pouvoir-achat",
    name: "Pouvoir d'achat",
    description: "Salaires, prix, prestations sociales et inflation.",
    icon: "wallet",
    order_index: 2,
  },
  {
    id: "theme-retraites",
    slug: "retraites",
    name: "Retraites",
    description: "Âge légal, pénibilité et financement du système.",
    icon: "hourglass",
    order_index: 3,
  },
  {
    id: "theme-immigration",
    slug: "immigration",
    name: "Immigration",
    description: "Politique migratoire, asile et intégration.",
    icon: "users",
    order_index: 4,
  },
  {
    id: "theme-securite",
    slug: "securite",
    name: "Sécurité",
    description: "Police, justice et lutte contre la délinquance.",
    icon: "shield",
    order_index: 5,
  },
  {
    id: "theme-sante",
    slug: "sante",
    name: "Santé",
    description: "Hôpital public, accès aux soins et prévention.",
    icon: "heart-pulse",
    order_index: 6,
  },
  {
    id: "theme-education",
    slug: "education",
    name: "Éducation",
    description: "École, enseignants et enseignement supérieur.",
    icon: "graduation-cap",
    order_index: 7,
  },
  {
    id: "theme-ecologie",
    slug: "ecologie",
    name: "Écologie",
    description: "Climat, biodiversité et normes environnementales.",
    icon: "leaf",
    order_index: 8,
  },
  {
    id: "theme-energie",
    slug: "energie",
    name: "Énergie",
    description: "Nucléaire, renouvelables et souveraineté énergétique.",
    icon: "zap",
    order_index: 9,
  },
  {
    id: "theme-europe",
    slug: "europe",
    name: "Europe",
    description: "Souveraineté nationale et intégration européenne.",
    icon: "globe",
    order_index: 10,
  },
  {
    id: "theme-international",
    slug: "international",
    name: "International",
    description: "Défense, diplomatie et alliances internationales.",
    icon: "compass",
    order_index: 11,
  },
  {
    id: "theme-logement",
    slug: "logement",
    name: "Logement",
    description: "Construction, loyers et accès à la propriété.",
    icon: "home",
    order_index: 12,
  },
];

export function getThemeBySlug(slug: string) {
  return themes.find((t) => t.slug === slug);
}
