"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  ChevronDown,
  CircleCheck,
  CircleHelp,
  CircleX,
  Compass,
  ExternalLink,
  FileCheck2,
  Info,
  LayoutList,
  ListFilter,
} from "lucide-react";
import { CandidateAvatarWithParty } from "@/components/candidates/candidate-avatar-party";
import { CompareShareButton } from "./compare-share-button";
import { CompareSubjectRow } from "./compare-subject-row";
import { ButtonLink } from "@/components/ui/button";
import { ThemeIcon } from "@/lib/theme-icons";
import { cn } from "@/lib/utils";
import type { SubjectComparison, ThemeComparison } from "@/lib/compare";
import { ORIENTATION_LABELS, type Candidate, type Proposal } from "@/lib/types";

type PositionFilter = "toutes" | "differences";

export function CompareView({
  candidateA,
  candidateB,
  blocks,
  allCandidates,
  sourcedCountA,
  sourcedCountB,
}: {
  candidateA: Candidate;
  candidateB: Candidate;
  blocks: ThemeComparison[];
  /** Pour changer d'adversaire sans repasser par la page de sélection. */
  allCandidates: Candidate[];
  sourcedCountA: number;
  sourcedCountB: number;
}) {
  const [filter, setFilter] = useState<PositionFilter>("toutes");
  const [activeThemeId, setActiveThemeId] = useState<string>(
    () => (blocks.find((b) => b.comparableCount > 0) ?? blocks[0])?.theme.id ?? ""
  );

  const allSubjects = useMemo(() => blocks.flatMap((b) => b.subjects), [blocks]);
  const proches = useMemo(() => allSubjects.filter((s) => s.verdict === "accord"), [allSubjects]);
  const opposees = useMemo(() => allSubjects.filter((s) => s.verdict === "desaccord"), [allSubjects]);
  const incomplets = useMemo(() => allSubjects.filter((s) => s.verdict === "inconnu"), [allSubjects]);
  const comparables = allSubjects.length - incomplets.length;

  const activeBlock = blocks.find((b) => b.theme.id === activeThemeId) ?? blocks[0];

  function jumpToSubject(subject: SubjectComparison) {
    const block = blocks.find((b) => b.subjects.some((s) => s.question.id === subject.question.id));
    if (!block) return;
    setActiveThemeId(block.theme.id);
    setFilter("toutes");
    document.getElementById("comparaison-themes")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div>
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <h1 className="font-serif text-[2rem] font-semibold leading-tight tracking-tight sm:text-[2.4rem]">
            <span style={{ color: candidateA.party?.color }}>{candidateA.name}</span>{" "}
            <span className="text-muted-2">vs</span>{" "}
            <span style={{ color: candidateB.party?.color }}>{candidateB.name}</span>
          </h1>
          <p className="mt-2 text-muted">
            Comparez leurs positions sur les grands thèmes pour voir facilement leurs différences.
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2.5">
          <div className="flex rounded-xl border border-border-strong bg-card p-1">
            <FilterTab
              active={filter === "toutes"}
              onClick={() => setFilter("toutes")}
              icon={LayoutList}
              label="Voir toutes les positions"
            />
            <FilterTab
              active={filter === "differences"}
              onClick={() => setFilter("differences")}
              icon={ListFilter}
              label="Voir uniquement les différences"
            />
          </div>
          <CompareShareButton />
        </div>
      </div>

      <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="min-w-0 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <CandidateSummaryCard candidate={candidateA} sourcedCount={sourcedCountA} />
            <CandidateSummaryCard candidate={candidateB} sourcedCount={sourcedCountB} />
          </div>

          <div id="comparaison-themes" className="scroll-mt-24">
            {/* Le compteur sur chaque onglet dit où la comparaison a
                réellement de la matière, plutôt que de laisser cliquer au
                hasard sur douze thèmes. */}
            <div className="flex flex-wrap gap-1.5">
              {blocks.map((block) => {
                const active = block.theme.id === activeBlock?.theme.id;
                return (
                  <button
                    key={block.theme.id}
                    type="button"
                    onClick={() => setActiveThemeId(block.theme.id)}
                    className={cn(
                      "focus-ring flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                      active
                        ? "border-primary bg-primary-soft text-primary"
                        : "border-border-strong bg-card text-muted hover:bg-surface"
                    )}
                  >
                    <ThemeIcon icon={block.theme.icon} className="h-3.5 w-3.5" />
                    {block.theme.name}
                    {block.comparableCount > 0 && (
                      <span
                        className={cn(
                          "rounded-full px-1.5 text-[0.7rem] font-semibold tabular-nums",
                          active ? "bg-card text-primary" : "bg-surface text-muted-2"
                        )}
                      >
                        {block.comparableCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {activeBlock && (
              <ThemeBlock
                key={activeBlock.theme.id}
                block={activeBlock}
                candidateA={candidateA}
                candidateB={candidateB}
                filter={filter}
              />
            )}
          </div>
        </div>

        <div className="min-w-0 space-y-5">
          <SummaryCard
            proches={proches.length}
            opposees={opposees.length}
            incomplets={incomplets.length}
            comparables={comparables}
            total={allSubjects.length}
          />
          <SubjectList
            tone="success"
            title="Leurs points communs"
            subjects={proches}
            emptyLabel="Aucune position proche sur les sujets documentés pour les deux."
            onSelect={jumpToSubject}
          />
          <SubjectList
            tone="danger"
            title="Leurs désaccords"
            subjects={opposees}
            emptyLabel="Aucune opposition nette sur les sujets documentés pour les deux."
            onSelect={jumpToSubject}
          />
          <OpponentPicker candidateA={candidateA} candidateB={candidateB} candidates={allCandidates} />

          <div className="rounded-2xl border border-primary/25 bg-primary-soft/60 p-5">
            <p className="text-sm font-semibold text-primary">
              Et vous, avec qui êtes-vous d&apos;accord&nbsp;?
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-foreground/80">
              Répondez au Match pour découvrir votre propre proximité avec chaque candidat.
            </p>
            <ButtonLink href="/match" variant="accent" size="sm" className="mt-3.5 w-full">
              Découvrir mon Match
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterTab({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof LayoutList;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "focus-ring flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
        active ? "bg-primary-soft text-primary" : "text-muted hover:text-foreground"
      )}
    >
      <Icon size={15} className="shrink-0" />
      {label}
    </button>
  );
}

function ThemeBlock({
  block,
  candidateA,
  candidateB,
  filter,
}: {
  block: ThemeComparison;
  candidateA: Candidate;
  candidateB: Candidate;
  filter: PositionFilter;
}) {
  const [showContext, setShowContext] = useState(false);
  const [showProposals, setShowProposals] = useState(false);

  // « Différences » = les sujets où les deux positions sont documentées et
  // divergent. Un sujet incomplet n'est pas une différence : on ne sait pas.
  const shown =
    filter === "differences"
      ? block.subjects.filter((s) => s.verdict === "desaccord" || s.verdict === "nuance")
      : block.subjects;

  const proposalCount = block.proposalsA.length + block.proposalsB.length;

  return (
    <section className="mt-5 rounded-2xl border border-border bg-surface/50 p-4 sm:p-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <ThemeIcon icon={block.theme.icon} className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h2 className="font-serif text-[1.35rem] font-semibold leading-tight tracking-tight">
              {block.theme.name}
            </h2>
            <p className="mt-0.5 text-sm text-muted">
              {block.comparableCount} sujet{block.comparableCount > 1 ? "s" : ""} comparé
              {block.comparableCount > 1 ? "s" : ""} sur {block.subjects.length}
            </p>
          </div>
        </div>

        {block.theme.description && (
          <button
            type="button"
            onClick={() => setShowContext((v) => !v)}
            className="focus-ring flex shrink-0 items-center gap-1.5 rounded-full border border-border-strong bg-card px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:bg-surface"
          >
            <Info size={13} />
            {showContext ? "Masquer le contexte" : "Voir le contexte du thème"}
          </button>
        )}
      </header>

      {showContext && block.theme.description && (
        <p className="mt-3 rounded-xl border border-border bg-card p-4 text-sm leading-relaxed text-muted">
          {block.theme.description}
        </p>
      )}

      <div className="mt-4 space-y-3">
        {shown.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border-strong bg-card p-6 text-center text-sm text-muted-2">
            {block.subjects.length === 0
              ? "Aucune question du Match ne porte sur ce thème."
              : filter === "differences"
                ? "Aucune différence documentée sur ce thème : les positions comparables sont proches, ou il manque une position."
                : "Aucun sujet documenté sur ce thème."}
          </p>
        ) : (
          shown.map((subject) => (
            <CompareSubjectRow
              key={subject.question.id}
              subject={subject}
              candidateA={candidateA}
              candidateB={candidateB}
            />
          ))
        )}
      </div>

      {/* Les propositions restent accessibles, mais en second rideau : elles
          n'entrent pas dans le calcul du verdict, les afficher à côté
          laissait croire le contraire. */}
      {proposalCount > 0 && (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setShowProposals((v) => !v)}
            className="focus-ring flex w-full items-center justify-center gap-2 rounded-xl border border-border-strong bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:bg-surface"
          >
            <ChevronDown
              size={15}
              className={cn("transition-transform", showProposals && "rotate-180")}
            />
            {showProposals ? "Masquer" : "Voir"} les {proposalCount} proposition
            {proposalCount > 1 ? "s" : ""} de ce thème
          </button>

          {showProposals && (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <ProposalColumn candidate={candidateA} proposals={block.proposalsA} />
              <ProposalColumn candidate={candidateB} proposals={block.proposalsB} />
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function ProposalColumn({ candidate, proposals }: { candidate: Candidate; proposals: Proposal[] }) {
  return (
    <div className="min-w-0">
      <p className="mb-2 truncate text-xs font-semibold uppercase tracking-[0.08em] text-muted-2">
        {candidate.name}
      </p>
      {proposals.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-2">
          Aucune proposition documentée sur ce thème.
        </p>
      ) : (
        <ul className="space-y-2.5">
          {proposals.map((p) => (
            <li key={p.id} className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm font-medium leading-snug">{p.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{p.summary}</p>
              <a
                href={p.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring mt-2.5 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
              >
                {p.source_name}
                <ExternalLink size={11} className="shrink-0" />
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CandidateSummaryCard({
  candidate,
  sourcedCount,
}: {
  candidate: Candidate;
  sourcedCount: number;
}) {
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
            Positionnement&nbsp;: {ORIENTATION_LABELS[candidate.party.orientation]}
          </li>
        )}
        <li className="flex items-center gap-2">
          <FileCheck2 size={15} className="shrink-0 text-primary" />
          {sourcedCount} proposition{sourcedCount > 1 ? "s" : ""} sourcée
          {sourcedCount > 1 ? "s" : ""}
        </li>
      </ul>
    </div>
  );
}

function SummaryCard({
  proches,
  opposees,
  incomplets,
  comparables,
  total,
}: {
  proches: number;
  opposees: number;
  incomplets: number;
  comparables: number;
  total: number;
}) {
  const rows = [
    { icon: CircleCheck, tone: "text-success", label: "Positions proches", value: proches },
    { icon: CircleX, tone: "text-danger", label: "Oppositions nettes", value: opposees },
    { icon: CircleHelp, tone: "text-muted-2", label: "Sujets incomplets", value: incomplets },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="text-sm font-semibold">En bref</p>
      <ul className="mt-3.5 space-y-2.5 text-sm">
        {rows.map(({ icon: Icon, tone, label, value }) => (
          <li key={label} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-foreground/85">
              <Icon size={15} className={cn("shrink-0", tone)} />
              {label}
            </span>
            <span className="font-semibold tabular-nums">{value}</span>
          </li>
        ))}
      </ul>
      {/* Le dénominateur est dit explicitement : sans lui, « 3 oppositions »
          ne veut rien dire. */}
      <p className="mt-3.5 flex items-start gap-1.5 border-t border-border pt-3.5 text-xs leading-relaxed text-muted-2">
        <Info size={12} className="mt-0.5 shrink-0" />
        {comparables} sujet{comparables > 1 ? "s" : ""} comparable{comparables > 1 ? "s" : ""} sur
        les {total} questions du Match — un sujet n&apos;est comparable que si les deux candidats
        ont une position documentée.
      </p>
    </div>
  );
}

function SubjectList({
  tone,
  title,
  subjects,
  emptyLabel,
  onSelect,
}: {
  tone: "success" | "danger";
  title: string;
  subjects: SubjectComparison[];
  emptyLabel: string;
  onSelect: (subject: SubjectComparison) => void;
}) {
  const toneClass = tone === "success" ? "text-success" : "text-danger";
  const Icon = tone === "success" ? CircleCheck : CircleX;

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className={cn("text-sm font-semibold", toneClass)}>{title}</p>
      {subjects.length === 0 ? (
        <p className="mt-2 text-sm leading-relaxed text-muted-2">{emptyLabel}</p>
      ) : (
        <ul className="mt-3 space-y-2.5">
          {subjects.map((subject) => (
            <li key={subject.question.id}>
              <button
                type="button"
                onClick={() => onSelect(subject)}
                className="focus-ring flex w-full items-start gap-2 text-left text-sm leading-snug text-foreground/85 hover:text-foreground hover:underline"
              >
                <Icon size={14} className={cn("mt-0.5 shrink-0", toneClass)} />
                {subject.question.question}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function OpponentPicker({
  candidateA,
  candidateB,
  candidates,
}: {
  candidateA: Candidate;
  candidateB: Candidate;
  candidates: Candidate[];
}) {
  const router = useRouter();
  const others = candidates.filter((c) => c.id !== candidateA.id && c.id !== candidateB.id);

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="text-sm font-semibold">Comparer avec un autre candidat</p>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">
        Gardez {candidateA.name} et choisissez un autre adversaire.
      </p>
      <label className="sr-only" htmlFor="opponent-picker">
        Choisir un autre adversaire
      </label>
      <select
        id="opponent-picker"
        value=""
        onChange={(e) => {
          if (e.target.value) router.push(`/comparer/${candidateA.slug}-vs-${e.target.value}`);
        }}
        className="focus-ring mt-3.5 w-full min-w-0 rounded-xl border border-border-strong bg-card px-3.5 py-2.5 text-sm"
      >
        <option value="">Choisir un candidat…</option>
        {others.map((c) => (
          <option key={c.id} value={c.slug}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}
