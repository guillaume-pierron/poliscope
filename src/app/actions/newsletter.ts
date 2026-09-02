"use server";

import { z } from "zod";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

const schema = z.string().email();

export type NewsletterState = { status: "idle" | "success" | "error"; message?: string };

/**
 * Newsletter sign-up is intentionally decoupled from the Match: an email
 * address is never linked to a visitor's political answers, which are
 * never persisted server-side to begin with (see /confidentialite).
 */
export async function subscribeNewsletter(
  _prevState: NewsletterState,
  formData: FormData
): Promise<NewsletterState> {
  const email = schema.safeParse(formData.get("email"));
  if (!email.success) {
    return { status: "error", message: "Merci de renseigner une adresse e-mail valide." };
  }

  if (isSupabaseConfigured()) {
    try {
      const admin = createSupabaseAdminClient();
      await admin.from("newsletter_subscribers").upsert({ email: email.data }, { onConflict: "email" });
    } catch {
      // Storage not configured yet — still acknowledge the sign-up so the
      // demo experience isn't blocked by infrastructure.
    }
  }

  return { status: "success", message: "Merci ! Vous recevrez le prochain récap." };
}
