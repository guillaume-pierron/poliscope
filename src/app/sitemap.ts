import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getCandidates, getThemes } from "@/lib/data/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [candidates, themes] = await Promise.all([getCandidates(), getThemes()]);

  const staticRoutes = [
    "",
    "/match",
    "/candidats",
    "/comparer",
    "/sondages",
    "/simulateur",
    "/actualites",
    "/methodologie",
    "/confidentialite",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));

  const candidateRoutes = candidates.map((c) => ({
    url: `${SITE_URL}/candidats/${c.slug}`,
    lastModified: new Date(),
  }));

  const themeRoutes = themes.map((t) => ({
    url: `${SITE_URL}/themes/${t.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...candidateRoutes, ...themeRoutes];
}
