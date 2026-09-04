"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sun,
  Sprout,
  Activity,
  ShieldCheck,
  Users,
  Search,
  ArrowRight,
  ChevronRight,
  Check,
  X,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Swoosh } from "@/components/ui/swoosh";
import { ThemeIcon } from "@/lib/theme-icons";
import { questions } from "@/lib/data/local/questions";
import { themes } from "@/lib/data/local/themes";

export interface UpdateItem {
  id: string;
  title: string;
  dateLabel: string;
  themeIcon: string;
  href: string;
}

const OPTIONS = [
  { label: "Oui", icon: Check, tone: "text-success" },
  { label: "Non", icon: X, tone: "text-danger" },
  { label: "Pas sûr", icon: HelpCircle, tone: "text-muted-2" },
];

function QuestionOfDay() {
  const [selected, setSelected] = useState<string | null>(null);
  // Deterministic on the server pass, refined to today once mounted:
  // Date.now() is impure and would risk a hydration mismatch in render.
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    );
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIndex(dayOfYear % questions.length);
  }, []);

  const question = questions[index];
  const theme = themes.find((t) => t.id === question.theme_id);

  return (
    <div className="relative flex min-w-0 flex-col overflow-hidden rounded-[20px] border border-[#F0E4CB] bg-[#FDF8EC] p-6">
      <div className="flex items-start justify-between gap-4">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-foreground/80">
          <Sun size={14} className="text-accent" />
          Question du jour
        </p>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-success-soft">
          <Sprout size={17} className="text-success" />
        </span>
      </div>

      <p className="mt-4 flex-1 text-balance text-[0.98rem] font-medium leading-snug">
        {question.question}
      </p>

      <div className="mt-5 grid grid-cols-3 gap-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt.label}
            type="button"
            onClick={() => setSelected(opt.label)}
            className={cn(
              "focus-ring flex min-w-0 items-center justify-center gap-1.5 rounded-xl border bg-card px-2 py-2.5 text-sm font-medium transition-colors",
              selected === opt.label
                ? "border-primary text-primary"
                : "border-border-strong hover:bg-surface"
            )}
          >
            <opt.icon size={14} className={cn("shrink-0", selected === opt.label ? "text-primary" : opt.tone)} />
            <span className="truncate">{opt.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="min-w-0 truncate text-xs text-muted-2">
          {theme ? `${theme.name} · ` : ""}1 des 18 questions du Match
        </p>
        <Link
          href="/match"
          className="focus-ring flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          Faire le test
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

function RecentUpdates({ updates }: { updates: UpdateItem[] }) {
  return (
    <div className="flex min-w-0 flex-col rounded-[20px] border border-[#E4EAF6] bg-[#F6F8FD] p-6">
      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-foreground/80">
        <Activity size={14} className="text-primary" />
        Dernières propositions ajoutées
      </p>

      <ul className="mt-4 flex-1 space-y-1.5">
        {updates.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              className="focus-ring group flex items-center gap-2.5 rounded-xl px-2 py-2 transition-colors hover:bg-card"
            >
              <span className="shrink-0 rounded-md bg-card px-2 py-1 text-[11px] text-muted-2">
                {item.dateLabel}
              </span>
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary-soft">
                <ThemeIcon icon={item.themeIcon} className="h-3.5 w-3.5 text-primary" />
              </span>
              <span className="min-w-0 flex-1 truncate text-sm">{item.title}</span>
              <ChevronRight
                size={15}
                className="shrink-0 text-muted-2 transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href="/candidats"
        className="focus-ring mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
      >
        Voir tous les programmes
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}

function TrustCard({
  candidateCount,
  proposalCount,
}: {
  candidateCount: number;
  proposalCount: number;
}) {
  const stats = [
    { icon: ShieldCheck, value: `${proposalCount}`, label: "propositions sourcées" },
    { icon: Users, value: `${candidateCount}`, label: "candidats couverts" },
    { icon: Search, value: "100%", label: "méthodologie publique et transparente" },
  ];

  return (
    <div className="flex min-w-0 flex-col rounded-[20px] border border-[#DCEDE1] bg-[#F1F9F3] p-6">
      <p className="relative inline-block self-start font-serif text-[0.95rem] font-semibold uppercase tracking-wide">
        La confiance, ça se prouve.
        <Swoosh className="text-success/60" />
      </p>

      <div className="mt-6 grid flex-1 grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="min-w-0">
            <stat.icon size={18} className="text-success" />
            <p className="mt-2 font-serif text-[1.7rem] font-semibold leading-none tabular-nums">
              {stat.value}
            </p>
            <p className="mt-1.5 text-[11px] leading-snug text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      <Link
        href="/methodologie"
        className="focus-ring mt-5 inline-flex items-center gap-1 text-sm font-medium text-success hover:underline"
      >
        Découvrir notre méthodologie
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}

export function TodayGrid({
  candidateCount,
  proposalCount,
  updates,
}: {
  candidateCount: number;
  proposalCount: number;
  updates: UpdateItem[];
}) {
  return (
    <section className="container-app pb-4 pt-8">
      <div className="grid gap-4 lg:grid-cols-3">
        <QuestionOfDay />
        <RecentUpdates updates={updates} />
        <TrustCard candidateCount={candidateCount} proposalCount={proposalCount} />
      </div>
    </section>
  );
}
