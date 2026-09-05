import { Hero } from "@/components/home/hero";
import { ToolsSection } from "@/components/home/tools-section";
import { TodayGrid, type UpdateItem } from "@/components/home/today-grid";
import { ThemesSection } from "@/components/home/themes-section";
import {
  getAllPositions,
  getCandidates,
  getHomeHeadlinePoll,
  getProposals,
  getQuestions,
  getThemes,
} from "@/lib/data/queries";
import { themeSimilarity, verdictFromSimilarity } from "@/lib/compare";
import { computeImpacts } from "@/lib/simulator/measures";
import { DEFAULT_PROFILE } from "@/lib/simulator/types";

export default async function HomePage() {
  const [candidates, themes, proposals, headline, questions, positions] = await Promise.all([
    getCandidates(),
    getThemes(),
    getProposals(),
    getHomeHeadlinePoll(),
    getQuestions(),
    getAllPositions(),
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

  // Aperçu du Comparateur : deux candidats réels, positions réellement
  // documentées — jamais un score inventé. On retient le premier désaccord
  // net et le premier point de convergence trouvés parmi les thèmes.
  const compareA = candidates.find((c) => c.slug === "francois-ruffin");
  const compareB = candidates.find((c) => c.slug === "marine-tondelier");
  const compareRows = (compareA && compareB
    ? themes.map((theme) => ({
        theme,
        verdict: verdictFromSimilarity(
          themeSimilarity(theme.id, compareA.id, compareB.id, questions, positions)
        ),
      }))
    : []
  ).filter((r) => r.verdict !== "inconnu");
  const compareAgreement = compareRows.find((r) => r.verdict === "accord");
  const compareDisagreement = compareRows.find((r) => r.verdict === "desaccord");

  // Aperçu du Simulateur : mesures réellement calculées pour le profil par
  // défaut (2000€ net, célibataire, locataire, véhiculé) — jamais un
  // montant estimé à la louche.
  const impacts = computeImpacts(DEFAULT_PROFILE, candidates.map((c) => c.slug));
  const simulatorSummary = impacts.reduce(
    (acc, impact) => ({
      concernCount: acc.concernCount + impact.quantified.length + impact.unquantified.length,
      quantifiedCount: acc.quantifiedCount + impact.quantified.length,
      totalEuro: acc.totalEuro + impact.quantifiedMonthlyTotal,
    }),
    { concernCount: 0, quantifiedCount: 0, totalEuro: 0 }
  );

  return (
    <>
      <Hero candidates={candidates} headline={headline} />
      <TodayGrid
        candidateCount={candidates.length}
        proposalCount={proposals.length}
        updates={updates}
      />
      <ThemesSection themes={themes} />
      <ToolsSection
        questionCount={questions.length}
        proposalCount={proposals.length}
        headline={headline}
        candidates={candidates}
        compareCandidates={compareA && compareB ? { a: compareA, b: compareB } : null}
        compareAgreement={compareAgreement ?? null}
        compareDisagreement={compareDisagreement ?? null}
        simulatorSummary={simulatorSummary}
      />
    </>
  );
}
