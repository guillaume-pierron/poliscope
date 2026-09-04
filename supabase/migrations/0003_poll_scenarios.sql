-- Polls can carry several scenarios (first-round hypotheses tested with
-- different candidate rosters, or several second-round duels). Scenarios are
-- a first-class table so results are always scoped to exactly one of them —
-- there is no code path that can blend two hypotheses together.
--
-- No real poll has ever been ingested (polls/poll_results are empty in
-- every environment), so this migration restructures the tables directly
-- rather than carrying forward a data migration.

alter table polls drop constraint if exists polls_natural_key;
alter table polls drop column if exists round;

alter table polls add column if not exists source_name text not null default '';
alter table polls add column if not exists source_url text not null default '';
alter table polls alter column source_name drop default;
alter table polls alter column source_url drop default;

alter table polls
  add constraint polls_natural_key unique (institute, field_start, field_end, published_at);

-- ---------------------------------------------------------------------------
-- poll_scenarios — one row per hypothesis/duel tested within a poll.
-- ---------------------------------------------------------------------------
create table if not exists poll_scenarios (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references polls(id) on delete cascade,
  label text not null,
  round text not null default 'premier_tour' check (round in ('premier_tour', 'second_tour')),
  order_index int not null default 0,
  created_at timestamptz not null default now(),
  unique (poll_id, label)
);
create index if not exists poll_scenarios_poll_id_idx on poll_scenarios(poll_id);

alter table poll_scenarios enable row level security;
create policy "public read" on poll_scenarios for select using (true);

-- ---------------------------------------------------------------------------
-- poll_results now scoped to a scenario, never directly to a poll.
-- ---------------------------------------------------------------------------
alter table poll_results drop constraint if exists poll_results_poll_id_candidate_id_key;
drop index if exists poll_results_poll_id_idx;

alter table poll_results add column if not exists scenario_id uuid references poll_scenarios(id) on delete cascade;
alter table poll_results drop column if exists poll_id;
alter table poll_results alter column scenario_id set not null;

alter table poll_results
  add constraint poll_results_scenario_id_candidate_id_key unique (scenario_id, candidate_id);
create index if not exists poll_results_scenario_id_idx on poll_results(scenario_id);

-- ---------------------------------------------------------------------------
-- submit_poll_data — rewritten for the scenario shape. A poll's source_url is
-- now mandatory, and every scenario must carry its own non-empty results;
-- an empty/malformed scenario is skipped rather than written half-populated.
-- ---------------------------------------------------------------------------
create or replace function submit_poll_data(payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_token text;
  v_election_id uuid;
  v_poll_id uuid;
  v_scenario jsonb;
  v_scenario_id uuid;
  v_result jsonb;
  v_candidate_id uuid;
  v_scenarios_written int := 0;
  v_results_written int := 0;
begin
  v_token := payload->>'token';
  if v_token is null or v_token <> (select token from automation_tokens where name = 'polls_writer') then
    raise exception 'invalid token';
  end if;

  if coalesce(payload->>'source_url', '') = '' then
    raise exception 'source_url is required';
  end if;
  if payload->'scenarios' is null or jsonb_array_length(payload->'scenarios') = 0 then
    raise exception 'at least one scenario is required';
  end if;

  select id into v_election_id from elections where is_active = true limit 1;
  if v_election_id is null then
    raise exception 'no active election';
  end if;

  insert into polls (
    election_id, institute, sponsor, field_start, field_end, sample_size, method,
    source_name, source_url, published_at, is_demo
  )
  values (
    v_election_id,
    payload->>'institute',
    payload->>'sponsor',
    (payload->>'field_start')::date,
    (payload->>'field_end')::date,
    (payload->>'sample_size')::int,
    coalesce(payload->>'method', ''),
    coalesce(nullif(payload->>'source_name', ''), payload->>'institute'),
    payload->>'source_url',
    (payload->>'published_at')::date,
    false
  )
  on conflict (institute, field_start, field_end, published_at)
  do update set
    sponsor = excluded.sponsor,
    sample_size = excluded.sample_size,
    method = excluded.method,
    source_name = excluded.source_name,
    source_url = excluded.source_url
  returning id into v_poll_id;

  for v_scenario in select * from jsonb_array_elements(payload->'scenarios')
  loop
    -- Skip a scenario carrying no results rather than write a hollow one.
    if v_scenario->'results' is null or jsonb_array_length(v_scenario->'results') = 0 then
      continue;
    end if;

    insert into poll_scenarios (poll_id, label, round, order_index)
    values (
      v_poll_id,
      v_scenario->>'label',
      coalesce(v_scenario->>'round', 'premier_tour'),
      coalesce((v_scenario->>'order_index')::int, 0)
    )
    on conflict (poll_id, label)
    do update set round = excluded.round, order_index = excluded.order_index
    returning id into v_scenario_id;

    v_scenarios_written := v_scenarios_written + 1;

    for v_result in select * from jsonb_array_elements(v_scenario->'results')
    loop
      select id into v_candidate_id from candidates where slug = v_result->>'candidate_slug';
      if v_candidate_id is not null then
        insert into poll_results (scenario_id, candidate_id, value, low, high)
        values (
          v_scenario_id,
          v_candidate_id,
          (v_result->>'value')::numeric,
          nullif(v_result->>'low', '')::numeric,
          nullif(v_result->>'high', '')::numeric
        )
        on conflict (scenario_id, candidate_id)
        do update set value = excluded.value, low = excluded.low, high = excluded.high;
        v_results_written := v_results_written + 1;
      end if;
    end loop;
  end loop;

  return jsonb_build_object(
    'poll_id', v_poll_id,
    'scenarios_written', v_scenarios_written,
    'results_written', v_results_written
  );
end;
$$;

revoke all on function submit_poll_data(jsonb) from public;
grant execute on function submit_poll_data(jsonb) to anon, authenticated;
