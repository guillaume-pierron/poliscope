import Link from "next/link";
import { ArrowRight, BarChart3, Calculator, Info, UserRound } from "lucide-react";
import { DEFAULT_PROFILE } from "@/lib/simulator/types";
import { cn } from "@/lib/utils";

const PROFILE_TITLE = "Salarié, célibataire, locataire";
const PROFILE_DETAIL = [
  `${DEFAULT_PROFILE.netMonthlyIncome.toLocaleString("fr-FR")} € net`,
  "Voiture",
  `${DEFAULT_PROFILE.kmPerYear.toLocaleString("fr-FR")} km/an`,
].join(" · ");

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
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-card text-accent">
          <Calculator size={20} strokeWidth={1.75} />
        </span>
        <div className="min-w-0">
          <h3 className="font-serif text-[1.4rem] font-semibold tracking-tight sm:text-[1.6rem]">
            Simulez ce que les programmes pourraient changer pour vous.
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
            Décrivez votre situation et découvrez quelles mesures vous concernent, avec un montant
            estimé quand cela est chiffré.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-5 xl:flex-row xl:items-stretch">
        <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
          {/* Le profil d'exemple est le profil par défaut du simulateur : les
              chiffres du résultat en découlent réellement. */}
          <div className="flex flex-1 items-center gap-4 rounded-2xl border border-border bg-card p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
              <UserRound size={20} strokeWidth={1.75} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-2">Exemple de profil</p>
              <p className="mt-0.5 truncate text-sm font-semibold">{PROFILE_TITLE}</p>
              <p className="mt-0.5 truncate text-xs text-muted-2">{PROFILE_DETAIL}</p>
            </div>
            <span className="shrink-0 text-sm font-medium text-primary group-hover:underline">
              Modifier
            </span>
          </div>

          <ArrowRight size={18} className="mx-auto shrink-0 text-muted-2 max-sm:rotate-90" />

          <div className="flex flex-1 items-center gap-4 rounded-2xl border border-success/25 bg-success-soft/60 p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-card text-success">
              <BarChart3 size={20} strokeWidth={1.75} />
            </span>
            <div className="min-w-0">
              <p className="text-xs text-muted-2">Résultat pour ce profil</p>
              <p className="mt-0.5 text-sm font-medium text-foreground/85">
                {concernCount} mesures vous concernent
              </p>
              <p className="text-sm font-medium text-foreground/85">
                {quantifiedCount} impact{quantifiedCount > 1 ? "s" : ""} calculable
                {quantifiedCount > 1 ? "s" : ""}
              </p>
              <p className="mt-1 font-mono text-xl font-semibold text-success">
                +{Math.round(totalEuro)} €/mois estimés
              </p>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-start justify-center gap-2.5 xl:max-w-[15rem] xl:border-l xl:border-accent/20 xl:pl-6">
          <span className="focus-ring inline-flex items-center gap-1.5 rounded-xl bg-foreground px-6 py-3 text-sm font-medium text-card transition-transform group-hover:-translate-y-0.5">
            Simuler mon impact
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </span>
          <p className="flex items-start gap-1.5 text-xs text-muted-2">
            <Info size={12} className="mt-0.5 shrink-0" />
            Estimation partielle — uniquement sur les mesures chiffrables
          </p>
        </div>
      </div>
    </Link>
  );
}
