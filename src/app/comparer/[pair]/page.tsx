import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CompareView, type ThemeRow } from "@/components/compare/compare-view";
import { themeSimilarity, verdictFromSimilarity } from "@/lib/compare";
import {
  getAllPositions,
  getCandidateBySlug,
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
    description: `Comparez les propositions de ${a.name} et ${b.name} thème par thème.`,
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

  const [candidateA, candidateB, themes, questions, positions] = await Promise.all([
    getCandidateBySlug(parsed.a),
    getCandidateBySlug(parsed.b),
    getThemes(),
    getQuestions(),
    getAllPositions(),
  ]);

  if (!candidateA || !candidateB || candidateA.id === candidateB.id) notFound();

  const [proposalsA, proposalsB] = await Promise.all([
    getProposalsForCandidate(candidateA.id),
    getProposalsForCandidate(candidateB.id),
  ]);

  const rows: ThemeRow[] = themes
    .map((theme) => {
      const itemsA = proposalsA.filter((p) => p.theme_id === theme.id);
      const itemsB = proposalsB.filter((p) => p.theme_id === theme.id);
      const similarity = themeSimilarity(theme.id, candidateA.id, candidateB.id, questions, positions);
      return {
        theme,
        verdict: verdictFromSimilarity(similarity),
        proposalsA: itemsA,
        proposalsB: itemsB,
      };
    })
    .filter((row) => row.proposalsA.length > 0 || row.proposalsB.length > 0);

  return (
    <div className="container-app max-w-6xl py-8 md:py-12">
      <Link
        href="/comparer"
        className="focus-ring inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft size={15} />
        Retour aux comparaisons
      </Link>

      <h1 className="mt-5 font-serif text-[2rem] font-semibold tracking-tight sm:text-[2.4rem]">
        <span style={{ color: candidateA.party?.color }}>{candidateA.name}</span>{" "}
        <span className="text-muted-2">vs</span>{" "}
        <span style={{ color: candidateB.party?.color }}>{candidateB.name}</span>
      </h1>
      <p className="mt-2 text-muted">Comparaison thème par thème, propositions sourcées.</p>

      <div className="mt-8">
        <CompareView
          candidateA={candidateA}
          candidateB={candidateB}
          rows={rows}
          sourcedCountA={proposalsA.length}
          sourcedCountB={proposalsB.length}
        />
      </div>
    </div>
  );
}
