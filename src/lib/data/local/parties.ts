import type { Party } from "@/lib/types";

/**
 * Real parties/movements for the declared 2027 candidates Poliscope covers.
 * Orientation labels follow the broad groupings commonly used by French
 * media and the Interior Ministry's own "nuance politique" classification —
 * they are simplifications used only for UI filtering, not a claim about
 * any party's self-description.
 */
export const parties: Party[] = [
  {
    id: "party-rn",
    name: "Rassemblement National",
    short_name: "RN",
    orientation: "extreme-droite",
    color: "#2a78d6",
  },
  {
    id: "party-lfi",
    name: "La France insoumise",
    short_name: "LFI",
    orientation: "gauche",
    color: "#eb6834",
  },
  {
    id: "party-renaissance",
    name: "Renaissance",
    short_name: "RE",
    orientation: "centre",
    color: "#1baf7a",
  },
  {
    id: "party-horizons",
    name: "Horizons",
    short_name: "HOR",
    orientation: "centre-droit",
    color: "#eda100",
  },
  {
    id: "party-lr",
    name: "Les Républicains",
    short_name: "LR",
    orientation: "droite",
    color: "#e87ba4",
  },
  {
    id: "party-place-publique",
    name: "Place publique",
    short_name: "PP",
    orientation: "centre-gauche",
    color: "#008300",
  },
  {
    id: "party-ecologistes",
    name: "Les Écologistes",
    short_name: "EELV",
    orientation: "gauche",
    color: "#4a3aa7",
  },
  {
    id: "party-debout",
    name: "Debout !",
    short_name: null,
    orientation: "gauche",
    color: "#e34948",
  },
  {
    id: "party-sans-etiquette-droite",
    name: "Sans étiquette (ex-Les Républicains)",
    short_name: null,
    orientation: "droite",
    color: "#9085e9",
  },
];
