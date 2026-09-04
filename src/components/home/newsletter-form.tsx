"use client";

import { useActionState } from "react";
import { subscribeNewsletter, type NewsletterState } from "@/app/actions/newsletter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const initialState: NewsletterState = { status: "idle" };

export function NewsletterForm({ className }: { className?: string }) {
  const [state, formAction, pending] = useActionState(subscribeNewsletter, initialState);

  return (
    <form action={formAction} className={cn("space-y-2", className)}>
      <div className="flex gap-2">
        <Input
          type="email"
          name="email"
          required
          placeholder="vous@exemple.fr"
          aria-label="Adresse e-mail"
          className="bg-card"
        />
        <Button type="submit" variant="primary" size="md" disabled={pending} className="shrink-0">
          {pending ? "…" : "Recevoir"}
        </Button>
      </div>
      {state.status === "success" && (
        <p className="text-xs text-success" role="status">
          {state.message}
        </p>
      )}
      {state.status === "error" && (
        <p className="text-xs text-danger" role="alert">
          {state.message}
        </p>
      )}
    </form>
  );
}
