"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  CircleHelp,
  CircleX,
  Compass,
  ExternalLink,
  FileCheck2,
  Home,
  Sparkles,
  Users,
} from "lucide-react";
import { CandidateAvatar } from "@/components/candidates/candidate-avatar";
import { CompareShareButton } from "./compare-share-button";
import { CompareSubjectRow } from "./compare-subject-row";
import { ButtonLink } from "@/components/ui/button";
import { ThemeIcon } from "@/lib/theme-icons";
import { cn } from "@/lib/utils";
import type { SubjectComparison, ThemeComparison, ThemeVerdict } from "@/lib/compare";
import { ORIENTATION_LABELS, type Candidate, type Proposal } from "@/lib/types";

/** `null` = tous les sujets ; sinon on ne garde que ce verdict. */
type SubjectFilter = ThemeVerdict | null;

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
  allCandidates: Candidate[];
  sourcedCountA: number;
  sourcedCountB: number;
}) {
  const [filter, setFilter] = useState<SubjectFilter>(null);
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
    setFilter(null);
    document.getElementById("comparaison")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function jumpToVerdict(verdict: ThemeVerdict) {
    const block = blocks.find((b) => b.subjects.some((s) => s.verdict === verdict));
    setFilter((prev) => (prev === verdict ? null : verdict));
    if (block) setActiveThemeId(block.theme.id);
    document.getElementById("comparaison")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div>
      <nav aria-label="Fil d'Ariane" className="flex items-center gap-1.5 text-sm text-muted-2">
        <Link href="/" className="focus-ring flex items-center gap-1.5 hover:text-foreground">
          <Home size={14} />
          Accueil
        </Link>
        <ChevronRight size={13} className="shrink-0" />
        <Link href="/comparer" className="focus-ring hover:text-foreground">
          Comparer les candidats
        </Link>
      </nav>

      <div className="mt-4 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <h1 className="font-serif text-[2rem] font-semibold leading-tight tracking-tight sm:text-[2.5rem]">
            <span style={{ color: candidateA.party?.color }}>{candidateA.name}</span>{" "}
            <span className="text-muted-2">vs</span>{" "}
            <span style={{ color: candidateB.party?.color }}>{candidateB.name}</span>
          </h1>
          <p className="mt-2 text-muted">
            Comparez leurs positions sur les grands thèmes pour voir facilement leurs différences.
          </p>
        </div>
        <CompareShareButton />
      </div>

      <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_330px] lg:items-start">
        <div className="min-w-0 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <CandidateSummaryCard candidate={candidateA} sourcedCount={sourcedCountA} />
            <CandidateSummaryCard candidate={candidateB} sourcedCount={sourcedCountB} />
          </div>

          {/* Ces trois chiffres filtrent le tableau : cliquer sur « 1
              désaccord net » y amène directement, plutôt que de laisser
              parcourir douze thèmes à la main. */}
          <div className="grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-3">
            <StatButton
              icon={CircleCheck}
              tone="success"
              value={proches.length}
              label={`point${proches.length > 1 ? "s" : ""} commun${proches.length > 1 ? "s" : ""}`}
              detail="Des convergences sur certains enjeux"
              active={filter === "accord"}
              onClick={() => jumpToVerdict("accord")}
            />
            <StatButton
              icon={CircleX}
              tone="danger"
              value={opposees.length}
              label={`désaccord${opposees.length > 1 ? "s" : ""} net${opposees.length > 1 ? "s" : ""}`}
              detail="Des visions opposées"
              active={filter === "desaccord"}
              onClick={() => jumpToVerdict("desaccord")}
            />
            <StatButton
              icon={CircleHelp}
              tone="muted"
              value={incomplets.length}
              label={`sujet${incomplets.length > 1 ? "s" : ""} incomplet${incomplets.length > 1 ? "s" : ""}`}
              detail="Pas de position claire des deux côtés"
              active={filter === "inconnu"}
              onClick={() => jumpToVerdict("inconnu")}
            />
          </div>

          <div id="comparaison" className="scroll-mt-24">
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
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border-strong bg-card text-muted hover:bg-surface"
                    )}
                  >
                    <ThemeIcon icon={block.theme.icon} className="h-3.5 w-3.5" />
                    {block.theme.name}
                    {/* Le compteur dit où la comparaison a de la matière : sur
                        ce jeu de données, la plupart des thèmes n'ont aucun
                        sujet documenté des deux côtés. */}
                    {block.comparableCount > 0 && (
                      <span
                        className={cn(
                          "rounded-full px-1.5 text-[0.7rem] font-semibold tabular-nums",
                          active ? "bg-primary-foreground/20" : "bg-surface text-muted-2"
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
                onClearFilter={() => setFilter(null)}
              />
            )}
          </div>
        </div>

        <div className="min-w-0 space-y-4">
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
            seeAllLabel="Voir tous les points communs"
            onSelect={jumpToSubject}
            onSeeAll={() => jumpToVerdict("accord")}
          />
          <SubjectList
            tone="danger"
            title="Leurs désaccords"
            subjects={opposees}
            emptyLabel="Aucune opposition nette sur les sujets documentés pour les deux."
            seeAllLabel="Voir tous les désaccords"
            onSelect={jumpToSubject}
            onSeeAll={() => jumpToVerdict("desaccord")}
          />
          <OpponentPicker candidateA={candidateA} candidateB={candidateB} candidates={allCandidates} />

          <div className="rounded-2xl border border-primary/25 bg-primary-soft/60 p-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Sparkles size={15} className="shrink-0" />
              Et vous, avec qui êtes-vous d&apos;accord&nbsp;?
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-foreground/80">
              Répondez au Match pour découvrir votre propre proximité avec chaque candidat.
            </p>
            <ButtonLink href="/match" variant="accent" size="sm" className="mt-3.5 w-full">
              Découvrir mon Match
              <ArrowRight size={15} />
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}

const STAT_TONE = {
  success: { bubble: "bg-success-soft text-success", ring: "border-success/40" },
  danger: { bubble: "bg-danger-soft text-danger", ring: "border-danger/40" },
  muted: { bubble: "bg-surface-strong text-muted-2", ring: "border-border-strong" },
} as const;

function StatButton({
  icon: Icon,
  tone,
  value,
  label,
  detail,
  active,
  onClick,
}: {
  icon: typeof CircleCheck;
  tone: keyof typeof STAT_TONE;
  value: number;
  label: string;
  detail: string;
  active: boolean;
  onClick: () => void;
}) {
  const style = STAT_TONE[tone];
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "focus-ring flex items-center gap-3 rounded-xl border p-3 text-left transition-colors",
        active ? cn("bg-surface", style.ring) : "border-transparent hover:bg-surface"
      )}
    >
      <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", style.bubble)}>
        <Icon size={18} />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-medium leading-tight">
          <span className="font-serif text-xl font-semibold tabular-nums">{value}</span> {label}
        </span>
        <span className="mt-0.5 block text-xs leading-tight text-muted-2">{detail}</span>
      </span>
    </button>
  );
}

function ThemeBlock({
  block,
  candidateA,
  candidateB,
  filter,
  onClearFilter,
}: {
  block: ThemeComparison;
  candidateA: Candidate;
  candidateB: Candidate;
  filter: SubjectFilter;
  onClearFilter: () => void;
}) {
  const [showContext, setShowContext] = useState(false);
  const [showProposals, setShowProposals] = useState(false);

  const shown = filter ? block.subjects.filter((s) => s.verdict === filter) : block.subjects;
  const proposalCount = block.proposalsA.length + block.proposalsB.length;

  return (
    <section className="mt-5 overflow-hidden rounded-2xl border border-border bg-card">
      <header className="flex flex-wrap items-center justify-between gap-3 p-5">
        <div className="flex items-center gap-3.5">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <ThemeIcon icon={block.theme.icon} className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h2 className="font-serif text-[1.5rem] font-semibold leading-tight tracking-tight">
              {block.theme.name}
            </h2>
            <p className="mt-0.5 text-sm text-muted">
              {block.comparableCount} sujet{block.comparableCount > 1 ? "s" : ""} comparable
              {block.comparableCount > 1 ? "s" : ""} sur ce thème
            </p>
          </div>
        </div>

        {block.theme.description && (
          <button
            type="button"
            onClick={() => setShowContext((v) => !v)}
            className="focus-ring flex shrink-0 items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            {showContext ? "Masquer le contexte" : "Voir le contexte de ce thème"}
            <ArrowRight size={14} className="shrink-0" />
          </button>
        )}
      </header>

      {showContext && block.theme.description && (
        <p className="mx-5 mb-4 rounded-xl bg-surface p-4 text-sm leading-relaxed text-muted">
          {block.theme.description}
        </p>
      )}

      {/* En-tête de tableau : le nom du candidat est dit une fois, en haut de
          sa colonne, au lieu d'être répété sur chaque ligne. */}
      <div className="hidden border-t border-border bg-surface/60 px-5 py-2.5 lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.15fr)_minmax(0,1.15fr)_minmax(0,0.8fr)] lg:gap-5">
        <ColumnHead>Question</ColumnHead>
        <CandidateColumnHead candidate={candidateA} />
        <CandidateColumnHead candidate={candidateB} />
        <ColumnHead className="text-center">Notre analyse</ColumnHead>
      </div>

      {shown.length === 0 ? (
        <div className="border-t border-border p-8 text-center">
          <p className="text-sm text-muted-2">
            {block.subjects.length === 0
              ? "Aucune question du Match ne porte sur ce thème."
              : "Aucun sujet de ce thème ne correspond au filtre choisi."}
          </p>
          {filter && block.subjects.length > 0 && (
            <button
              type="button"
              onClick={onClearFilter}
              className="focus-ring mt-2 text-sm font-medium text-primary hover:underline"
            >
              Voir tous les sujets de ce thème
            </button>
          )}
        </div>
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

      {/* Les propositions restent accessibles, mais en second rideau :
          elles n'entrent pas dans le calcul du verdict, les afficher à côté
          laissait croire le contraire. */}
      {proposalCount > 0 && (
        <div className="border-t border-border p-4">
          <button
            type="button"
            onClick={() => setShowProposals((v) => !v)}
            className="focus-ring flex w-full items-center justify-center gap-2 rounded-xl bg-surface px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-surface-strong hover:text-foreground"
          >
            <ChevronDown
              size={15}
              className={cn("shrink-0 transition-transform", showProposals && "rotate-180")}
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

function ColumnHead({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("text-xs font-semibold uppercase tracking-[0.08em] text-muted-2", className)}>
      {children}
    </p>
  );
}

function CandidateColumnHead({ candidate }: { candidate: Candidate }) {
  return (
    <div className="min-w-0">
      <p className="truncate text-xs font-semibold uppercase tracking-[0.06em]">{candidate.name}</p>
      {candidate.party && (
        <p className="truncate text-xs text-muted-2">{candidate.party.name}</p>
      )}
    </div>
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
            <li key={p.id} className="rounded-xl border border-border bg-surface p-4">
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
  const color = candidate.party?.color ?? "var(--primary)";
  return (
    // min-w-0 : la carte est un élément de grille, et le nom en `truncate`
    // (donc white-space: nowrap) lui imposerait sinon sa largeur min-content,
    // qui déborde de l'écran sous 360 px.
    <div className="min-w-0 rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-4">
        <CandidateAvatar
          name={candidate.name}
          color={candidate.party?.color}
          photoUrl={candidate.photo_url}
          size="lg"
          className="ring-2 ring-border-strong"
        />
        <div className="min-w-0">
          <Link
            href={`/candidats/${candidate.slug}`}
            className="focus-ring block truncate font-serif text-[1.3rem] font-semibold tracking-tight hover:underline"
          >
            {candidate.name}
          </Link>
          {candidate.party && (
            <p className="mt-1.5 flex min-w-0 items-center gap-2">
              {/* Sigle du parti, à défaut d'un logo — jamais une abréviation inventée. */}
              {candidate.party.short_name && (
                <span
                  className="shrink-0 rounded-full px-2 py-0.5 text-[0.7rem] font-bold leading-none text-white"
                  style={{ background: color }}
                >
                  {candidate.party.short_name}
                </span>
              )}
              <span className="truncate text-sm text-muted">{candidate.party.name}</span>
            </p>
          )}
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
      <p className="flex items-center gap-2 text-sm font-semibold">
        <Users size={15} className="shrink-0 text-primary" />
        En bref
      </p>
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
      {/* Le dénominateur est dit explicitement : sans lui, « 1 opposition »
          ne veut rien dire. */}
      <p className="mt-3.5 border-t border-border pt-3.5 text-xs leading-relaxed text-muted-2">
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
  seeAllLabel,
  onSelect,
  onSeeAll,
}: {
  tone: "success" | "danger";
  title: string;
  subjects: SubjectComparison[];
  emptyLabel: string;
  seeAllLabel: string;
  onSelect: (subject: SubjectComparison) => void;
  onSeeAll: () => void;
}) {
  const isSuccess = tone === "success";
  const Icon = isSuccess ? CircleCheck : CircleX;
  const shown = subjects.slice(0, 3);

  return (
    <div
      className={cn(
        "rounded-2xl border p-5",
        isSuccess ? "border-success/20 bg-success-soft/40" : "border-danger/20 bg-danger-soft/40"
      )}
    >
      <p
        className={cn(
          "flex items-center gap-2 text-sm font-semibold",
          isSuccess ? "text-success" : "text-danger"
        )}
      >
        <Icon size={16} className="shrink-0" />
        {title}
      </p>

      {subjects.length === 0 ? (
        <p className="mt-2 text-sm leading-relaxed text-muted-2">{emptyLabel}</p>
      ) : (
        <>
          <ul className="mt-3 space-y-2.5">
            {shown.map((subject) => (
              <li key={subject.question.id}>
                <button
                  type="button"
                  onClick={() => onSelect(subject)}
                  className="focus-ring flex w-full items-start gap-2 text-left text-sm leading-snug text-foreground/85 hover:underline"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                      isSuccess ? "bg-success" : "bg-danger"
                    )}
                  />
                  {subject.question.question}
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={onSeeAll}
            className={cn(
              "focus-ring mt-3.5 flex items-center gap-1.5 text-sm font-medium hover:underline",
              isSuccess ? "text-success" : "text-danger"
            )}
          >
            {seeAllLabel}
            <ArrowRight size={14} className="shrink-0" />
          </button>
        </>
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
      <p className="flex items-center gap-2 text-sm font-semibold">
        <Users size={15} className="shrink-0 text-primary" />
        Comparer avec un autre candidat
      </p>
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
