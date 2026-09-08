"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Logo du site. L'image est cherchée dans public/illustrations/logo.png ;
 * tant qu'elle n'est pas déposée — ou si elle échoue à charger — on retombe
 * sur le nom composé en sérif, exactement comme avant. Même repli que les
 * portraits de candidats (voir CandidateAvatar) : rien ne casse à cause d'un
 * fichier manquant.
 *
 * Pas d'import statique : il ferait échouer le build tant que le fichier
 * n'existe pas, et l'en-tête est sur toutes les pages.
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
        <Image
          src="/illustrations/logo.png"
          alt={SITE_NAME}
          // Dimensions réelles du fichier ; la hauteur est fixée en CSS et la
          // largeur suit ce rapport.
          width={823}
          height={225}
          priority
          className="h-8 w-auto"
          onError={() => setFailed(true)}
        />
      )}
    </Link>
  );
}
