export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

/**
 * Poliscope runs out of the box on a local, typed demo dataset
 * (src/lib/data/local) so the app is fully functional without any
 * infrastructure. Once Supabase credentials are provided, the data layer
 * (src/lib/data/queries.ts) transparently reads from Postgres instead —
 * see README.md for the migration path.
 */
export function isSupabaseConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}
