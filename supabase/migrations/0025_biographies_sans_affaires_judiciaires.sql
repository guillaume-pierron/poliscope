-- Retire toute mention d'affaire judiciaire des biographies de candidats.
--
-- Règle éditoriale : une biographie décrit un parcours (naissance, formation,
-- mandats, fonctions) — jamais une affaire judiciaire. Ces affaires ont leur
-- rubrique dédiée, « Affaires & controverses », qui seule garantit le
-- vocabulaire procédural exact (mise en examen ≠ condamnation), le statut à
-- jour, la mention d'un appel ou d'un pourvoi en cours, et les sources.
--
-- Les répéter dans la biographie reviendrait à pondérer deux fois la même
-- information, et seulement pour les candidats qui en ont une : c'est
-- exactement l'asymétrie de traitement que la méthodologie s'engage à ne pas
-- produire (voir /methodologie, « les mêmes rubriques et les mêmes critères
-- pour tous les candidats »).
--
-- Au moment de l'écriture de cette migration, une seule biographie était
-- concernée (Marine Le Pen). La vérification finale ci-dessous est là pour
-- que la règle continue de s'appliquer si d'autres biographies venaient à
-- dériver : elle échoue bruyamment plutôt que de laisser passer.

update candidates
set biography = 'Née le 5 août 1968 à Neuilly-sur-Seine, Marine Le Pen est avocate de formation. Présidente du Front National puis du Rassemblement National de 2011 à 2021, elle est députée du Pas-de-Calais et préside le groupe RN à l''Assemblée nationale depuis 2022. Elle a été candidate à la présidentielle en 2012, 2017 et 2022.'
where slug = 'marine-le-pen';

-- Garde-fou : aucune biographie ne doit plus contenir de mention judiciaire.
do $$
declare
  restantes text;
begin
  select string_agg(slug, ', ')
  into restantes
  from candidates
  where biography ~* '(condamn|mise en examen|inéligib|cassation|tribunal correctionnel|cour d''appel|relaxe|non-lieu)';

  if restantes is not null then
    raise exception 'Biographie(s) contenant encore une mention judiciaire : %. Ces informations doivent vivre dans candidate_legal_cases, pas dans la biographie.', restantes;
  end if;
end $$;
