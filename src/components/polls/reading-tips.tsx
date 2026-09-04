import { BarChart3, Clock, ShieldCheck } from "lucide-react";

const TIPS = [
  {
    icon: BarChart3,
    title: "Les instituts testent plusieurs hypothèses",
    description: "Chaque sondage présente un ou plusieurs scénarios, avec des candidats différents.",
  },
  {
    icon: ShieldCheck,
    title: "Poliscope ne mélange jamais les scénarios",
    description: "Les résultats sont présentés séparément, pour une lecture claire et fidèle.",
  },
  {
    icon: Clock,
    title: "Une photographie, pas une prédiction",
    description: "Un sondage est une mesure à un instant T, jamais une prévision du résultat.",
  },
];

export function ReadingTips() {
  return (
    <div className="rounded-2xl border border-primary/20 bg-primary-soft/40 p-5 sm:p-6">
      <p className="flex items-center gap-2 text-sm font-semibold text-primary">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
          i
        </span>
        Comment lire ces sondages ?
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {TIPS.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-card text-primary shadow-sm">
              <Icon size={16} />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-snug">{title}</p>
              <p className="mt-0.5 text-xs leading-snug text-muted">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
