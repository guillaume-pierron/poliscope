-- Droit de réponse / signalement d'erreur sur une information sensible de
-- "Parcours & actes" (affaire judiciaire, controverse, évolution de
-- position...). Même politique que newsletter_subscribers : aucune policy
-- publique, ni lecture ni écriture — seul le service_role (utilisé par le
-- serveur d'actions Next.js, qui contourne la RLS) peut écrire, et seul
-- l'admin peut lire pour traiter les signalements.

create table if not exists record_corrections (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid references candidates(id) on delete set null,
  -- Nom de la table concernée (ex. "candidate_legal_cases") et id de la ligne,
  -- en texte libre plutôt qu'une clé étrangère : la ligne visée peut appartenir
  -- à n'importe laquelle des tables "Parcours & actes", et peut être supprimée
  -- après le signalement sans que celui-ci perde son contexte.
  record_table text,
  record_id text,
  message text not null,
  contact_email text,
  status text not null default 'new' check (status in ('new', 'reviewed', 'resolved', 'dismissed')),
  created_at timestamptz not null default now()
);
create index if not exists record_corrections_status_idx on record_corrections(status);

alter table record_corrections enable row level security;
-- Intentionally no public policies: not readable, not writable by anon —
-- only the service_role key (server actions, admin back-office) touches it.
