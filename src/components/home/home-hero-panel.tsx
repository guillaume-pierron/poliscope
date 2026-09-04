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
 * Decides what the hero's right-hand panel shows: real polls by default, or
 * the visitor's own Match results if they've already taken it on this
 * device. Reads localStorage only — never touches the server with a
 * visitor's answers. Renders a neutral skeleton until that check resolves,
 * so the server-rendered markup never has to guess.
 */
export function HomeHeroPanel({
  candidates,
  headline,
}: {
  candidates: Candidate[];
  headline: HeadlinePoll | null;
}) {
  const [answers, setAnswers] = useState<UserAnswer[] | null>(null);
  const [tab, setTab] = useState<HeroTab | null>(null);

  useEffect(() => {
    const loaded = loadAnswers();
    const hasMatch = loaded.some((a) => a.value !== null);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAnswers(loaded);
    setTab(hasMatch ? "match" : "sondages");
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
        <MatchHeroPanel answers={answers} />
      )}
    </div>
  );
}
