import { CompareShowcaseCard } from "@/components/home/compare-showcase-card";
import { MatchShowcaseCard } from "@/components/home/match-showcase-card";
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
}: {
  questionCount: number;
  proposalCount: number;
  headline: HeadlinePoll | null;
  candidates: Candidate[];
  compareCandidates: { a: Candidate; b: Candidate } | null;
  compareAgreement: { theme: Theme; verdict: ThemeVerdict } | null;
  compareDisagreement: { theme: Theme; verdict: ThemeVerdict } | null;
  simulatorSummary: { concernCount: number; quantifiedCount: number; totalEuro: number };
}) {
  return (
    <section className="container-app pb-20 pt-6">
      <div className="max-w-2xl">
        <h2 className="text-balance font-serif text-[1.9rem] font-semibold tracking-tight sm:text-[2.2rem]">
          La présidentielle, sans le brouillard.
        </h2>
        <p className="mt-3 text-muted">
          Voici ce que vous pouvez réellement faire avec Poliscope — sans parti pris.
        </p>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-[1.65fr_1fr]">
        <MatchShowcaseCard
          questionCount={questionCount}
          proposalCount={proposalCount}
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
    </section>
  );
}
