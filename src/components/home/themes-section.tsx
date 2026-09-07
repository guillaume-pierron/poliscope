import Link from "next/link";
import { ThemeIcon } from "@/lib/theme-icons";
import { Swoosh } from "@/components/ui/swoosh";
import { hexToRgba } from "@/lib/utils";
import type { Theme } from "@/lib/types";

/** Rotating accent hues for the theme pills, as in the design. */
const PILL_COLORS = ["#1d6ff2", "#eb6834", "#16a34a", "#7c3aed", "#eda100", "#e87ba4"];

export function ThemesSection({
  themes,
  proposalCounts,
}: {
  themes: Theme[];
  /** Documented proposals per theme id — same count as the theme page itself, never a guessed number. */
  proposalCounts: Record<string, number>;
}) {
  return (
    <section className="container-app py-12">
      <div className="flex flex-col gap-7 xl:flex-row xl:items-start xl:gap-12">
        <h2 className="relative flex shrink-0 items-start font-serif text-[1.8rem] font-semibold tracking-tight xl:whitespace-nowrap xl:text-[2rem]">
          <span className="relative inline-block">
            Les sujets qui comptent
            <Swoosh className="text-primary/70" />
          </span>
        </h2>

        <div className="flex flex-1 flex-wrap gap-2.5 xl:pt-1">
          {themes.map((theme, i) => {
            const color = PILL_COLORS[i % PILL_COLORS.length];
            const count = proposalCounts[theme.id] ?? 0;
            return (
              <Link
                key={theme.id}
                href={`/themes/${theme.slug}`}
                aria-label={`${theme.name}, ${count} proposition${count > 1 ? "s" : ""} documentée${count > 1 ? "s" : ""}`}
                style={{ ["--pill-tint" as string]: hexToRgba(color, 0.08) }}
                className="focus-ring group flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium transition-all hover:-translate-y-0.5 hover:border-border-strong hover:bg-[var(--pill-tint)] hover:shadow-[0_10px_20px_-14px_rgba(15,23,41,0.4)]"
              >
                <ThemeIcon icon={theme.icon} className="h-4 w-4 shrink-0" style={{ color }} />
                {theme.name}
                <span className="text-xs font-normal text-muted-2 tabular-nums" aria-hidden="true">
                  · {count}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
