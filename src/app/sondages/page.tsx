import type { Metadata } from "next";
import { LineChart } from "lucide-react";
import { AverageExplainer } from "@/components/polls/average-explainer";
import { EvolutionChart } from "@/components/polls/evolution-chart";
import { PollFilters } from "@/components/polls/poll-filters";
import { ReadingTips } from "@/components/polls/reading-tips";
import { RecentChanges } from "@/components/polls/recent-changes";
import { TodaySnapshot } from "@/components/polls/today-snapshot";
import { collectPremierTourHeadlines, computeSnapshot } from "@/lib/polls-aggregate";
import { getCandidates, getPollResults, getPollScenarios, getPolls } from "@/lib/data/queries";
import type { PollScenario, PollResult } from "@/lib/types";

export const metadata: Metadata = {
  title: "Sondages",
  description: "Suivez les tendances de la présidentielle 2027 et leur évolution dans le temps.",
};

const SNAPSHOT_WINDOW = 5;

export default async function SondagesPage() {
  const [polls, scenarios, candidates] = await Promise.all([
    getPolls(),
    getPollScenarios(),
    getCandidates(),
  ]);

  const resultsByScenario: Record<string, PollResult[]> = {};
  await Promise.all(
    scenarios.map(async (scenario) => {
      resultsByScenario[scenario.id] = await getPollResults(scenario.id);
    })
  );

  const scenariosByPoll: Record<string, PollScenario[]> = {};
  for (const scenario of scenarios) {
    (scenariosByPoll[scenario.poll_id] ??= []).push(scenario);
  }
  for (const list of Object.values(scenariosByPoll)) {
    list.sort((a, b) => a.order_index - b.order_index);
  }

  const premierTourHeadlines = collectPremierTourHeadlines(polls, scenariosByPoll, resultsByScenario);
  const snapshot = computeSnapshot(premierTourHeadlines, candidates, SNAPSHOT_WINDOW);

  const hasPremierTour = premierTourHeadlines.length > 0;
  const hasSecondTour = polls.some((p) => (scenariosByPoll[p.id] ?? []).some((s) => s.round === "second_tour"));
  const defaultRound = hasPremierTour ? "premier_tour" : hasSecondTour ? "second_tour" : "premier_tour";

  return (
    <div className="container-app max-w-6xl py-8 md:py-12">
      <h1 className="font-serif text-[2rem] font-semibold tracking-tight sm:text-[2.4rem]">
        Sondages présidentiels 2027
      </h1>
      <p className="mt-2 max-w-2xl text-muted">
        Retrouvez les derniers sondages d&apos;intentions de vote et leur évolution.
      </p>

      <div className="mt-6">
        <ReadingTips />
      </div>

      {polls.length === 0 ? (
        <div className="mt-8 flex flex-col items-center rounded-xl border border-dashed border-border-strong py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary">
            <LineChart size={20} />
          </span>
          <p className="mt-4 max-w-md text-muted">
            Aucun sondage n&apos;est encore répertorié pour la présidentielle 2027. Ce module
            n&apos;affiche que des chiffres réels, publiés par un institut identifié et sourcé — il
            se remplira au fur et à mesure des publications.
          </p>
        </div>
      ) : (
        <>
          {hasPremierTour && (
            <div className="mt-6">
              <TodaySnapshot
                entries={snapshot}
                windowSize={SNAPSHOT_WINDOW}
                latestPublishedAt={premierTourHeadlines[0].poll.published_at}
              />
            </div>
          )}

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
            <div id="sondages-liste" className="min-w-0 scroll-mt-24">
              <h2 className="mb-4 text-lg font-semibold">Derniers sondages publiés</h2>
              <PollFilters
                polls={polls}
                scenariosByPoll={scenariosByPoll}
                resultsByScenario={resultsByScenario}
                candidates={candidates}
                defaultRound={defaultRound}
              />
            </div>

            <div className="space-y-5 lg:sticky lg:top-24">
              {hasPremierTour && <RecentChanges entries={snapshot} windowSize={SNAPSHOT_WINDOW} />}
              {hasPremierTour && (
                <EvolutionChart headlines={premierTourHeadlines} candidates={candidates} />
              )}
              <AverageExplainer />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
