import type { Metadata } from "next";
import { Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Méthodologie",
  description: "Comment fonctionne le calcul de proximité de Mon Match, en toute transparence.",
};

export default function MethodologiePage() {
  return (
    <div className="container-app max-w-2xl py-10 md:py-16">
      <h1 className="font-serif text-[2rem] font-semibold tracking-tight sm:text-[2.4rem]">Méthodologie</h1>
      <p className="mt-3 text-muted">
        Comment Poliscope calcule votre proximité avec chaque candidat — et ce que ce score ne
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
          <h2 className="text-xl font-semibold">2. « Neutre » et « Sans opinion » sont deux choses différentes</h2>
          <p className="mt-3 leading-relaxed text-foreground/85">
            C&apos;est une distinction importante, souvent confondue ailleurs :
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-surface p-4">
              <p className="font-semibold text-foreground">Neutre</p>
              <p className="mt-1.5 text-sm text-muted">
                Une vraie réponse, notée 0. Elle entre normalement dans le calcul, exactement comme
                un +2 ou un -1 : « je suis sincèrement partagé sur cette question ».
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-4">
              <p className="font-semibold text-foreground">Sans opinion (Passer)</p>
              <p className="mt-1.5 text-sm text-muted">
                N&apos;est pas une réponse. La question est totalement exclue du calcul — elle ne
                vous rapproche jamais artificiellement d&apos;un candidat positionné à 0.
              </p>
            </div>
          </div>
          <p className="mt-3 leading-relaxed text-foreground/85">
            Confondre les deux fausserait le résultat : passer une question par indécision ne doit
            jamais compter comme si vous étiez réellement neutre dessus.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">3. Le calcul, question par question</h2>
          <p className="mt-3 leading-relaxed text-foreground/85">
            Pour chaque question à laquelle vous répondez (Neutre inclus, Sans opinion exclu), on
            mesure l&apos;écart entre votre réponse et la position documentée du candidat. Un écart
            de 0 donne une similarité de 100&nbsp;%, un écart maximal de 4 donne une similarité de
            0&nbsp;%.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-lg border border-border bg-surface p-4 text-sm">
            similarité = 1 − (|votre réponse − position du candidat| / 4)
          </pre>
        </section>

        <section>
          <h2 className="text-xl font-semibold">4. Un score par thème, puis un score global</h2>
          <p className="mt-3 leading-relaxed text-foreground/85">
            Un thème ne pèse jamais plus lourd simplement parce qu&apos;il contient plus de
            questions. Le calcul se fait en deux étapes :
          </p>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-foreground/85">
            <li>
              Pour chaque <strong>thème</strong> (Retraites, Économie, Immigration…), on fait la
              moyenne des similarités de ses seules questions comparables.
            </li>
            <li>
              Le <strong>score global</strong> est la moyenne de ces scores par thème — chaque
              thème compte à égalité, qu&apos;il ait une seule question ou cinq.
            </li>
          </ol>
          <p className="mt-3 leading-relaxed text-foreground/85">
            Par défaut, aucun thème n&apos;est mis en avant par Poliscope : il n&apos;y a pas de
            pondération éditoriale cachée. Un thème sans aucune question comparable est simplement
            exclu du calcul, pour vous comme pour le candidat.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">5. Les questions sans réponse ne sont jamais devinées</h2>
          <p className="mt-3 leading-relaxed text-foreground/85">
            Si vous répondez « Sans opinion », la question est exclue du calcul. Si un candidat
            n&apos;a pas de position documentée et sourcée sur une question, celle-ci est exclue du
            calcul pour ce candidat uniquement — jamais remplacée par une estimation. La fiche du
            candidat l&apos;indique alors explicitement : « Position non renseignée ».
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">6. La couverture : sur combien de réponses repose le score</h2>
          <p className="mt-3 leading-relaxed text-foreground/85">
            Un score calculé sur 16 de vos 18 réponses n&apos;a pas la même robustesse qu&apos;un
            score calculé sur 8. La couverture mesure cette part :
          </p>
          <pre className="mt-4 overflow-x-auto rounded-lg border border-border bg-surface p-4 text-sm">
            couverture = positions documentées comparables / réponses que vous avez données
          </pre>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
            {[
              ["≥ 80 %", "Couverture élevée"],
              ["60 – 79 %", "Couverture moyenne"],
              ["< 60 %", "Couverture faible"],
            ].map(([range, label]) => (
              <div key={label} className="rounded-lg border border-border bg-surface p-3">
                <p className="font-mono text-sm font-semibold">{range}</p>
                <p className="mt-1 text-muted">{label}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 leading-relaxed text-foreground/85">
            Quand la couverture est faible, le résultat est marqué « Résultat provisoire » plutôt
            que présenté avec la même confiance qu&apos;un score bien documenté. Le candidat n&apos;est
            jamais masqué pour autant.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">7. Une précision volontairement simple</h2>
          <p className="mt-3 leading-relaxed text-foreground/85">
            Le score affiché est toujours arrondi à l&apos;entier (80&nbsp;%, jamais 80,43&nbsp;%).
            Ce n&apos;est pas une mesure scientifique au dixième de pourcent près, mais un ordre de
            grandeur pensé pour être lu simplement.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">8. Ce que le score ne dit pas</h2>
          <div className="mt-3 flex items-start gap-3 rounded-xl border border-border bg-surface p-4 text-sm">
            <Info size={16} className="mt-0.5 shrink-0 text-primary" />
            <p>
              Poliscope n&apos;affiche jamais « Vous devriez voter pour X », et ne présente jamais
              ce résultat comme une probabilité de vote ou une mesure scientifique absolue de
              compatibilité politique. Le score indique uniquement une proximité entre vos réponses
              et les positions actuellement renseignées pour ce candidat, sur les questions
              auxquelles vous avez répondu. Le vote reste une décision personnelle, informée par
              bien plus qu&apos;un questionnaire.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold">9. Vos réponses restent chez vous</h2>
          <p className="mt-3 leading-relaxed text-foreground/85">
            Le questionnaire ne demande ni nom, ni email, ni création de compte. Vos réponses, votre
            profil et votre score personnel sont stockés uniquement dans votre navigateur
            (localStorage) et le calcul de proximité s&apos;exécute entièrement sur votre appareil.
            Notre base de données ne contient que des données publiques : questions, thèmes,
            candidats, positions documentées et leurs sources — jamais vos réponses. Voir la page{" "}
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
