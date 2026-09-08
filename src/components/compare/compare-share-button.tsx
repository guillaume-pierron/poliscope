"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";

/**
 * Copie l'URL de la comparaison. Rien n'est envoyé nulle part : le lien
 * suffit à reconstituer la page, qui ne contient que des données publiques.
 */
export function CompareShareButton() {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Presse-papiers refusé (contexte non sécurisé, permission) : on ne
      // prétend pas avoir copié.
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className="focus-ring inline-flex shrink-0 items-center gap-2 rounded-xl border border-border-strong bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:bg-surface"
    >
      {copied ? (
        <>
          <Check size={15} className="text-success" />
          Lien copié
        </>
      ) : (
        <>
          <Share2 size={15} />
          Partager cette comparaison
        </>
      )}
    </button>
  );
}
