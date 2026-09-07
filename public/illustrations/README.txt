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
