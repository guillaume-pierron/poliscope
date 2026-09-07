import { CompareShowcaseCard } from "@/components/home/compare-showcase-card";
import { MatchShowcaseCard } from "@/components/home/match-showcase-card";
import { PassageAuReelShowcaseBand } from "@/components/home/passage-au-reel-showcase-band";
import { PollsShowcaseCard } from "@/components/home/polls-showcase-card";
import { SimulatorShowcaseBand } from "@/components/home/simulator-showcase-band";
import type { HeadlinePoll } from "@/lib/data/queries";
import type { ThemeVerdict } from "@/lib/compare";
import type { Candidate, Theme } from "@/lib/types";

export function ToolsSection({
  questionCount,
  proposalCount,
  headline,
  candidates,
  compareCandidates,
  compareAgreement,
  compareDisagreement,
  simulatorSummary,
  analysisCount,
  themes,
}: {
  questionCount: number;
  proposalCount: number;
  headline: HeadlinePoll | null;
  candidates: Candidate[];
  compareCandidates: { a: Candidate; b: Candidate } | null;
  compareAgreement: { theme: Theme; verdict: ThemeVerdict } | null;
  compareDisagreement: { theme: Theme; verdict: ThemeVerdict } | null;
  simulatorSummary: { concernCount: number; quantifiedCount: number; totalEuro: number };
  /** Published "Passage au réel" analyses — the band hides itself when there are none. */
  analysisCount: number;
  themes: Theme[];
}) {
  return (
    // pt- généreux : la section suit désormais directement la fine bande de
    // preuve sous le hero, et non plus une section à l'espacement complet.
    <section className="container-app pb-14 pt-14">
      <div className="max-w-2xl">
        <h2 className="text-balance font-serif text-[1.9rem] font-semibold tracking-tight sm:text-[2.2rem]">
          Cinq outils, une seule règle&nbsp;:{" "}
          <span className="text-primary">tout est sourcé</span>.
        </h2>
        <p className="mt-3 text-muted">
          Chaque position, chaque chiffre renvoie à sa source d&apos;origine — vous pouvez toujours
          vérifier par vous-même, sans qu&apos;on vous dise quoi penser.
        </p>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-[1.65fr_1fr]">
        <MatchShowcaseCard
          questionCount={questionCount}
          proposalCount={proposalCount}
          candidates={candidates}
          themes={themes}
          className="lg:row-span-2"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:contents">
          <CompareShowcaseCard
            candidates={compareCandidates}
            agreement={compareAgreement}
            disagreement={compareDisagreement}
          />
          <PollsShowcaseCard headline={headline} candidates={candidates} />
        </div>
      </div>

      <SimulatorShowcaseBand
        concernCount={simulatorSummary.concernCount}
        quantifiedCount={simulatorSummary.quantifiedCount}
        totalEuro={simulatorSummary.totalEuro}
        className="mt-4"
      />

      <PassageAuReelShowcaseBand analysisCount={analysisCount} className="mt-4" />
    </section>
  );
}
