import type { Metadata } from "next";
import { Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Méthodologie",
  description: "Comment fonctionne le calcul de compatibilité de Mon Match, en toute transparence.",
};

export default function MethodologiePage() {
  return (
    <div className="container-app max-w-2xl py-10 md:py-16">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Méthodologie</h1>
      <p className="mt-3 text-muted">
        Comment Poliscope calcule votre compatibilité avec chaque candidat — et ce que ce score ne
        signifie pas.
      </p>

      <div className="prose-content mt-10 space-y-10">
        <section>
          <h2 className="text-xl font-semibold">1. Une échelle commune</h2>
          <p className="mt-3 leading-relaxed text-foreground/85">
            Chaque question du Match porte sur une mesure concrète. Vos réponses, comme les
            positions documentées des candidats, sont exprimées sur la même échelle à cinq
            niveaux :
          </p>
          <div className="mt-4 grid grid-cols-5 gap-2 text-center text-xs">
            {[
              ["-2", "Totalement opposé"],
              ["-1", "Plutôt opposé"],
              ["0", "Neutre"],
              ["+1", "Plutôt favorable"],
              ["+2", "Totalement favorable"],
            ].map(([value, label]) => (
              <div key={value} className="rounded-lg border border-border bg-surface p-3">
                <p className="font-mono text-lg font-semibold">{value}</p>
                <p className="mt-1 text-muted">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold">2. Le calcul, question par question</h2>
          <p className="mt-3 leading-relaxed text-foreground/85">
            Pour chaque question à laquelle vous répondez, on mesure l&apos;écart entre votre
            réponse et la position documentée du candidat, sur cette échelle de -2 à +2. Un écart
            de 0 donne une similarité de 100&nbsp;%, un écart maximal de 4 donne une similarité de
            0&nbsp;%.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-lg border border-border bg-surface p-4 text-sm">
            similarité = 1 − (|votre réponse − position du candidat| / 4)
          </pre>
        </section>

        <section>
          <h2 className="text-xl font-semibold">3. Une moyenne pondérée</h2>
          <p className="mt-3 leading-relaxed text-foreground/85">
            Le score global affiché sur 100 est la moyenne des similarités obtenues sur chaque
            question, pondérée par l&apos;importance (le poids) de chaque question. Certaines
            questions jugées structurantes comptent davantage dans le résultat final.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">4. Les questions sans réponse ne sont jamais devinées</h2>
          <p className="mt-3 leading-relaxed text-foreground/85">
            Si vous passez une question, elle est simplement exclue du calcul. Si un candidat n&apos;a
            pas de position documentée et sourcée sur une question, celle-ci est exclue du calcul
            pour ce candidat uniquement — jamais remplacée par une estimation. La fiche du candidat
            l&apos;indique alors explicitement : « Position non renseignée ».
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">5. Ce que le score ne dit pas</h2>
          <div className="mt-3 flex items-start gap-3 rounded-xl border border-border bg-surface p-4 text-sm">
            <Info size={16} className="mt-0.5 shrink-0 text-primary" />
            <p>
              Poliscope n&apos;affiche jamais « Vous devriez voter pour X ». Le résultat indique
              uniquement que vos réponses sont les plus proches des positions actuellement
              renseignées pour ce candidat, sur les questions auxquelles vous avez répondu. Le vote
              reste une décision personnelle, informée par bien plus qu&apos;un questionnaire.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold">6. Vos réponses restent chez vous</h2>
          <p className="mt-3 leading-relaxed text-foreground/85">
            Le questionnaire ne demande ni nom, ni email, ni création de compte. Vos réponses sont
            stockées uniquement dans votre navigateur (localStorage) et le calcul de compatibilité
            s&apos;exécute sur votre appareil. Voir la page{" "}
            <a href="/confidentialite" className="underline underline-offset-2">
              Confidentialité
            </a>{" "}
            pour le détail.
          </p>
        </section>
      </div>
    </div>
  );
}
