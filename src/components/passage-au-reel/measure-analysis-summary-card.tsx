import Link from "next/link";
import { AlertTriangle, ArrowRight, Clock, Coins, Library, Lightbulb, Users } from "lucide-react";
import { CandidateAvatar } from "@/components/candidates/candidate-avatar";
import { ThemeIcon } from "@/lib/theme-icons";
import { formatCentral, formatCount, formatRange } from "@/lib/passage-au-reel/format";
import { cn } from "@/lib/utils";
import { FeasibilityBadge } from "./badges";
import {
  CONFIDENCE_LEVEL_LABELS,
  type Candidate,
  type ConfidenceLevel,
  type FeasibilityStatus,
  type MeasureAnalysisBundle,
  type Proposal,
  type Theme,
} from "@/lib/types";

/** Remplissage et teinte de la jauge de certitude — jamais un pourcentage, qui laisserait croire à une mesure fine. */
const CONFIDENCE_GAUGE: Record<ConfidenceLevel, { width: string; bar: string; text: string }> = {
  elevee: { width: "88%", bar: "bg-success", text: "text-success" },
  moyenne: { width: "55%", bar: "bg-accent", text: "text-accent" },
  faible: { width: "25%", bar: "bg-danger", text: "text-danger" },
};

/** Teinte de l'encart de synthèse, alignée sur le statut de faisabilité. */
const SUMMARY_TONE: Record<FeasibilityStatus, string> = {
  faisable_parametres_connus: "border-success/20 bg-success-soft/50 text-success",
  faisable_sous_conditions: "border-primary/20 bg-primary-soft/50 text-primary",
  mise_en_oeuvre_complexe: "border-accent/20 bg-accent-soft/50 text-accent",
  informations_insuffisantes: "border-border bg-surface text-muted",
  obstacle_juridique_majeur: "border-danger/20 bg-danger-soft/50 text-danger",
};

/** Compact card for /passage-au-reel and the candidate-page teaser — never a full re-render of the fiche. */
export function MeasureAnalysisSummaryCard({
  bundle,
  proposal,
  candidate,
  theme,
  className,
}: {
  bundle: MeasureAnalysisBundle;
  proposal: Proposal;
  candidate: Candidate;
  theme: Theme | undefined;
  className?: string;
}) {
  const { analysis, budgetEstimates, impacts, assumptions } = bundle;

  const cost = budgetEstimates[0]
    ? (formatRange(
        budgetEstimates[0].annual_cost_min,
        budgetEstimates[0].annual_cost_central,
        budgetEstimates[0].annual_cost_max,
        budgetEstimates[0].currency
      ) ?? formatCentral(budgetEstimates[0].annual_cost_central, budgetEstimates[0].currency))
    : null;

  const delay =
    analysis.legal_implementation_delay_min_months !== null ||
    analysis.legal_implementation_delay_max_months !== null
      ? formatRange(
          analysis.legal_implementation_delay_min_months,
          null,
          analysis.legal_implementation_delay_max_months,
          "mois"
        )
      : null;

  // Un chiffrage sourcé quand il existe ; à défaut le premier groupe décrit,
  // qui dit « qui » sans prétendre dire « combien ».
  const beneficiaries =
    analysis.beneficiaries_count_central !== null
      ? formatPeople(analysis.beneficiaries_count_central)
      : (analysis.beneficiaries_groups[0] ?? null);

  const sourceCount = new Set(
    [
      ...budgetEstimates.map((b) => b.source_url ?? b.source_name),
      ...impacts.map((i) => i.source_url ?? i.source_name).filter(Boolean),
      ...assumptions.map((a) => a.source_url ?? a.source_name).filter(Boolean),
      proposal.source_url,
    ].filter(Boolean)
  ).size;

  const gauge = analysis.confidence_level ? CONFIDENCE_GAUGE[analysis.confidence_level] : null;

  return (
    <Link
      href={`/mesures/${proposal.id}`}
      className={cn(
        "focus-ring group flex flex-col rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[0_16px_36px_-24px_rgba(15,23,41,0.3)]",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <CandidateAvatar
            name={candidate.name}
            color={candidate.party?.color}
            photoUrl={candidate.photo_url}
            size="sm"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{candidate.name}</p>
            {theme && (
              <p className="flex items-center gap-1 text-xs text-muted">
                <ThemeIcon icon={theme.icon} className="h-3 w-3" />
                {theme.name}
              </p>
            )}
          </div>
        </div>
        {analysis.status === "outdated" && (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent">
            <AlertTriangle size={11} />À actualiser
          </span>
        )}
      </div>

      <h3 className="mt-3.5 font-serif text-[1.15rem] font-semibold leading-snug tracking-tight">
        {proposal.title}
      </h3>

      {analysis.feasibility_status && (
        <FeasibilityBadge status={analysis.feasibility_status} className="mt-3 w-fit" />
      )}

      {/* « Non chiffré » est une information, pas un trou à combler : chaque
          ligne absente est affichée comme telle plutôt que masquée. */}
      <dl className="mt-4 space-y-2 border-t border-border pt-4 text-xs">
        <Row icon={Coins} label="Coût annuel" value={cost} fallback="Non chiffré" />
        <Row icon={Clock} label="Délai de mise en œuvre" value={delay} fallback="Non documenté" />
        <Row icon={Users} label="Bénéficiaires" value={beneficiaries} fallback="Non documentés" />
        <Row
          icon={Library}
          label="Sources"
          value={`${sourceCount} source${sourceCount > 1 ? "s" : ""}`}
        />
      </dl>

      {gauge && analysis.confidence_level && (
        <div className="mt-4 flex items-center gap-2.5">
          <span className="shrink-0 text-xs text-muted">Niveau de certitude</span>
          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-strong">
            <span className={cn("block h-full rounded-full", gauge.bar)} style={{ width: gauge.width }} />
          </span>
          <span className={cn("shrink-0 text-xs font-semibold", gauge.text)}>
            {confidenceWord(analysis.confidence_level)}
          </span>
        </div>
      )}

      {analysis.summary && (
        <div
          className={cn(
            "mt-4 rounded-xl border p-3.5",
            analysis.feasibility_status
              ? SUMMARY_TONE[analysis.feasibility_status]
              : "border-border bg-surface text-muted"
          )}
        >
          <p className="flex items-center gap-1.5 text-xs font-semibold">
            <Lightbulb size={13} />
            Ce que dit l&apos;analyse
          </p>
          <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-foreground/80">
            {analysis.summary}
          </p>
        </div>
      )}

      <span className="mt-4 flex items-center gap-1.5 text-sm font-medium text-primary">
        Voir l&apos;analyse
        <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

/** « ~ 2,2 millions » plutôt que « 2 200 000 » : la carte n'a pas la place, et
 *  l'ordre de grandeur suffit ici — la fiche donne le chiffre exact et sa source. */
function formatPeople(count: number): string {
  if (count >= 1_000_000) {
    return `~ ${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 }).format(count / 1_000_000)} millions`;
  }
  return formatCount(count) ?? "—";
}

/** « Confiance moyenne » → « Moyenne » : le libellé de la jauge porte déjà le mot. */
function confidenceWord(level: ConfidenceLevel): string {
  const word = CONFIDENCE_LEVEL_LABELS[level].replace("Confiance ", "");
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function Row({
  icon: Icon,
  label,
  value,
  fallback = "—",
}: {
  icon: typeof Coins;
  label: string;
  value: string | null;
  /** Ce qu'affiche la ligne quand aucune source ne la renseigne — jamais un blanc. */
  fallback?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="flex shrink-0 items-center gap-1.5 text-muted-2">
        <Icon size={13} className="shrink-0" />
        {label}
      </dt>
      {/* Un groupe de bénéficiaires peut être une phrase entière : la valeur
          doit pouvoir se replier, sinon elle pousse la carte hors de sa colonne. */}
      <dd className={cn("min-w-0 text-right font-medium", value ? "text-foreground" : "text-muted-2 italic")}>
        {value ?? fallback}
      </dd>
    </div>
  );
}
