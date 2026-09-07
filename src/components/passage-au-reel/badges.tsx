import { CircleHelp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CHECKLIST_GLYPH, type ChecklistItem } from "@/lib/passage-au-reel/feasibility";
import {
  CONFIDENCE_LEVEL_LABELS,
  FEASIBILITY_STATUS_LABELS,
  type ConfidenceLevel,
  type FeasibilityStatus,
} from "@/lib/types";

const FEASIBILITY_VARIANT: Record<FeasibilityStatus, "success" | "primary" | "accent" | "danger" | "default"> = {
  faisable_parametres_connus: "success",
  faisable_sous_conditions: "primary",
  mise_en_oeuvre_complexe: "accent",
  informations_insuffisantes: "default",
  obstacle_juridique_majeur: "danger",
};

export function FeasibilityBadge({ status, className }: { status: FeasibilityStatus; className?: string }) {
  return (
    <Badge variant={FEASIBILITY_VARIANT[status]} className={cn("text-sm", className)}>
      {FEASIBILITY_STATUS_LABELS[status]}
    </Badge>
  );
}

const CONFIDENCE_VARIANT: Record<ConfidenceLevel, "success" | "accent" | "default"> = {
  elevee: "success",
  moyenne: "accent",
  faible: "default",
};

export function ConfidenceBadge({ level, className }: { level: ConfidenceLevel; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs text-muted", className)}>
      <CircleHelp size={13} className="shrink-0" />
      Niveau de confiance :
      <Badge variant={CONFIDENCE_VARIANT[level]}>{CONFIDENCE_LEVEL_LABELS[level]}</Badge>
    </span>
  );
}

const CHECKLIST_TONE: Record<ChecklistItem["state"], string> = {
  ok: "text-success",
  warning: "text-accent",
  unknown: "text-muted-2",
};

/**
 * Never color-only: the glyph (✓ / ⚠ / ?) and the label are both always
 * shown, so the meaning survives grayscale or a screen reader.
 */
export function FeasibilityChecklist({ items, className }: { items: ChecklistItem[]; className?: string }) {
  if (items.length === 0) return null;
  return (
    <ul className={cn("space-y-1.5 text-sm", className)}>
      {items.map((item) => (
        <li key={item.label} className={cn("flex items-start gap-2", CHECKLIST_TONE[item.state])}>
          <span aria-hidden="true" className="mt-0.5 w-4 shrink-0 text-center font-semibold">
            {CHECKLIST_GLYPH[item.state]}
          </span>
          <span className="text-foreground/85">{item.label}</span>
        </li>
      ))}
    </ul>
  );
}
