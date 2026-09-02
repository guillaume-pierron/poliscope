"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Label, Input, Textarea, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { AdminFormState } from "@/app/admin/actions";
import type { EntityConfig } from "@/lib/admin/entities";

const initialState: AdminFormState = { status: "idle" };

export function EntityForm({
  entity,
  record,
  relationOptions,
  action,
}: {
  entity: EntityConfig;
  record?: Record<string, unknown>;
  relationOptions: Record<string, { value: string; label: string }[]>;
  action: (prevState: AdminFormState, formData: FormData) => Promise<AdminFormState>;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const router = useRouter();

  return (
    <form action={formAction} className="space-y-5">
      {record?.id !== undefined && <input type="hidden" name="id" value={String(record.id)} />}

      {entity.fields.map((field) => {
        const value = record?.[field.name];
        let defaultValue = value === null || value === undefined ? "" : String(value);
        if (field.type === "date" && defaultValue) defaultValue = defaultValue.slice(0, 10);

        return (
          <div key={field.name}>
            <Label htmlFor={field.name}>{field.label}</Label>
            {field.type === "textarea" ? (
              <Textarea id={field.name} name={field.name} defaultValue={defaultValue} rows={4} required={field.required} />
            ) : field.type === "select" ? (
              <Select id={field.name} name={field.name} defaultValue={defaultValue} required={field.required}>
                <option value="">—</option>
                {(field.relation ? relationOptions[field.relation] : field.options)?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            ) : (
              <Input
                id={field.name}
                name={field.name}
                type={field.type === "number" ? "number" : field.type === "date" ? "date" : field.type === "url" ? "url" : "text"}
                step={field.type === "number" ? "any" : undefined}
                defaultValue={defaultValue}
                required={field.required}
              />
            )}
            {field.help && <p className="mt-1 text-xs text-muted-2">{field.help}</p>}
          </div>
        );
      })}

      {state.status === "error" && (
        <p className="rounded-lg bg-danger-soft p-3 text-sm text-danger" role="alert">
          {state.message}
        </p>
      )}

      <div className="flex gap-2 pt-2">
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? "Enregistrement…" : "Enregistrer"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
