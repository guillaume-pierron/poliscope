import Link from "next/link";
import { ArrowRight, ArrowUpRight, ListChecks, Lock, Users } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { HandNote } from "@/components/ui/hand-note";
import { Swoosh } from "@/components/ui/swoosh";
import { MatchExplainerCard } from "./match-explainer-card";
import { MatchOrbit } from "./match-orbit";
import { cn } from "@/lib/utils";
import type { Candidate, Theme } from "@/lib/types";

export function MatchShowcaseCard({
  questionCount,
  proposalCount,
  candidates,
  themes,
  className,
}: {
  questionCount: number;
  proposalCount: number;
  candidates: Candidate[];
  themes: Theme[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[24px] border border-primary/15 bg-primary-soft/50 p-6 sm:p-8",
        className
      )}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-primary/10"
      />

      <div className="relative grid gap-10 lg:grid-cols-2 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.05fr)_minmax(0,0.92fr)] xl:gap-8">
        {/* ─── La promesse ─── */}
        <div className="flex flex-col">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Mon Match
            <span className="h-px w-9 bg-primary/50" />
          </p>

          <h3 className="mt-4 font-serif text-[2.4rem] font-semibold leading-[1] tracking-tight sm:text-[2.9rem]">
            Mon Match
          </h3>

          <p className="mt-4 max-w-md text-[1.05rem] leading-relaxed">
            Répondez à {questionCount} questions et découvrez quels candidats sont les plus proches
            de{" "}
            <span className="relative inline-block">
              vos idées
              <Swoosh className="text-primary/60" />
            </span>
            .
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Stat icon={ListChecks} value={`${questionCount} questions`} detail="Environ 3 minutes" />
            <Stat
              icon={Users}
              value={`${candidates.length} candidats comparés`}
              detail="Sur les mêmes enjeux"
            />
          </div>

          <div className="mt-7">
            <ButtonLink href="/match" variant="accent" size="lg" className="w-full sm:w-auto">
              Découvrir mon Match
              <ArrowRight size={17} />
            </ButtonLink>
            <p className="mt-3.5 flex items-center gap-1.5 text-xs text-muted-2">
              <Lock size={12} />
              Sans inscription · résultats calculés sur votre appareil
            </p>
          </div>

          <Link
            href="/candidats"
            className="focus-ring group mt-auto flex items-center gap-1.5 border-t border-primary/15 pt-5 text-sm font-medium text-primary hover:underline max-xl:mt-8"
          >
            Explorer les {proposalCount} propositions sourcées
            <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* ─── La constellation ─── */}
        <div className="flex items-center justify-center px-6 py-4 max-lg:order-last sm:px-10 xl:order-none xl:px-2">
          <MatchOrbit candidates={candidates} />
        </div>

        {/* ─── Ce que le Match apporte ─── */}
        <div className="relative flex flex-col justify-center">
          <HandNote className="mb-3 ml-1 block w-[8rem] -rotate-3 leading-tight">
            Vos idées comptent.
          </HandNote>
          <MatchExplainerCard themes={themes} />
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  value,
  detail,
}: {
  icon: typeof Users;
  value: string;
  detail: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
        <Icon size={17} />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold">{value}</span>
        <span className="block text-xs text-muted-2">{detail}</span>
      </span>
    </div>
  );
}
