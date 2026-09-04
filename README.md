# Poliscope

Comprenez les programmes. Comparez les candidats. Faites-vous votre propre opinion.

Poliscope est une plateforme indépendante et non partisane pour comprendre les
programmes de l'élection présidentielle française de 2027 (premier tour le
18 avril, second tour le 2 mai), comparer les candidats et découvrir quels
programmes correspondent le plus à ses propres positions politiques. Le nom
est provisoire ; les candidats et leurs propositions sont réels et sourcés —
voir [Candidats et sources](#candidats-et-sources).

Construite pour survivre à 2027 : le modèle de données (élections, candidats,
thèmes, questions, propositions, sondages) est générique et pourra servir aux
législatives, municipales et européennes suivantes.

## Fonctionnalités (V1)

- **Mon Match** (`/match`) — questionnaire de 18 questions, sans compte, dont
  les réponses restent dans le navigateur (`localStorage`) et ne sont jamais
  envoyées à un serveur.
- **Résultats** (`/match/resultats`) — classement de compatibilité, points
  d'accord/désaccord, partage (scores uniquement, jamais les réponses).
- **Candidats** (`/candidats`, `/candidats/[slug]`) — fiches avec biographie,
  propositions sourcées classées par thème, statut de chaque proposition.
- **Comparateur** (`/comparer`, `/comparer/[a]-vs-[b]`) — comparaison thème par
  thème avec un filtre « Voir uniquement leurs différences ».
- **Thèmes** (`/themes/[slug]`) — vue transversale d'un thème pour tous les
  candidats.
- **Méthodologie** (`/methodologie`) et **Confidentialité** (`/confidentialite`).
- **Sondages** (`/sondages`) — structure complète (institut, commanditaire,
  méthode, échantillon, courbe d'évolution) ; volontairement vide par défaut
  tant qu'aucun sondage réel et sourcé n'a été ajouté (voir plus bas).
- **Simulateur d'impact** (`/simulateur`) — structure prête, marquée « Bientôt
  disponible » comme demandé pour la V1.
- **Administration** (`/admin`) — CRUD générique (candidats, partis, thèmes,
  questions, positions, propositions) protégé par mot de passe, pour mettre à
  jour le contenu sans toucher au code une fois Supabase connecté.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 ·
composants maison dans le style shadcn/ui · Supabase (Postgres) · Recharts ·
Framer Motion.

## Comment ça marche sans base de données

Poliscope fonctionne **immédiatement**, sans aucune configuration : toutes les
lectures passent par `src/lib/data/queries.ts`, qui interroge Supabase si les
variables d'environnement sont présentes, et retombe sinon sur le jeu de
données typé dans `src/lib/data/local/` — qui contient les vraies données
(candidats, propositions sourcées) décrites plus bas, pas des données
fictives. C'est ce même jeu de données qui est exporté vers
`supabase/seed.sql` (voir plus bas), donc le comportement est identique en
local et avec une vraie base.

## Démarrage

```bash
npm install
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000). Tout fonctionne sans
`.env.local` : candidats, Match, comparateur, sondages. Seule
l'administration nécessite Supabase pour enregistrer des modifications (elle
reste consultable en lecture seule sans configuration).

### Connecter Supabase (optionnel, recommandé en production)

1. Créez un projet sur [supabase.com](https://supabase.com).
2. Copiez `.env.example` vers `.env.local` et renseignez les clés du projet
   (Project Settings → API) ainsi qu'un `ADMIN_PASSWORD` et un
   `ADMIN_SESSION_SECRET` (`openssl rand -hex 32`).
3. Appliquez le schéma :
   ```bash
   supabase link --project-ref <votre-ref>
   supabase db push        # applique supabase/migrations/0001_init.sql
   ```
4. Chargez les données de démonstration (facultatif) :
   ```bash
   psql "$DATABASE_URL" -f supabase/seed.sql
   ```
5. Redémarrez `npm run dev` — le site lit désormais Supabase, et
   `/admin` peut enregistrer des modifications.

Pour régénérer `supabase/seed.sql` après une modification du jeu de données de
démonstration (`src/lib/data/local/`) :

```bash
npm run db:seed:export
```

## Structure du projet

```
src/
  app/                  Routes (App Router)
    match/              Questionnaire + résultats
    candidats/          Liste + fiche candidat
    comparer/           Sélecteur + comparaison a-vs-b
    themes/[slug]/      Vue transversale par thème
    sondages/           Sondages (vide par défaut, structure prête)
    simulateur/         Bientôt disponible
    admin/              Back-office protégé
    api/match-data/     Données publiques (candidats, positions, questions)
                        utilisées pour scorer le Match côté client
  components/           UI (ui/, layout/, home/, match/, results/,
                        candidates/, compare/, polls/, admin/)
  lib/
    types.ts            Types du domaine (miroir du schéma SQL)
    scoring.ts           Algorithme de compatibilité (pur, testable)
    match-storage.ts     Persistance locale des réponses (localStorage)
    compare.ts            Similarité thème par thème pour le comparateur
    data/
      queries.ts          Couche d'accès aux données (Supabase → fallback local)
      local/               Jeu de données typé (candidats réels et sourcés)
    admin/                 Auth, config des entités, accès données admin
    supabase/               Clients Supabase (browser, server, admin)
  proxy.ts                Protège /admin (anciennement middleware.ts)
supabase/
  migrations/0001_init.sql Schéma complet (tables, contraintes, RLS)
  seed.sql                  Données réelles (généré depuis local/, voir ci-dessus)
scripts/export-seed.ts       Génère supabase/seed.sql depuis les données locales
```

## Algorithme de compatibilité

Documenté en détail sur `/methodologie`. En résumé : chaque réponse et chaque
position candidate sont sur une échelle -2..+2 ; la similarité par question
est `1 − |réponse − position| / 4` ; le score final est la moyenne pondérée
des similarités sur les questions **auxquelles vous avez répondu et pour
lesquelles le candidat a une position documentée**. Une position non
documentée n'est jamais devinée : elle est exclue du calcul et affichée comme
« Position non renseignée ». Le site n'affiche jamais de recommandation de
vote, uniquement une proximité entre vos réponses et des positions publiques
sourcées.

## Confidentialité

- Aucun compte, aucun nom, aucun email requis pour le Match.
- Les réponses ne sont jamais envoyées à un serveur ; elles vivent dans le
  `localStorage` du navigateur et le score est calculé côté client
  (`src/lib/scoring.ts`, appelé depuis `/match/resultats`).
- Le partage de résultats ne transmet que des scores agrégés, jamais le détail
  des réponses, et seulement sur action explicite de l'utilisateur.
- La newsletter (table `newsletter_subscribers`) est totalement indépendante
  du Match : aucune jointure entre un email et des réponses politiques.

Voir `/confidentialite` pour la version destinée aux visiteurs.

## Candidats et sources

Poliscope couvre neuf des principales figures déclarées à la présidentielle
2027 (sur un total de 25+ candidatures annoncées au 3 septembre 2026, un
champ qui continue d'évoluer) : Jean-Luc Mélenchon, François Ruffin, Marine
Tondelier, Raphaël Glucksmann, Gabriel Attal, Édouard Philippe, Xavier
Bertrand, Bruno Retailleau et Marine Le Pen. Ce n'est ni une liste officielle
ni un jugement sur qui « compte » — c'est un premier périmètre couvrant tout
l'échiquier politique, à étendre.

**Chaque biographie et chaque proposition provient d'une source réelle et
nommée** (site de campagne officiel, site d'un parti, ou média identifiable),
avec sa date de publication — voir `source_name` / `source_url` /
`published_at` sur chaque fiche candidat et dans
`src/lib/data/local/proposals.ts`. Aucune position n'est devinée : quand
aucune source fiable n'a été trouvée pour un candidat sur un thème donné (ou
sur une question du Match), ce thème est simplement absent de sa fiche —
affiché comme « Position non renseignée » — plutôt que rempli par une
estimation. C'est pourquoi la couverture est volontairement inégale d'un
candidat à l'autre : elle reflète ce que chacun a réellement rendu public,
pas un choix éditorial.

**Ce jeu de données est un instantané, pas une vérité figée.** Les
candidatures, programmes et sondages évoluent en continu jusqu'à la
publication de la liste officielle par le Conseil constitutionnel, peu avant
le premier tour. Pour l'étendre ou le corriger :

- via `/admin` une fois Supabase connecté (ajout de candidats, propositions,
  positions, sans toucher au code) ;
- ou en modifiant `src/lib/data/local/*.ts` puis en relançant
  `npm run db:seed:export`.

Dans les deux cas, la même règle s'applique : pas de proposition sans source
vérifiable et datée.

Le module Sondages (`/sondages`) est volontairement vide par défaut pour la
même raison : afficher un chiffre à côté du nom d'un candidat réel sans
institut ni méthode identifiés serait trompeur. Il se remplit uniquement via
de vrais sondages sourcés (table `polls` / `poll_results`).

## Déploiement (Vercel)

1. Poussez le dépôt sur GitHub.
2. Importez-le sur [vercel.com](https://vercel.com).
3. Renseignez les variables d'environnement de `.env.example` dans les
   réglages du projet Vercel (mêmes valeurs qu'en local).
4. Déployez — le build (`next build`) est vérifié en TypeScript strict.

## Scripts

```bash
npm run dev             # serveur de développement
npm run build            # build de production (vérifie TypeScript)
npm run start             # sert le build de production
npm run lint               # ESLint
npm run db:seed:export      # régénère supabase/seed.sql depuis les données locales
```

## Feuille de route

- Simulateur d'impact économique (structure en place, calculs à venir).
- Sondages : brancher une source réelle (import manuel via `/admin` ou flux
  automatisé depuis un institut) pour peupler le module, actuellement vide.
- Étendre la couverture aux ~15 autres candidats déclarés, et maintenir les
  positions/propositions à jour à mesure que les programmes se précisent.
- Authentification multi-admin (actuellement : mot de passe unique via
  cookie signé — largement suffisant pour une V1, à remplacer par Supabase
  Auth + rôles si plusieurs personnes doivent éditer le contenu).
- Extension du modèle de données à d'autres scrutins (législatives,
  municipales, européennes) : la table `elections` est déjà prévue pour ça.
