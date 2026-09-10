"use client";

import { useActionState, useState } from "react";
import { Flag } from "lucide-react";
import { reportCorrection, type ReportCorrectionState } from "@/app/actions/report-correction";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";

const initialState: ReportCorrectionState = { status: "idle" };

/**
 * "Signaler une erreur ou apporter un contexte" — droit de réponse minimal
 * prévu sur chaque information sensible (voir /methodologie). Volontairement
 * discret : ce n'est pas un appel à contester, seulement une porte ouverte.
 */
export function ReportIssueButton({
  candidateId,
  recordTable,
  recordId,
}: {
  candidateId: string;
  recordTable: string;
  recordId: string;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(reportCorrection, initialState);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="focus-ring inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-foreground hover:underline"
      >
        <Flag size={12} />
        Signaler une erreur ou apporter un contexte
      </button>

      <Modal open={open} onClose={() => setOpen(false)}>
        {state.status === "success" ? (
          <div className="py-2">
            <p className="font-semibold">Merci</p>
            <p className="mt-1.5 text-sm text-muted">{state.message}</p>
          </div>
        ) : (
          <form action={formAction} className="space-y-4">
            <div>
              <p className="font-semibold">Signaler une erreur ou apporter un contexte</p>
              <p className="mt-1 text-sm text-muted">
                Une information vous semble incorrecte, incomplète, ou mérite un contexte supplémentaire ?
                Décrivez-le ci-dessous, avec une source si possible. Notre équipe examine chaque signalement
                avant toute correction.
              </p>
            </div>
            <input type="hidden" name="candidateId" value={candidateId} />
            <input type="hidden" name="recordTable" value={recordTable} />
            <input type="hidden" name="recordId" value={recordId} />
            <div>
              <Label htmlFor="report-message">Votre message</Label>
              <Textarea id="report-message" name="message" required minLength={10} rows={4} placeholder="Décrivez l'erreur ou le contexte manquant…" />
            </div>
            <div>
              <Label htmlFor="report-email">Votre e-mail (optionnel, pour vous répondre)</Label>
              <Input id="report-email" name="contactEmail" type="email" placeholder="vous@exemple.fr" />
            </div>
            {state.status === "error" && (
              <p className="text-sm text-danger" role="alert">
                {state.message}
              </p>
            )}
            <Button type="submit" variant="primary" size="md" disabled={pending} className="w-full justify-center">
              {pending ? "Envoi…" : "Envoyer le signalement"}
            </Button>
          </form>
        )}
      </Modal>
    </>
  );
}
