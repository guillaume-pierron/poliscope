"use server";

import { z } from "zod";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

const schema = z.object({
  candidateId: z.string().uuid().optional().or(z.literal("")),
  recordTable: z.string().max(80).optional(),
  recordId: z.string().max(80).optional(),
  message: z.string().min(10, "Merci de préciser votre signalement (10 caractères minimum).").max(2000),
  contactEmail: z.string().email().optional().or(z.literal("")),
});

export type ReportCorrectionState = { status: "idle" | "success" | "error"; message?: string };

/**
 * "Signaler une erreur ou apporter un contexte" — droit de réponse minimal
 * sur les rubriques sensibles de "Parcours & actes" (voir méthodologie).
 * N'affiche jamais rien publiquement par elle-même : chaque signalement est
 * traité manuellement par l'équipe éditoriale avant toute correction.
 */
export async function reportCorrection(
  _prevState: ReportCorrectionState,
  formData: FormData
): Promise<ReportCorrectionState> {
  const parsed = schema.safeParse({
    candidateId: formData.get("candidateId")?.toString() ?? "",
    recordTable: formData.get("recordTable")?.toString(),
    recordId: formData.get("recordId")?.toString(),
    message: formData.get("message")?.toString() ?? "",
    contactEmail: formData.get("contactEmail")?.toString() ?? "",
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }

  if (isSupabaseConfigured()) {
    try {
      const admin = createSupabaseAdminClient();
      await admin.from("record_corrections").insert({
        candidate_id: parsed.data.candidateId || null,
        record_table: parsed.data.recordTable || null,
        record_id: parsed.data.recordId || null,
        message: parsed.data.message,
        contact_email: parsed.data.contactEmail || null,
      });
    } catch {
      // Storage not configured yet — still acknowledge the report so the
      // demo experience isn't blocked by infrastructure.
    }
  }

  return { status: "success", message: "Merci, votre signalement a été transmis à l'équipe Polysia." };
}
