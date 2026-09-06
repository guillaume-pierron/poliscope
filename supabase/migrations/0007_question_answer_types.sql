-- Broadens the Match question bank from a single likert/choice shape to
-- three explicit answer types (likert / choice / priority), adds a
-- structured `options` array shared by all three (replacing the old
-- likert-only `choices`), a hidden neutral `context` explainer, an
-- `is_active` flag preparing a future variable-length questionnaire, and
-- richer sourcing on candidate_positions. Mirrors src/lib/types.ts.

alter table questions
  add column if not exists context text,
  add column if not exists is_active boolean not null default true,
  -- [{ "id": string, "label": string, "value"?: number, "description"?: string, "theme_id"?: string }]
  add column if not exists options jsonb not null default '[]'::jsonb,
  -- optional, explicit { option_id: { option_id: 0..1 } } compatibility table for "choice" questions.
  add column if not exists compatibility jsonb;

alter table questions drop constraint if exists questions_answer_type_check;
alter table questions add constraint questions_answer_type_check
  check (answer_type in ('likert', 'choice', 'priority'));

-- Superseded by the richer `options` above — dropped rather than kept
-- alongside a column the application no longer reads.
alter table questions drop column if exists choices;

alter table candidate_positions
  add column if not exists answer_type text,
  add column if not exists numeric_score smallint check (numeric_score between -2 and 2),
  add column if not exists option_id text,
  -- reserved for a future multi-select priority format; unused in V1.
  add column if not exists option_ids jsonb,
  -- outlet the source_url belongs to — derived from the URL, never guessed.
  add column if not exists source_name text,
  add column if not exists verified_at timestamptz;

-- Backfill from the columns being retired, for any row inserted before this migration.
update candidate_positions set numeric_score = score where numeric_score is null;
update candidate_positions cp
  set answer_type = q.answer_type
  from questions q
  where cp.question_id = q.id and cp.answer_type is null;

alter table candidate_positions drop column if exists score;
alter table candidate_positions alter column answer_type set not null;
alter table candidate_positions drop constraint if exists candidate_positions_answer_type_check;
alter table candidate_positions add constraint candidate_positions_answer_type_check
  check (answer_type in ('likert', 'choice', 'priority'));
