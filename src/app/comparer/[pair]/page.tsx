import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CompareTable, type ThemeRow } from "@/components/compare/compare-table";
import { ButtonLink } from "@/components/ui/button";
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
    <div className="container-app max-w-5xl py-10 md:py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {candidateA.name} <span className="text-muted-2">vs</span> {candidateB.name}
          </h1>
          <p className="mt-2 text-muted">Comparaison thème par thème, propositions sourcées.</p>
        </div>
        <div className="flex gap-2">
          <ButtonLink href={`/candidats/${candidateA.slug}`} variant="outline" size="sm">
            Programme de {candidateA.name.split(" ")[0]}
          </ButtonLink>
          <ButtonLink href={`/candidats/${candidateB.slug}`} variant="outline" size="sm">
            Programme de {candidateB.name.split(" ")[0]}
          </ButtonLink>
        </div>
      </div>

      <div className="mt-10">
        <CompareTable candidateA={candidateA} candidateB={candidateB} rows={rows} />
      </div>
    </div>
  );
}
