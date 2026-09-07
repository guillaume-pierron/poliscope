import type { Metadata } from "next";
import { Compass } from "lucide-react";
import { PassageAuReelExplorer, type AnalyzedMeasure } from "@/components/passage-au-reel/passage-au-reel-explorer";
import { getCandidates, getProposals, getPublishedMeasureAnalysisBundles, getThemes } from "@/lib/data/queries";

export const metadata: Metadata = {
  title: "Passage au réel",
  description:
    "Coût, faisabilité, délais, bénéficiaires et impacts : ce que l'on peut réellement savoir derrière chaque proposition.",
};

export default async function PassageAuReelPage() {
  const [bundles, proposals, candidates, themes] = await Promise.all([
    getPublishedMeasureAnalysisBundles(),
    getProposals(),
    getCandidates(),
    getThemes(),
  ]);

  const measures: AnalyzedMeasure[] = bundles
    .map((bundle) => {
      const proposal = proposals.find((p) => p.id === bundle.analysis.proposal_id);
      if (!proposal) return null;
      const candidate = candidates.find((c) => c.id === proposal.candidate_id);
      if (!candidate) return null;
      const theme = themes.find((t) => t.id === proposal.theme_id);
      return { bundle, proposal, candidate, theme };
    })
    .filter((m): m is AnalyzedMeasure => m !== null);

  return (
    <div className="container-app max-w-5xl py-10 md:py-14">
      <div className="max-w-2xl">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1.5 text-sm font-medium text-primary">
          <Compass size={15} />
          Passage au réel
        </span>
        <h1 className="mt-4 text-balance font-serif text-[2.1rem] font-semibold leading-[1.1] tracking-tight sm:text-[2.5rem]">
          Les programmes passent au réel.
        </h1>
        <p className="mt-4 text-muted">
          Coût, faisabilité, délais, bénéficiaires et impacts : découvrez ce que l&apos;on peut réellement savoir
          derrière chaque proposition — et ce qui reste, honnêtement, incertain.{" "}
          <a href="/methodologie#passage-au-reel" className="underline underline-offset-2">
            Comment ces analyses sont construites
          </a>
          .
        </p>
      </div>

      <div className="mt-9">
        {measures.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border-strong p-8 text-center text-sm text-muted-2">
            Aucune analyse publiée pour le moment.
          </p>
        ) : (
          <PassageAuReelExplorer measures={measures} themes={themes} />
        )}
      </div>
    </div>
  );
}
