import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { ENTITIES, ENTITY_KEYS, type EntityKey } from "@/lib/admin/entities";
import { getEntityList, isLiveData } from "@/lib/admin/data";
import { deleteEntityAction } from "../../actions";

function isEntityKey(value: string): value is EntityKey {
  return (ENTITY_KEYS as string[]).includes(value);
}

export default async function EntityListPage({
  params,
}: {
  params: Promise<{ entity: string }>;
}) {
  const { entity: entityParam } = await params;
  if (!isEntityKey(entityParam)) notFound();

  const entity = ENTITIES[entityParam];
  const rows = await getEntityList(entityParam);
  const live = isLiveData();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{entity.labelPlural}</h1>
        <ButtonLink href={`/admin/${entityParam}/new`} size="sm" variant="primary">
          <Plus size={16} />
          Ajouter
        </ButtonLink>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td className="p-6 text-center text-muted">Aucun élément pour le moment.</td>
              </tr>
            )}
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-border last:border-0 hover:bg-surface">
                <td className="max-w-md truncate p-4 font-medium">
                  {String(row[entity.titleField] ?? row.id)}
                </td>
                <td className="w-24 p-4 text-right">
                  <div className="flex justify-end gap-1">
                    <Link
                      href={`/admin/${entityParam}/${row.id}`}
                      className="focus-ring rounded-lg p-2 text-muted hover:bg-surface-strong hover:text-foreground"
                      aria-label="Modifier"
                    >
                      <Pencil size={15} />
                    </Link>
                    {live && (
                      <form
                        action={async () => {
                          "use server";
                          await deleteEntityAction(entityParam, String(row.id));
                        }}
                      >
                        <Button
                          type="submit"
                          variant="ghost"
                          size="icon"
                          className="text-danger hover:bg-danger-soft"
                          aria-label="Supprimer"
                        >
                          <Trash2 size={15} />
                        </Button>
                      </form>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
