const SECTIONS = [
  { href: "#programme", label: "Programme" },
  { href: "#parcours", label: "Parcours" },
  { href: "#votes", label: "Votes" },
  { href: "#evolution-positions", label: "Évolution des positions" },
  { href: "#affaires", label: "Affaires & controverses" },
  { href: "#transparence", label: "Transparence" },
  { href: "#sources", label: "Sources" },
] as const;

/**
 * Navigation interne de la fiche candidat. Un simple ancrage plutôt qu'un
 * onglet qui masque/affiche du contenu : chaque section reste dans le flux
 * normal de la page (référençable, indexable, jamais de contenu qui
 * disparaît pour un lecteur JS désactivé).
 *
 * Même langage que la nav du header (libellés texte), pas des pastilles : à
 * densité égale, des libellés tiennent sur une seule ligne aux largeurs
 * desktop courantes — les pastilles, plus larges, débordaient et
 * déclenchaient le défilement natif du navigateur (avec ses flèches ◀▶ sur
 * Windows/Chrome). Le défilement horizontal reste prévu pour les petits
 * écrans, mais sans barre de défilement visible — un simple glissé tactile,
 * jamais pour le contenu d'une section.
 *
 * Pas de mise en avant de la section en cours de lecture (scroll-spy) : ça
 * suppose de suivre la position de scroll en JS, une brique à part si elle
 * s'avère utile — mieux vaut sept libellés à égalité qu'un premier onglet
 * marqué « actif » à tort dès que la page défile.
 */
export function CandidateSectionNav() {
  return (
    <nav
      aria-label="Sections de la fiche candidat"
      className="sticky top-[calc(var(--header-height)_-_1px)] z-10 -mx-1.5 overflow-x-auto border-b border-border bg-background/95 px-1.5 backdrop-blur-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <ul className="flex min-w-max items-center gap-7">
        {SECTIONS.map((section) => (
          <li key={section.href} className="flex h-12 items-center">
            <a
              href={section.href}
              className="focus-ring whitespace-nowrap text-sm text-muted transition-colors hover:text-foreground"
            >
              {section.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
