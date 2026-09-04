import Link from "next/link";
import { ArrowRight, ShieldCheck, Users, BarChart3 } from "lucide-react";
import { getCandidates, getProposals, getThemes } from "@/lib/data/queries";

/**
 * Top status strip. The mockup showed a live news ticker ("EN DIRECT",
 * "Débat ce soir à 21h…", "il y a 1 h"): that needs a real newsroom feed,
 * which doesn't exist yet, and inventing headlines/timestamps would be
 * misinformation. Same visual, fed instead by figures that are actually
 * true right now. When the actualités module ships, swap `items` below for
 * the real feed — the markup already supports a meta/timestamp per item.
 */
export async function Ticker() {
  const [candidates, proposals, themes] = await Promise.all([
    getCandidates(),
    getProposals(),
    getThemes(),
  ]);

  const items = [
    {
      icon: ShieldCheck,
      label: `${proposals.length} propositions sourcées`,
      meta: "toutes reliées à une source",
    },
    {
      icon: Users,
      label: `${candidates.length} candidats déclarés`,
      meta: "présidentielle 2027",
    },
    {
      icon: BarChart3,
      label: `${themes.length} thématiques comparées`,
      meta: "thème par thème",
    },
  ];

  return (
    <div className="border-b border-border bg-surface/70">
      <div className="container-app flex h-10 items-center gap-4 overflow-x-auto whitespace-nowrap text-xs [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <span className="flex shrink-0 items-center gap-1.5 font-semibold tracking-wide">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          À JOUR
        </span>

        {items.map((item, i) => (
          <div key={item.label} className="flex shrink-0 items-center gap-4">
            <span className="text-border-strong">|</span>
            <span className="flex items-center gap-1.5">
              <item.icon size={13} className={i === 0 ? "text-success" : "text-primary"} />
              <span className="font-medium text-foreground">{item.label}</span>
              <span className="text-muted-2">{item.meta}</span>
            </span>
          </div>
        ))}

        <Link
          href="/methodologie"
          className="focus-ring ml-auto hidden shrink-0 items-center gap-1 font-medium text-muted transition-colors hover:text-foreground md:flex"
        >
          Voir la méthodologie
          <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}
