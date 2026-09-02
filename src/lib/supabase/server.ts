import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL } from "./config";

/** Server-side client scoped to the current request, respecting RLS. */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component render — safe to ignore when
          // middleware/proxy is refreshing the session instead.
        }
      },
    },
  });
}

/**
 * Privileged client for the admin area (server actions only). Bypasses RLS
 * using the service role key — never expose this client to the browser.
 */
export function createSupabaseAdminClient() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "Supabase n'est pas configuré : renseignez SUPABASE_SERVICE_ROLE_KEY pour activer l'administration."
    );
  }
  return createServiceClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}
