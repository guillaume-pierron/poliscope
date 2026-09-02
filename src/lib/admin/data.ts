import "server-only";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { ENTITIES, type EntityKey } from "./entities";

import { themes } from "@/lib/data/local/themes";
import { parties } from "@/lib/data/local/parties";
import { candidates } from "@/lib/data/local/candidates";
import { proposals } from "@/lib/data/local/proposals";
import { questions } from "@/lib/data/local/questions";
import { candidatePositions } from "@/lib/data/local/positions";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LOCAL_DATASETS: Record<EntityKey, any[]> = {
  themes,
  parties,
  candidats: candidates,
  propositions: proposals,
  questions,
  positions: candidatePositions,
};

/** True when admin reads/writes hit a real Supabase project rather than the bundled demo dataset. */
export function isLiveData() {
  return isSupabaseConfigured();
}

export async function getEntityList(key: EntityKey) {
  const entity = ENTITIES[key];
  if (isSupabaseConfigured()) {
    try {
      const admin = createSupabaseAdminClient();
      const { data, error } = await admin.from(entity.table).select("*");
      if (error) throw error;
      return data ?? [];
    } catch {
      // fall through to local demo data
    }
  }
  return LOCAL_DATASETS[key];
}

export async function getEntityById(key: EntityKey, id: string) {
  const list = await getEntityList(key);
  return list.find((row) => String(row.id) === id);
}

export async function getRelationOptions(key: EntityKey) {
  const entity = ENTITIES[key];
  const rows = await getEntityList(key);
  return rows.map((row) => ({ value: String(row.id), label: String(row[entity.titleField] ?? row.id) }));
}
