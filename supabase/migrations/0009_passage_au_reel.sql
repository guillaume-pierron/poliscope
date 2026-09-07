-- "Passage au réel" — faisabilité et impact réel des mesures.
--
-- Legal + implementation + beneficiaries are flattened directly onto
-- measure_analyses (few columns each); budget, impacts and assumptions get
-- their own tables because they are genuinely one-to-many (several budget
-- estimates from different sources, several impacts per horizon/scenario,
-- several assumptions). See src/lib/types.ts for the application-side model
-- this mirrors, and src/lib/data/local/measure-analyses.ts for the pilot
-- data.
--
-- Security: unlike every other public table in this schema, a draft or
-- under-review analysis must never be readable by the anon key — only
-- status = 'published' rows are. The admin back-office reads through the
-- service_role client (see lib/admin/data.ts), which bypasses RLS entirely
-- and always sees every status.

create table if not exists measure_analyses (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references proposals(id) on delete cascade,
  status text not null default 'in_progress'
    check (status in ('in_progress', 'review_required', 'published', 'outdated')),
  summary text,

  feasibility_status text
    check (feasibility_status in (
      'faisable_parametres_connus', 'faisable_sous_conditions', 'mise_en_oeuvre_complexe',
      'informations_insuffisantes', 'obstacle_juridique_majeur'
    )),
  precision_level text check (precision_level in ('precise', 'partiellement_precis', 'insuffisant')),
  confidence_level text check (confidence_level in ('elevee', 'moyenne', 'faible')),

  legal_path text check (legal_path in (
    'decret', 'loi_ordinaire', 'loi_organique', 'loi_finances', 'referendum',
    'revision_constitutionnelle', 'negociation_europeenne', 'autre'
  )),
  legal_constitutional_change_required boolean not null default false,
  legal_eu_change_required boolean not null default false,
  legal_notes text,
  legal_implementation_delay_min_months int,
  legal_implementation_delay_max_months int,

  implementation_existing_administration text not null default 'non_documente'
    check (implementation_existing_administration in ('oui', 'non', 'incertain', 'non_documente')),
  implementation_new_recruitment_needed text not null default 'non_documente'
    check (implementation_new_recruitment_needed in ('oui', 'non', 'incertain', 'non_documente')),
  implementation_notes text,

  -- ["Salariés au SMIC", "Retraités", ...] — descriptive, never a score.
  beneficiaries_groups jsonb not null default '[]'::jsonb,
  beneficiaries_description text,
  beneficiaries_count_min bigint,
  beneficiaries_count_central bigint,
  beneficiaries_count_max bigint,
  beneficiaries_source_name text,
  beneficiaries_source_url text,

  -- Matches a SimulatorMeasure.id in src/lib/simulator/measures.ts when an
  -- equivalent is already modeled there — set by hand, never guessed.
  simulator_measure_id text,

  reviewed_at date,
  reviewed_by text,
  published_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (proposal_id)
);
create index if not exists measure_analyses_proposal_id_idx on measure_analyses(proposal_id);
create index if not exists measure_analyses_status_idx on measure_analyses(status);

create table if not exists measure_budget_estimates (
  id uuid primary key default gen_random_uuid(),
  measure_analysis_id uuid not null references measure_analyses(id) on delete cascade,
  source_type text not null check (source_type in ('candidate', 'independent_body', 'academic', 'other')),
  source_name text not null,
  source_url text,
  -- Values are in Md€ (milliards d'euros) by convention — see the UI, which
  -- always labels them explicitly rather than relying on this comment alone.
  annual_cost_min numeric,
  annual_cost_central numeric,
  annual_cost_max numeric,
  annual_revenue_min numeric,
  annual_revenue_central numeric,
  annual_revenue_max numeric,
  currency text not null default 'Md€',
  reference_year int,
  financing_identified text not null default 'non_documente'
    check (financing_identified in ('oui', 'non', 'incertain', 'non_documente')),
  notes text
);
create index if not exists measure_budget_estimates_analysis_id_idx on measure_budget_estimates(measure_analysis_id);

create table if not exists measure_impacts (
  id uuid primary key default gen_random_uuid(),
  measure_analysis_id uuid not null references measure_analyses(id) on delete cascade,
  impact_type text not null check (impact_type in (
    'revenu_menages', 'finances_publiques', 'emploi', 'pib', 'inflation', 'investissement',
    'consommation', 'dette_publique', 'balance_commerciale', 'emissions_co2', 'energie',
    'logement', 'sante', 'inegalites', 'autre'
  )),
  horizon text not null check (horizon in ('court', 'moyen', 'long')),
  -- "unique" while only one reliable estimate exists — never fabricate
  -- prudent/central/favorable rows just to fill the UI.
  scenario text not null default 'unique' check (scenario in ('unique', 'prudent', 'central', 'favorable')),
  population text,
  value_min numeric,
  value_central numeric,
  value_max numeric,
  unit text not null,
  confidence_level text not null check (confidence_level in ('elevee', 'moyenne', 'faible')),
  method text not null,
  source_name text,
  source_url text,
  scenario_assumptions text,
  publication_date date
);
create index if not exists measure_impacts_analysis_id_idx on measure_impacts(measure_analysis_id);

create table if not exists measure_assumptions (
  id uuid primary key default gen_random_uuid(),
  measure_analysis_id uuid not null references measure_analyses(id) on delete cascade,
  name text not null,
  value text not null,
  unit text,
  assumption_type text not null
    check (assumption_type in ('official', 'candidate', 'model', 'external_study', 'manual_assumption')),
  justification text,
  source_name text,
  source_url text
);
create index if not exists measure_assumptions_analysis_id_idx on measure_assumptions(measure_analysis_id);

alter table measure_analyses enable row level security;
alter table measure_budget_estimates enable row level security;
alter table measure_impacts enable row level security;
alter table measure_assumptions enable row level security;

create policy "public read published analyses" on measure_analyses
  for select using (status = 'published');

create policy "public read budgets of published analyses" on measure_budget_estimates
  for select using (
    exists (select 1 from measure_analyses ma where ma.id = measure_analysis_id and ma.status = 'published')
  );

create policy "public read impacts of published analyses" on measure_impacts
  for select using (
    exists (select 1 from measure_analyses ma where ma.id = measure_analysis_id and ma.status = 'published')
  );

create policy "public read assumptions of published analyses" on measure_assumptions
  for select using (
    exists (select 1 from measure_analyses ma where ma.id = measure_analysis_id and ma.status = 'published')
  );

-- Explicit grants (defense in depth alongside RLS) — matches 0004_grant_privileges.sql's
-- pattern rather than relying only on `alter default privileges` having applied.
grant select on measure_analyses, measure_budget_estimates, measure_impacts, measure_assumptions
  to anon, authenticated;
grant select, insert, update, delete on measure_analyses, measure_budget_estimates, measure_impacts, measure_assumptions
  to service_role;
