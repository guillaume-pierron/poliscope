"use client";

import { useEffect, useState } from "react";
import { CalendarClock } from "lucide-react";
import { describeRemaining } from "@/lib/election-countdown";
import { formatDate } from "@/lib/utils";

/**
 * Décompte jusqu'au premier tour. La date vient toujours de l'élection
 * active (voir data/local/elections.ts, fixée en Conseil des ministres) —
 * jamais d'une constante écrite ici, qui deviendrait fausse sans prévenir.
 *
 * Le compte à rebours n'est calculé qu'après montage : le rendu serveur
 * d'une page statique figerait « aujourd'hui » à la date du build. Le
 * serveur n'affiche donc que la date, qui, elle, ne bouge pas.
 */
export function ElectionCountdown({ roundDate }: { roundDate: string | null }) {
  const [remaining, setRemaining] = useState<string | null>(null);

  useEffect(() => {
    if (!roundDate) return;

    function update() {
      setRemaining(describeRemaining(roundDate as string));
    }
    update();
    // Une minute suffit : au-delà d'une journée l'affichage est en jours, et
    // sous 24 h il est en heures et minutes.
    const timer = setInterval(update, 60_000);
    return () => clearInterval(timer);
  }, [roundDate]);

  if (!roundDate) return null;

  return (
    <span className="flex shrink-0 items-center gap-1.5">
      <CalendarClock size={13} className="shrink-0 text-primary" />
      <span className="font-medium text-foreground">
        {remaining ? `Premier tour ${remaining}` : "Premier tour"}
      </span>
      <span className="text-muted-2">{formatDate(roundDate)}</span>
    </span>
  );
}
