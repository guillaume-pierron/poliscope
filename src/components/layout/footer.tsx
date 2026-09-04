import Link from "next/link";
import { Logo } from "./logo";
import { NewsletterForm } from "@/components/home/newsletter-form";

const columns = [
  {
    title: "Outils",
    links: [
      { href: "/match", label: "Mon Match" },
      { href: "/comparer", label: "Comparateur" },
      { href: "/candidats", label: "Candidats" },
      { href: "/sondages", label: "Sondages" },
      { href: "/simulateur", label: "Simulateur d'impact" },
    ],
  },
  {
    title: "Thématiques",
    links: [
      { href: "/themes/economie", label: "Économie" },
      { href: "/themes/retraites", label: "Retraites" },
      { href: "/themes/immigration", label: "Immigration" },
      { href: "/themes/ecologie", label: "Écologie" },
    ],
  },
  {
    title: "À propos",
    links: [
      { href: "/methodologie", label: "Méthodologie" },
      { href: "/confidentialite", label: "Confidentialité" },
      { href: "/admin", label: "Administration" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <div className="container-app py-14">
        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-muted">
              Comprenez les programmes. Comparez les candidats. Faites-vous votre
              propre opinion.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="focus-ring text-sm text-muted transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-sm font-semibold">L&apos;essentiel de la présidentielle</h4>
            <p className="mt-2 text-sm text-muted">
              Sans passer votre journée sur les réseaux sociaux.
            </p>
            <NewsletterForm className="mt-4" />
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-2 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Poliscope. Plateforme indépendante et non partisane.</p>
          <p>
            Plateforme indépendante, non affiliée à un candidat ou un parti. Chaque proposition
            est sourcée — voir la méthodologie.
          </p>
        </div>
      </div>
    </footer>
  );
}
