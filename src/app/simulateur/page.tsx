import type { Metadata } from "next";
import { Simulator } from "@/components/simulator/simulator";
import { getCandidates } from "@/lib/data/queries";

export const metadata: Metadata = {
  title: "Simulateur d'impact",
  description:
    "Renseignez votre situation et découvrez, candidat par candidat, quelles mesures sourcées vous concernent — avec une estimation en euros quand la mesure est chiffrée.",
};

export default async function SimulateurPage() {
  const candidates = await getCandidates();

  return (
    <div className="container-app py-10 md:py-14">
      <div className="max-w-3xl">
        <h1 className="font-serif text-[2rem] font-semibold tracking-tight sm:text-[2.4rem]">
          Quel impact sur votre situation&nbsp;?
        </h1>
        <p className="mt-3 text-muted">
          Décrivez votre foyer : Poliscope croise votre profil avec les propositions réellement
          sourcées de chaque candidat, et estime un montant chaque fois que la mesure donne
          elle-même le chiffre.
        </p>
      </div>

      <div className="mt-9">
        <Simulator candidates={candidates} />
      </div>
    </div>
  );
}
