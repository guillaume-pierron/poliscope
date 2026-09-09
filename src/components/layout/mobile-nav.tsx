"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MobileNav({
  open,
  onOpenChange,
}: {
  /** Contrôlé par Header, qui doit savoir si le menu est ouvert pour forcer
   *  son propre fond opaque — sinon la ligne du logo reste transparente
   *  au-dessus d'un panneau plein, en haut d'une page pas encore défilée. */
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const setOpen = onOpenChange;
  const pathname = usePathname();

  // Close the menu on navigation. En effet et non pendant le rendu : `open`
  // vit maintenant chez Header, et ajuster l'état d'un ancêtre pendant le
  // rendu d'un descendant sort du cas que React documente pour ce motif
  // (se limiter à son propre state local).
  useEffect(() => {
    onOpenChange(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- ferme sur changement de route, jamais sur un changement de onOpenChange lui-même.
  }, [pathname]);

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
        onClick={() => setOpen(!open)}
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
          //
          "absolute inset-x-0 top-full z-40 origin-top border-b border-border bg-background transition-all duration-200",
          open
            ? // min-h-dvh seulement ici : ouvert, le panneau ne doit jamais
              // s'arrêter avant le bas de l'écran, quel que soit le nombre de
              // liens — sur l'accueil, le propre bouton « Découvrir mon
              // Match » du hero apparaissait sinon juste en dessous, donnant
              // l'impression d'un bouton en double. Fermé, le panneau garde
              // sa hauteur naturelle (repliée à quelques pixels) : un
              // min-h-dvh permanent restait dans le flux de défilement même
              // invisible et ajoutait un écran plein de vide en bas de
              // chaque page — vérifié en isolant le contenu réel de la page.
              "pointer-events-auto min-h-dvh translate-y-0 opacity-100"
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
