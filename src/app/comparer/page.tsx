import type { Metadata } from "next";
import { CandidatePicker } from "@/components/compare/candidate-picker";
import { getCandidates } from "@/lib/data/queries";

export const metadata: Metadata = {
  title: "Comparer les candidats",
  description: "Choisissez deux candidats et comparez leurs propositions thème par thème.",
};

export default async function ComparerPage({
  searchParams,
}: {
  searchParams: Promise<{ a?: string }>;
}) {
  const [candidates, { a }] = await Promise.all([getCandidates(), searchParams]);

  return (
    <div className="container-app max-w-4xl py-10 md:py-16">
      <h1 className="font-serif text-[2rem] font-semibold tracking-tight sm:text-[2.4rem]">Comparer deux candidats</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Sélectionnez deux candidats pour comparer leurs propositions thème par thème, avec la
        possibilité de n&apos;afficher que leurs différences.
      </p>

      <div className="mt-8">
        <CandidatePicker candidates={candidates} initialA={a} />
      </div>
    </div>
  );
}
