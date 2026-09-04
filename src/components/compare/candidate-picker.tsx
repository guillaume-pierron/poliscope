"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, SplitSquareHorizontal } from "lucide-react";
import { CandidateAvatar } from "@/components/candidates/candidate-avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Candidate } from "@/lib/types";

export function CandidatePicker({
  candidates,
  initialA,
}: {
  candidates: Candidate[];
  initialA?: string;
}) {
  const router = useRouter();
  const [a, setA] = useState<string | undefined>(initialA);
  const [b, setB] = useState<string | undefined>(undefined);

  function pick(slug: string) {
    if (a === slug) {
      setA(undefined);
      return;
    }
    if (b === slug) {
      setB(undefined);
      return;
    }
    if (!a) setA(slug);
    else if (!b) setB(slug);
    else {
      setA(slug);
      setB(undefined);
    }
  }

  function launch() {
    if (a && b) router.push(`/comparer/${a}-vs-${b}`);
  }

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {candidates.map((candidate) => {
          const role = a === candidate.slug ? "A" : b === candidate.slug ? "B" : null;
          return (
            <button
              key={candidate.id}
              type="button"
              onClick={() => pick(candidate.slug)}
              className={cn(
                "focus-ring relative flex items-center gap-3 rounded-xl border p-4 text-left transition-all",
                role
                  ? "border-primary bg-primary-soft"
                  : "border-border hover:border-border-strong hover:bg-surface"
              )}
            >
              <CandidateAvatar
                name={candidate.name}
                color={candidate.party?.color}
                photoUrl={candidate.photo_url}
                size="sm"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{candidate.name}</p>
                <p className="truncate text-xs text-muted">{candidate.party?.name}</p>
              </div>
              {role && (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {role}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <p className="text-sm text-muted">
          {!a && "Choisissez un premier candidat."}
          {a && !b && "Choisissez un second candidat."}
          {a && b && "Prêt à comparer."}
        </p>
        <Button variant="accent" size="lg" onClick={launch} disabled={!a || !b}>
          <SplitSquareHorizontal size={18} />
          Comparer
          <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  );
}
