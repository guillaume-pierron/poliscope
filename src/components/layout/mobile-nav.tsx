"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ChevronRight,
  Compass,
  FileText,
  Home,
  Menu,
  Scale,
  Sun,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Une icône par entrée — reprise de celle déjà associée à la rubrique
 * ailleurs sur le site, jamais une nouvelle association inventée pour ce
 * seul menu : Scale est déjà l'icône de la carte Comparer de l'accueil,
 * Compass celle de Faisabilité & impact partout où le sujet apparaît,
 * BarChart3 celle de la carte Sondages, UserRound celle du « Votre profil »
 * des constellations du Match.
 */
const NAV_ICONS: Record<string, typeof Home> = {
  "/": Home,
  "/match": UserRound,
  "/candidats": Users,
  "/comparer": Scale,
  "/passage-au-reel": Compass,
  "/sondages": BarChart3,
  "/methodologie": FileText,
};

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
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelHeight, setPanelHeight] = useState<number | null>(null);

  /**
   * Hauteur exacte de la place restante sous l'en-tête, mesurée plutôt que
   * devinée en CSS : `100dvh` a un historique de comportements incohérents
   * sur les navigateurs mobiles réels (barre d'outils de Safari iOS qui
   * apparaît/disparaît, notamment), et rien ne garantit qu'il corresponde à
   * l'espace réellement visible sur tous les appareils. `visualViewport`,
   * quand il existe, reflète cet espace visible même quand un clavier
   * virtuel est ouvert — `overflow-y-auto` (déjà sur ce panneau) prend le
   * relais dès que le contenu dépasse cette hauteur.
   */
  useEffect(() => {
    if (!open) return;

    function updateHeight() {
      // Le bas du <header>, jamais celui du panneau : à l'ouverture, le
      // panneau lui-même est encore décalé de -translate-y-2 pendant les
      // 200ms de la transition, et le mesurer à cet instant capture une
      // position ~8px trop haute — le panneau retombait alors 8px sous le
      // bas de l'écran. L'en-tête, lui, n'est jamais animé.
      const header = panelRef.current?.closest("header");
      const top = header?.getBoundingClientRect().bottom ?? 0;
      const viewport = window.visualViewport?.height ?? window.innerHeight;
      setPanelHeight(Math.max(0, viewport - top));
    }
    updateHeight();

    window.addEventListener("resize", updateHeight);
    window.visualViewport?.addEventListener("resize", updateHeight);
    return () => {
      window.removeEventListener("resize", updateHeight);
      window.visualViewport?.removeEventListener("resize", updateHeight);
    };
  }, [open]);

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
        ref={panelRef}
        // `minHeight` inline en plus de `height` : sinon la classe
        // `min-h-dvh` (repli avant mesure) l'emporterait sur une hauteur
        // mesurée plus petite qu'elle — `min-height` gagne toujours face à
        // une `height` plus courte, en CSS comme en style inline.
        style={open && panelHeight !== null ? { height: panelHeight, minHeight: panelHeight } : undefined}
        className={cn(
          // `absolute` + `top-full`, ancré sur le <header> (position: sticky,
          // donc lui-même un contexte de positionnement) plutôt qu'un `fixed`
          // à une hauteur fixe depuis le haut de la fenêtre : ce panneau se
          // cale ainsi toujours juste sous l'en-tête réellement affiché,
          // ticker compris quand la page n'est pas encore défilée. Un
          // décalage figé (`top-16`, puis `top-[var(--header-height)]`)
          // recouvrait le bas du bouton bascule à chaque fois que la hauteur
          // réelle divergeait — rendant le menu impossible à refermer.
          "absolute inset-x-0 top-full z-40 origin-top overflow-y-auto border-b border-border bg-background transition-all duration-200",
          open
            ? // La hauteur exacte vient de `panelHeight` (mesurée en JS, voir
              // plus haut) ; `min-h-dvh` ne reste qu'un repli pour la toute
              // première image avant que la mesure n'arrive — un panneau qui
              // ne couvrirait que son contenu laisserait sinon voir la page
              // en dessous (sur l'accueil, le propre bouton « Découvrir mon
              // Match » du hero) pendant cette fraction de seconde.
              "pointer-events-auto min-h-dvh translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        )}
      >
        <nav className="container-app flex flex-col py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-2">
            Navigation
          </p>

          <ul className="mt-3 space-y-1.5">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              const Icon = NAV_ICONS[link.href] ?? Home;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "focus-ring flex items-center gap-3 rounded-2xl border-l-[3px] py-2.5 pl-3.5 pr-3 transition-colors",
                      active
                        ? "border-primary bg-primary-soft text-primary"
                        : "border-transparent hover:bg-surface"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                        active ? "bg-card text-primary" : "bg-surface text-muted"
                      )}
                    >
                      <Icon size={18} />
                    </span>
                    <span
                      className={cn(
                        "flex-1 font-serif text-lg font-semibold tracking-tight",
                        !active && "text-foreground"
                      )}
                    >
                      {link.label}
                    </span>
                    <ChevronRight size={17} className={active ? "text-primary" : "text-muted-2"} />
                  </Link>
                </li>
              );
            })}
          </ul>

          <hr className="mt-6 border-border" />

          <Link
            href="/match"
            className="focus-ring mt-6 flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Sun size={16} className="shrink-0" />
            Découvrir mon Match
            <ChevronRight size={16} className="shrink-0" />
          </Link>

          <p className="mt-5 flex items-center justify-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted-2">
            <span aria-hidden="true" className="h-px w-6 bg-border-strong" />
            Pour des choix plus éclairés
            <span aria-hidden="true" className="h-px w-6 bg-border-strong" />
          </p>
        </nav>
      </div>
    </div>
  );
}
