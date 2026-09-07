import Link from "next/link";
import { ArrowRight, ArrowUpRight, ListChecks, Lock, Users } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { HandNote } from "@/components/ui/hand-note";
import { Swoosh } from "@/components/ui/swoosh";
import { MatchOrbit } from "./match-orbit";
import { MatchTopThree } from "./match-top-three";
import { cn } from "@/lib/utils";
import type { Candidate } from "@/lib/types";

export function MatchShowcaseCard({
  questionCount,
  proposalCount,
  candidates,
  className,
}: {
  questionCount: number;
  proposalCount: number;
  candidates: Candidate[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[24px] border border-primary/15 bg-primary-soft/60 p-6 sm:p-8",
        className
      )}
    >
      {/* Aplat doux dans l'angle, comme sur la maquette. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-primary/10"
      />

      <div className="relative grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] xl:gap-10">
        {/* ─── Colonne de gauche : la promesse ─── */}
        <div className="flex flex-col">
          <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Mon Match
            <span className="h-px w-8 bg-primary/40" />
          </p>

          <h3 className="mt-3 font-serif text-[2.1rem] font-semibold leading-[1.05] tracking-tight sm:text-[2.5rem]">
            Mon Match
          </h3>

          <p className="mt-3 max-w-md text-[1.05rem] leading-relaxed">
            Répondez à {questionCount} questions et découvrez quels candidats sont les plus proches
            de{" "}
            <span className="relative inline-block">
              vos idées
              <Swoosh className="text-primary/60" />
            </span>
            .
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
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
            <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-2">
              <Lock size={12} />
              Sans inscription · résultats calculés sur votre appareil
            </p>
          </div>

          {/* L'orbite tient compagnie au texte sur grand écran, passe dessous sinon. */}
          <div className="mt-8 xl:mt-10">
            <MatchOrbit candidates={candidates} />
          </div>

          <Link
            href="/candidats"
            className="focus-ring group mt-8 flex items-center gap-1.5 border-t border-primary/15 pt-5 text-sm font-medium text-primary hover:underline"
          >
            Explorer les {proposalCount} propositions sourcées
            <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* ─── Colonne de droite : le classement réel du visiteur ─── */}
        <div className="flex flex-col justify-center">
          <HandNote className="mb-3 hidden w-[9rem] -rotate-3 xl:block">
            Vos idées comptent.
          </HandNote>
          <MatchTopThree candidateCount={candidates.length} />
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
