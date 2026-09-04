-- Lightweight topic tags on proposals, used to power the theme pages' filter
-- chips and "quick comparison" panel. Stored as a plain comma-separated
-- string (not text[]) so the existing generic admin form — which only knows
-- how to write text/number/boolean fields — needs no special-casing.
alter table proposals add column if not exists tags text;

-- Backfill for the 63 proposals already seeded (seed.sql only inserts with
-- `on conflict do nothing`, so it never updates existing rows). IDs reuse
-- the same deterministic uuid_generate_v5 scheme as seed.sql, keyed off each
-- proposal's stable "proposal-N" position in src/lib/data/local/proposals.ts.
update proposals set tags = 'Âge légal, Réforme des retraites' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-1');
update proposals set tags = 'SMIC, Prix' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-2');
update proposals set tags = 'Régularisation, Asile' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-3');
update proposals set tags = 'Police, Réforme policière' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-4');
update proposals set tags = 'Hôpital public, Urgences' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-5');
update proposals set tags = 'Effectifs, Gratuité' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-6');
update proposals set tags = 'Renouvelables, Nucléaire' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-7');
update proposals set tags = 'Traités européens, Souveraineté' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-8');
update proposals set tags = 'Logement social, Loyers' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-9');
update proposals set tags = 'SMIC, Salaire minimum' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-10');
update proposals set tags = 'Pénibilité, Départ anticipé' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-11');
update proposals set tags = 'Immigration de travail' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-12');
update proposals set tags = 'Rénovation thermique, Climat' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-13');
update proposals set tags = 'Nucléaire' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-14');
update proposals set tags = 'Défense européenne, Souveraineté numérique' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-15');
update proposals set tags = 'SMIC' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-16');
update proposals set tags = 'Âge légal' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-17');
update proposals set tags = 'Débat public' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-18');
update proposals set tags = 'Loyers, Rénovation énergétique' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-19');
update proposals set tags = 'Ukraine, Défense' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-20');
update proposals set tags = 'Salaires, Fiscalité' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-21');
update proposals set tags = 'Pénibilité, Âge légal' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-22');
update proposals set tags = 'Débat public' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-23');
update proposals set tags = 'Enseignants, Effectifs' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-24');
update proposals set tags = 'Défense européenne' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-25');
update proposals set tags = 'Institutions européennes' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-26');
update proposals set tags = 'Service civique' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-27');
update proposals set tags = 'Budget, Fonction publique' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-28');
update proposals set tags = 'Âge légal, Capitalisation' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-29');
update proposals set tags = 'Quotas' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-30');
update proposals set tags = 'Effectifs, Enseignants' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-31');
update proposals set tags = 'Nucléaire, Renouvelables' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-32');
update proposals set tags = 'ZFE, Transition' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-33');
update proposals set tags = 'Santé mentale, Numérique' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-34');
update proposals set tags = 'Souveraineté' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-35');
update proposals set tags = 'Enseignants, Salaires' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-36');
update proposals set tags = 'Enseignants, Réforme scolaire' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-37');
update proposals set tags = 'Âge légal' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-38');
update proposals set tags = 'Quotas, Immigration de travail' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-39');
update proposals set tags = 'Nucléaire, Renouvelables' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-40');
update proposals set tags = 'Propriétaires, Rénovation énergétique' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-41');
update proposals set tags = 'Référendum, Constitution' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-42');
update proposals set tags = 'Narcotrafic, Police' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-43');
update proposals set tags = 'Budget' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-44');
update proposals set tags = 'Aides sociales, Travail' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-45');
update proposals set tags = 'Âge légal' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-46');
update proposals set tags = 'Enseignants, Autonomie' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-47');
update proposals set tags = 'Adaptation climatique' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-48');
update proposals set tags = 'Renouvelables, Nucléaire' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-49');
update proposals set tags = 'Schengen, Frontières' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-50');
update proposals set tags = 'Construction, Loyers' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-51');
update proposals set tags = 'Justice, Sanctions' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-52');
update proposals set tags = 'Prisons, Peines plancher' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-53');
update proposals set tags = 'Référendum, Constitution' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-54');
update proposals set tags = 'Quotas' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-55');
update proposals set tags = 'Nucléaire' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-56');
update proposals set tags = 'Fiscalité, Numérique' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-57');
update proposals set tags = 'Construction' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-58');
update proposals set tags = 'TVA, Énergie' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-59');
update proposals set tags = 'Âge légal' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-60');
update proposals set tags = 'Référendum, Régularisation' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-61');
update proposals set tags = 'Éolien, Nucléaire' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-62');
update proposals set tags = 'Hôpital public' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:proposal:proposal-63');
