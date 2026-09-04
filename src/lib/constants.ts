export const SITE_NAME = "Poliscope";
export const SITE_DESCRIPTION =
  "Comprenez les programmes. Comparez les candidats. Faites-vous votre propre opinion.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/match", label: "Mon Match" },
  { href: "/candidats", label: "Candidats" },
  { href: "/comparer", label: "Comparer" },
  { href: "/sondages", label: "Sondages" },
  { href: "/methodologie", label: "Méthodologie" },
] as const;
