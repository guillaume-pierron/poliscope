import type { Party } from "@/lib/types";

/**
 * Real parties/movements for the declared 2027 candidates Poliscope covers.
 * Orientation labels follow the broad groupings commonly used by French
 * media and the Interior Ministry's own "nuance politique" classification —
 * they are simplifications used only for UI filtering, not a claim about
 * any party's self-description.
 *
 * Les couleurs reprennent celles que Wikipédia normalise pour les partis
 * français (Modèle:Infobox Parti politique français/couleurs), plutôt qu'une
 * palette décorative : un lecteur lit du sens dans une couleur, autant
 * qu'elle corresponde à quelque chose de vérifiable.
 *
 * Deux réserves, signalées au cas par cas ci-dessous :
 *   - ces codes sont pensés comme fonds de cellule de tableau ; les plus
 *     clairs sont assombris ici pour rester lisibles en texte et en filet
 *     sur fond blanc, en gardant la même teinte ;
 *   - trois formations n'ont pas de couleur documentée. Leur couleur est
 *     alors un choix conventionnel, sans signification.
 */
export const parties: Party[] = [
  {
    id: "party-rn",
    name: "Rassemblement National",
    short_name: "RN",
    orientation: "extreme-droite",
    color: "#0d378a",
  },
  {
    id: "party-lfi",
    name: "La France insoumise",
    short_name: "LFI",
    orientation: "gauche",
    color: "#cc2443",
  },
  {
    id: "party-renaissance",
    name: "Renaissance",
    short_name: "RE",
    orientation: "centre",
    // Officiellement #ffeb00 : jaune vif, illisible en texte sur fond clair.
    color: "#c9a800",
  },
  {
    id: "party-horizons",
    name: "Horizons",
    short_name: "HOR",
    orientation: "centre-droit",
    color: "#0000ba",
  },
  {
    id: "party-lr",
    name: "Les Républicains",
    short_name: "LR",
    orientation: "droite",
    color: "#0066cc",
  },
  {
    id: "party-place-publique",
    name: "Place publique",
    short_name: "PP",
    orientation: "centre-gauche",
    // Officiellement #ffc0c0 : rose pâle, prévu comme fond de tableau.
    color: "#d94f7d",
  },
  {
    id: "party-ecologistes",
    name: "Les Écologistes",
    short_name: "EELV",
    orientation: "gauche",
    color: "#00a000",
  },
  {
    id: "party-debout",
    name: "Debout !",
    short_name: null,
    orientation: "gauche",
    // Mouvement récent, sans couleur documentée — choix conventionnel.
    color: "#e34948",
  },
  {
    id: "party-sans-etiquette-droite",
    name: "Sans étiquette (ex-Les Républicains)",
    short_name: null,
    orientation: "droite",
    // Sans étiquette, donc sans couleur de parti — choix conventionnel.
    color: "#6b7280",
  },
  {
    id: "party-nouvelle-energie",
    name: "Nouvelle Énergie",
    short_name: "NE",
    orientation: "droite",
    // Mouvement récent, sans couleur documentée — choix conventionnel.
    color: "#0d9488",
  },
  {
    id: "party-pcf",
    name: "Parti communiste français",
    short_name: "PCF",
    orientation: "gauche",
    color: "#dd0000",
  },
  {
    id: "party-lo",
    name: "Lutte Ouvrière",
    short_name: "LO",
    orientation: "extreme-gauche",
    color: "#bb0000",
  },
  {
    id: "party-dlf",
    name: "Debout la France",
    short_name: "DLF",
    orientation: "droite",
    color: "#0082c4",
  },
];
