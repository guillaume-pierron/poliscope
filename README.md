# Poliscope

Comprenez les programmes. Comparez les candidats. Faites-vous votre propre opinion.

Poliscope est une plateforme indépendante et non partisane pour comprendre les
programmes de l'élection présidentielle française de 2027, comparer les
candidats et découvrir quels programmes correspondent le plus à ses propres
positions politiques. Le nom, les candidats et les données de cette version
sont **de démonstration** — voir [Données de démonstration](#données-de-démonstration).

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
  méthode, échantillon, courbe d'évolution) avec données de démonstration.
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
données de démonstration typé dans `src/lib/data/local/`. C'est le même jeu de
données qui est exporté vers `supabase/seed.sql` (voir plus bas), donc le
comportement est identique en local et avec une vraie base.

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
    sondages/           Sondages (démonstration)
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
      local/               Jeu de données de démonstration typé
    admin/                 Auth, config des entités, accès données admin
    supabase/               Clients Supabase (browser, server, admin)
  proxy.ts                Protège /admin (anciennement middleware.ts)
supabase/
  migrations/0001_init.sql Schéma complet (tables, contraintes, RLS)
  seed.sql                  Données de démonstration (généré, voir ci-dessus)
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

## Données de démonstration

Les cinq candidats (Camille Martin, Alexandre Leroy, Sarah Moreau, Thomas
Bernard, Nina Laurent), leurs partis et toutes leurs propositions sont
**fictifs**, créés uniquement pour donner corps à l'application. Chaque
proposition de démonstration est marquée comme telle et pointe vers une source
factice (`example.org`). Aucune déclaration réelle n'a été attribuée à une
personne réelle. Avant toute mise en production, ce jeu de données doit être
remplacé par des candidats et des sources réelles, vérifiées et datées (voir
la structure `proposals` / `candidate_positions` dans
`supabase/migrations/0001_init.sql`).

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
- Sondages : brancher un import automatisé plutôt que des données de
  démonstration.
- Authentification multi-admin (actuellement : mot de passe unique via
  cookie signé — largement suffisant pour une V1, à remplacer par Supabase
  Auth + rôles si plusieurs personnes doivent éditer le contenu).
- Extension du modèle de données à d'autres scrutins (législatives,
  municipales, européennes) : la table `elections` est déjà prévue pour ça.
