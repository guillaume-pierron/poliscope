-- Repères d'état civil et fonction en cours, affichés sur la fiche candidat.
--
-- Ces valeurs ne sont pas une recherche nouvelle : elles extraient ce que la
-- biographie déjà sourcée de chaque fiche énonce en prose, pour pouvoir
-- l'afficher en repères lisibles. Toute fiche non renseignée affiche
-- simplement moins de repères.
--
-- birth_date est un texte et non une date : la source de Bruno Retailleau ne
-- donne que l'année de naissance. Une colonne `date` obligerait à inventer un
-- jour, ce que ce site ne fait jamais.

alter table candidates add column if not exists birth_date text;
alter table candidates add column if not exists birth_place text;
alter table candidates add column if not exists "current_role" text;
alter table candidates add column if not exists current_role_detail text;

update candidates set
  birth_date = v.birth_date,
  birth_place = v.birth_place,
  "current_role" = v."current_role",
  current_role_detail = v.current_role_detail
from (values
  ('jean-luc-melenchon',     '1951-08-19', 'Tanger (Maroc)',       'Fondateur de La France insoumise',     'depuis 2016'),
  ('francois-ruffin',        '1975-10-18', 'Calais',               'Député de la Somme',                   'depuis 2017'),
  ('marine-tondelier',       '1986-08-23', 'Bois-Bernard',         'Secrétaire nationale des Écologistes', 'depuis décembre 2022'),
  ('raphael-glucksmann',     '1979-10-15', 'Boulogne-Billancourt', 'Député européen',                      'depuis juillet 2019'),
  ('gabriel-attal',          '1989-03-16', 'Clamart',              'Secrétaire général de Renaissance',    'depuis décembre 2024'),
  ('edouard-philippe',       '1970-11-28', 'Rouen',                'Maire du Havre',                       'depuis 2010'),
  ('xavier-bertrand',        '1965-03-21', 'Châlons-en-Champagne', 'Président du conseil régional',        'Hauts-de-France, depuis 2016'),
  -- Année seule : la source ne donne pas le jour de naissance.
  ('bruno-retailleau',       '1960',       'Cholet',               'Sénateur de la Vendée',                'depuis 2004'),
  -- « depuis 2022 » se rapporte, dans la source, à la présidence du groupe RN
  -- et non au mandat de députée : aucune date n'est donc rattachée ici.
  ('marine-le-pen',          '1968-08-05', 'Neuilly-sur-Seine',    'Députée du Pas-de-Calais',             null),
  ('david-lisnard',          '1969-02-02', 'Limoges',              'Maire de Cannes',                      'depuis 2014'),
  ('fabien-roussel',         '1969-04-16', 'Béthune',              'Maire de Saint-Amand-les-Eaux',        'depuis janvier 2025'),
  -- Aucun mandat électif : la fonction retenue est celle que la source décrit.
  ('nathalie-arthaud',       '1970-02-23', 'Peyrins (Drôme)',      'Porte-parole de Lutte Ouvrière',       'depuis décembre 2008'),
  ('nicolas-dupont-aignan',  '1961-03-07', 'Paris',                'Maire de Yerres',                      'depuis 2020')
) as v(slug, birth_date, birth_place, "current_role", current_role_detail)
where candidates.slug = v.slug;
