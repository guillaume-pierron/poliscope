import { calculateChoiceSimilarity, calculateLikertSimilarity } from "@/lib/scoring";
import type { CandidatePosition, Proposal, Question, Theme } from "@/lib/types";

export type ThemeVerdict = "accord" | "desaccord" | "nuance" | "inconnu";

/**
 * Average similarity between two candidates for a given theme, computed
 * from the Match question bank — the only quantitative signal we have,
 * likert and choice questions alike (never a "priority" question, which
 * never has a candidate position to compare). Returns null when neither
 * candidate has a documented, shared question for that theme — in that
 * case the UI treats it as "unknown" rather than guessing similarity from
 * free-text proposals.
 */
export function themeSimilarity(
  themeId: string,
  candidateAId: string,
  candidateBId: string,
  questions: Question[],
  positions: CandidatePosition[]
): number | null {
  const themeQuestions = questions.filter((q) => q.theme_id === themeId && q.answer_type !== "priority");
  if (themeQuestions.length === 0) return null;

  let sum = 0;
  let count = 0;
  for (const q of themeQuestions) {
    const posA = positions.find((p) => p.question_id === q.id && p.candidate_id === candidateAId);
    const posB = positions.find((p) => p.question_id === q.id && p.candidate_id === candidateBId);
    if (!posA || !posB) continue;

    if (q.answer_type === "likert") {
      if (posA.numeric_score === null || posB.numeric_score === null) continue;
      sum += calculateLikertSimilarity(posA.numeric_score, posB.numeric_score);
      count += 1;
    } else {
      if (posA.option_id === null || posB.option_id === null) continue;
      sum += calculateChoiceSimilarity(posA.option_id, posB.option_id, q.compatibility);
      count += 1;
    }
  }

  return count > 0 ? sum / count : null;
}

export function verdictFromSimilarity(similarity: number | null): ThemeVerdict {
  if (similarity === null) return "inconnu";
  if (similarity >= 0.75) return "accord";
  if (similarity <= 0.35) return "desaccord";
  return "nuance";
}

export const VERDICT_LABELS: Record<ThemeVerdict, string> = {
  accord: "Positions proches",
  desaccord: "Positions opposées",
  nuance: "Positions nuancées",
  inconnu: "Non comparable",
};

/* ------------------------------------------------------------------------ *
 *  Comparaison sujet par sujet
 *
 *  Le verdict d'un thème se calcule sur les questions du Match, alors que la
 *  page montrait à côté des propositions en texte libre : deux sources de
 *  données différentes, présentées comme si l'une expliquait l'autre. Les
 *  fonctions ci-dessous descendent d'un cran, à la question, où la position
 *  de chaque candidat et le verdict portent enfin sur la même chose.
 * ------------------------------------------------------------------------ */

/** Une position n'est exploitable que si elle porte réellement une valeur. */
export function isDocumented(position: CandidatePosition | undefined): position is CandidatePosition {
  return !!position && (position.numeric_score !== null || position.option_id !== null);
}

export interface SubjectComparison {
  question: Question;
  /** `null` quand ce candidat n'a pas de position documentée sur la question. */
  positionA: CandidatePosition | null;
  positionB: CandidatePosition | null;
  /** `null` dès qu'il manque une des deux positions — jamais une similarité devinée. */
  similarity: number | null;
  verdict: ThemeVerdict;
}

export function compareSubject(
  question: Question,
  positions: CandidatePosition[],
  candidateAId: string,
  candidateBId: string
): SubjectComparison {
  const rawA = positions.find((p) => p.question_id === question.id && p.candidate_id === candidateAId);
  const rawB = positions.find((p) => p.question_id === question.id && p.candidate_id === candidateBId);
  const positionA = isDocumented(rawA) ? rawA : null;
  const positionB = isDocumented(rawB) ? rawB : null;

  let similarity: number | null = null;
  if (positionA && positionB) {
    if (question.answer_type === "likert") {
      if (positionA.numeric_score !== null && positionB.numeric_score !== null) {
        similarity = calculateLikertSimilarity(positionA.numeric_score, positionB.numeric_score);
      }
    } else if (positionA.option_id !== null && positionB.option_id !== null) {
      similarity = calculateChoiceSimilarity(positionA.option_id, positionB.option_id, question.compatibility);
    }
  }

  return {
    question,
    positionA,
    positionB,
    similarity,
    verdict: verdictFromSimilarity(similarity),
  };
}

export interface ThemeComparison {
  theme: Theme;
  /** Sujets du Match rattachés à ce thème, comparables ou non. */
  subjects: SubjectComparison[];
  /** Sujets où les deux candidats ont une position documentée. */
  comparableCount: number;
  proposalsA: Proposal[];
  proposalsB: Proposal[];
}

/**
 * Un bloc par thème. Les questions "priority" sont exclues : elles n'ont
 * jamais de position candidat, elles pondèrent seulement le Match du
 * visiteur (voir lib/types.ts).
 */
export function buildThemeComparisons(
  themes: Theme[],
  questions: Question[],
  positions: CandidatePosition[],
  proposalsA: Proposal[],
  proposalsB: Proposal[],
  candidateAId: string,
  candidateBId: string
): ThemeComparison[] {
  return themes
    .map((theme) => {
      const subjects = questions
        .filter((q) => q.theme_id === theme.id && q.answer_type !== "priority")
        .map((q) => compareSubject(q, positions, candidateAId, candidateBId));

      return {
        theme,
        subjects,
        comparableCount: subjects.filter((s) => s.similarity !== null).length,
        proposalsA: proposalsA.filter((p) => p.theme_id === theme.id),
        proposalsB: proposalsB.filter((p) => p.theme_id === theme.id),
      };
    })
    .filter(
      (block) =>
        block.subjects.length > 0 || block.proposalsA.length > 0 || block.proposalsB.length > 0
    );
}

/**
 * Libellés au niveau du sujet. « Sujet incomplet » plutôt que « Non
 * comparable » : à ce niveau, l'absence vient toujours d'une position non
 * documentée d'un côté, ce que la carte dit ensuite explicitement.
 */
export const SUBJECT_VERDICT_LABELS: Record<ThemeVerdict, string> = {
  accord: "Positions proches",
  nuance: "Position nuancée",
  desaccord: "Opposition nette",
  inconnu: "Sujet incomplet",
};

/**
 * Une phrase d'analyse strictement déduite des deux positions — jamais une
 * synthèse rédigée sur le fond, que rien dans nos données ne permettrait
 * d'écrire. Elle dit l'écart, pas ce qu'il signifie politiquement.
 *
 * `null` quand une des deux positions manque : l'appelant affiche alors
 * lequel des deux candidats est documenté, ce qui est la seule chose que
 * l'on sache dans ce cas.
 */
export function describeGap(subject: SubjectComparison): string | null {
  const { question, positionA, positionB } = subject;
  if (!positionA || !positionB) return null;

  if (question.answer_type === "likert") {
    if (positionA.numeric_score === null || positionB.numeric_score === null) return null;
    const gap = Math.abs(positionA.numeric_score - positionB.numeric_score);
    if (gap === 0) return "Même position sur l'échelle de réponse.";
    if (gap === 4) return "Positions aux deux extrémités de l'échelle.";
    const words = ["", "un cran", "deux crans", "trois crans"];
    return `Positions séparées de ${words[gap]} sur l'échelle de réponse.`;
  }

  if (positionA.option_id === null || positionB.option_id === null) return null;
  if (positionA.option_id === positionB.option_id) return "Même option retenue.";
  return subject.similarity !== null && subject.similarity > 0
    ? "Options différentes, mais rapprochées par la méthodologie."
    : "Options différentes.";
}
