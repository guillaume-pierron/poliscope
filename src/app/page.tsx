import { Hero } from "@/components/home/hero";
import { ToolsSection } from "@/components/home/tools-section";
import { MatchDemoSection } from "@/components/home/match-demo-section";
import { ThemesSection } from "@/components/home/themes-section";
import { getCandidates, getThemes } from "@/lib/data/queries";

export default async function HomePage() {
  const [candidates, themes] = await Promise.all([getCandidates(), getThemes()]);

  return (
    <>
      <Hero candidates={candidates} />
      <ToolsSection />
      <MatchDemoSection />
      <ThemesSection themes={themes} />
    </>
  );
}
