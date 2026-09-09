"use client";

import { useState } from "react";
import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Logo du site. L'image est cherchée dans public/illustrations/logo.svg ;
 * tant qu'elle n'est pas déposée — ou si elle échoue à charger — on retombe
 * sur le nom composé en sérif, exactement comme avant. Même repli que les
 * portraits de candidats (voir CandidateAvatar) : rien ne casse à cause d'un
 * fichier manquant.
 *
 * `<img>` brut plutôt que next/image : l'optimiseur refuse les SVG par
 * défaut (400 sans dangerouslyAllowSVG), et une image déjà vectorielle n'a
 * de toute façon rien à gagner à repasser par lui.
 */
export function Logo({ className }: { className?: string }) {
  const [failed, setFailed] = useState(false);

  return (
    <Link
      href="/"
      className={cn("focus-ring relative inline-flex items-center", className)}
      aria-label={`${SITE_NAME} — retour à l'accueil`}
    >
      {failed ? (
        <span className="font-serif text-2xl font-semibold tracking-tight">{SITE_NAME}</span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- SVG : next/image ne l'optimiserait pas.
        <img
          src="/illustrations/logo.svg"
          alt={SITE_NAME}
          // Rapport réel du fichier (viewBox 2265.26 x 635.75) ; la hauteur
          // est fixée en CSS et la largeur suit ce rapport.
          width={2265}
          height={636}
          className="h-8 w-auto"
          onError={() => setFailed(true)}
        />
      )}
    </Link>
  );
}
