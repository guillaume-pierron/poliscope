import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PollCard } from "@/components/polls/poll-card";
import { TrendChart } from "@/components/polls/trend-chart";
import { getCandidates, getPollResults, getPolls } from "@/lib/data/queries";

export const metadata: Metadata = {
  title: "Sondages",
  description: "Suivez les tendances de la présidentielle 2027 et leur évolution dans le temps.",
};

export default async function SondagesPage() {
  const [polls, candidates] = await Promise.all([getPolls(), getCandidates()]);
  const resultsByPoll: Record<string, Awaited<ReturnType<typeof getPollResults>>> = {};
  await Promise.all(
    polls.map(async (poll) => {
      resultsByPoll[poll.id] = await getPollResults(poll.id);
    })
  );

  const latest = polls[0];

  return (
    <div className="container-app max-w-4xl py-10 md:py-16">
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Sondages</h1>
        <Badge variant="demo">Données de démonstration</Badge>
      </div>
      <p className="mt-2 max-w-2xl text-muted">
        Intentions de vote au premier tour, agrégées par institut. Ces chiffres sont fictifs et
        illustrent la structure du futur module Sondages.
      </p>

      <div className="mt-6 flex items-start gap-3 rounded-xl border border-border bg-surface p-4 text-sm text-muted">
        <AlertTriangle size={16} className="mt-0.5 shrink-0" />
        <p>
          Un sondage est une photographie à un instant donné, avec une marge d&apos;erreur. Ni une
          moyenne ni une projection ne doivent être lues comme une probabilité certaine de
          victoire.
        </p>
      </div>

      {latest && (
        <section className="mt-10">
          <h2 className="mb-4 text-lg font-semibold">Évolution des intentions de vote</h2>
          <div className="rounded-xl border border-border bg-background p-6">
            <TrendChart polls={polls} resultsByPoll={resultsByPoll} candidates={candidates} />
          </div>
        </section>
      )}

      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold">Derniers sondages publiés</h2>
        <div className="space-y-4">
          {polls.map((poll) => (
            <PollCard
              key={poll.id}
              poll={poll}
              results={resultsByPoll[poll.id] ?? []}
              candidates={candidates}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
