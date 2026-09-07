"use client";

import { useEffect, useState } from "react";
import { HeroPanelSwitch, type HeroTab } from "./hero-panel-switch";
import { PollHeroPanel } from "./poll-hero-panel";
import { MatchHeroPanel } from "./match-hero-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { loadAnswers } from "@/lib/match-storage";
import type { HeadlinePoll } from "@/lib/data/queries";
import type { Candidate, UserAnswer } from "@/lib/types";

/**
 * The hero's right-hand panel always opens on "Mon Match" — either the
 * visitor's own results if they've taken it on this device, or an
 * explained example if they haven't. Polls stay one click away: they're
 * useful, but they're the least distinctive thing Poliscope does, and
 * leading with them made the site read as yet another poll aggregator.
 * Reads localStorage only — never touches the server with a visitor's
 * answers. Renders a neutral skeleton until that check resolves, so the
 * server-rendered markup never has to guess.
 */
export function HomeHeroPanel({
  candidates,
  headline,
  questionCount,
}: {
  candidates: Candidate[];
  headline: HeadlinePoll | null;
  questionCount: number;
}) {
  const [answers, setAnswers] = useState<UserAnswer[] | null>(null);
  const [tab, setTab] = useState<HeroTab | null>(null);

  useEffect(() => {
    const loaded = loadAnswers();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAnswers(loaded);
    setTab("match");
  }, []);

  if (answers === null || tab === null) {
    return (
      <div className="space-y-3 rounded-[20px] border border-border bg-card p-6 shadow-[0_24px_70px_-38px_rgba(15,23,41,0.35)]">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  const hasMatch = answers.some((a) => a.value !== null);

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <HeroPanelSwitch active={tab} onChange={setTab} />
      </div>
      {tab === "sondages" ? (
        <PollHeroPanel candidates={candidates} headline={headline} showMatchNudge={!hasMatch} />
      ) : (
        <MatchHeroPanel answers={answers} questionCount={questionCount} />
      )}
    </div>
  );
}
