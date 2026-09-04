"use client";

import { cn } from "@/lib/utils";

export type HeroTab = "sondages" | "match";

export function HeroPanelSwitch({
  active,
  onChange,
  showChangedDot,
}: {
  active: HeroTab;
  onChange: (tab: HeroTab) => void;
  /** Small dot on "Mon Match" hinting the user's results shifted since last visit. */
  showChangedDot?: boolean;
}) {
  return (
    <div className="inline-flex gap-1 rounded-full border border-border-strong bg-surface p-1 text-xs">
      <button
        type="button"
        onClick={() => onChange("sondages")}
        className={cn(
          "rounded-full px-3 py-1.5 font-medium transition-colors",
          active === "sondages" ? "bg-card text-primary shadow-sm" : "text-muted hover:text-foreground"
        )}
      >
        Sondages
      </button>
      <button
        type="button"
        onClick={() => onChange("match")}
        className={cn(
          "relative rounded-full px-3 py-1.5 font-medium transition-colors",
          active === "match" ? "bg-card text-primary shadow-sm" : "text-muted hover:text-foreground"
        )}
      >
        Mon Match
        {showChangedDot && (
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-accent" />
        )}
      </button>
    </div>
  );
}
