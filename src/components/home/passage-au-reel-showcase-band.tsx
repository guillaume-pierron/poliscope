import Link from "next/link";
import { ArrowRight, Clock, Coins, FileText, Scale, Users } from "lucide-react";
import { formatRange } from "@/lib/passage-au-reel/format";
import {
  CONFIDENCE_LEVEL_LABELS,
  FEASIBILITY_STATUS_LABELS,
  LEGAL_PATH_LABELS,
  type MeasureAnalysisBundle,
  type Proposal,
} from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Homepage entry point for "Faisabilité & impact". Renders nothing when no
 * analysis is published yet — an empty promise on the homepage would be
 * worse than no promise at all. Les quatre indicateurs viennent d'une
 * analyse réellement publiée, nommée juste en dessous : ce sont les chiffres
 * d'une mesure précise, jamais une moyenne ni un ordre de grandeur inventé.
 */
export function PassageAuReelShowcaseBand({
  analysisCount,
  showcase,
  className,
}: {
  analysisCount: number;
  showcase: { bundle: MeasureAnalysisBundle; proposal: Proposal } | null;
  className?: string;
}) {
  if (analysisCount === 0) return null;

  const stats = showcase ? buildStats(showcase.bundle) : [];

  return (
    <Link
      href="/passage-au-reel"
      className={cn(
        "focus-ring group flex flex-col gap-6 rounded-[24px] border border-primary/20 bg-primary-soft/40 p-7 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/35 sm:p-8",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-card text-primary">
          <FileText size={20} strokeWidth={1.75} />
        </span>
        <div className="min-w-0">
          <h3 className="font-serif text-[1.4rem] font-semibold tracking-tight sm:text-[1.6rem]">
            Combien ça coûte&nbsp;? Est-ce vraiment applicable&nbsp;?
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
            Pour {analysisCount} mesure{analysisCount > 1 ? "s" : ""} analysée
            {analysisCount > 1 ? "s" : ""} : le cadre juridique, le coût quand il est chiffré, qui
            est concerné — et un niveau de confiance sur la mise en œuvre.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-5 xl:flex-row xl:items-stretch">
        <div className="min-w-0 flex-1">
          {stats.length > 0 ? (
            <>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                      <stat.icon size={17} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs text-muted-2">{stat.label}</span>
                      <span
                        className={cn(
                          "mt-0.5 block text-sm font-semibold",
                          stat.highlight && "text-success"
                        )}
                      >
                        {stat.value}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted-2">{stat.detail}</span>
                    </span>
                  </div>
                ))}
              </div>
              {showcase && (
                <p className="mt-3 text-xs text-muted-2">
                  Chiffres de la mesure «&nbsp;{showcase.proposal.title}&nbsp;» — chaque analyse a
                  les siens.
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-2">
              Le détail de chaque analyse est disponible sur la page dédiée.
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center xl:border-l xl:border-primary/20 xl:pl-6">
          <span className="focus-ring inline-flex items-center gap-1.5 rounded-xl bg-foreground px-6 py-3 text-sm font-medium text-card transition-transform group-hover:-translate-y-0.5">
            Explorer faisabilité &amp; impact
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

type Stat = {
  icon: typeof Scale;
  label: string;
  value: string;
  detail: string;
  highlight?: boolean;
};

/** N'ajoute une carte que si la donnée existe : rien n'est comblé par une estimation. */
function buildStats(bundle: MeasureAnalysisBundle): Stat[] {
  const { analysis, budgetEstimates } = bundle;
  const stats: Stat[] = [];

  if (analysis.legal_path) {
    stats.push({
      icon: Scale,
      label: "Cadre juridique",
      value: LEGAL_PATH_LABELS[analysis.legal_path],
      detail: analysis.legal_constitutional_change_required
        ? "révision constitutionnelle requise"
        : analysis.legal_eu_change_required
          ? "modification européenne requise"
          : "dans le droit actuel",
    });
  }

  const costs = budgetEstimates
    .flatMap((e) => [e.annual_cost_min, e.annual_cost_central, e.annual_cost_max])
    .filter((n): n is number => n !== null);
  if (costs.length > 0) {
    stats.push({
      icon: Coins,
      label: "Coût annuel",
      value: formatRange(Math.min(...costs), null, Math.max(...costs), "Md€") ?? "—",
      detail:
        budgetEstimates.length > 1
          ? `${budgetEstimates.length} chiffrages sourcés`
          : "estimation sourcée",
    });
  }

  const count = analysis.beneficiaries_count_central;
  if (count !== null) {
    stats.push({
      icon: Users,
      label: "Qui est concerné",
      value:
        count >= 1_000_000
          ? `~ ${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 }).format(count / 1_000_000)} millions`
          : new Intl.NumberFormat("fr-FR").format(count),
      detail: "de personnes",
    });
  }

  if (analysis.feasibility_status) {
    stats.push({
      icon: Clock,
      label: "Faisabilité",
      value: FEASIBILITY_STATUS_LABELS[analysis.feasibility_status],
      detail: analysis.confidence_level
        ? CONFIDENCE_LEVEL_LABELS[analysis.confidence_level].toLowerCase()
        : "niveau de confiance non renseigné",
      highlight: analysis.feasibility_status === "faisable_parametres_connus",
    });
  }

  return stats;
}
