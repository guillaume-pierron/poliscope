import {
  Wallet,
  Tag as TagIcon,
  Percent,
  Zap,
  HeartHandshake,
  Leaf,
  Users,
  Shield,
  Hourglass,
  Home,
  GraduationCap,
  HeartPulse,
  Globe,
  ScrollText,
  Landmark,
  type LucideIcon,
} from "lucide-react";

/**
 * Keyword → icon lookup for proposal tags. Tags are free-form (derived per
 * proposal from its own sourced text, see local/proposals.ts), so this is a
 * best-effort visual match rather than an exhaustive enum — anything
 * unmatched falls back to a plain tag glyph.
 */
const KEYWORD_ICONS: [pattern: RegExp, icon: LucideIcon][] = [
  [/smic|salaire|revenu/i, Wallet],
  [/tva|fiscal|imp[oô]t|budget/i, Percent],
  [/[ée]nergie|nucl[ée]aire|[ée]olien|renouvelable/i, Zap],
  [/aide|solidarit[ée]|rsa/i, HeartHandshake],
  [/climat|[ée]colog|environnement|adaptation/i, Leaf],
  [/immigration|quota|r[ée]gularisation|asile|frontière|schengen/i, Users],
  [/police|s[ée]curit[ée]|justice|prison|narcotrafic|sanction/i, Shield],
  [/retraite|[âa]ge l[ée]gal|p[ée]nibilit[ée]|capitalisation/i, Hourglass],
  [/logement|loyer|construction|propri[ée]taire/i, Home],
  [/[ée]cole|enseignant|effectif|[ée]ducation/i, GraduationCap],
  [/sant[ée]|h[oô]pital|urgence/i, HeartPulse],
  [/europe|souverainet[ée]|d[ée]fense|ukraine|international/i, Globe],
  [/r[ée]f[ée]rendum|constitution|institution/i, ScrollText],
];

export function tagIcon(tag: string): LucideIcon {
  const match = KEYWORD_ICONS.find(([pattern]) => pattern.test(tag));
  return match ? match[1] : TagIcon;
}

/** Icon for the theme's own hero medallion accent — reuses the same lookup. */
export const CivicIcon = Landmark;
