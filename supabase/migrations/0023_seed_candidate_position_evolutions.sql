-- "Parcours & actes" — évolutions de positions. Deux cas documentés,
-- recherchés et recoupés contre des sources identifiables en septembre
-- 2026 (voir chaque source_url) — mêmes faits que
-- src/lib/data/local/candidate-records.ts, avec lequel ce fichier doit
-- rester synchronisé à la main.
--
-- Principe absolu : jamais "retournement de veste", jamais un jugement.
-- Chaque évolution repose sur au moins deux déclarations datées et sourcées
-- individuellement (candidate_position_history) — jamais une conclusion
-- tirée d'une seule citation. Quand le candidat a lui-même donné une
-- explication sourcée de son changement, elle est reportée telle quelle
-- (candidate_explanation) — jamais une raison devinée par Polysia.
--
-- Ce n'est pas une recherche exhaustive — voir /methodologie : un candidat
-- non listé ici signifie "aucune évolution documentée dans Polysia",
-- jamais "aucune évolution".
--
-- Idempotent : chaque ligne a un identifiant déterministe
-- (uuid_generate_v5), donc rejouer cette migration ne duplique rien.

-- ---------------------------------------------------------------------------
-- candidate_position_history
-- ---------------------------------------------------------------------------

-- Jean-Luc Mélenchon — port du voile islamique. Note : la citation de 2010
-- porte spécifiquement sur le voile intégral (niqab/burqa), distincte de
-- l'opposition plus générale au port du voile exprimée en 2017.
insert into candidate_position_history (id, candidate_id, theme_id, subject, position_summary, quote, date, source_name, source_url, source_type, status, verified_at) values
  (uuid_generate_v5(uuid_ns_url(), 'poliscope:candidate_position_history:melenchon-voile-2010'), uuid_generate_v5(uuid_ns_url(), 'poliscope:candidate:jean-luc-melenchon'), null, 'Port du voile islamique', 'Sur son blog, à propos du voile intégral (niqab/burqa), il décrit son port comme un traitement dégradant pour la femme qui le porte et plaide pour son interdiction dans l''espace public.', 'Mon point de départ est que le port de ce voile est un traitement dégradant pour la personne qui s''y soumet.', '2010-01-07', 'Blog de Jean-Luc Mélenchon', 'https://melenchon.fr/2010/01/07/je-parle-du-voile-integral/', 'candidate', 'published', '2026-09-10')
  on conflict (id) do nothing;
insert into candidate_position_history (id, candidate_id, theme_id, subject, position_summary, quote, date, source_name, source_url, source_type, status, verified_at) values
  (uuid_generate_v5(uuid_ns_url(), 'poliscope:candidate_position_history:melenchon-voile-2017'), uuid_generate_v5(uuid_ns_url(), 'poliscope:candidate:jean-luc-melenchon'), null, 'Port du voile islamique', 'Interrogé sur le port du voile islamique dans « L''Émission politique » (France 2), il dit ne pas en comprendre le sens religieux et affirme son opposition à l''ensemble des signes religieux.', 'Je ne vois pas en quoi Dieu serait intéressé par un chiffon sur la tête.', '2017-02-23', 'Franceinfo', 'https://www.franceinfo.fr/politique/j-ai-fait-une-erreur-terrible-jean-luc-melenchon-admet-avoir-change-d-avis-sur-le-port-du-voile-islamique_8175281.html', 'media', 'published', '2026-09-10')
  on conflict (id) do nothing;
insert into candidate_position_history (id, candidate_id, theme_id, subject, position_summary, quote, date, source_name, source_url, source_type, status, verified_at) values
  (uuid_generate_v5(uuid_ns_url(), 'poliscope:candidate_position_history:melenchon-voile-2026'), uuid_generate_v5(uuid_ns_url(), 'poliscope:candidate:jean-luc-melenchon'), null, 'Port du voile islamique', 'Il déclare publiquement avoir changé d''avis sur le port du voile islamique, qualifiant ses positions passées d''« erreur terrible », après avoir échangé avec des femmes concernées.', 'J''ai rencontré des femmes qui portaient le voile [...] j''ai été convaincu et j''ai changé d''avis. Je me suis dit que j''ai fait une erreur terrible.', '2026-09-02', 'Franceinfo', 'https://www.franceinfo.fr/politique/j-ai-fait-une-erreur-terrible-jean-luc-melenchon-admet-avoir-change-d-avis-sur-le-port-du-voile-islamique_8175281.html', 'media', 'published', '2026-09-10')
  on conflict (id) do nothing;

-- Marine Le Pen — sortie de l'euro.
insert into candidate_position_history (id, candidate_id, theme_id, subject, position_summary, quote, date, source_name, source_url, source_type, status, verified_at) values
  (uuid_generate_v5(uuid_ns_url(), 'poliscope:candidate_position_history:lepen-euro-2017'), uuid_generate_v5(uuid_ns_url(), 'poliscope:candidate:marine-le-pen'), null, 'Sortie de l''euro', 'Lors de la présentation de ses « 144 engagements présidentiels » aux assises de Lyon, elle défend le rétablissement d''une monnaie nationale, présenté comme un levier de compétitivité économique.', 'rétablissement d''une monnaie nationale adaptée à notre économie, levier de notre compétitivité', '2017-02-05', 'Public Sénat', 'https://www.publicsenat.fr/actualites/non-classe/sur-l-europe-marine-le-pen-a-t-elle-vraiment-change-202482', 'media', 'published', '2026-09-10')
  on conflict (id) do nothing;
insert into candidate_position_history (id, candidate_id, theme_id, subject, position_summary, quote, date, source_name, source_url, source_type, status, verified_at) values
  (uuid_generate_v5(uuid_ns_url(), 'poliscope:candidate_position_history:lepen-euro-2019'), uuid_generate_v5(uuid_ns_url(), 'poliscope:candidate:marine-le-pen'), null, 'Sortie de l''euro', 'Lors de ses vœux à la presse, elle affirme que sortir de l''euro n''est plus une priorité, tout en continuant à qualifier la monnaie unique de problématique pour la France.', 'Incontestablement, l''euro est un boulet pour la France, [...] en sortir n''est plus une priorité.', '2019-01-17', 'Public Sénat', 'https://www.publicsenat.fr/actualites/non-classe/sur-l-europe-marine-le-pen-a-t-elle-vraiment-change-202482', 'media', 'published', '2026-09-10')
  on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- candidate_position_evolutions
-- ---------------------------------------------------------------------------

insert into candidate_position_evolutions (id, candidate_id, theme_id, subject, evolution_type, confidence, summary, candidate_explanation, candidate_explanation_source_url, status, verified_at) values
  (uuid_generate_v5(uuid_ns_url(), 'poliscope:candidate_position_evolution:melenchon-voile'), uuid_generate_v5(uuid_ns_url(), 'poliscope:candidate:jean-luc-melenchon'), null, 'Port du voile islamique', 'position_reversed', 'evolved', 'Jean-Luc Mélenchon a publiquement reconnu avoir changé d''avis sur le port du voile islamique : après avoir qualifié le voile intégral de « traitement dégradant » en 2010 et le port du voile en général de « chiffon sur la tête » en 2017, il affirme désormais que sa position passée était une erreur. Sa déclaration de 2010 portait spécifiquement sur le voile intégral (niqab/burqa) ; celle de 2017 sur le port du voile de façon plus générale.', '« J''ai rencontré des femmes qui portaient le voile [...] j''ai été convaincu et j''ai changé d''avis. Je me suis dit que j''ai fait une erreur terrible. »', 'https://www.franceinfo.fr/politique/j-ai-fait-une-erreur-terrible-jean-luc-melenchon-admet-avoir-change-d-avis-sur-le-port-du-voile-islamique_8175281.html', 'published', '2026-09-10')
  on conflict (id) do nothing;
insert into candidate_position_evolutions (id, candidate_id, theme_id, subject, evolution_type, confidence, summary, candidate_explanation, candidate_explanation_source_url, status, verified_at) values
  (uuid_generate_v5(uuid_ns_url(), 'poliscope:candidate_position_evolution:lepen-euro'), uuid_generate_v5(uuid_ns_url(), 'poliscope:candidate:marine-le-pen'), null, 'Sortie de l''euro', 'position_reversed', 'evolved', 'Marine Le Pen a abandonné sa proposition de sortie de l''euro entre sa campagne présidentielle de 2017, où elle défendait le rétablissement d''une monnaie nationale, et janvier 2019, où elle a déclaré que sortir de l''euro n''était plus une priorité — tout en continuant à qualifier l''euro de problématique pour la France.', 'Elle a évoqué une proposition « perçue comme brutale » ayant entraîné « une véritable crainte », plaidant depuis pour une reconquête de la souveraineté « progressive » plutôt que brutale.', 'https://www.publicsenat.fr/actualites/non-classe/sur-l-europe-marine-le-pen-a-t-elle-vraiment-change-202482', 'published', '2026-09-10')
  on conflict (id) do nothing;
