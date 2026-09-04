import type { CSSProperties } from "react";
import {
  LineChart,
  Wallet,
  Hourglass,
  Users,
  Shield,
  HeartPulse,
  GraduationCap,
  Leaf,
  Zap,
  Globe,
  Compass,
  Home,
  type LucideIcon,
} from "lucide-react";

export const THEME_ICONS: Record<string, LucideIcon> = {
  "line-chart": LineChart,
  wallet: Wallet,
  hourglass: Hourglass,
  users: Users,
  shield: Shield,
  "heart-pulse": HeartPulse,
  "graduation-cap": GraduationCap,
  leaf: Leaf,
  zap: Zap,
  globe: Globe,
  compass: Compass,
  home: Home,
};

export function ThemeIcon({
  icon,
  className,
  style,
}: {
  icon: string;
  className?: string;
  style?: CSSProperties;
}) {
  const Icon = THEME_ICONS[icon] ?? Globe;
  return <Icon className={className} style={style} aria-hidden="true" />;
}
