"use client";

import { useState } from "react";
import { ButtonLink } from "@/components/ui/button";
import { LIKERT_OPTIONS } from "@/lib/data/local/questions";
import { cn } from "@/lib/utils";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const SAMPLE_QUESTION =
  "Faut-il repousser l'âge légal de départ à la retraite au-delà de 64 ans ?";

export function MatchDemoSection() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <section className="container-app py-20">
      <div className="grid gap-10 rounded-2xl border border-border bg-background p-8 md:grid-cols-2 md:p-12">
        <div>
          <p className="text-sm font-semibold text-primary">Essayez maintenant</p>
          <h2 className="mt-2 text-balance text-3xl font-semibold tracking-tight">
            Une question, pour voir.
          </h2>
          <p className="mt-3 max-w-md text-muted">
            Le vrai questionnaire compte 18 questions couvrant douze thématiques.
            Chaque réponse est comparée aux positions documentées des candidats,
            uniquement sur votre appareil.
          </p>
          <ButtonLink href="/match" variant="primary" size="lg" className="mt-6">
            Faire le test complet
            <ArrowRight size={18} />
          </ButtonLink>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-2">
            Retraites
          </p>
          <p className="mt-2 text-lg font-medium leading-snug">{SAMPLE_QUESTION}</p>

          <div className="mt-5 space-y-2">
            {LIKERT_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setSelected(option.value)}
                className={cn(
                  "focus-ring flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left text-sm transition-colors",
                  selected === option.value
                    ? "border-primary bg-primary-soft text-primary"
                    : "border-border-strong bg-background hover:bg-surface-strong"
                )}
              >
                {option.label}
                {selected === option.value && <CheckCircle2 size={16} />}
              </button>
            ))}
          </div>

          {selected !== null && (
            <p className="mt-4 animate-fade-in text-sm text-muted">
              Enregistré. Dans le vrai Match, on continue ainsi sur 18 questions
              avant d&apos;afficher votre classement.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
