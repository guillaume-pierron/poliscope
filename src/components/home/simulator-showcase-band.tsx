import Link from "next/link";
import { ArrowRight, Calculator, Info } from "lucide-react";
import { DEFAULT_PROFILE } from "@/lib/simulator/types";
import { cn } from "@/lib/utils";

const PROFILE_CHIPS = [
  `${DEFAULT_PROFILE.netMonthlyIncome.toLocaleString("fr-FR")} € net`,
  "Célibataire",
  "Locataire",
  "Voiture",
  `${DEFAULT_PROFILE.kmPerYear.toLocaleString("fr-FR")} km/an`,
];

export function SimulatorShowcaseBand({
  concernCount,
  quantifiedCount,
  totalEuro,
  className,
}: {
  concernCount: number;
  quantifiedCount: number;
  totalEuro: number;
  className?: string;
}) {
  return (
    <Link
      href="/simulateur"
      className={cn(
        "focus-ring group flex flex-col gap-6 rounded-[24px] border border-accent/20 bg-accent-soft/50 p-7 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/35 sm:p-8",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-card text-accent">
          <Calculator size={19} strokeWidth={1.75} />
        </span>
        <div className="min-w-0">
          <h3 className="font-serif text-[1.4rem] font-semibold tracking-tight sm:text-[1.55rem]">
            Ce que les programmes pourraient changer pour vous.
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            Décrivez votre situation et découvrez quelles mesures vous concernent, avec un montant
            lorsque celui-ci peut être calculé sérieusement.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-4 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:gap-6">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-2">
              Exemple de profil
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {PROFILE_CHIPS.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-border-strong bg-surface px-2.5 py-1 text-xs font-medium text-foreground/80"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          <ArrowRight size={18} className="hidden shrink-0 text-muted-2 sm:block" />

          <div className="shrink-0">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-2">Résultat</p>
            <p className="mt-2 text-sm font-medium text-foreground/85">
              {concernCount} mesures vous concernent
            </p>
            <p className="text-sm font-medium text-foreground/85">
              {quantifiedCount} impact{quantifiedCount > 1 ? "s" : ""} calculable
              {quantifiedCount > 1 ? "s" : ""}
            </p>
            <p className="font-mono text-lg font-semibold text-success">
              +{Math.round(totalEuro)} €/mois estimés
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-start gap-2 lg:items-end">
          <span className="focus-ring inline-flex items-center gap-1.5 rounded-xl bg-foreground px-6 py-3 text-sm font-medium text-card transition-transform group-hover:-translate-y-0.5">
            Simuler mon impact
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </span>
          <p className="flex items-center gap-1.5 text-xs text-muted-2">
            <Info size={12} />
            Estimation partielle · uniquement sur les mesures chiffrables
          </p>
        </div>
      </div>
    </Link>
  );
}
