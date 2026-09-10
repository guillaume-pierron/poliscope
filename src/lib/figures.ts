/**
 * Repère les grandeurs chiffrées d'un texte (montants, pourcentages, durées)
 * pour que l'œil puisse les accrocher sans lire tout le paragraphe.
 *
 * Pourquoi une règle purement mécanique : mettre un mot en gras est un acte
 * éditorial. Choisir *quels mots* comptent dans la proposition d'un candidat
 * reviendrait à orienter la lecture — exactement ce que ce site s'interdit.
 * Un chiffre accompagné de son unité, lui, se repère sans jugement : la règle
 * est la même pour tous les candidats et ne dépend d'aucune interprétation.
 *
 * D'où l'exigence d'une unité : un nombre seul n'est pas mis en valeur, ce qui
 * écarte au passage les dates (« le 31 août 2026 ») et les numéros d'article
 * (« article 49, alinéa 3 »), qui ne sont pas des grandeurs et dont la mise en
 * gras ne ferait que du bruit.
 */

/**
 * Un nombre — séparateurs de milliers français inclus : espace ordinaire,
 * espace insécable, espace fine insécable — suivi d'une unité ou d'un ordre
 * de grandeur, qui est ce qui qualifie la grandeur.
 *
 * `\b` ne porte que sur les unités alphabétiques : après « % » ou « € », tous
 * deux non alphanumériques, il n'y aurait pas de frontière de mot et la
 * correspondance échouerait silencieusement.
 */
const FIGURE_PATTERN =
  /\d[\d   .,]*\s*(?:%|€|(?:milliards?|millions?|euros?|ans|mois|semaines?|jours?|heures?|points?)\b)/gi;

export interface FigureSegment {
  text: string;
  /** true quand ce segment est une grandeur chiffrée à mettre en valeur. */
  isFigure: boolean;
}

/**
 * Découpe un texte en segments alternant texte courant et grandeurs
 * chiffrées. Renvoie toujours au moins un segment (le texte entier, non mis
 * en valeur) — y compris pour une chaîne vide, afin que l'appelant n'ait
 * jamais à distinguer ce cas.
 */
export function splitFigures(text: string): FigureSegment[] {
  const segments: FigureSegment[] = [];
  let lastIndex = 0;

  // `matchAll` plutôt qu'une boucle sur `exec` : la regex porte le drapeau
  // `g`, donc un `exec` répété partagerait `lastIndex` entre deux appels
  // et sauterait des correspondances.
  for (const match of text.matchAll(FIGURE_PATTERN)) {
    const start = match.index;
    if (start > lastIndex) {
      segments.push({ text: text.slice(lastIndex, start), isFigure: false });
    }
    segments.push({ text: match[0], isFigure: true });
    lastIndex = start + match[0].length;
  }

  if (lastIndex < text.length || segments.length === 0) {
    segments.push({ text: text.slice(lastIndex), isFigure: false });
  }

  return segments;
}
