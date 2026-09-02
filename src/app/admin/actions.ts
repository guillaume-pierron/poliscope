"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, createSessionToken } from "@/lib/admin/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { ENTITIES, type EntityKey } from "@/lib/admin/entities";

export type AdminFormState = { status: "idle" | "error" | "success"; message?: string };

export async function loginAction(
  _prevState: AdminFormState,
  formData: FormData
): Promise<AdminFormState> {
  const password = formData.get("password");
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected) {
    return {
      status: "error",
      message: "ADMIN_PASSWORD n'est pas configuré côté serveur (voir .env.example).",
    };
  }
  if (password !== expected) {
    return { status: "error", message: "Mot de passe incorrect." };
  }

  const store = await cookies();
  store.set(ADMIN_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  redirect((formData.get("next") as string) || "/admin");
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

function parseFieldValue(raw: FormDataEntryValue | null, type: string) {
  if (raw === null) return null;
  const value = raw.toString();
  if (value === "" ) return null;
  if (type === "number") return Number(value);
  if (type === "boolean") return value === "on" || value === "true";
  return value;
}

export async function saveEntityAction(
  entityKey: EntityKey,
  _prevState: AdminFormState,
  formData: FormData
): Promise<AdminFormState> {
  if (!isSupabaseConfigured()) {
    return {
      status: "error",
      message:
        "Supabase n'est pas configuré : les modifications ne peuvent pas être enregistrées en V1 démo. Renseignez NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY et SUPABASE_SERVICE_ROLE_KEY (voir .env.example).",
    };
  }

  const entity = ENTITIES[entityKey];
  const id = formData.get("id")?.toString();

  const record: Record<string, unknown> = {};
  for (const field of entity.fields) {
    record[field.name] = parseFieldValue(formData.get(field.name), field.type);
  }

  try {
    const admin = createSupabaseAdminClient();
    if (id) {
      const { error } = await admin.from(entity.table).update(record).eq("id", id);
      if (error) throw error;
    } else {
      const { error } = await admin.from(entity.table).insert(record);
      if (error) throw error;
    }
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Erreur lors de l'enregistrement.",
    };
  }

  revalidatePath(`/admin/${entityKey}`);
  redirect(`/admin/${entityKey}`);
}

export async function deleteEntityAction(entityKey: EntityKey, id: string) {
  if (!isSupabaseConfigured()) return;
  const entity = ENTITIES[entityKey];
  const admin = createSupabaseAdminClient();
  await admin.from(entity.table).delete().eq("id", id);
  revalidatePath(`/admin/${entityKey}`);
}
