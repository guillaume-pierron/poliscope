import type { Metadata } from "next";
import { ShieldCheck, Lock, Mail, EyeOff } from "lucide-react";

export const metadata: Metadata = {
  title: "Confidentialité",
  description: "Comment Poliscope protège vos données, en particulier vos réponses au Match politique.",
};

const principles = [
  {
    icon: ShieldCheck,
    title: "Aucun compte requis",
    body: "Le Match politique, le comparateur et les fiches candidats sont accessibles sans inscription, sans nom et sans adresse e-mail.",
  },
  {
    icon: Lock,
    title: "Vos réponses restent sur votre appareil",
    body: "Les réponses au Match sont enregistrées uniquement dans le stockage local de votre navigateur (localStorage). Elles ne sont jamais envoyées ni conservées sur nos serveurs, et le calcul de proximité s'exécute dans votre navigateur.",
  },
  {
    icon: EyeOff,
    title: "Aucun profil politique nominatif",
    body: "Poliscope ne construit aucun profil associant une identité (email, compte, cookie publicitaire) à des opinions politiques. Le partage de résultats ne transmet que des scores de proximité, jamais le détail de vos réponses, et seulement si vous cliquez explicitement sur « Partager ».",
  },
  {
    icon: Mail,
    title: "La newsletter est indépendante du Match",
    body: "Une adresse e-mail laissée pour recevoir le récap de la présidentielle n'est jamais rapprochée de réponses au questionnaire politique.",
  },
];

export default function ConfidentialitePage() {
  return (
    <div className="container-app max-w-2xl py-10 md:py-16">
      <h1 className="font-serif text-[2rem] font-semibold tracking-tight sm:text-[2.4rem]">Confidentialité</h1>
      <p className="mt-3 text-muted">
        Le Match peut révéler indirectement des opinions politiques. Nous avons conçu Poliscope
        selon une logique « privacy by design ».
      </p>

      <div className="mt-10 space-y-6">
        {principles.map((p) => (
          <div key={p.title} className="flex gap-4 rounded-xl border border-border bg-card p-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
              <p.icon size={18} />
            </span>
            <div>
              <h2 className="font-semibold">{p.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted">{p.body}</p>
            </div>
          </div>
        ))}
      </div>

      <section className="mt-12">
        <h2 className="text-xl font-semibold">Cookies et mesure d&apos;audience</h2>
        <p className="mt-3 leading-relaxed text-foreground/85">
          Poliscope n&apos;utilise pas de cookies publicitaires ni de traceurs tiers. Si une mesure
          d&apos;audience est mise en place, elle reposera sur une solution respectueuse de la vie
          privée (données agrégées, sans identifiant individuel), conformément aux recommandations
          de la CNIL sur les outils exemptés de consentement.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Vos droits (RGPD)</h2>
        <p className="mt-3 leading-relaxed text-foreground/85">
          Les seules données personnelles que Poliscope peut recevoir sont une adresse e-mail
          (newsletter, sur base volontaire) et, pour l&apos;administration du site, des identifiants
          d&apos;accès. Vous pouvez à tout moment demander l&apos;accès, la rectification ou la
          suppression de ces données en nous contactant. Aucune réponse au Match politique n&apos;est
          conservée côté serveur : il n&apos;y a donc rien à exporter ni à supprimer de ce côté — un
          simple effacement des données de votre navigateur suffit.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Contact</h2>
        <p className="mt-3 leading-relaxed text-foreground/85">
          Pour toute question relative à la confidentialité, contactez l&apos;équipe de Poliscope via
          le formulaire de contact du site.
        </p>
      </section>
    </div>
  );
}
