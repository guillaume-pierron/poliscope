import Link from "next/link";
import { ArrowRight, ExternalLink, Info, LineChart, Sun } from "lucide-react";
import { CandidateAvatar } from "@/components/candidates/candidate-avatar";
import { ButtonLink } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import type { HeadlinePoll } from "@/lib/data/queries";
import type { Candidate } from "@/lib/types";

export function PollHeroPanel({
  candidates,
  headline,
  showMatchNudge,
}: {
  candidates: Candidate[];
  headline: HeadlinePoll | null;
  showMatchNudge: boolean;
}) {
  return (
    <div className="rounded-[20px] border border-border bg-card p-6 shadow-[0_24px_70px_-38px_rgba(15,23,41,0.35)]">
      {headline ? (
        <PollBody candidates={candidates} headline={headline} />
      ) : (
        <div className="flex flex-col items-center py-6 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-soft text-primary">
            <LineChart size={20} />
          </span>
          <p className="mt-3 text-sm text-muted">
            Aucun sondage fiable n&apos;est disponible pour le moment.
          </p>
          <Link
            href="/sondages"
            className="focus-ring mt-2 text-sm font-medium text-primary hover:underline"
          >
            Voir la page Sondages
          </Link>
        </div>
      )}

      {showMatchNudge && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <p className="text-sm text-muted">
            Et vous, de quel candidat êtes-vous le plus proche&nbsp;?
          </p>
          <ButtonLink href="/match" variant="accent" size="sm" className="shrink-0">
            Faire mon Match
            <Sun size={14} />
          </ButtonLink>
        </div>
      )}
    </div>
  );
}

function PollBody({ candidates, headline }: { candidates: Candidate[]; headline: HeadlinePoll }) {
  const { poll, scenario, results } = headline;
  const sorted = [...results].sort((a, b) => b.value - a.value).slice(0, 5);
  const maxValue = Math.max(...sorted.map((r) => r.value), 1);

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <p className="font-serif text-[1.05rem] font-semibold">La course aujourd&apos;hui</p>
        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-success-soft px-2.5 py-1 text-xs font-medium text-success">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          {formatDate(poll.published_at)}
        </span>
      </div>
      <p className="mt-0.5 text-xs text-muted-2">
        {poll.institute} — {scenario.label}
      </p>

      <ul className="mt-5 space-y-3.5">
        {sorted.map((result) => {
          const candidate = candidates.find((c) => c.id === result.candidate_id);
          if (!candidate) return null;
          const color = candidate.party?.color ?? "var(--primary)";
          return (
            <li key={result.id} className="flex items-center gap-3">
              <CandidateAvatar
                name={candidate.name}
                color={candidate.party?.color}
                photoUrl={candidate.photo_url}
                size="sm"
              />
              <p className="w-[118px] shrink-0 truncate text-sm font-medium xl:w-[150px]">
                {candidate.name}
              </p>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-strong">
                <div
                  className="h-full rounded-full transition-[width] duration-700 ease-out"
                  style={{ width: `${(result.value / maxValue) * 100}%`, background: color }}
                />
              </div>
              <span
                className="w-[52px] shrink-0 text-right font-mono text-sm font-semibold tabular-nums"
                style={{ color }}
              >
                {result.value}%
              </span>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 flex items-start gap-1.5 text-xs text-muted-2">
        <Info size={13} className="mt-0.5 shrink-0" />
        Les scores peuvent varier selon les hypothèses de candidatures testées par l&apos;institut.
      </p>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
        <a
          href={poll.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
        >
          {poll.source_name || poll.institute}
          <ExternalLink size={12} />
        </a>
        <Link
          href="/sondages"
          className="focus-ring flex shrink-0 items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          Voir tous les sondages
          <ArrowRight size={13} />
        </Link>
      </div>
    </>
  );
}
