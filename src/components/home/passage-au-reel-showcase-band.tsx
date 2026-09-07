import Link from "next/link";
import { ArrowRight, Compass, Scale, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Homepage entry point for "Passage au réel". Renders nothing when no
 * analysis is published yet — an empty promise on the homepage would be
 * worse than no promise at all.
 */
export function PassageAuReelShowcaseBand({
  analysisCount,
  className,
}: {
  analysisCount: number;
  className?: string;
}) {
  if (analysisCount === 0) return null;

  return (
    <Link
      href="/passage-au-reel"
      className={cn(
        "focus-ring group flex flex-col gap-5 rounded-[24px] border border-primary/20 bg-primary-soft/40 p-7 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/35 sm:p-8",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-card text-primary">
          <Compass size={19} strokeWidth={1.75} />
        </span>
        <div className="min-w-0">
          <h3 className="font-serif text-[1.4rem] font-semibold tracking-tight sm:text-[1.55rem]">
            Combien ça coûte&nbsp;? Est-ce vraiment applicable&nbsp;?
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            Pour {analysisCount} mesure{analysisCount > 1 ? "s" : ""} analysée
            {analysisCount > 1 ? "s" : ""} : le cadre juridique, le coût quand il est chiffré, qui
            est concerné — et ce qui reste, honnêtement, incertain.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          <Chip icon={Scale} label="Cadre juridique" />
          <Chip icon={Wallet} label="Coût annuel" />
          <Chip icon={Compass} label="Qui est concerné" />
        </div>

        <span className="focus-ring inline-flex w-fit shrink-0 items-center gap-1.5 rounded-xl bg-foreground px-6 py-3 text-sm font-medium text-card transition-transform group-hover:-translate-y-0.5">
          Explorer faisabilité & impact
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

function Chip({ icon: Icon, label }: { icon: typeof Compass; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground/80">
      <Icon size={13} className="text-primary" />
      {label}
    </span>
  );
}
