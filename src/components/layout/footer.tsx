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
    <footer className="mt-16 border-t border-border bg-surface">
      <div className="container-app pt-9 pb-10">
        <div className="grid gap-8 md:grid-cols-[1.5fr_1fr_1fr_1fr_2.45fr]">
          <div>
            <Logo />
            <p className="mt-2 max-w-[15rem] text-sm text-muted">
              Comprenez les programmes. Faites-vous votre propre opinion.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold">{col.title}</h4>
              <ul className="mt-1.5 space-y-0.5">
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

          <div className="md:border-l md:border-border md:pl-10">
            <h4 className="text-base font-semibold">L&apos;essentiel de la présidentielle</h4>
            <p className="mt-1.5 text-sm text-muted">
              Sans passer votre journée sur les réseaux sociaux.
            </p>
            {/* Bouton en pilule dans le footer — le composant partagé reste en rounded-xl ailleurs. */}
            <NewsletterForm className="mt-4 [&_button]:rounded-full" />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2 border-t border-border pt-4 text-xs text-muted-2 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Poliscope</p>
          <p>
            Plateforme indépendante, non affiliée à un candidat ou un parti. Chaque proposition
            est sourcée — voir la méthodologie.
          </p>
        </div>
      </div>
    </footer>
  );
}
