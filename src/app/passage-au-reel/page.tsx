import type { Metadata } from "next";
import { Clock, Coins, Compass, Gauge, Users } from "lucide-react";
import { PassageAuReelExplorer, type AnalyzedMeasure } from "@/components/passage-au-reel/passage-au-reel-explorer";
import { HandNote } from "@/components/ui/hand-note";
import { getCandidates, getProposals, getPublishedMeasureAnalysisBundles, getThemes } from "@/lib/data/queries";

export const metadata: Metadata = {
  title: "Faisabilité & impact",
  description:
    "Coût, faisabilité, délais, bénéficiaires et impacts : ce que l'on peut réellement savoir derrière chaque proposition.",
};

/**
 * Les quatre lignes que porte chaque carte. Les trois premières se lisent
 * seules une fois la carte sous les yeux : elles ne sont rappelées ici que
 * pour dire d'où vient le chiffre. La quatrième a besoin d'être définie —
 * on la lit spontanément comme « chances que la mesure passe », ce qu'elle
 * n'est pas.
 */
const READING_KEYS = [
  { icon: Coins, label: "Coût", body: "Le chiffrage annuel publié par une source identifiée." },
  { icon: Clock, label: "Délai", body: "Le temps de mise en œuvre une fois la mesure votée." },
  { icon: Users, label: "Bénéficiaires", body: "La population concernée, quand une source la chiffre." },
  {
    icon: Gauge,
    label: "Niveau de certitude",
    body: "La solidité des données disponibles — jamais un pronostic sur l'adoption de la mesure.",
  },
];

export default async function PassageAuReelPage() {
  const [bundles, proposals, candidates, themes] = await Promise.all([
    getPublishedMeasureAnalysisBundles(),
    getProposals(),
    getCandidates(),
    getThemes(),
  ]);

  const measures: AnalyzedMeasure[] = bundles
    .map((bundle) => {
      const proposal = proposals.find((p) => p.id === bundle.analysis.proposal_id);
      if (!proposal) return null;
      const candidate = candidates.find((c) => c.id === proposal.candidate_id);
      if (!candidate) return null;
      const theme = themes.find((t) => t.id === proposal.theme_id);
      return { bundle, proposal, candidate, theme };
    })
    .filter((m): m is AnalyzedMeasure => m !== null);

  return (
    <div className="container-app max-w-6xl py-10 md:py-14">
      <div className="relative">
        {/* Aquarelle décorative facultative : fond CSS, donc rien ne casse tant
            que le fichier n'a pas été déposé (voir public/illustrations/README.txt). */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 hidden h-32 w-56 bg-[url('/illustrations/passage-au-reel-header.png')] bg-contain bg-right-top bg-no-repeat xl:block"
        />

        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1.5 text-sm font-medium text-primary">
            <Compass size={15} />
            Faisabilité & impact
          </span>
          <h1 className="mt-4 text-balance font-serif text-[2.1rem] font-semibold leading-[1.1] tracking-tight sm:text-[2.6rem]">
            Ce qu&apos;une mesure peut vraiment changer.
          </h1>
          <p className="mt-4 text-muted">
            Coût, délais, bénéficiaires, obstacles juridiques : chaque analyse rassemble ce que des sources
            publiques permettent d&apos;établir sur une proposition — et dit clairement où elles s&apos;arrêtent.{" "}
            <a href="/methodologie#passage-au-reel" className="underline underline-offset-2">
              Comment ces analyses sont construites
            </a>
            .
          </p>
          <HandNote className="mt-4 block" tone="primary">
            aucun chiffre sans source
          </HandNote>
        </div>
      </div>

      <div className="mt-9 grid gap-x-6 gap-y-5 rounded-2xl border border-border bg-surface/60 p-5 sm:grid-cols-2 lg:grid-cols-4">
        {READING_KEYS.map(({ icon: Icon, label, body }) => (
          <div key={label}>
            <p className="flex items-center gap-2 text-sm font-semibold">
              <Icon size={15} className="shrink-0 text-primary" />
              {label}
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-muted">{body}</p>
          </div>
        ))}
      </div>

      <div className="mt-9">
        {measures.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border-strong p-8 text-center text-sm text-muted-2">
            Aucune analyse publiée pour le moment.
          </p>
        ) : (
          <PassageAuReelExplorer measures={measures} themes={themes} />
        )}
      </div>
    </div>
  );
}
