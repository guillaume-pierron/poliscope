-- Cinq votes parlementaires supplémentaires (Mélenchon, Philippe ×2, Attal,
-- Bertrand), recherchés et vérifiés en même temps que ceux de 0021.
--
-- Pourquoi un fichier séparé plutôt qu'un ajout à 0021 : 0021 était déjà
-- appliquée en base quand ces lignes ont été écrites. Modifier une migration
-- déjà jouée ne la rejoue pas — les lignes ajoutées après coup ne seraient
-- jamais parties en production, silencieusement. Une migration appliquée est
-- immuable ; toute donnée ultérieure passe par un nouveau fichier.
--
-- Idempotent : identifiants déterministes (uuid_generate_v5).

-- Scrutin n°578 (15e législature) — adoption en première lecture de la loi
-- "pour une immigration maîtrisée, un droit d'asile effectif et une
-- intégration réussie", le 22 avril 2018.
insert into candidate_votes (id, candidate_id, institution, legislature, official_vote_id, title, description, theme_id, vote_date, candidate_vote, importance_level, featured, source_name, source_url, source_type, status, verified_at) values
  (uuid_generate_v5(uuid_ns_url(), 'poliscope:candidate_vote:578-jean-luc-melenchon'), uuid_generate_v5(uuid_ns_url(), 'poliscope:candidate:jean-luc-melenchon'), 'assemblee_nationale', '15e législature', '578', 'Adoption de la loi « pour une immigration maîtrisée, un droit d''asile effectif et une intégration réussie » (1re lecture)', 'Vote sur l''ensemble du texte en première lecture, après une semaine de débats et l''examen d''environ un millier d''amendements.', uuid_generate_v5(uuid_ns_url(), 'poliscope:theme:immigration'), '2018-04-22', 'against', 'major', true, 'Assemblée nationale', 'https://www.assemblee-nationale.fr/dyn/15/scrutins/578', 'parliament', 'published', '2026-09-10')
  on conflict (id) do nothing;

-- Scrutin n°511 (14e législature) — adoption définitive de la loi ouvrant le
-- mariage aux couples de personnes de même sexe ("mariage pour tous"), le
-- 23 avril 2013.
insert into candidate_votes (id, candidate_id, institution, legislature, official_vote_id, title, description, theme_id, vote_date, candidate_vote, importance_level, featured, source_name, source_url, source_type, status, verified_at) values
  (uuid_generate_v5(uuid_ns_url(), 'poliscope:candidate_vote:511-edouard-philippe'), uuid_generate_v5(uuid_ns_url(), 'poliscope:candidate:edouard-philippe'), 'assemblee_nationale', '14e législature', '511', 'Adoption de la loi ouvrant le mariage aux couples de personnes de même sexe', 'Vote définitif sur l''ensemble du texte, en deuxième lecture, après son adoption par le Sénat.', null, '2013-04-23', 'abstention', 'major', true, 'Assemblée nationale', 'https://www.assemblee-nationale.fr/14/scrutins/jo0511.asp', 'parliament', 'published', '2026-09-10')
  on conflict (id) do nothing;

-- Scrutin n°1109 (14e législature) — adoption en première lecture de la loi
-- relative au renseignement, le 5 mai 2015.
insert into candidate_votes (id, candidate_id, institution, legislature, official_vote_id, title, description, theme_id, vote_date, candidate_vote, importance_level, featured, source_name, source_url, source_type, status, verified_at) values
  (uuid_generate_v5(uuid_ns_url(), 'poliscope:candidate_vote:1109-edouard-philippe'), uuid_generate_v5(uuid_ns_url(), 'poliscope:candidate:edouard-philippe'), 'assemblee_nationale', '14e législature', '1109', 'Adoption de la loi relative au renseignement (1re lecture)', 'Vote sur l''ensemble du texte encadrant les techniques de renseignement et leur contrôle, en première lecture.', uuid_generate_v5(uuid_ns_url(), 'poliscope:theme:securite'), '2015-05-05', 'against', 'major', true, 'Assemblée nationale', 'https://www.assemblee-nationale.fr/dyn/14/scrutins/1109', 'parliament', 'published', '2026-09-10')
  on conflict (id) do nothing;

-- Motion de censure contre le gouvernement Michel Barnier (voir scrutin
-- n°519 ci-dessus) : les groupes qui s'opposent à une motion de censure ne
-- prennent traditionnellement pas part à ce vote plutôt que de voter
-- "contre" — Gabriel Attal (groupe Ensemble pour la République) ne figure
-- dans aucune liste de votants de ce scrutin.
insert into candidate_votes (id, candidate_id, institution, legislature, official_vote_id, title, description, theme_id, vote_date, candidate_vote, importance_level, featured, source_name, source_url, source_type, status, verified_at) values
  (uuid_generate_v5(uuid_ns_url(), 'poliscope:candidate_vote:519-gabriel-attal'), uuid_generate_v5(uuid_ns_url(), 'poliscope:candidate:gabriel-attal'), 'assemblee_nationale', '17e législature', '519', 'Motion de censure contre le gouvernement Michel Barnier', 'Motion déposée par les groupes du Nouveau Front populaire après l''engagement de la responsabilité du gouvernement (article 49, alinéa 3) sur le projet de loi de financement de la Sécurité sociale pour 2025. Son adoption entraîne la démission du gouvernement.', null, '2024-12-04', 'did_not_vote', 'major', true, 'Assemblée nationale', 'https://www.assemblee-nationale.fr/dyn/17/scrutins/519', 'parliament', 'published', '2026-09-10')
  on conflict (id) do nothing;

-- Autorisation de la prolongation des opérations aériennes françaises en
-- Syrie, le 25 novembre 2015 (dans le contexte des attentats du 13 novembre)
-- — adoptée à une très large majorité (515 voix contre 4). Identifiant de
-- scrutin officiel non retrouvé : source = page officielle "Positions de
-- vote" de Xavier Bertrand sur le site de l'Assemblée nationale.
insert into candidate_votes (id, candidate_id, institution, legislature, official_vote_id, title, description, theme_id, vote_date, candidate_vote, importance_level, featured, source_name, source_url, source_type, status, verified_at) values
  (uuid_generate_v5(uuid_ns_url(), 'poliscope:candidate_vote:syrie2015-xavier-bertrand'), uuid_generate_v5(uuid_ns_url(), 'poliscope:candidate:xavier-bertrand'), 'assemblee_nationale', '14e législature', null, 'Autorisation de la prolongation des opérations aériennes françaises en Syrie', 'Déclaration du Gouvernement sur la prolongation de l''engagement des forces armées françaises en Syrie, suivie d''un vote, dans le contexte des attentats du 13 novembre 2015.', uuid_generate_v5(uuid_ns_url(), 'poliscope:theme:international'), '2015-11-25', 'for', 'major', true, 'Assemblée nationale', 'https://www.assemblee-nationale.fr/dyn/deputes/PA267080/positions-de-vote?legislature=archive', 'parliament', 'published', '2026-09-10')
  on conflict (id) do nothing;

