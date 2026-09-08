import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Attention : dès qu'un motif est déclaré, Next.js 16 refuse toute image
    // locale qui n'en respecte aucun. Les deux entrées sont donc nécessaires
    // — la seconde rétablit ce qui était permis par défaut.
    localPatterns: [
      // Photos de candidats : elles seules portent une chaîne de requête, le
      // `?v=<horodatage>` que queries.ts ajoute en développement pour qu'un
      // remplacement de fichier soit visible tout de suite (voir
      // withDevPhotoCacheBust). Omettre `search` l'autorise ici.
      { pathname: "/candidates/**" },
      // Le reste des images de public/ — logo compris. `search: ""` interdit
      // toute chaîne de requête, la forme stricte recommandée par Next.
      { pathname: "/**", search: "" },
    ],
  },
};

export default nextConfig;
