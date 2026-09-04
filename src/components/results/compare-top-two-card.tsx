import Link from "next/link";
import { BarChart3, Scale } from "lucide-react";
import { CandidateAvatarWithParty } from "@/components/candidates/candidate-avatar-party";
import type { CandidateMatchResult } from "@/lib/types";

export function CompareTopTwoCard({
  first,
  second,
}: {
  first: CandidateMatchResult;
  second: CandidateMatchResult;
}) {
  return (
    <div className="rounded-[22px] border border-border bg-primary-soft/40 p-6">
      <p className="flex items-center gap-2.5 font-medium">
        <Scale size={18} className="text-primary" />
        Comparer vos 2 meilleurs résultats
      </p>

      <div className="mt-5 flex items-start gap-3">
        <Contestant result={first} />
        <span className="mt-6 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-card text-[11px] font-semibold text-muted">
          VS
        </span>
        <Contestant result={second} />
      </div>

      <Link
        href={`/comparer/${first.candidate.slug}-vs-${second.candidate.slug}`}
        className="focus-ring mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98]"
      >
        <BarChart3 size={16} />
        Lancer la comparaison
      </Link>
    </div>
  );
}

function Contestant({ result }: { result: CandidateMatchResult }) {
  const { candidate, score } = result;
  const color = candidate.party?.color ?? "var(--primary)";
  return (
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-2.5">
        <CandidateAvatarWithParty candidate={candidate} size="md" />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{candidate.name}</p>
          <p className="truncate text-xs text-muted">{candidate.party?.name}</p>
        </div>
      </div>
      <p className="mt-3 font-serif text-2xl font-semibold tabular-nums" style={{ color }}>
        {score !== null ? `${score}%` : "—"}
      </p>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-card">
        <div
          className="h-full rounded-full"
          style={{ width: score !== null ? `${score}%` : "0%", background: color }}
        />
      </div>
    </div>
  );
}
