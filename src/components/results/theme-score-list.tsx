import type { ThemeMatchScore } from "@/lib/types";

/** Per-theme breakdown — every theme weighted equally, never by question count. */
export function ThemeScoreList({ themeScores }: { themeScores: ThemeMatchScore[] }) {
  if (themeScores.length === 0) return null;

  return (
    <div className="space-y-2.5">
      {themeScores.map(({ theme, score }) => (
        <div key={theme.id} className="flex items-center gap-3 text-sm">
          <span className="w-28 shrink-0 truncate text-muted sm:w-36">{theme.name}</span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-strong">
            <div className="h-full rounded-full bg-primary" style={{ width: `${score}%` }} />
          </div>
          <span className="w-9 shrink-0 text-right font-mono font-medium tabular-nums">
            {score}%
          </span>
        </div>
      ))}
    </div>
  );
}
