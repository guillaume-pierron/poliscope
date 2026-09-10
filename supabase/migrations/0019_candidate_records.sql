-- "Parcours & actes" — le parcours réel des candidats : métiers exercés,
-- mandats politiques, votes parlementaires, évolution des positions dans le
-- temps, affaires judiciaires, controverses documentées et transparence
-- (déclarations HATVP et assimilées).
--
-- Même principe absolu que "Passage au réel" (0009_passage_au_reel.sql), que
-- ce fichier reprend délibérément à l'identique : mieux vaut une rubrique
-- vide ("Non documenté") qu'une affirmation impossible à défendre. Un
-- brouillon (draft / review_required) n'est jamais visible publiquement —
-- seul status = 'published' l'est, via la même RLS. Le back-office
-- (lib/admin/data.ts) passe par le client service_role, qui voit tous les
-- statuts. Voir src/lib/types.ts pour le modèle applicatif miroir.
--
-- Deux tables (affaires judiciaires, controverses) démarrent par défaut à
-- 'review_required' plutôt que 'draft' : ce sont les catégories les plus
-- sensibles, pour lesquelles une validation humaine explicite avant
-- publication est non négociable (voir la méthodologie publique).
--
-- `is_ongoing` (parcours pro, mandats) distingue explicitement "ce poste est
-- toujours occupé" de "la date de fin n'est simplement pas connue" — les deux
-- ne doivent jamais être confondus, dans le même esprit que la distinction
-- "Absent" / "Abstention" pour les votes ci-dessous.

-- ---------------------------------------------------------------------------
-- candidate_careers — parcours professionnel (avant / en parallèle de la politique)
-- ---------------------------------------------------------------------------
create table if not exists candidate_careers (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references candidates(id) on delete cascade,
  title text not null,
  organization text not null,
  sector text,
  description text,
  -- Texte libre et non une date stricte : une source peut ne donner qu'une
  -- année (même convention que candidates.birth_date, voir 0018).
  start_date text,
  end_date text,
  is_ongoing boolean not null default false,
  source_name text,
  source_url text,
  source_type text check (source_type in ('official', 'court', 'parliament', 'candidate', 'media', 'institution', 'other')),
  status text not null default 'draft' check (status in ('draft', 'review_required', 'published', 'outdated')),
  verified_at date,
  created_at timestamptz not null default now()
);
create index if not exists candidate_careers_candidate_id_idx on candidate_careers(candidate_id);
create index if not exists candidate_careers_status_idx on candidate_careers(status);

-- ---------------------------------------------------------------------------
-- candidate_mandates — mandats & fonctions politiques
-- ---------------------------------------------------------------------------
create table if not exists candidate_mandates (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references candidates(id) on delete cascade,
  title text not null,
  institution text not null,
  territory text,
  appointment_type text not null default 'elu' check (appointment_type in ('elu', 'nomme')),
  party_at_time text,
  start_date text,
  end_date text,
  is_ongoing boolean not null default false,
  source_name text,
  source_url text,
  source_type text check (source_type in ('official', 'court', 'parliament', 'candidate', 'media', 'institution', 'other')),
  status text not null default 'draft' check (status in ('draft', 'review_required', 'published', 'outdated')),
  verified_at date,
  created_at timestamptz not null default now()
);
create index if not exists candidate_mandates_candidate_id_idx on candidate_mandates(candidate_id);
create index if not exists candidate_mandates_status_idx on candidate_mandates(status);

-- ---------------------------------------------------------------------------
-- candidate_votes — votes parlementaires individuels documentés
-- ---------------------------------------------------------------------------
create table if not exists candidate_votes (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references candidates(id) on delete cascade,
  institution text not null check (institution in ('assemblee_nationale', 'senat', 'parlement_europeen')),
  legislature text,
  official_vote_id text,
  title text not null,
  -- Description factuelle du texte soumis au vote — jamais une interprétation politique du vote lui-même.
  description text,
  theme_id uuid references themes(id) on delete set null,
  vote_date date not null,
  -- "absent" / "did_not_vote" ne doivent jamais être affichés comme une abstention politique : trois états distincts.
  candidate_vote text not null check (candidate_vote in ('for', 'against', 'abstention', 'did_not_vote', 'absent', 'not_available')),
  importance_level text not null default 'secondary' check (importance_level in ('secondary', 'important', 'major')),
  featured boolean not null default false,
  source_name text,
  source_url text not null,
  source_type text check (source_type in ('official', 'court', 'parliament', 'candidate', 'media', 'institution', 'other')),
  status text not null default 'draft' check (status in ('draft', 'review_required', 'published', 'outdated')),
  verified_at date,
  created_at timestamptz not null default now()
);
create index if not exists candidate_votes_candidate_id_idx on candidate_votes(candidate_id);
create index if not exists candidate_votes_theme_id_idx on candidate_votes(theme_id);
create index if not exists candidate_votes_status_idx on candidate_votes(status);

-- ---------------------------------------------------------------------------
-- candidate_position_history — une déclaration/position datée, sourcée, sur un sujet
-- ---------------------------------------------------------------------------
create table if not exists candidate_position_history (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references candidates(id) on delete cascade,
  theme_id uuid references themes(id) on delete set null,
  subject text not null,
  position_summary text not null,
  quote text,
  date date,
  source_name text,
  source_url text,
  source_type text check (source_type in ('official', 'court', 'parliament', 'candidate', 'media', 'institution', 'other')),
  status text not null default 'draft' check (status in ('draft', 'review_required', 'published', 'outdated')),
  verified_at date,
  created_at timestamptz not null default now()
);
create index if not exists candidate_position_history_candidate_id_idx on candidate_position_history(candidate_id);
create index if not exists candidate_position_history_theme_id_idx on candidate_position_history(theme_id);
create index if not exists candidate_position_history_status_idx on candidate_position_history(status);

-- ---------------------------------------------------------------------------
-- candidate_position_evolutions — lecture éditoriale neutre d'un changement documenté
-- ---------------------------------------------------------------------------
create table if not exists candidate_position_evolutions (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references candidates(id) on delete cascade,
  theme_id uuid references themes(id) on delete set null,
  subject text not null,
  evolution_type text not null check (evolution_type in (
    'position_maintained', 'position_evolved', 'position_clarified', 'position_reversed', 'insufficient_context'
  )),
  -- Distinct de evolution_type : une nuance interne, jamais affichée telle
  -- quelle comme un verdict. "confirmed_contradiction" est la seule valeur
  -- qui justifie evolution_type = 'position_reversed' sans autre qualificatif.
  confidence text not null default 'insufficient_context' check (confidence in (
    'compatible', 'nuanced', 'evolved', 'apparently_contradictory', 'confirmed_contradiction', 'insufficient_context'
  )),
  summary text not null,
  -- Explication donnée par le candidat lui-même, si elle existe et est sourcée — jamais une raison inventée par Polysia.
  candidate_explanation text,
  candidate_explanation_source_url text,
  status text not null default 'review_required' check (status in ('draft', 'review_required', 'published', 'outdated')),
  verified_at date,
  created_at timestamptz not null default now()
);
create index if not exists candidate_position_evolutions_candidate_id_idx on candidate_position_evolutions(candidate_id);
create index if not exists candidate_position_evolutions_theme_id_idx on candidate_position_evolutions(theme_id);
create index if not exists candidate_position_evolutions_status_idx on candidate_position_evolutions(status);

-- ---------------------------------------------------------------------------
-- candidate_legal_cases — affaires judiciaires. Vocabulaire strictement
-- procédural français : ne jamais afficher "condamné" hors
-- convicted_first_instance/convicted_final, ne jamais présenter une mise en
-- examen (indicted) comme une culpabilité établie.
-- ---------------------------------------------------------------------------
create table if not exists candidate_legal_cases (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references candidates(id) on delete cascade,
  title text not null,
  case_type text not null,
  summary text not null,
  -- convicted_on_appeal : la cour d'appel a confirmé une condamnation mais un
  -- pourvoi en cassation reste possible/en cours — distinct de
  -- appeal_pending (pas encore jugé en appel) et de convicted_final (plus
  -- aucun recours possible).
  legal_status text not null check (legal_status in (
    'investigation', 'questioned', 'indicted', 'charged', 'trial_pending',
    'convicted_first_instance', 'appeal_pending', 'convicted_on_appeal',
    'convicted_final', 'acquitted', 'dismissed', 'closed_without_action'
  )),
  jurisdiction text,
  start_date date,
  decision_date date,
  last_updated date not null default current_date,
  next_review_at date,
  source_name text,
  source_url text,
  source_type text check (source_type in ('official', 'court', 'parliament', 'candidate', 'media', 'institution', 'other')),
  status text not null default 'review_required' check (status in ('draft', 'review_required', 'published', 'outdated')),
  created_at timestamptz not null default now()
);
create index if not exists candidate_legal_cases_candidate_id_idx on candidate_legal_cases(candidate_id);
create index if not exists candidate_legal_cases_status_idx on candidate_legal_cases(status);

-- ---------------------------------------------------------------------------
-- candidate_controversies — polémiques médiatiques documentées, distinctes
-- des affaires judiciaires par construction (deux tables séparées).
-- ---------------------------------------------------------------------------
create table if not exists candidate_controversies (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references candidates(id) on delete cascade,
  title text not null,
  summary text not null,
  event_date date,
  context text,
  candidate_response text,
  candidate_response_source_url text,
  controversy_status text not null default 'documented' check (controversy_status in (
    'documented', 'disputed', 'resolved', 'context_needed'
  )),
  last_updated date not null default current_date,
  next_review_at date,
  source_name text,
  source_url text,
  source_type text check (source_type in ('official', 'court', 'parliament', 'candidate', 'media', 'institution', 'other')),
  status text not null default 'review_required' check (status in ('draft', 'review_required', 'published', 'outdated')),
  created_at timestamptz not null default now()
);
create index if not exists candidate_controversies_candidate_id_idx on candidate_controversies(candidate_id);
create index if not exists candidate_controversies_status_idx on candidate_controversies(status);

-- ---------------------------------------------------------------------------
-- candidate_transparency_records — déclarations publiques référencées
-- (HATVP et assimilées). L'absence de ligne pour un type donné se lit comme
-- "non documenté dans Polysia", jamais comme "n'existe pas" — voir l'UI.
-- ---------------------------------------------------------------------------
create table if not exists candidate_transparency_records (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references candidates(id) on delete cascade,
  record_type text not null check (record_type in (
    'declaration_interets', 'declaration_patrimoine', 'fonctions_declarees',
    'activites_professionnelles', 'mandats_declares', 'participations', 'autre'
  )),
  title text not null,
  publication_date date,
  source_name text,
  source_url text,
  source_type text check (source_type in ('official', 'court', 'parliament', 'candidate', 'media', 'institution', 'other')),
  status text not null default 'draft' check (status in ('draft', 'review_required', 'published', 'outdated')),
  verified_at date,
  created_at timestamptz not null default now()
);
create index if not exists candidate_transparency_records_candidate_id_idx on candidate_transparency_records(candidate_id);
create index if not exists candidate_transparency_records_status_idx on candidate_transparency_records(status);

-- ---------------------------------------------------------------------------
-- Row Level Security — même politique que measure_analyses : seul
-- status = 'published' est lisible par la clé anonyme.
-- ---------------------------------------------------------------------------
alter table candidate_careers enable row level security;
alter table candidate_mandates enable row level security;
alter table candidate_votes enable row level security;
alter table candidate_position_history enable row level security;
alter table candidate_position_evolutions enable row level security;
alter table candidate_legal_cases enable row level security;
alter table candidate_controversies enable row level security;
alter table candidate_transparency_records enable row level security;

create policy "public read published careers" on candidate_careers for select using (status = 'published');
create policy "public read published mandates" on candidate_mandates for select using (status = 'published');
create policy "public read published votes" on candidate_votes for select using (status = 'published');
create policy "public read published position history" on candidate_position_history for select using (status = 'published');
create policy "public read published position evolutions" on candidate_position_evolutions for select using (status = 'published');
create policy "public read published legal cases" on candidate_legal_cases for select using (status = 'published');
create policy "public read published controversies" on candidate_controversies for select using (status = 'published');
create policy "public read published transparency records" on candidate_transparency_records for select using (status = 'published');

-- Explicit grants (defense in depth alongside RLS) — matches 0004/0009's pattern.
grant select on
  candidate_careers, candidate_mandates, candidate_votes, candidate_position_history,
  candidate_position_evolutions, candidate_legal_cases, candidate_controversies, candidate_transparency_records
  to anon, authenticated;
grant select, insert, update, delete on
  candidate_careers, candidate_mandates, candidate_votes, candidate_position_history,
  candidate_position_evolutions, candidate_legal_cases, candidate_controversies, candidate_transparency_records
  to service_role;
