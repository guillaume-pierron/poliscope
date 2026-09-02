import { notFound } from "next/navigation";
import { EntityForm } from "@/components/admin/entity-form";
import { ENTITIES, ENTITY_KEYS, type EntityKey } from "@/lib/admin/entities";
import { getEntityById, getRelationOptions } from "@/lib/admin/data";
import { saveEntityAction } from "../../../actions";

function isEntityKey(value: string): value is EntityKey {
  return (ENTITY_KEYS as string[]).includes(value);
}

export default async function EditEntityPage({
  params,
}: {
  params: Promise<{ entity: string; id: string }>;
}) {
  const { entity: entityParam, id } = await params;
  if (!isEntityKey(entityParam)) notFound();
  const entity = ENTITIES[entityParam];
  const record = await getEntityById(entityParam, id);
  if (!record) notFound();

  const relationKeys = Array.from(new Set(entity.fields.map((f) => f.relation).filter(Boolean))) as EntityKey[];
  const relationOptions: Record<string, { value: string; label: string }[]> = {};
  await Promise.all(
    relationKeys.map(async (key) => {
      relationOptions[key] = await getRelationOptions(key);
    })
  );

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold">Modifier — {entity.label}</h1>
      <div className="mt-6">
        <EntityForm
          entity={entity}
          record={record}
          relationOptions={relationOptions}
          action={saveEntityAction.bind(null, entityParam)}
        />
      </div>
    </div>
  );
}
