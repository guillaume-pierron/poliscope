"use client";

import { useActionState } from "react";
import { loginAction, type AdminFormState } from "@/app/admin/actions";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialState: AdminFormState = { status: "idle" };

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <input type="hidden" name="next" value={next ?? "/admin"} />
      <div>
        <Label htmlFor="password">Mot de passe</Label>
        <Input id="password" name="password" type="password" required autoFocus />
      </div>
      {state.status === "error" && (
        <p className="text-sm text-danger" role="alert">
          {state.message}
        </p>
      )}
      <Button type="submit" variant="primary" className="w-full" disabled={pending}>
        {pending ? "Connexion…" : "Se connecter"}
      </Button>
    </form>
  );
}
