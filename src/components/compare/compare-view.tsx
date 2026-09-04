"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  CheckCircle2,
  CircleCheck,
  CircleHelp,
  CircleX,
  Compass,
  Eye,
  EyeOff,
  ExternalLink,
  FileCheck2,
  SplitSquareHorizontal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { CandidateAvatarWithParty } from "@/components/candidates/candidate-avatar-party";
import { ThemeIcon } from "@/lib/theme-icons";
import { cn } from "@/lib/utils";
import { VERDICT_LABELS, type ThemeVerdict } from "@/lib/compare";
import { ORIENTATION_LABELS, type Candidate, type Proposal, type Theme } from "@/lib/types";

export interface ThemeRow {
  theme: Theme;
  verdict: ThemeVerdict;
  proposalsA: Proposal[];
  proposalsB: Proposal[];
}

const VERDICT_TEXT_CLASS: Record<ThemeVerdict, string> = {
  accord: "text-success",
  desaccord: "text-danger",
  nuance: "text-muted",
  inconnu: "text-muted-2",
};

type VerdictFilter = "all" | "differences" | "accord" | "desaccord";

export function CompareView({
  candidateA,
  candidateB,
  rows,
  sourcedCountA,
  sourcedCountB,
}: {
  candidateA: Candidate;
  candidateB: Candidate;
  rows: ThemeRow[];
  sourcedCountA: number;
  sourcedCountB: number;
}) {
  const [activeThemes, setActiveThemes] = useState<Set<string>>(new Set());
  const [verdictFilter, setVerdictFilter] = useState<VerdictFilter>("all");

  const proches = useMemo(() => rows.filter((r) => r.verdict === "accord"), [rows]);
  const opposees = useMemo(() => rows.filter((r) => r.verdict === "desaccord"), [rows]);
  const incomplets = useMemo(() => rows.filter((r) => r.verdict === "inconnu"), [rows]);

  const visibleRows = useMemo(() => {
    return rows.filter((row) => {
      if (verdictFilter === "differences" && row.verdict === "accord") return false;
      if (verdictFilter === "accord" && row.verdict !== "accord") return false;
      if (verdictFilter === "desaccord" && row.verdict !== "desaccord") return false;
      if (activeThemes.size > 0 && !activeThemes.has(row.theme.id)) return false;
      return true;
    });
  }, [rows, verdictFilter, activeThemes]);

  function toggleTheme(id: string) {
    setActiveThemes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function jumpTo(filter: VerdictFilter) {
    setVerdictFilter((prev) => (prev === filter ? "all" : filter));
    document.getElementById("comparaison-themes")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
      {/* Main column */}
      <div className="min-w-0 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <CandidateSummaryCard candidate={candidateA} sourcedCount={sourcedCountA} />
          <CandidateSummaryCard candidate={candidateB} sourcedCount={sourcedCountB} />
        </div>

        <StatsCard
          proches={proches.length}
          opposees={opposees.length}
          incomplets={incomplets.length}
          onlyDifferences={verdictFilter === "differences"}
          onToggleDifferences={() =>
            setVerdictFilter((prev) => (prev === "differences" ? "all" : "differences"))
          }
        />

        <div id="comparaison-themes" className="scroll-mt-24">
          <div className="flex flex-wrap gap-1.5">
            {rows.map(({ theme }) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => toggleTheme(theme.id)}
                className={cn(
                  "focus-ring flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  activeThemes.has(theme.id)
                    ? "border-primary bg-primary-soft text-primary"
                    : "border-border-strong text-muted hover:bg-surface"
                )}
              >
                <ThemeIcon icon={theme.icon} className="h-3.5 w-3.5" />
                {theme.name}
              </button>
            ))}
          </div>

          <div className="mt-5 space-y-4">
            {visibleRows.length === 0 && (
              <p className="rounded-xl border border-dashed border-border py-12 text-center text-muted">
                Aucun thème ne correspond aux filtres sélectionnés.
              </p>
            )}

            {visibleRows.map((row) => (
              <ThemeRowCard key={row.theme.id} row={row} />
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-5 lg:sticky lg:top-24">
        <SidebarStatsCard proches={proches.length} opposees={opposees.length} incomplets={incomplets.length} />
        <SidebarThemeList
          tone="success"
          title="Leurs points communs"
          themes={proches.map((r) => r.theme)}
          emptyLabel="Aucune position proche identifiée sur les thèmes documentés."
          onSeeAll={() => jumpTo("accord")}
        />
        <SidebarThemeList
          tone="danger"
          title="Leurs désaccords"
          themes={opposees.map((r) => r.theme)}
          emptyLabel="Aucune opposition nette identifiée sur les thèmes documentés."
          onSeeAll={() => jumpTo("desaccord")}
        />

        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm font-semibold">Comparer avec un autre candidat</p>
          <p className="mt-1.5 text-sm text-muted">
            Gardez {candidateA.name.split(" ")[0]} et choisissez un autre adversaire.
          </p>
          <ButtonLink href={`/comparer?a=${candidateA.slug}`} variant="outline" size="sm" className="mt-3 w-full">
            <SplitSquareHorizontal size={15} />
            Changer d&apos;adversaire
          </ButtonLink>
        </div>

        <div className="rounded-2xl border border-primary/30 bg-primary-soft p-5">
          <p className="text-sm font-semibold text-primary">Et vous, avec qui êtes-vous d&apos;accord ?</p>
          <p className="mt-1.5 text-sm text-foreground/80">
            Répondez au Match pour découvrir votre propre proximité avec chaque candidat.
          </p>
          <ButtonLink href="/match" variant="accent" size="sm" className="mt-3 w-full">
            Faire mon Match
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

function CandidateSummaryCard({ candidate, sourcedCount }: { candidate: Candidate; sourcedCount: number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-3">
        <CandidateAvatarWithParty candidate={candidate} size="lg" />
        <div className="min-w-0">
          <Link
            href={`/candidats/${candidate.slug}`}
            className="focus-ring block truncate text-base font-semibold hover:underline"
          >
            {candidate.name}
          </Link>
          <p className="truncate text-sm text-muted">{candidate.party?.name ?? "Sans étiquette"}</p>
        </div>
      </div>

      <ul className="mt-4 space-y-2 text-sm text-foreground/85">
        <li className="flex items-center gap-2">
          <BadgeCheck size={15} className="shrink-0 text-primary" />
          Candidat à l&apos;élection présidentielle
        </li>
        {candidate.party && (
          <li className="flex items-center gap-2">
            <Compass size={15} className="shrink-0 text-primary" />
            Positionnement : {ORIENTATION_LABELS[candidate.party.orientation]}
          </li>
        )}
        <li className="flex items-center gap-2">
          <FileCheck2 size={15} className="shrink-0 text-primary" />
          {sourcedCount} proposition{sourcedCount > 1 ? "s" : ""} sourcée{sourcedCount > 1 ? "s" : ""}
        </li>
      </ul>
    </div>
  );
}

function StatsCard({
  proches,
  opposees,
  incomplets,
  onlyDifferences,
  onToggleDifferences,
}: {
  proches: number;
  opposees: number;
  incomplets: number;
  onlyDifferences: boolean;
  onToggleDifferences: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="grid grid-cols-3 gap-4">
        <StatItem icon={<CircleCheck size={16} className="text-success" />} value={proches} label="positions proches" />
        <StatItem icon={<CircleX size={16} className="text-danger" />} value={opposees} label="oppositions nettes" />
        <StatItem icon={<CircleHelp size={16} className="text-muted-2" />} value={incomplets} label="sujets incomplets" />
      </div>
      <Button
        variant={onlyDifferences ? "primary" : "outline"}
        size="sm"
        onClick={onToggleDifferences}
        className="shrink-0"
      >
        {onlyDifferences ? <Eye size={16} /> : <EyeOff size={16} />}
        Voir uniquement leurs différences
      </Button>
    </div>
  );
}

function StatItem({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="min-w-0">
      <p className="flex items-center gap-1.5 text-xl font-semibold">
        {icon}
        {value}
      </p>
      <p className="mt-0.5 text-xs text-muted-2">{label}</p>
    </div>
  );
}

function SidebarStatsCard({
  proches,
  opposees,
  incomplets,
}: {
  proches: number;
  opposees: number;
  incomplets: number;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="text-sm font-semibold">En bref</p>
      <ul className="mt-3 space-y-2.5 text-sm">
        <li className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 text-foreground/85">
            <CircleCheck size={15} className="text-success" />
            Positions proches
          </span>
          <span className="font-semibold">{proches}</span>
        </li>
        <li className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 text-foreground/85">
            <CircleX size={15} className="text-danger" />
            Oppositions nettes
          </span>
          <span className="font-semibold">{opposees}</span>
        </li>
        <li className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 text-foreground/85">
            <CircleHelp size={15} className="text-muted-2" />
            Sujets incomplets
          </span>
          <span className="font-semibold">{incomplets}</span>
        </li>
      </ul>
    </div>
  );
}

function SidebarThemeList({
  tone,
  title,
  themes,
  emptyLabel,
  onSeeAll,
}: {
  tone: "success" | "danger";
  title: string;
  themes: Theme[];
  emptyLabel: string;
  onSeeAll: () => void;
}) {
  const toneClass = tone === "success" ? "text-success" : "text-danger";
  const shown = themes.slice(0, 4);

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className={cn("text-sm font-semibold", toneClass)}>{title}</p>
      {shown.length === 0 ? (
        <p className="mt-2 text-sm text-muted-2">{emptyLabel}</p>
      ) : (
        <ul className="mt-3 space-y-2 text-sm text-foreground/85">
          {shown.map((theme) => (
            <li key={theme.id} className="flex items-center gap-2">
              <ThemeIcon icon={theme.icon} className={cn("h-3.5 w-3.5 shrink-0", toneClass)} />
              {theme.name}
            </li>
          ))}
        </ul>
      )}
      {themes.length > 0 && (
        <button
          type="button"
          onClick={onSeeAll}
          className={cn("focus-ring mt-3 text-sm font-medium hover:underline", toneClass)}
        >
          Voir tout →
        </button>
      )}
    </div>
  );
}

function ThemeRowCard({ row }: { row: ThemeRow }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="grid gap-4 md:grid-cols-[180px_1fr_1fr] md:items-start">
        <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-2">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
            <ThemeIcon icon={row.theme.icon} className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold">{row.theme.name}</p>
            <p className={cn("text-xs font-medium", VERDICT_TEXT_CLASS[row.verdict])}>
              {VERDICT_LABELS[row.verdict]}
            </p>
          </div>
        </div>

        <ProposalColumn proposals={row.proposalsA} />
        <ProposalColumn proposals={row.proposalsB} />
      </div>
    </section>
  );
}

function ProposalColumn({ proposals }: { proposals: Proposal[] }) {
  if (proposals.length === 0) {
    return (
      <div className="flex min-h-[96px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border p-4 text-center">
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-dashed border-border-strong text-sm font-semibold text-muted-2">
          ?
        </span>
        <p className="text-xs text-muted-2">Position non renseignée.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {proposals.map((p) => (
        <div key={p.id} className="rounded-xl border border-border bg-surface p-4">
          <p className="text-sm font-medium leading-snug">{p.title}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">{p.summary}</p>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-2.5">
            {p.verified_at ? (
              <span className="flex items-center gap-1 text-xs font-medium text-success">
                <CheckCircle2 size={12} />
                Source vérifiée
              </span>
            ) : (
              <Badge variant="outline">Non vérifiée</Badge>
            )}
            <a
              href={p.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              Voir la source
              <ExternalLink size={11} />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
