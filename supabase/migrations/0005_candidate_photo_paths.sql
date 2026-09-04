-- Points each candidate's photo_url at the local file the app expects
-- (see public/candidates/README.txt). Drop the actual image files in
-- public/candidates/<slug>.jpg — this migration only tells the site where
-- to look for them.
update candidates set photo_url = '/candidates/jean-luc-melenchon.jpg' where slug = 'jean-luc-melenchon';
update candidates set photo_url = '/candidates/francois-ruffin.jpg' where slug = 'francois-ruffin';
update candidates set photo_url = '/candidates/marine-tondelier.jpg' where slug = 'marine-tondelier';
update candidates set photo_url = '/candidates/raphael-glucksmann.jpg' where slug = 'raphael-glucksmann';
update candidates set photo_url = '/candidates/gabriel-attal.jpg' where slug = 'gabriel-attal';
update candidates set photo_url = '/candidates/edouard-philippe.jpg' where slug = 'edouard-philippe';
update candidates set photo_url = '/candidates/xavier-bertrand.jpg' where slug = 'xavier-bertrand';
update candidates set photo_url = '/candidates/bruno-retailleau.jpg' where slug = 'bruno-retailleau';
update candidates set photo_url = '/candidates/marine-le-pen.jpg' where slug = 'marine-le-pen';
