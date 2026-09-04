-- Scoped write path for automated poll ingestion. Instead of handing the
-- weekly research routine the master service_role key (full bypass of RLS,
-- every table), it gets only: the public anon key + a dedicated token that
-- this function checks. A leaked token allows inserting/updating polls and
-- poll_results only — nothing else is reachable through it.

create table if not exists automation_tokens (
  name text primary key,
  token text not null,
  created_at timestamptz not null default now()
);
alter table automation_tokens enable row level security;
-- Intentionally no policies: unreachable via the anon/authenticated API
-- keys, only readable from inside the SECURITY DEFINER function below.

insert into automation_tokens (name, token)
values ('polls_writer', '5a1356971ca514888232e0f8b32d2662c832a5722490485e')
on conflict (name) do update set token = excluded.token;

-- Natural key so re-running the same week's research doesn't duplicate a poll.
alter table polls
  add constraint polls_natural_key unique (institute, field_start, field_end, round);

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
  v_result jsonb;
  v_candidate_id uuid;
  v_written int := 0;
begin
  v_token := payload->>'token';
  if v_token is null or v_token <> (select token from automation_tokens where name = 'polls_writer') then
    raise exception 'invalid token';
  end if;

  select id into v_election_id from elections where is_active = true limit 1;
  if v_election_id is null then
    raise exception 'no active election';
  end if;

  insert into polls (election_id, institute, sponsor, field_start, field_end, sample_size, method, round, published_at, is_demo)
  values (
    v_election_id,
    payload->>'institute',
    payload->>'sponsor',
    (payload->>'field_start')::date,
    (payload->>'field_end')::date,
    (payload->>'sample_size')::int,
    coalesce(payload->>'method', ''),
    coalesce(payload->>'round', 'premier_tour'),
    (payload->>'published_at')::date,
    false
  )
  on conflict (institute, field_start, field_end, round)
  do update set
    sponsor = excluded.sponsor,
    sample_size = excluded.sample_size,
    method = excluded.method,
    published_at = excluded.published_at
  returning id into v_poll_id;

  for v_result in select * from jsonb_array_elements(coalesce(payload->'results', '[]'::jsonb))
  loop
    select id into v_candidate_id from candidates where slug = v_result->>'candidate_slug';
    if v_candidate_id is not null then
      insert into poll_results (poll_id, candidate_id, value, low, high)
      values (
        v_poll_id,
        v_candidate_id,
        (v_result->>'value')::numeric,
        nullif(v_result->>'low', '')::numeric,
        nullif(v_result->>'high', '')::numeric
      )
      on conflict (poll_id, candidate_id)
      do update set value = excluded.value, low = excluded.low, high = excluded.high;
      v_written := v_written + 1;
    end if;
  end loop;

  return jsonb_build_object('poll_id', v_poll_id, 'results_written', v_written);
end;
$$;

revoke all on function submit_poll_data(jsonb) from public;
grant execute on function submit_poll_data(jsonb) to anon, authenticated;
