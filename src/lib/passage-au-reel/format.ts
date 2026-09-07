/**
 * Formatting helpers shared by every "Passage au réel" section — centralized
 * so a range always reads the same way everywhere (see lib/types.ts's rule:
 * an interval beats a fake single-decimal precision).
 */

function fmtNumber(n: number, signed: boolean): string {
  const formatted = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(Math.abs(n));
  if (!signed) return n < 0 ? `-${formatted}` : formatted;
  return n < 0 ? `-${formatted}` : `+${formatted}`;
}

/**
 * "6 à 9" from (6, 7.5, 9), "7,5" from (null, 7.5, null), null when nothing
 * is documented at all — the caller must then show a "non estimé" state,
 * never a blank space that reads as an oversight.
 */
export function formatRange(
  min: number | null,
  central: number | null,
  max: number | null,
  unit: string,
  options: { signed?: boolean } = {}
): string | null {
  const signed = options.signed ?? false;
  if (min !== null && max !== null && min !== max) {
    return `${fmtNumber(min, signed)} à ${fmtNumber(max, signed)} ${unit}`;
  }
  const single = central ?? min ?? max;
  return single === null ? null : `${fmtNumber(single, signed)} ${unit}`;
}

export function formatCentral(central: number | null, unit: string, options: { signed?: boolean } = {}): string | null {
  if (central === null) return null;
  return `${fmtNumber(central, options.signed ?? false)} ${unit}`;
}

export function formatCount(n: number | null): string | null {
  if (n === null) return null;
  return new Intl.NumberFormat("fr-FR").format(n);
}
