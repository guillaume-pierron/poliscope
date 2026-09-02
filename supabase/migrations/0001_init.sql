-- Poliscope — initial schema
-- Designed to outlive the 2027 presidential election: elections are a first-class
-- table so the same schema serves législatives, municipales, européennes, etc.

create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------------
-- elections
-- ---------------------------------------------------------------------------
create table if not exists elections (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  kind text not null check (kind in ('presidentielle', 'legislatives', 'municipales', 'europeennes', 'autre')),
  round_date date,
  is_active boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- parties
-- ---------------------------------------------------------------------------
create table if not exists parties (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  short_name text,
  orientation text not null default 'non-partisan' check (
    orientation in ('gauche', 'centre-gauche', 'centre', 'centre-droit', 'droite', 'extreme-gauche', 'extreme-droite', 'non-partisan')
  ),
  color text not null default '#4338ca',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- candidates
-- ---------------------------------------------------------------------------
create table if not exists candidates (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  photo_url text,
  party_id uuid references parties(id) on delete set null,
  biography text not null default '',
  official_website text,
  election_id uuid not null references elections(id) on delete cascade,
  is_demo boolean not null default false,
  order_index int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists candidates_election_id_idx on candidates(election_id);

-- ---------------------------------------------------------------------------
-- themes
-- ---------------------------------------------------------------------------
create table if not exists themes (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text not null default '',
  icon text not null default 'globe',
  order_index int not null default 0
);

-- ---------------------------------------------------------------------------
-- questions (the Match question bank)
-- ---------------------------------------------------------------------------
create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  theme_id uuid not null references themes(id) on delete cascade,
  question text not null,
  description text,
  weight numeric not null default 1,
  answer_type text not null default 'likert' check (answer_type in ('likert', 'choice')),
  -- for answer_type = 'choice': [{ "label": string, "value": number }]
  choices jsonb,
  order_index int not null default 0
);
create index if not exists questions_theme_id_idx on questions(theme_id);

-- ---------------------------------------------------------------------------
-- candidate_positions — a candidate's documented position on a Match question.
-- score is null when the position is not documented ("Position non renseignée")
-- rather than guessed.
-- ---------------------------------------------------------------------------
create table if not exists candidate_positions (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references candidates(id) on delete cascade,
  question_id uuid not null references questions(id) on delete cascade,
  score smallint check (score between -2 and 2),
  explanation text,
  source_url text,
  created_at timestamptz not null default now(),
  unique (candidate_id, question_id)
);
create index if not exists candidate_positions_candidate_id_idx on candidate_positions(candidate_id);
create index if not exists candidate_positions_question_id_idx on candidate_positions(question_id);

-- ---------------------------------------------------------------------------
-- proposals — sourced campaign proposals shown on candidate/theme pages.
-- ---------------------------------------------------------------------------
create table if not exists proposals (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references candidates(id) on delete cascade,
  theme_id uuid not null references themes(id) on delete restrict,
  title text not null,
  summary text not null default '',
  description text not null default '',
  source_name text not null default '',
  source_url text not null,
  published_at date,
  verified_at date,
  status text not null default 'programme' check (
    status in ('annonce', 'proposition_officielle', 'programme', 'precision_ulterieure')
  ),
  created_at timestamptz not null default now()
);
create index if not exists proposals_candidate_id_idx on proposals(candidate_id);
create index if not exists proposals_theme_id_idx on proposals(theme_id);

-- ---------------------------------------------------------------------------
-- polls & poll_results
-- ---------------------------------------------------------------------------
create table if not exists polls (
  id uuid primary key default gen_random_uuid(),
  election_id uuid not null references elections(id) on delete cascade,
  institute text not null,
  sponsor text,
  field_start date not null,
  field_end date not null,
  sample_size int not null,
  method text not null default '',
  round text not null default 'premier_tour' check (round in ('premier_tour', 'second_tour')),
  published_at date not null,
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists polls_election_id_idx on polls(election_id);

create table if not exists poll_results (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references polls(id) on delete cascade,
  candidate_id uuid not null references candidates(id) on delete cascade,
  value numeric not null,
  low numeric,
  high numeric,
  unique (poll_id, candidate_id)
);
create index if not exists poll_results_poll_id_idx on poll_results(poll_id);

-- ---------------------------------------------------------------------------
-- newsletter_subscribers — intentionally decoupled from Match answers, which
-- are never persisted server-side to begin with (see /confidentialite).
-- ---------------------------------------------------------------------------
create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security — public, anonymous read access to editorial content;
-- all writes go through server actions using the service role key, which
-- bypasses RLS, so no public write policy is ever defined.
-- ---------------------------------------------------------------------------
alter table elections enable row level security;
alter table parties enable row level security;
alter table candidates enable row level security;
alter table themes enable row level security;
alter table questions enable row level security;
alter table candidate_positions enable row level security;
alter table proposals enable row level security;
alter table polls enable row level security;
alter table poll_results enable row level security;
alter table newsletter_subscribers enable row level security;

create policy "public read" on elections for select using (true);
create policy "public read" on parties for select using (true);
create policy "public read" on candidates for select using (true);
create policy "public read" on themes for select using (true);
create policy "public read" on questions for select using (true);
create policy "public read" on candidate_positions for select using (true);
create policy "public read" on proposals for select using (true);
create policy "public read" on polls for select using (true);
create policy "public read" on poll_results for select using (true);
-- newsletter_subscribers has no public policies: neither readable nor
-- writable by the anon key, only by the service role in server actions.
