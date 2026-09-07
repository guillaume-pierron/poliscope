import type { Metadata } from "next";
import Link from "next/link";
import { CandidatesGrid } from "@/components/candidates/candidates-grid";
import { getCandidates, getProposals } from "@/lib/data/queries";

export const metadata: Metadata = {
  title: "Candidats",
  description: "Découvrez tous les candidats à la présidentielle 2027 et leurs programmes.",
};

export default async function CandidatsPage() {
  const [candidates, proposals] = await Promise.all([getCandidates(), getProposals()]);

  // Décomptes réels par candidat — jamais un ordre de grandeur : ce sont les
  // propositions effectivement documentées et les thèmes qu'elles couvrent.
  const proposalCounts: Record<string, number> = {};
  const themeSets: Record<string, Set<string>> = {};
  for (const proposal of proposals) {
    proposalCounts[proposal.candidate_id] = (proposalCounts[proposal.candidate_id] ?? 0) + 1;
    (themeSets[proposal.candidate_id] ??= new Set()).add(proposal.theme_id);
  }
  const themeCounts = Object.fromEntries(
    Object.entries(themeSets).map(([id, set]) => [id, set.size])
  );

  return (
    <div className="container-app py-10 md:py-14">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <h1 className="font-serif text-[2.2rem] font-semibold tracking-tight sm:text-[2.7rem]">
            Les candidats
          </h1>
          <p className="mt-3 text-muted">
            Les principaux candidats déclarés à l&apos;élection présidentielle 2027. Chaque
            proposition listée est reliée à sa source d&apos;origine — voir la{" "}
            <Link href="/methodologie" className="underline underline-offset-2">
              méthodologie
            </Link>
            .
          </p>
        </div>

        <div className="flex shrink-0 items-start gap-6">
          <p className="max-w-[16rem] font-serif text-[1.05rem] italic leading-relaxed text-foreground/75">
            Comprendre les programmes.
            <br />
            Éclairer le débat. Comparer sereinement.
            <span aria-hidden="true" className="mt-3 block h-0.5 w-14 bg-primary/60" />
          </p>
          {/* Illustration d'en-tête, optionnelle : en fond CSS, donc rien ne
              s'affiche tant que le fichier n'est pas déposé (voir
              public/illustrations/README.txt). */}
          <span
            aria-hidden="true"
            className="hidden h-28 w-52 bg-[url('/illustrations/candidates-header.png')] bg-contain bg-right-top bg-no-repeat xl:block"
          />
        </div>
      </div>

      <div className="mt-9">
        <CandidatesGrid
          candidates={candidates}
          proposalCounts={proposalCounts}
          themeCounts={themeCounts}
        />
      </div>
    </div>
  );
}
