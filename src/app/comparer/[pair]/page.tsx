import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CompareView } from "@/components/compare/compare-view";
import { buildThemeComparisons } from "@/lib/compare";
import {
  getAllPositions,
  getCandidateBySlug,
  getCandidates,
  getProposalsForCandidate,
  getQuestions,
  getThemes,
} from "@/lib/data/queries";

function parsePair(pair: string) {
  const [a, b] = pair.split("-vs-");
  return a && b ? { a, b } : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pair: string }>;
}): Promise<Metadata> {
  const { pair } = await params;
  const parsed = parsePair(pair);
  if (!parsed) return {};
  const [a, b] = await Promise.all([
    getCandidateBySlug(parsed.a),
    getCandidateBySlug(parsed.b),
  ]);
  if (!a || !b) return {};
  return {
    title: `${a.name} vs ${b.name}`,
    description: `Comparez les positions de ${a.name} et ${b.name}, sujet par sujet, à partir de sources vérifiables.`,
  };
}

export default async function ComparePairPage({
  params,
}: {
  params: Promise<{ pair: string }>;
}) {
  const { pair } = await params;
  const parsed = parsePair(pair);
  if (!parsed) notFound();

  const [candidateA, candidateB, themes, questions, positions, allCandidates] = await Promise.all([
    getCandidateBySlug(parsed.a),
    getCandidateBySlug(parsed.b),
    getThemes(),
    getQuestions(),
    getAllPositions(),
    getCandidates(),
  ]);

  if (!candidateA || !candidateB || candidateA.id === candidateB.id) notFound();

  const [proposalsA, proposalsB] = await Promise.all([
    getProposalsForCandidate(candidateA.id),
    getProposalsForCandidate(candidateB.id),
  ]);

  const blocks = buildThemeComparisons(
    themes,
    questions,
    positions,
    proposalsA,
    proposalsB,
    candidateA.id,
    candidateB.id
  );

  return (
    <div className="container-app max-w-6xl py-8 md:py-12">
      <Link
        href="/comparer"
        className="focus-ring inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft size={15} />
        Retour aux comparaisons
      </Link>

      <div className="mt-5">
        <CompareView
          candidateA={candidateA}
          candidateB={candidateB}
          blocks={blocks}
          allCandidates={allCandidates}
          sourcedCountA={proposalsA.length}
          sourcedCountB={proposalsB.length}
        />
      </div>
    </div>
  );
}
