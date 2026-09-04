export type EntityKey = "themes" | "parties" | "candidats" | "propositions" | "questions" | "positions";

export type FieldType = "text" | "textarea" | "number" | "url" | "date" | "select" | "boolean";

export interface EntityField {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  /** For "select" fields: name of the entity to resolve options from. */
  relation?: EntityKey;
  /** For "select" fields with a fixed, small option set. */
  options?: { value: string; label: string }[];
  help?: string;
}

export interface EntityConfig {
  key: EntityKey;
  table: string;
  label: string;
  labelPlural: string;
  titleField: string;
  fields: EntityField[];
}

export const ENTITIES: Record<EntityKey, EntityConfig> = {
  themes: {
    key: "themes",
    table: "themes",
    label: "Thème",
    labelPlural: "Thèmes",
    titleField: "name",
    fields: [
      { name: "name", label: "Nom", type: "text", required: true },
      { name: "slug", label: "Slug (URL)", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "icon", label: "Icône (lucide, ex: leaf)", type: "text" },
      { name: "order_index", label: "Ordre d'affichage", type: "number" },
    ],
  },
  parties: {
    key: "parties",
    table: "parties",
    label: "Parti",
    labelPlural: "Partis",
    titleField: "name",
    fields: [
      { name: "name", label: "Nom", type: "text", required: true },
      { name: "short_name", label: "Sigle", type: "text" },
      {
        name: "orientation",
        label: "Orientation",
        type: "select",
        options: [
          { value: "gauche", label: "Gauche" },
          { value: "centre-gauche", label: "Centre gauche" },
          { value: "centre", label: "Centre" },
          { value: "centre-droit", label: "Centre droit" },
          { value: "droite", label: "Droite" },
          { value: "extreme-gauche", label: "Extrême gauche" },
          { value: "extreme-droite", label: "Extrême droite" },
          { value: "non-partisan", label: "Non partisan" },
        ],
      },
      { name: "color", label: "Couleur (hex)", type: "text" },
    ],
  },
  candidats: {
    key: "candidats",
    table: "candidates",
    label: "Candidat",
    labelPlural: "Candidats",
    titleField: "name",
    fields: [
      { name: "name", label: "Nom", type: "text", required: true },
      { name: "slug", label: "Slug (URL)", type: "text", required: true },
      { name: "party_id", label: "Parti", type: "select", relation: "parties" },
      { name: "biography", label: "Biographie", type: "textarea" },
      { name: "official_website", label: "Site officiel", type: "url" },
      { name: "photo_url", label: "Photo (URL)", type: "url" },
      { name: "order_index", label: "Ordre d'affichage", type: "number" },
    ],
  },
  propositions: {
    key: "propositions",
    table: "proposals",
    label: "Proposition",
    labelPlural: "Propositions",
    titleField: "title",
    fields: [
      { name: "candidate_id", label: "Candidat", type: "select", relation: "candidats", required: true },
      { name: "theme_id", label: "Thème", type: "select", relation: "themes", required: true },
      { name: "title", label: "Titre", type: "text", required: true },
      { name: "summary", label: "Résumé court", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "source_name", label: "Nom de la source", type: "text" },
      { name: "source_url", label: "URL de la source", type: "url", required: true },
      { name: "published_at", label: "Date de publication", type: "date" },
      { name: "verified_at", label: "Date de vérification", type: "date" },
      {
        name: "tags",
        label: "Tags (séparés par des virgules)",
        type: "text",
        help: "Ex. « SMIC, Prix » — alimente les filtres de la page thème.",
      },
      {
        name: "status",
        label: "Statut",
        type: "select",
        options: [
          { value: "annonce", label: "Annonce" },
          { value: "proposition_officielle", label: "Proposition officielle" },
          { value: "programme", label: "Programme" },
          { value: "precision_ulterieure", label: "Précision apportée ultérieurement" },
        ],
      },
    ],
  },
  questions: {
    key: "questions",
    table: "questions",
    label: "Question",
    labelPlural: "Questions du Match",
    titleField: "question",
    fields: [
      { name: "question", label: "Question", type: "text", required: true },
      { name: "theme_id", label: "Thème", type: "select", relation: "themes", required: true },
      { name: "description", label: "Précision (optionnelle)", type: "textarea" },
      {
        name: "answer_type",
        label: "Type de réponse",
        type: "select",
        options: [
          { value: "likert", label: "Échelle d'accord (5 niveaux)" },
          { value: "choice", label: "Choix multiples" },
        ],
      },
      { name: "weight", label: "Poids", type: "number", help: "1 par défaut, plus si structurante." },
      { name: "order_index", label: "Ordre d'affichage", type: "number" },
    ],
  },
  positions: {
    key: "positions",
    table: "candidate_positions",
    label: "Position",
    labelPlural: "Positions des candidats",
    titleField: "id",
    fields: [
      { name: "candidate_id", label: "Candidat", type: "select", relation: "candidats", required: true },
      { name: "question_id", label: "Question", type: "select", relation: "questions", required: true },
      {
        name: "score",
        label: "Position (-2 à 2, vide = non renseignée)",
        type: "number",
      },
      { name: "explanation", label: "Explication courte", type: "textarea" },
      { name: "source_url", label: "URL de la source", type: "url" },
    ],
  },
};

export const ENTITY_KEYS = Object.keys(ENTITIES) as EntityKey[];
