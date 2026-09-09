"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [lastPathname, setLastPathname] = useState(pathname);

  // Close the menu on navigation. Adjusted during render (React's
  // documented pattern for resetting state when a prop changes) rather
  // than in an effect, since this is derived from `pathname`, not an
  // external system.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <Button
        variant="ghost"
        size="icon"
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </Button>

      <div
        className={cn(
          // `absolute` + `top-full`, ancré sur le <header> (position: sticky,
          // donc lui-même un contexte de positionnement) plutôt qu'un `fixed`
          // à une hauteur fixe depuis le haut de la fenêtre : ce panneau se
          // cale ainsi toujours juste sous l'en-tête réellement affiché,
          // ticker compris quand la page n'est pas encore défilée. Un
          // décalage figé (`top-16`, puis `top-[var(--header-height)]`)
          // recouvrait le bas du bouton bascule à chaque fois que la hauteur
          // réelle divergeait — rendant le menu impossible à refermer.
          "absolute inset-x-0 top-full z-40 origin-top border-b border-border bg-background transition-all duration-200",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        )}
      >
        <nav className="container-app flex flex-col gap-1 py-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "focus-ring rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-surface",
                pathname === link.href && "bg-surface text-primary"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/match"
            className="focus-ring mt-2 inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground"
          >
            Découvrir mon Match
          </Link>
        </nav>
      </div>
    </div>
  );
}
