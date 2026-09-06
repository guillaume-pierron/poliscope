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
          <h2 className="text-xl font-semibold">1. Trois types de questions, selon ce qu&apos;elles mesurent</h2>
          <p className="mt-3 leading-relaxed text-foreground/85">
            Le Match ne force pas tout dans un simple « oui / non ». Chaque question prend l&apos;une
            de ces trois formes, selon la nature du sujet :
          </p>
          <div className="mt-4 grid gap-3">
            <div className="rounded-xl border border-border bg-surface p-4">
              <p className="font-semibold text-foreground">Échelle d&apos;opinion (12 questions)</p>
              <p className="mt-1.5 text-sm text-muted">
                Pour un sujet qui se mesure sur un seul axe continu (par ex. le niveau d&apos;une
                dépense, l&apos;intensité d&apos;une norme). Vos réponses, comme les positions des
                candidats, sont exprimées sur la même échelle à cinq niveaux, de -2 à +2 — parfois
                en accord/désaccord (« Tout à fait favorable… Totalement opposé »), parfois en
                intensité (« Fortement réduire… Fortement augmenter »). Les deux formulations sont
                calculées de la même façon.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-4">
              <p className="font-semibold text-foreground">Arbitrage entre politiques (4 questions)</p>
              <p className="mt-1.5 text-sm text-muted">
                Pour un sujet où plusieurs politiques réellement différentes s&apos;affrontent, sans
                qu&apos;on puisse les aligner sur un seul axe (ex. nucléaire / renouvelables / réduire
                la consommation / mix diversifié). Vous choisissez une seule option parmi
                plusieurs — jamais un curseur entre deux extrêmes imaginaires.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-4">
              <p className="font-semibold text-foreground">Vos priorités (2 questions)</p>
              <p className="mt-1.5 text-sm text-muted">
                Deux questions vous demandent quels sujets comptent le plus pour vous. Elles ne
                sont jamais comparées à un candidat : elles ajustent seulement le poids de vos
                propres thèmes dans votre score, comme expliqué au point 5.
              </p>
            </div>
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
                Une vraie réponse, notée 0 sur une échelle d&apos;opinion. Elle entre normalement dans
                le calcul, exactement comme un +2 ou un -1 : « je suis sincèrement partagé sur
                cette question ».
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-4">
              <p className="font-semibold text-foreground">Sans opinion (Passer)</p>
              <p className="mt-1.5 text-sm text-muted">
                N&apos;est pas une réponse. La question est totalement exclue du calcul — elle ne
                vous rapproche jamais artificiellement d&apos;un candidat positionné à 0, ni d&apos;un
                candidat ayant choisi une option donnée.
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
            Pour une question à <strong>échelle d&apos;opinion</strong> (Neutre inclus, Sans opinion
            exclu), on mesure l&apos;écart entre votre réponse et la position documentée du
            candidat. Un écart de 0 donne une similarité de 100&nbsp;%, un écart maximal de 4
            donne une similarité de 0&nbsp;%.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-lg border border-border bg-surface p-4 text-sm">
            similarité = 1 − (|votre réponse − position du candidat| / 4)
          </pre>
          <p className="mt-4 leading-relaxed text-foreground/85">
            Pour un <strong>arbitrage</strong>, les options n&apos;ont pas d&apos;ordre entre elles —
            on n&apos;invente donc jamais de distance. Vous avez choisi la même option que le
            candidat : 100&nbsp;% de similarité. Une option différente : 0&nbsp;%. (Une compatibilité
            intermédiaire explicite et documentée publiquement pourrait un jour exister pour un
            couple d&apos;options précis, mais jamais une proximité devinée du type « nucléaire ≈
            60&nbsp;% compatible avec mix ».)
          </p>
          <p className="mt-4 leading-relaxed text-foreground/85">
            Une question de <strong>priorité</strong> n&apos;est jamais comparée à un candidat — voir
            le point 5.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">4. Un score par thème, puis un score global</h2>
          <p className="mt-3 leading-relaxed text-foreground/85">
            Un thème ne pèse jamais plus lourd simplement parce qu&apos;il contient plus de
            questions, ni parce qu&apos;il mélange échelles et arbitrages. Le calcul se fait en deux
            étapes :
          </p>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-foreground/85">
            <li>
              Pour chaque <strong>thème</strong> (Retraites, Économie, Immigration…), on fait la
              moyenne des similarités de ses seules questions comparables — qu&apos;elles soient à
              échelle ou à arbitrage, la similarité est toujours ramenée entre 0 et 1.
            </li>
            <li>
              Le <strong>score global</strong> est la moyenne de ces scores par thème — chaque
              thème compte à égalité par défaut, qu&apos;il ait une seule question ou cinq.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold">5. Vos priorités pondèrent votre score</h2>
          <p className="mt-3 leading-relaxed text-foreground/85">
            Les deux questions de priorité vous demandent quels sujets comptent le plus pour vous.
            Si vous répondez, le thème de votre premier choix compte deux fois plus que les autres
            dans votre score global, et celui de votre second choix une fois et demie — une règle
            fixe, appliquée de la même façon à tout le monde. Si vous les passez, chaque thème
            garde le même poids : il n&apos;y a jamais de mise en avant éditoriale cachée d&apos;un
            sujet par Poliscope.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">6. Les questions sans réponse ne sont jamais devinées</h2>
          <p className="mt-3 leading-relaxed text-foreground/85">
            Si vous répondez « Sans opinion », la question est exclue du calcul. Si un candidat
            n&apos;a pas de position documentée et sourcée sur une question, celle-ci est exclue du
            calcul pour ce candidat uniquement — jamais remplacée par une estimation. La fiche du
            candidat l&apos;indique alors explicitement : « Position non renseignée ».
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">7. La couverture : sur combien de réponses repose le score</h2>
          <p className="mt-3 leading-relaxed text-foreground/85">
            Un score calculé sur 14 de vos 16 réponses comparables n&apos;a pas la même robustesse
            qu&apos;un score calculé sur 6. La couverture mesure cette part — elle ne compte jamais
            les questions de priorité, qui ne sont comparées à aucun candidat :
          </p>
          <pre className="mt-4 overflow-x-auto rounded-lg border border-border bg-surface p-4 text-sm">
            couverture = positions documentées comparables / réponses comparables que vous avez données
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
          <h2 className="text-xl font-semibold">8. « Cette question départage les candidats »</h2>
          <p className="mt-3 leading-relaxed text-foreground/85">
            Certaines questions affichent une indication discrète — « départage fortement les
            candidats » ou « les candidats sont plutôt proches » — <strong>avant</strong> que vous
            répondiez, sans jamais montrer de nom ni de position. Elle est calculée uniquement à
            partir des positions réellement documentées (l&apos;écart entre elles pour une échelle,
            la répartition entre options pour un arbitrage), jamais fixée à la main question par
            question. En dessous d&apos;un nombre minimal de positions documentées, rien ne
            s&apos;affiche plutôt que d&apos;avancer une conclusion peu fiable.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">9. Une précision volontairement simple</h2>
          <p className="mt-3 leading-relaxed text-foreground/85">
            Le score affiché est toujours arrondi à l&apos;entier (80&nbsp;%, jamais 80,43&nbsp;%).
            Ce n&apos;est pas une mesure scientifique au dixième de pourcent près, mais un ordre de
            grandeur pensé pour être lu simplement.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">10. Ce que le score ne dit pas</h2>
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
          <h2 className="text-xl font-semibold">11. Vos réponses restent chez vous</h2>
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
