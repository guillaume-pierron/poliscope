/**
 * « dans 222 jours », « dans 5 h 12 min », « aujourd'hui ». Renvoie `null`
 * une fois le scrutin passé : mieux vaut n'afficher que la date qu'un
 * décompte négatif.
 *
 * `now` est injectable pour les tests ; en production c'est l'horloge du
 * visiteur. Le scrutin est un jour et non un horaire : on décompte jusqu'à
 * son début, et il reste « aujourd'hui » tant que ce jour n'est pas fini.
 */
export function describeRemaining(roundDate: string, now: Date = new Date()): string | null {
  const target = new Date(`${roundDate}T00:00:00`);
  if (Number.isNaN(target.getTime())) return null;

  const diffMs = target.getTime() - now.getTime();

  if (diffMs <= 0) {
    const endOfDay = target.getTime() + 24 * 60 * 60 * 1000;
    return now.getTime() < endOfDay ? "aujourd'hui" : null;
  }

  const minutes = Math.floor(diffMs / 60_000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days >= 1) return `dans ${days} jour${days > 1 ? "s" : ""}`;
  if (hours >= 1) return `dans ${hours} h ${minutes % 60} min`;
  return `dans ${minutes} min`;
}
