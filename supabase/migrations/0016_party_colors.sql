-- Aligne les couleurs des partis sur celles que Wikipédia normalise
-- (Modèle:Infobox Parti politique français/couleurs) plutôt que sur la
-- palette décorative d'origine, qui n'avait aucune correspondance : Les
-- Républicains y étaient roses, La France insoumise orange.
--
-- Trois exceptions documentées dans src/lib/data/local/parties.ts :
-- Renaissance et Place publique sont assombris (leurs codes officiels
-- sont pensés comme fonds de tableau, illisibles en texte), et trois
-- formations sans couleur documentée gardent un choix conventionnel.

update parties set color = '#0d378a' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:party:rn');
update parties set color = '#cc2443' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:party:lfi');
update parties set color = '#c9a800' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:party:renaissance');
update parties set color = '#0000ba' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:party:horizons');
update parties set color = '#0066cc' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:party:lr');
update parties set color = '#d94f7d' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:party:place-publique');
update parties set color = '#00a000' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:party:ecologistes');
update parties set color = '#e34948' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:party:debout');
update parties set color = '#6b7280' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:party:sans-etiquette-droite');
update parties set color = '#0d9488' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:party:nouvelle-energie');
update parties set color = '#dd0000' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:party:pcf');
update parties set color = '#bb0000' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:party:lo');
update parties set color = '#0082c4' where id = uuid_generate_v5(uuid_ns_url(), 'poliscope:party:dlf');
