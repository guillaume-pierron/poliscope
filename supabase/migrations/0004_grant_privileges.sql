-- Row Level Security policies only take effect once the underlying role also
-- holds the ordinary Postgres table-level privilege — "public read" policies
-- from 0001_init.sql are silent no-ops without this grant. A fresh Supabase
-- project normally wires this up automatically; this project's `public`
-- schema never received it, so every anon/service_role read has been
-- failing with "permission denied" since the schema was created — including
-- the service_role key, which should bypass RLS entirely but still needs
-- the base grant to see the table at all.
grant usage on schema public to anon, authenticated, service_role;

grant select on all tables in schema public to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to service_role;
grant usage, select on all sequences in schema public to anon, authenticated, service_role;

-- So future tables created by later migrations inherit the same grants
-- without needing another one of these files.
alter default privileges in schema public grant select on tables to anon, authenticated;
alter default privileges in schema public grant select, insert, update, delete on tables to service_role;
alter default privileges in schema public grant usage, select on sequences to anon, authenticated, service_role;
