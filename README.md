# Branche `automation/polls-inbox`

Cette branche est un simple point de dépôt pour l'ingestion automatisée des
sondages de Poliscope. Elle n'est jamais fusionnée dans `main` et ne contient
aucun code applicatif.

**Fonctionnement :**
1. Une routine cloud programmée (Claude) cherche chaque semaine les sondages
   réels et sourcés de la présidentielle 2027, et dépose un fichier JSON par
   sondage trouvé dans `data/polls-inbox/`, puis pousse sur cette branche.
   Ce fichier ne contient **aucun secret**.
2. Le push déclenche `.github/workflows/ingest-polls.yml`, qui lit chaque
   fichier et l'envoie à la fonction Supabase `submit_poll_data` via l'API
   REST — c'est cette étape (exécutée par GitHub, pas par l'agent cloud) qui
   ajoute le jeton d'authentification, stocké uniquement comme secret du
   dépôt (jamais commité).
3. La fonction Supabase gère elle-même les doublons (un sondage déjà soumis
   pour le même institut/mêmes dates met à jour la ligne existante).

**Secrets requis côté GitHub** (Settings → Secrets and variables → Actions) :
`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `POLLS_AUTOMATION_TOKEN`.

Format attendu d'un fichier dans `data/polls-inbox/` :

```json
{
  "institute": "Ifop",
  "sponsor": "Le Figaro",
  "field_start": "2026-09-01",
  "field_end": "2026-09-02",
  "sample_size": 1500,
  "method": "Échantillon représentatif interrogé en ligne, méthode des quotas",
  "round": "premier_tour",
  "published_at": "2026-09-03",
  "results": [
    { "candidate_slug": "marine-le-pen", "value": 28, "low": 26, "high": 30 }
  ]
}
```
