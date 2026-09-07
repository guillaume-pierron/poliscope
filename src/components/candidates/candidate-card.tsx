import Link from "next/link";
import { ArrowRight, BarChart3, FileText, Scale, Target } from "lucide-react";
import { CandidateAvatar } from "./candidate-avatar";
import { Badge } from "@/components/ui/badge";
import { ORIENTATION_LABELS } from "@/lib/types";
import { cn } from "@/lib/utils";
import type { Candidate } from "@/lib/types";

export function CandidateCard({
  candidate,
  proposalCount,
  themeCount,
  proximity,
}: {
  candidate: Candidate;
  /** Propositions réellement documentées pour ce candidat. */
  proposalCount: number;
  /** Thèmes distincts couverts par ces propositions. */
  themeCount: number;
  /**
   * Proximité avec les réponses du visiteur, calculée sur son appareil.
   * `null` tant qu'il n'a pas fait le Match — on n'affiche alors aucun
   * pourcentage plutôt qu'un score qui n'existe pas.
   */
  proximity: number | null;
}) {
  const color = candidate.party?.color ?? "var(--primary)";

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_44px_-26px_rgba(15,23,41,0.28)]">
      {/* Seul marqueur coloré de la carte : sur une grille de treize
          candidats, multiplier les rappels de la couleur du parti donnait à
          chaque marque une présence que ce site n'a pas à lui accorder. */}
      <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1.5" style={{ background: color }} />

      <div className="flex flex-1 flex-col p-5 pl-7">
        <div className="flex items-start gap-4">
          <CandidateAvatar
            name={candidate.name}
            color={candidate.party?.color}
            photoUrl={candidate.photo_url}
            size="lg"
            className="ring-4 ring-card"
          />
          <div className="min-w-0 flex-1">
            <h3 className="font-serif text-[1.35rem] font-semibold leading-tight tracking-tight">
              {candidate.name}
            </h3>
            <p className="mt-0.5 truncate text-sm text-muted">{candidate.party?.name}</p>
            {candidate.party && (
              <span className="mt-2 inline-flex rounded-full bg-surface px-2.5 py-1 text-xs font-medium text-muted">
                {ORIENTATION_LABELS[candidate.party.orientation]}
              </span>
            )}
          </div>
          {/* Sigle du parti, à défaut d'un logo fourni. */}
          {candidate.party?.short_name && (
            <span
              aria-hidden="true"
              className="shrink-0 font-serif text-lg font-bold tracking-tight text-muted-2"
            >
              {candidate.party.short_name}
            </span>
          )}
          {candidate.is_demo && <Badge variant="demo">Démo</Badge>}
        </div>

        <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-muted">{candidate.biography}</p>

        {/* La proximité n'apparaît qu'une fois le Match fait : une case vide
            sur trois, à la première visite, déséquilibrait la rangée. */}
        <div
          className={cn(
            "mt-4 grid gap-2 border-t border-border pt-4",
            proximity === null ? "grid-cols-2" : "grid-cols-3"
          )}
        >
          <Stat icon={FileText} value={proposalCount} label="propositions sourcées" />
          <Stat icon={BarChart3} value={themeCount} label="thèmes couverts" />
          {proximity !== null && (
            <Stat icon={Target} value={`${proximity} %`} label="de proximité" />
          )}
        </div>

        <div className="mt-5 flex gap-2.5">
          <Link
            href={`/candidats/${candidate.slug}`}
            className="focus-ring inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Voir le programme
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href={`/comparer?a=${candidate.slug}`}
            className="focus-ring inline-flex items-center justify-center gap-2 rounded-xl border border-border-strong bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:bg-surface"
          >
            <Scale size={15} />
            Comparer
          </Link>
        </div>
      </div>
    </article>
  );
}

function Stat({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof FileText;
  value: number | string;
  label: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon size={15} className="mt-0.5 shrink-0 text-primary" />
      <span className="min-w-0">
        <span className="block text-sm font-semibold leading-tight">{value}</span>
        <span className="block text-[0.7rem] leading-tight text-muted-2">{label}</span>
      </span>
    </div>
  );
}
