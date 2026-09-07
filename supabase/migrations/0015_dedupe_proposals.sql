-- Supprime 10 propositions dupliquées : chacune existait en deux
-- exemplaires identiques (même candidat, titre, résumé, description et
-- source), créés à 31 secondes d'intervalle le 5 septembre 2026 —
-- signature d'une double soumission du formulaire d'administration, la
-- même que celle déjà corrigée en 0014 pour la mesure sur la BCE.
--
-- L'exemplaire conservé est le plus ancien de chaque paire. Aucune des
-- lignes supprimées n'est référencée par une analyse « Faisabilité &
-- impact » (vérifié avant écriture de cette migration).
delete from proposals where id in (
  'd8389fbe-b3ef-474c-a6c4-d5e58dfa2281', -- Ruffin — statut des travailleurs essentiels
  'f58c66ed-f87b-494f-bc99-0e0c0d97fe4f', -- Tondelier — ISF climatique et TVA verte
  '436af3b6-1479-491a-be3c-ef56cdf7aea5', -- Glucksmann — colonies de vacances
  '6dd28a11-0744-405d-8590-7322b6df6c75', -- Attal — plan France 2040 pour l'IA
  'b2dce203-b2d0-4bea-8170-819a962326cc', -- Attal — baisse des cotisations salariales
  'b9b87fde-0f43-4734-b6f0-77d184969913', -- Philippe — amende de responsabilisation scolaire
  '8f026425-b87e-4ed5-b75e-3ff797726d2e', -- Philippe — peines minimales
  '1afa6509-701c-4248-bfd5-ec86f52dc248', -- Retailleau — réduction du nombre de fonctionnaires
  '6dfe8557-09dd-4e8f-b056-8abd54607f90', -- Retailleau — internats disciplinaires
  '01510d57-58fd-4568-9b41-4f4ce50764f3'  -- Le Pen — règle d'or budgétaire
);
