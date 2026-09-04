import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function AverageExplainer() {
  return (
    <div className="rounded-2xl border border-accent/25 bg-accent-soft/40 p-5">
      <p className="flex items-center gap-2 text-sm font-semibold text-accent">
        <Sparkles size={15} />
        Pourquoi les chiffres sont-ils des moyennes ?
      </p>
      <p className="mt-2 text-sm leading-relaxed text-foreground/80">
        Nous calculons une moyenne des derniers sondages de premier tour pour lisser les écarts
        méthodologiques entre instituts et donner une image plus stable de la tendance.
      </p>
      <Link
        href="/methodologie"
        className="focus-ring mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
      >
        En savoir plus sur notre méthodologie
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}
