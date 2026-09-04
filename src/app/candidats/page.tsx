import type { Metadata } from "next";
import { CandidatesGrid } from "@/components/candidates/candidates-grid";
import { getCandidates } from "@/lib/data/queries";

export const metadata: Metadata = {
  title: "Candidats",
  description: "Découvrez tous les candidats à la présidentielle 2027 et leurs programmes.",
};

export default async function CandidatsPage() {
  const candidates = await getCandidates();

  return (
    <div className="container-app py-10 md:py-16">
      <h1 className="font-serif text-[2rem] font-semibold tracking-tight sm:text-[2.4rem]">Les candidats</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Les principaux candidats déclarés à l&apos;élection présidentielle 2027. Chaque
        proposition listée est reliée à sa source d&apos;origine — voir la{" "}
        <a href="/methodologie" className="underline underline-offset-2">
          méthodologie
        </a>
        .
      </p>

      <div className="mt-8">
        <CandidatesGrid candidates={candidates} />
      </div>
    </div>
  );
}
