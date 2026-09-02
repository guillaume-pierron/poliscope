import Link from "next/link";
import { CandidateAvatar } from "./candidate-avatar";
import { Badge } from "@/components/ui/badge";
import { ORIENTATION_LABELS } from "@/lib/types";
import type { Candidate } from "@/lib/types";

export function CandidateCard({ candidate }: { candidate: Candidate }) {
  return (
    <Link
      href={`/candidats/${candidate.slug}`}
      className="focus-ring group flex flex-col rounded-xl border border-border bg-background p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[0_20px_40px_-24px_rgba(15,15,25,0.25)]"
    >
      <div className="flex items-start justify-between">
        <CandidateAvatar name={candidate.name} color={candidate.party?.color} size="lg" />
        {candidate.is_demo && <Badge variant="demo">Démo</Badge>}
      </div>

      <h3 className="mt-4 text-lg font-semibold">{candidate.name}</h3>
      <p className="text-sm text-muted">
        {candidate.party?.name}
        {candidate.party && (
          <span className="text-muted-2"> · {ORIENTATION_LABELS[candidate.party.orientation]}</span>
        )}
      </p>

      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">{candidate.biography}</p>

      <span className="mt-4 text-sm font-medium text-primary group-hover:underline">
        Voir le programme →
      </span>
    </Link>
  );
}
