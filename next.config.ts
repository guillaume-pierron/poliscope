import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      // Autorise le paramètre `?v=<horodatage>` que queries.ts ajoute en
      // développement aux photos de candidats, pour que remplacer un fichier
      // dans public/candidates/ soit visible immédiatement (voir
      // withDevPhotoCacheBust). Sans `search`, Next.js 16 refuse par défaut
      // toute chaîne de requête sur une image locale (anti-énumération) ;
      // omettre `search` ici l'autorise pour ce préfixe précisément — jamais
      // pour le reste du site.
      { pathname: "/candidates/**" },
    ],
  },
};

export default nextConfig;
