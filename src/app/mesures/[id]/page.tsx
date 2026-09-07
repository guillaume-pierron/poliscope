import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { CandidateAvatarWithParty } from "@/components/candidates/candidate-avatar-party";
import { ThemeIcon } from "@/lib/theme-icons";
import { Badge } from "@/components/ui/badge";
import { MeasureAnalysisPanel } from "@/components/passage-au-reel/measure-analysis-panel";
import { PROPOSAL_STATUS_LABELS } from "@/lib/types";
import {
  getCandidates,
  getProposalById,
  getPublishedMeasureAnalysisBundleForProposal,
  getThemes,
} from "@/lib/data/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const proposal = await getProposalById(id);
  if (!proposal) return {};
  return {
    title: proposal.title,
    description: proposal.summary,
  };
}

export default async function MesurePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [proposal, themes, allCandidates] = await Promise.all([
    getProposalById(id),
    getThemes(),
    getCandidates(),
  ]);
  if (!proposal) notFound();

  const candidateFull = allCandidates.find((c) => c.id === proposal.candidate_id);
  const theme = themes.find((t) => t.id === proposal.theme_id);
  const bundle = await getPublishedMeasureAnalysisBundleForProposal(proposal.id);

  return (
    <div className="container-app max-w-3xl py-10 md:py-14">
      <Link
        href={candidateFull ? `/candidats/${candidateFull.slug}` : "/candidats"}
        className="focus-ring inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-foreground"
      >
        <ArrowLeft size={15} />
        Retour à la fiche candidat
      </Link>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          {theme && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1.5 text-sm font-medium text-primary">
              <ThemeIcon icon={theme.icon} className="h-4 w-4" />
              {theme.name}
            </span>
          )}
          <h1 className="mt-3 text-balance font-serif text-[1.9rem] font-semibold leading-snug tracking-tight sm:text-[2.2rem]">
            {proposal.title}
          </h1>
          <p className="mt-2 text-muted">{proposal.summary}</p>
        </div>
      </div>

      {candidateFull && (
        <Link
          href={`/candidats/${candidateFull.slug}`}
          className="focus-ring mt-5 flex w-fit items-center gap-3 rounded-2xl border border-border bg-card p-3 pr-5 transition-colors hover:bg-surface"
        >
          <CandidateAvatarWithParty candidate={candidateFull} size="md" />
          <div>
            <p className="text-sm font-medium">{candidateFull.name}</p>
            <p className="text-xs text-muted">{candidateFull.party?.name}</p>
          </div>
        </Link>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Badge variant="default">{PROPOSAL_STATUS_LABELS[proposal.status]}</Badge>
        <a
          href={proposal.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          Voir la source originale ({proposal.source_name})
          <ExternalLink size={13} />
        </a>
      </div>

      <div className="mt-9">
        {bundle ? (
          <MeasureAnalysisPanel bundle={bundle} />
        ) : (
          <div className="rounded-2xl border border-dashed border-border-strong p-6 text-center">
            <p className="font-medium">Faisabilité & impact — analyse non disponible</p>
            <p className="mt-2 text-sm text-muted">
              Cette mesure n&apos;a pas encore fait l&apos;objet d&apos;une analyse de faisabilité publiée par
              Poliscope. Voir{" "}
              <Link href="/passage-au-reel" className="underline underline-offset-2">
                les mesures déjà analysées
              </Link>
              .
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
