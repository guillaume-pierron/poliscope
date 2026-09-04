import { Hero } from "@/components/home/hero";
import { ToolsSection } from "@/components/home/tools-section";
import { TodayGrid, type UpdateItem } from "@/components/home/today-grid";
import { ThemesSection } from "@/components/home/themes-section";
import { getCandidates, getHomeHeadlinePoll, getProposals, getThemes } from "@/lib/data/queries";

export default async function HomePage() {
  const [candidates, themes, proposals, headline] = await Promise.all([
    getCandidates(),
    getThemes(),
    getProposals(),
    getHomeHeadlinePoll(),
  ]);

  const updates: UpdateItem[] = [...proposals]
    .filter((p) => p.published_at)
    .sort((a, b) => (a.published_at! < b.published_at! ? 1 : -1))
    .slice(0, 3)
    .map((proposal) => {
      const candidate = candidates.find((c) => c.id === proposal.candidate_id);
      const theme = themes.find((t) => t.id === proposal.theme_id);
      return {
        id: proposal.id,
        title: proposal.title,
        dateLabel: new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" }).format(
          new Date(proposal.published_at!)
        ),
        themeIcon: theme?.icon ?? "globe",
        href: candidate ? `/candidats/${candidate.slug}` : "/candidats",
      };
    });

  return (
    <>
      <Hero candidates={candidates} headline={headline} />
      <TodayGrid
        candidateCount={candidates.length}
        proposalCount={proposals.length}
        updates={updates}
      />
      <ThemesSection themes={themes} />
      <ToolsSection />
    </>
  );
}
