import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ThemePageClient } from "@/components/themes/theme-page-client";
import { getCandidates, getProposals, getThemeBySlug, getThemes } from "@/lib/data/queries";

export async function generateStaticParams() {
  const themes = await getThemes();
  return themes.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const theme = await getThemeBySlug(slug);
  if (!theme) return {};
  return { title: theme.name, description: theme.description };
}

export default async function ThemePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const theme = await getThemeBySlug(slug);
  if (!theme) notFound();

  const [candidates, proposals] = await Promise.all([getCandidates(), getProposals()]);
  const themeProposals = proposals.filter((p) => p.theme_id === theme.id);

  return <ThemePageClient theme={theme} candidates={candidates} proposals={themeProposals} />;
}
