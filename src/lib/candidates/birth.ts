const MONTHS = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

export interface FormattedBirth {
  /** Date en toutes lettres, ou la valeur brute quand elle n'est pas une date complète. */
  date: string;
  /** Âge révolu — `null` dès que la source ne donne pas le jour exact. */
  age: string | null;
}

/**
 * Rend la naissance telle que la source la donne : jour complet quand il est
 * connu, année seule sinon. L'âge n'accompagne que les dates complètes —
 * le déduire d'une année seule ferait passer une approximation pour un fait.
 *
 * `today` est injectable pour les tests ; en production c'est la date du
 * rendu. Les fiches candidats étant générées statiquement, l'âge affiché est
 * celui du build et peut avoir un an de retard sur une fiche non reconstruite.
 */
export function formatBirth(birthDate: string, today: Date = new Date()): FormattedBirth {
  const full = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthDate);
  if (!full) return { date: birthDate, age: null };

  const year = Number(full[1]);
  const month = Number(full[2]);
  const day = Number(full[3]);
  if (month < 1 || month > 12) return { date: birthDate, age: null };

  const date = `${day} ${MONTHS[month - 1]} ${year}`;

  let age = today.getFullYear() - year;
  const beforeBirthday =
    today.getMonth() + 1 < month || (today.getMonth() + 1 === month && today.getDate() < day);
  if (beforeBirthday) age -= 1;

  return { date, age: `${age} ans` };
}
