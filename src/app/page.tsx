import { Hero } from "@/components/home/hero";
import { ToolsSection } from "@/components/home/tools-section";
import { ThemesSection } from "@/components/home/themes-section";
import { TrustLine } from "@/components/home/trust-line";
import {
  getAllPositions,
  getCandidates,
  getHomeHeadlinePoll,
  getProposals,
  getPublishedMeasureAnalysisBundles,
  getQuestions,
  getThemes,
} from "@/lib/data/queries";
import { themeSimilarity, verdictFromSimilarity } from "@/lib/compare";
import { computeImpacts } from "@/lib/simulator/measures";
import { DEFAULT_PROFILE } from "@/lib/simulator/types";

export default async function HomePage() {
  const [candidates, themes, proposals, headline, questions, positions, analysisBundles] =
    await Promise.all([
      getCandidates(),
      getThemes(),
      getProposals(),
      getHomeHeadlinePoll(),
      getQuestions(),
      getAllPositions(),
      getPublishedMeasureAnalysisBundles(),
    ]);

  // Compteur de propositions par thème pour les pills "Les sujets qui
  // comptent" — dérivé des propositions déjà chargées pour la page (même
  // décompte que la page thème elle-même), jamais une requête par thème.
  const proposalCountByTheme: Record<string, number> = {};
  for (const proposal of proposals) {
    proposalCountByTheme[proposal.theme_id] = (proposalCountByTheme[proposal.theme_id] ?? 0) + 1;
  }

  // Aperçu du Comparateur : deux candidats réels, positions réellement
  // documentées — jamais un score inventé. On retient le premier désaccord
  // net et le premier point de convergence trouvés parmi les thèmes. Cette
  // paire est choisie pour avoir plusieurs thèmes réellement comparables
  // (accords ET désaccords) dans les données actuelles — voir /comparer
  // pour changer de candidats.
  const compareA = candidates.find((c) => c.slug === "jean-luc-melenchon");
  const compareB = candidates.find((c) => c.slug === "bruno-retailleau");
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
      <Hero candidates={candidates} headline={headline} questionCount={questions.length} />
      <TrustLine proposalCount={proposals.length} candidateCount={candidates.length} />
      {/* "Ce que vous pouvez faire ici" avant "explorez par thème" : un
          visiteur qui découvre le site a besoin de comprendre l'outil avant
          qu'on lui propose de naviguer par sujet. */}
      <ToolsSection
        questionCount={questions.length}
        proposalCount={proposals.length}
        headline={headline}
        candidates={candidates}
        compareCandidates={compareA && compareB ? { a: compareA, b: compareB } : null}
        compareAgreement={compareAgreement ?? null}
        compareDisagreement={compareDisagreement ?? null}
        simulatorSummary={simulatorSummary}
        analysisCount={analysisBundles.length}
      />
      <ThemesSection themes={themes} proposalCounts={proposalCountByTheme} />
    </>
  );
}
