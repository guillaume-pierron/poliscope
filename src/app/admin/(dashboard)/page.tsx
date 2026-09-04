import Link from "next/link";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ENTITIES, ENTITY_KEYS } from "@/lib/admin/entities";
import { getEntityList, isLiveData } from "@/lib/admin/data";

export default async function AdminDashboardPage() {
  const live = isLiveData();
  const counts = await Promise.all(ENTITY_KEYS.map((key) => getEntityList(key)));

  return (
    <div>
      <h1 className="text-2xl font-semibold">Tableau de bord</h1>

      <div
        className={`mt-4 flex items-start gap-3 rounded-xl border p-4 text-sm ${
          live ? "border-success/30 bg-success-soft text-success" : "border-accent/30 bg-accent-soft text-accent"
        }`}
      >
        {live ? <CheckCircle2 size={16} className="mt-0.5 shrink-0" /> : <AlertCircle size={16} className="mt-0.5 shrink-0" />}
        <p>
          {live
            ? "Connecté à Supabase — les modifications sont enregistrées en base."
            : "Supabase n'est pas configuré : vous consultez le jeu de données de démonstration en lecture seule. Renseignez les variables Supabase dans .env.local pour activer l'édition (voir README)."}
        </p>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ENTITY_KEYS.map((key, i) => (
          <Link
            key={key}
            href={`/admin/${key}`}
            className="focus-ring rounded-xl border border-border bg-card p-5 transition-colors hover:border-border-strong hover:bg-surface"
          >
            <div className="flex items-center justify-between">
              <p className="font-semibold">{ENTITIES[key].labelPlural}</p>
              <Badge>{counts[i].length}</Badge>
            </div>
            <p className="mt-1 text-sm text-muted">Gérer les {ENTITIES[key].labelPlural.toLowerCase()}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
