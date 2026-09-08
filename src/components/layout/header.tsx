"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Sun } from "lucide-react";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";
import { ButtonLink } from "@/components/ui/button";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const scrolled = useScrolled();

  if (pathname === "/match") {
    return (
      <header className="border-b border-border bg-background">
        <div className="container-app flex h-[72px] items-center justify-between">
          <Logo />
          <Link
            href="/"
            className="focus-ring flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
          >
            Quitter le Match
            <LogOut size={15} />
          </Link>
        </div>
      </header>
    );
  }

  return (
    // Transparent tant que la page est en haut ; le fond et le filet
    // n'apparaissent qu'une fois du contenu passé dessous. La bordure reste
    // toujours présente, seulement transparente : la retirer décalerait la
    // page d'un pixel à chaque apparition.
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-300",
        scrolled
          ? "border-border bg-background/90 backdrop-blur-md"
          : "border-transparent bg-transparent"
      )}
    >
      <div className="container-app flex h-[72px] items-center justify-between gap-6">
        <Logo />

        {/* Sept entrées, dont « Faisabilité & impact » : la barre ne tient
            qu'à partir de 1024 px. Sous ce seuil elle débordait de la fenêtre
            et provoquait un défilement horizontal sur toute la page — d'où
            `lg` et non `md`, en miroir du `lg:hidden` de MobileNav. */}
        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "focus-ring relative py-1 text-sm transition-colors",
                  active ? "font-semibold text-foreground" : "text-muted hover:text-foreground"
                )}
              >
                {link.label}
                {active && (
                  <span className="absolute -bottom-1.5 left-0 h-0.5 w-full rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink href="/match" variant="accent" size="md" className="hidden sm:inline-flex">
            Découvrir mon Match
            <Sun size={16} />
          </ButtonLink>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

/**
 * `true` dès que la page n'est plus tout en haut. L'état n'est mis à jour
 * qu'au changement de valeur : un setState à chaque pixel re-rendrait tout
 * l'en-tête pendant le défilement.
 *
 * Faux au premier rendu, côté serveur comme côté client, puis corrigé au
 * montage — ce qui couvre le rechargement d'une page déjà défilée.
 */
function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let current = false;
    function update() {
      const next = window.scrollY > threshold;
      if (next !== current) {
        current = next;
        setScrolled(next);
      }
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [threshold]);

  return scrolled;
}
