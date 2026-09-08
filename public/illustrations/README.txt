Illustrations du site. Dépose simplement un fichier au chemin attendu : il
apparaît sans aucune modification de code.

--- Page d'accueil (déjà en place) ---

hero.png          Aquarelle du premier écran MOBILE. Format portrait,
                  sujet à droite, moitié gauche laissée vide pour le texte.
hero_deskop.png   Version DESKTOP, image miroir : sujet à gauche, vide à
                  droite. Affichée collée au bord gauche de la fenêtre.

Ces deux-là passent par un import statique : leur URL porte un hash du
contenu, donc remplacer le fichier suffit à voir le changement.

--- Questionnaire du Match (/match) ---

Ces trois images passent aussi par un import statique : elles sont donc
converties et redimensionnées automatiquement, et leur URL porte un hash
du contenu. Remplacer un fichier suffit à voir le changement.

Attention : elles sont désormais REQUISES au build. Ne les supprime pas
sans retirer aussi leur import dans
src/components/match/questionnaire.tsx.

Fond transparent recommandé (PNG), le décor de la page étant crème.

match-side-left.png    Grande scène décorative, colonne de GAUCHE.
                       Visible à partir de 1024 px de large.
                       Occupe 26 % de la largeur de la fenêtre (max 420 px),
                       calée en bas. Prévoir un format portrait.

match-side-right.png   Décor de la colonne de DROITE (feuillage).
                       Visible à partir de 1280 px de large.
                       Occupe 16 % de la largeur (max 260 px), calé en bas.

match-question.png     Petite vignette en haut à droite de la carte de
                       question. Affichée en 112 × 80 px, visible à partir
                       de 640 px. Prévoir un rapport largeur/hauteur proche
                       de 1,4 pour éviter les bandes vides.

Le poids du fichier source importe peu : l'optimiseur le ramène à quelques
dizaines de Ko en WebP. Inutile de compresser avant de déposer.

--- Page Candidats (/candidats) — OPTIONNEL ---

candidates-header.png   Illustration décorative en haut à droite de la page.
                        Affichée en 208 × 112 px, visible à partir de
                        1280 px de large.

Celle-ci est chargée en fond CSS : tant que le fichier n'existe pas, rien
ne s'affiche. Elle n'est donc PAS requise au build — mais elle n'est pas
non plus optimisée : compresse-la avant de la déposer (moins de 150 Ko).

--- Page Faisabilité & impact (/passage-au-reel) — OPTIONNEL ---

passage-au-reel-header.png   Aquarelle décorative posée sur le bandeau de
                             lecture, à droite du titre. Affichée dans une boîte
                             de 416 × 208 px (rapport 2:1), calée en bas à droite,
                             visible à partir de 1280 px de large. Format
                             paysage, sujet posé sur la ligne du bas.

Comme celle de la page Candidats : fond CSS, donc pas requise au build, mais
pas optimisée non plus — compresse-la avant de la déposer (moins de 150 Ko).

--- Logo du site --- 

logo.png          Logo affiché dans l'en-tête et le pied de page.
                  Affiché en 32 px de haut, la largeur suit le rapport
                  du fichier. (Comme tous les chemins de ce fichier,
                  relatif à public/illustrations/.)

Fond TRANSPARENT indispensable : sur la page d'accueil, l'en-tête est
transparent et laisse passer l'aquarelle — un fond blanc y ferait un
rectangle visible.

Prévoir au moins 2x la taille d'affichage pour les écrans Retina, soit
environ 64 px de haut. Un fichier plus grand ne coûte rien : il passe
par l'optimiseur de Next et sort en WebP.

Tant que le fichier n'est pas déposé, l'en-tête affiche le nom du site
composé en sérif, comme avant — rien ne casse.
