import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CandidateHeroCard } from "@/components/candidates/candidate-hero-card";
import { CandidateProximityCard, CandidatePointsCards } from "@/components/candidates/candidate-match-sidebar";
import { CandidateAtAGlanceCard } from "@/components/candidates/candidate-at-a-glance-card";
import { CandidateDeepenCard } from "@/components/candidates/candidate-deepen-card";
import { CandidateProposalsSection } from "@/components/candidates/candidate-proposals-section";
import { CandidatePositionList } from "@/components/candidates/candidate-position-list";
import { CandidateSourcesSection } from "@/components/candidates/candidate-sources-section";
import { PassageAuReelCandidateSummary } from "@/components/passage-au-reel/passage-au-reel-candidate-summary";
import { isQuantifiedProposal } from "@/lib/utils";
import {
  getCandidateBySlug,
  getCandidates,
  getPositionsForCandidate,
  getProposalsForCandidate,
  getPublishedMeasureAnalysisBundles,
  getQuestions,
  getThemes,
} from "@/lib/data/queries";
import { SITE_URL } from "@/lib/constants";

export async function generateStaticParams() {
  const candidates = await getCandidates();
  return candidates.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const candidate = await getCandidateBySlug(slug);
  if (!candidate) return {};
  return {
    title: candidate.name,
    description: candidate.biography,
    openGraph: { title: candidate.name, description: candidate.biography },
  };
}

export default async function CandidatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [candidate, themes] = await Promise.all([getCandidateBySlug(slug), getThemes()]);
  if (!candidate) notFound();

  const [proposals, positions, questions, allAnalysisBundles] = await Promise.all([
    getProposalsForCandidate(candidate.id),
    getPositionsForCandidate(candidate.id),
    getQuestions(),
    getPublishedMeasureAnalysisBundles(),
  ]);

  const sourceCount = new Set(proposals.map((p) => p.source_url)).size;
  const quantifiedCount = proposals.filter(isQuantifiedProposal).length;
  const proposalIds = new Set(proposals.map((p) => p.id));
  const candidateAnalysisBundles = allAnalysisBundles.filter((b) => proposalIds.has(b.analysis.proposal_id));
  const analyzedProposalIds = new Set(candidateAnalysisBundles.map((b) => b.analysis.proposal_id));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: candidate.name,
    description: candidate.biography,
    affiliation: candidate.party?.name,
    url: `${SITE_URL}/candidats/${candidate.slug}`,
  };

  return (
    <div className="container-app max-w-6xl py-8 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start lg:gap-8">
        {/* Left column: the candidate card, then proposals, Match positions,
            sources. La carte reste dans cette colonne : la mettre en pleine
            largeur repousserait les cartes de synthèse sous la ligne de
            flottaison. */}
        <div className="min-w-0 space-y-10">
          <CandidateHeroCard candidate={candidate} />

          <div>
            <CandidateProposalsSection
              proposals={proposals}
              themes={themes}
              candidateSlug={candidate.slug}
              analyzedProposalIds={analyzedProposalIds}
            />
            {proposals.length === 0 && (
              <p className="mt-6 rounded-xl border border-dashed border-border p-5 text-sm text-muted-2">
                Aucune proposition documentée pour ce candidat à ce stade.
              </p>
            )}
          </div>

          <div>
            <h2 id="positions" className="scroll-mt-24 text-2xl font-semibold tracking-tight">
              Ses positions sur les questions du Match
            </h2>
            <p className="mt-2 text-sm text-muted">
              Chaque position provient d&apos;une proposition sourcée — voir{" "}
              <Link href="/methodologie" className="underline underline-offset-2">
                comment c&apos;est calculé
              </Link>
              .
            </p>
            <div className="mt-6">
              <CandidatePositionList positions={positions} questions={questions} />
            </div>
          </div>

          <CandidateSourcesSection proposals={proposals} />

          <div className="rounded-xl border border-border bg-surface p-5 text-sm text-muted">
            Retrouvez le détail du calcul de proximité sur la page{" "}
            <Link href="/methodologie" className="underline underline-offset-2">
              méthodologie
            </Link>
            .
          </div>
        </div>

        {/* Right column: personal Match summary, always in this order.
            La carte a gauche, les cartes de synthèse à droite : c'est la
            structure de la page, elle ne bouge pas au fil des refontes. */}
        <div className="space-y-6 lg:sticky lg:top-24">
          <CandidateProximityCard candidate={candidate} />
          <CandidateAtAGlanceCard
            proposalCount={proposals.length}
            quantifiedCount={quantifiedCount}
            sourceCount={sourceCount}
          />
          <PassageAuReelCandidateSummary bundles={candidateAnalysisBundles} />
          <CandidatePointsCards candidate={candidate} />
          <CandidateDeepenCard slug={candidate.slug} />
        </div>
      </div>
    </div>
  );
}
