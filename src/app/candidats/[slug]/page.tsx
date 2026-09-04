import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BadgeCheck, Globe, SplitSquareHorizontal } from "lucide-react";
import { CandidateHeroPhoto } from "@/components/candidates/candidate-hero-photo";
import { CandidateProximityCard, CandidatePointsCards } from "@/components/candidates/candidate-match-sidebar";
import { CandidateAtAGlanceCard } from "@/components/candidates/candidate-at-a-glance-card";
import { CandidateDeepenCard } from "@/components/candidates/candidate-deepen-card";
import { CandidateProposalsSection } from "@/components/candidates/candidate-proposals-section";
import { CandidatePositionList } from "@/components/candidates/candidate-position-list";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { ORIENTATION_LABELS } from "@/lib/types";
import { isQuantifiedProposal } from "@/lib/utils";
import {
  getCandidateBySlug,
  getCandidates,
  getPositionsForCandidate,
  getProposalsForCandidate,
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

  const [proposals, positions, questions] = await Promise.all([
    getProposalsForCandidate(candidate.id),
    getPositionsForCandidate(candidate.id),
    getQuestions(),
  ]);

  const sourceCount = new Set(proposals.map((p) => p.source_url)).size;
  const quantifiedCount = proposals.filter(isQuantifiedProposal).length;

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

      <Link
        href="/candidats"
        className="focus-ring inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft size={15} />
        Retour à la liste des candidats
      </Link>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start lg:gap-8">
        {/* Left column: hero, proposals, Match positions reference */}
        <div className="min-w-0 space-y-8">
          <div className="flex flex-col gap-6 rounded-[24px] border border-border bg-card p-6 sm:flex-row sm:p-8">
            <CandidateHeroPhoto
              name={candidate.name}
              color={candidate.party?.color}
              photoUrl={candidate.photo_url}
              className="h-56 w-full shrink-0 sm:h-auto sm:w-48"
            />
            <div className="min-w-0 flex-1">
              <h1 className="font-serif text-[2.1rem] font-semibold leading-tight tracking-tight sm:text-[2.4rem]">
                {candidate.name}
              </h1>
              <p className="mt-1.5 text-muted">
                {candidate.party?.name}
                {candidate.party && (
                  <>
                    {" · "}
                    <span className="text-muted-2">
                      {ORIENTATION_LABELS[candidate.party.orientation]}
                    </span>
                  </>
                )}
              </p>

              <Badge variant="primary" className="mt-3">
                <BadgeCheck size={13} />
                Candidat déclaré
              </Badge>

              <p className="mt-4 max-w-2xl leading-relaxed text-foreground/85">
                {candidate.biography}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <ButtonLink href={`/comparer?a=${candidate.slug}`} variant="outline" size="sm">
                  <SplitSquareHorizontal size={16} />
                  Comparer ce candidat
                </ButtonLink>
                <ButtonLink href="/match" variant="accent" size="sm">
                  Faire mon Match
                </ButtonLink>
                {candidate.official_website && (
                  <a
                    href={candidate.official_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
                  >
                    <Globe size={14} />
                    Site officiel
                  </a>
                )}
              </div>
            </div>
          </div>

          <CandidateProposalsSection
            proposals={proposals}
            themes={themes}
            candidateSlug={candidate.slug}
          />
          {proposals.length === 0 && (
            <p className="rounded-xl border border-dashed border-border p-5 text-sm text-muted-2">
              Aucune proposition documentée pour ce candidat à ce stade.
            </p>
          )}

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

          <div className="rounded-xl border border-border bg-surface p-5 text-sm text-muted">
            Retrouvez le détail du calcul de proximité sur la page{" "}
            <Link href="/methodologie" className="underline underline-offset-2">
              méthodologie
            </Link>
            .
          </div>
        </div>

        {/* Right column: personal Match summary, always in this order */}
        <div className="space-y-6 lg:sticky lg:top-24">
          <CandidateProximityCard candidate={candidate} />
          <CandidateAtAGlanceCard
            proposalCount={proposals.length}
            quantifiedCount={quantifiedCount}
            sourceCount={sourceCount}
          />
          <CandidatePointsCards candidate={candidate} />
          <CandidateDeepenCard slug={candidate.slug} />
        </div>
      </div>
    </div>
  );
}
