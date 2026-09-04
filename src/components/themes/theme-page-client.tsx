"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookMarked,
  FileCheck2,
  LayoutGrid,
  ScanSearch,
  ShieldCheck,
  SplitSquareHorizontal,
  Users2,
  X,
  type LucideIcon,
} from "lucide-react";
import { CandidateAvatar } from "@/components/candidates/candidate-avatar";
import { Button, ButtonLink } from "@/components/ui/button";
import { Sparkle } from "@/components/ui/swoosh";
import { CityStreetIllustration } from "@/components/ui/doodles";
import { ThemeProposalCard } from "./theme-proposal-card";
import { ThemeIcon } from "@/lib/theme-icons";
import { tagIcon } from "@/lib/tag-icons";
import { cn, isQuantifiedProposal, parseTags } from "@/lib/utils";
import type { Candidate, Proposal, Theme } from "@/lib/types";

type ViewMode = "candidat" | "comparaison";
type SharedTag = { tag: string; entries: { candidate: Candidate; proposal: Proposal }[] };

export function ThemePageClient({
  theme,
  candidates,
  proposals,
}: {
  theme: Theme;
  candidates: Candidate[];
  proposals: Proposal[];
}) {
  const router = useRouter();
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("candidat");
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const topTags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of proposals) {
      for (const tag of parseTags(p.tags)) counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([tag]) => tag);
  }, [proposals]);

  const filteredProposals = activeTag
    ? proposals.filter((p) => parseTags(p.tags).includes(activeTag))
    : proposals;

  const quantifiedCount = proposals.filter(isQuantifiedProposal).length;
  const candidatesConcerned = new Set(proposals.map((p) => p.candidate_id)).size;

  // Tags shared by >= 2 candidates in this theme power the comparison view.
  // Never affected by the chip filter, and never forced when the data isn't there.
  const sharedTags: SharedTag[] = useMemo(() => {
    const byTag = new Map<string, Map<string, Proposal>>();
    for (const p of proposals) {
      for (const tag of parseTags(p.tags)) {
        const forTag = byTag.get(tag) ?? new Map<string, Proposal>();
        if (!forTag.has(p.candidate_id)) forTag.set(p.candidate_id, p);
        byTag.set(tag, forTag);
      }
    }
    return [...byTag.entries()]
      .filter(([, byCandidate]) => byCandidate.size >= 2)
      .sort((a, b) => b[1].size - a[1].size)
      .map(([tag, byCandidate]) => ({
        tag,
        entries: [...byCandidate.entries()]
          .map(([candidateId, proposal]) => {
            const candidate = candidates.find((c) => c.id === candidateId);
            return candidate ? { candidate, proposal } : null;
          })
          .filter((e): e is { candidate: Candidate; proposal: Proposal } => e !== null),
      }));
  }, [proposals, candidates]);
  const hasComparison = sharedTags.length > 0;

  function toggleCompare(candidateId: string) {
    setCompareIds((prev) => {
      if (prev.includes(candidateId)) return prev.filter((id) => id !== candidateId);
      if (prev.length >= 2) return [prev[1], candidateId];
      return [...prev, candidateId];
    });
  }

  function launchCompare() {
    if (compareIds.length !== 2) return;
    const slugs = compareIds.map((id) => candidates.find((c) => c.id === id)?.slug).filter(Boolean);
    if (slugs.length === 2) router.push(`/comparer/${slugs[0]}-vs-${slugs[1]}`);
  }

  const visibleCandidates = activeTag
    ? candidates.filter((c) => filteredProposals.some((p) => p.candidate_id === c.id))
    : candidates;

  return (
    <>
      <div className="container-app max-w-6xl py-10 md:py-14">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-5">
            <span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
              <ThemeIcon icon={theme.icon} className="h-10 w-10" />
            </span>
            <div>
              <h1 className="font-serif text-[2.2rem] font-semibold tracking-tight sm:text-[2.5rem]">
                {theme.name}
              </h1>
              <p className="mt-1 max-w-md text-muted">{theme.description}</p>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <Stat icon={FileCheck2} value={proposals.length} label="propositions sourcées" />
                <Stat icon={Users2} value={candidatesConcerned} label="candidats concernés" />
                <Stat icon={BookMarked} value={quantifiedCount} label="mesures chiffrées" />
              </div>
            </div>
          </div>
          <CityStreetIllustration className="hidden h-32 w-full max-w-md shrink-0 lg:block" />
        </div>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1.5">
            <FilterChip active={activeTag === null} onClick={() => setActiveTag(null)} label="Tous" />
            {topTags.map((tag) => (
              <FilterChip
                key={tag}
                active={activeTag === tag}
                onClick={() => setActiveTag(tag)}
                label={tag}
                icon={tagIcon(tag)}
              />
            ))}
          </div>

          {hasComparison && (
            <div className="flex shrink-0 gap-1 rounded-full border border-border-strong bg-surface p-1">
              <ViewToggleButton
                active={viewMode === "candidat"}
                onClick={() => setViewMode("candidat")}
                icon={ScanSearch}
                label="Par candidat"
              />
              <ViewToggleButton
                active={viewMode === "comparaison"}
                onClick={() => setViewMode("comparaison")}
                icon={LayoutGrid}
                label="Comparaison rapide"
              />
            </div>
          )}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0">
            {viewMode === "candidat" ? (
              <div className="space-y-8">
                {visibleCandidates.map((candidate) => {
                  const items = filteredProposals.filter((p) => p.candidate_id === candidate.id);
                  return (
                    <section key={candidate.id}>
                      <div className="mb-3 flex items-center gap-2.5">
                        <CandidateAvatar
                          name={candidate.name}
                          color={candidate.party?.color}
                          photoUrl={candidate.photo_url}
                          size="sm"
                        />
                        <p className="font-semibold">{candidate.name}</p>
                      </div>
                      {items.length > 0 ? (
                        <div className="space-y-3">
                          {items.map((p) => (
                            <ThemeProposalCard
                              key={p.id}
                              proposal={p}
                              selected={compareIds.includes(candidate.id)}
                              onToggleCompare={() => toggleCompare(candidate.id)}
                            />
                          ))}
                        </div>
                      ) : (
                        <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-2">
                          Position non renseignée pour ce thème.
                        </p>
                      )}
                    </section>
                  );
                })}
              </div>
            ) : (
              <ComparisonTable sharedTags={sharedTags} />
            )}
          </div>

          {hasComparison && (
            <aside className="hidden lg:block">
              <ComparisonSidebar
                sharedTags={sharedTags.slice(0, 3)}
                onSeeAll={() => setViewMode("comparaison")}
              />
            </aside>
          )}
        </div>

        <div className="mt-10">
          <ButtonLink href="/match" variant="outline">
            Découvrir ma proximité sur ce thème
          </ButtonLink>
        </div>
      </div>

      {compareIds.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur-md">
          <div className="container-app flex max-w-6xl flex-wrap items-center justify-between gap-3 py-3">
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
              {compareIds.map((id) => {
                const candidate = candidates.find((c) => c.id === id);
                if (!candidate) return null;
                return (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1.5 rounded-full bg-surface py-1 pl-1 pr-2.5"
                  >
                    <CandidateAvatar
                      name={candidate.name}
                      color={candidate.party?.color}
                      photoUrl={candidate.photo_url}
                      size="sm"
                    />
                    {candidate.name}
                    <button
                      type="button"
                      onClick={() => toggleCompare(id)}
                      className="focus-ring text-muted-2 hover:text-foreground"
                    >
                      <X size={12} />
                    </button>
                  </span>
                );
              })}
              {compareIds.length === 1 && <span>Choisissez un second candidat.</span>}
            </div>
            <Button variant="accent" onClick={launchCompare} disabled={compareIds.length !== 2}>
              <SplitSquareHorizontal size={16} />
              Comparer
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

function Stat({ icon: Icon, value, label }: { icon: LucideIcon; value: number; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-muted">
      <Icon size={15} className="text-primary" />
      <span className="font-semibold text-foreground">{value}</span>
      {label}
    </span>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  icon: Icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon?: LucideIcon;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "focus-ring flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary-soft text-primary"
          : "border-border-strong bg-card hover:bg-surface"
      )}
    >
      {Icon && <Icon size={14} />}
      {label}
    </button>
  );
}

function ViewToggleButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: LucideIcon;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "focus-ring flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
        active ? "bg-card text-primary shadow-sm" : "text-muted hover:text-foreground"
      )}
    >
      <Icon size={14} />
      {label}
    </button>
  );
}

function lastName(name: string) {
  return name.split(" ").slice(-1)[0];
}

function ComparisonTable({ sharedTags }: { sharedTags: SharedTag[] }) {
  const allCandidates: Candidate[] = [];
  for (const { entries } of sharedTags) {
    for (const { candidate } of entries) {
      if (!allCandidates.some((c) => c.id === candidate.id)) allCandidates.push(candidate);
    }
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="w-36 p-4 text-left text-xs font-medium uppercase tracking-wide text-muted-2">
              Critère
            </th>
            {allCandidates.map((c) => (
              <th key={c.id} className="p-4 text-left">
                <div className="flex items-center gap-2">
                  <CandidateAvatar name={c.name} color={c.party?.color} photoUrl={c.photo_url} size="sm" />
                  <span className="font-medium">{lastName(c.name)}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sharedTags.map(({ tag, entries }) => (
            <tr key={tag} className="border-b border-border last:border-0">
              <td className="p-4 align-top text-xs font-medium text-muted-2">{tag}</td>
              {allCandidates.map((c) => {
                const entry = entries.find((e) => e.candidate.id === c.id);
                return (
                  <td key={c.id} className="p-4 align-top">
                    {entry ? (
                      <a
                        href={entry.proposal.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="focus-ring hover:underline"
                      >
                        {entry.proposal.title}
                      </a>
                    ) : (
                      <span className="text-muted-2">—</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ComparisonSidebar({
  sharedTags,
  onSeeAll,
}: {
  sharedTags: SharedTag[];
  onSeeAll: () => void;
}) {
  const previewCandidates: Candidate[] = [];
  for (const { entries } of sharedTags) {
    for (const { candidate } of entries) {
      if (previewCandidates.length < 3 && !previewCandidates.some((c) => c.id === candidate.id)) {
        previewCandidates.push(candidate);
      }
    }
  }

  return (
    <div className="sticky top-24 rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-1.5">
        <Sparkle className="h-3.5 w-3.5 text-primary" />
        <h2 className="font-serif text-lg font-semibold">Comparaison rapide</h2>
      </div>
      <p className="mt-1 text-xs text-muted-2">
        Aperçu sur {sharedTags.length} enjeu{sharedTags.length > 1 ? "x" : ""} clé
        {sharedTags.length > 1 ? "s" : ""}
      </p>

      <div className="mt-4 flex items-center gap-2">
        {previewCandidates.map((c) => (
          <CandidateAvatar key={c.id} name={c.name} color={c.party?.color} photoUrl={c.photo_url} size="sm" />
        ))}
      </div>

      <div className="mt-4 space-y-4">
        {sharedTags.map(({ tag, entries }) => (
          <div key={tag}>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-2">{tag}</p>
            <ul className="mt-1.5 space-y-1">
              {entries
                .filter((e) => previewCandidates.some((c) => c.id === e.candidate.id))
                .map(({ candidate, proposal }) => (
                  <li key={candidate.id} className="truncate text-sm">
                    <span className="font-medium">{lastName(candidate.name)}</span>{" "}
                    <span className="text-muted">— {proposal.title}</span>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onSeeAll}
        className="focus-ring mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
      >
        Voir la comparaison complète
        <ArrowRight size={14} />
      </button>

      <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-border bg-surface p-3 text-xs text-muted">
        <ShieldCheck size={14} className="mt-0.5 shrink-0 text-primary" />
        <p>Comme toujours, on source : chaque proposition listée est vérifiée et reliée à sa source primaire.</p>
      </div>
    </div>
  );
}
