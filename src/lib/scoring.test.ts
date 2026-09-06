import { describe, expect, it } from "vitest";
import {
  calculateChoiceSimilarity,
  calculateLikertSimilarity,
  calculateQuestionDiscrimination,
  calculateQuestionSimilarity,
  computeMatchResults,
  computeThemeWeightsFromPriorityAnswers,
  computeUserPriorityThemes,
} from "./scoring";
import type { Candidate, CandidatePosition, Question, Theme, UserAnswer } from "./types";

const theme: Theme = {
  id: "theme-test",
  slug: "test",
  name: "Thème test",
  description: "",
  icon: "globe",
  order_index: 1,
};

const otherTheme: Theme = { ...theme, id: "theme-other", slug: "other", name: "Autre thème" };

function likertQuestion(id: string, overrides: Partial<Question> = {}): Question {
  return {
    id,
    theme_id: theme.id,
    theme,
    question: `Question ${id}`,
    description: null,
    context: null,
    weight: 1,
    answer_type: "likert",
    order_index: 1,
    is_active: true,
    options: [
      { id: "favorable-fort", label: "Tout à fait favorable", value: 2 },
      { id: "favorable", label: "Plutôt favorable", value: 1 },
      { id: "neutre", label: "Neutre", value: 0 },
      { id: "oppose", label: "Plutôt opposé", value: -1 },
      { id: "oppose-fort", label: "Totalement opposé", value: -2 },
    ],
    ...overrides,
  };
}

function choiceQuestion(id: string, overrides: Partial<Question> = {}): Question {
  return {
    id,
    theme_id: theme.id,
    theme,
    question: `Question ${id}`,
    description: null,
    context: null,
    weight: 1,
    answer_type: "choice",
    order_index: 2,
    is_active: true,
    options: [
      { id: "option-a", label: "Option A" },
      { id: "option-b", label: "Option B" },
      { id: "option-c", label: "Option C" },
    ],
    ...overrides,
  };
}

function likertPosition(
  candidateId: string,
  questionId: string,
  numeric_score: number | null
): CandidatePosition {
  return {
    id: `pos-${candidateId}-${questionId}`,
    candidate_id: candidateId,
    question_id: questionId,
    answer_type: "likert",
    numeric_score,
    option_id: null,
    explanation: null,
    source_url: null,
    source_name: null,
    verified_at: null,
  };
}

function choicePosition(candidateId: string, questionId: string, option_id: string | null): CandidatePosition {
  return {
    id: `pos-${candidateId}-${questionId}`,
    candidate_id: candidateId,
    question_id: questionId,
    answer_type: "choice",
    numeric_score: null,
    option_id,
    explanation: null,
    source_url: null,
    source_name: null,
    verified_at: null,
  };
}

function candidate(id: string): Candidate {
  return {
    id,
    slug: id,
    name: id,
    photo_url: null,
    party_id: null,
    biography: "",
    official_website: null,
    election_id: "election-test",
    is_demo: true,
    order_index: 1,
  };
}

describe("calculateLikertSimilarity", () => {
  it("A. user +2 / candidate +2 => 100%", () => {
    expect(calculateLikertSimilarity(2, 2)).toBe(1);
  });

  it("B. user +2 / candidate -2 => 0%", () => {
    expect(calculateLikertSimilarity(2, -2)).toBe(0);
  });

  it("C. Neutre 0 / candidate 0 => 100%", () => {
    expect(calculateLikertSimilarity(0, 0)).toBe(1);
  });
});

describe("calculateChoiceSimilarity", () => {
  it("E. same option => 100%", () => {
    expect(calculateChoiceSimilarity("option-a", "option-a")).toBe(1);
  });

  it("F. different option => 0%, never an invented intermediate distance", () => {
    expect(calculateChoiceSimilarity("option-a", "option-b")).toBe(0);
  });

  it("honors an explicit, documented compatibility rule when given", () => {
    const compatibility = { "option-a": { "option-c": 0.5 } };
    expect(calculateChoiceSimilarity("option-a", "option-c", compatibility)).toBe(0.5);
    // still binary for a pair the rule doesn't cover
    expect(calculateChoiceSimilarity("option-a", "option-b", compatibility)).toBe(0);
  });
});

describe("calculateQuestionSimilarity", () => {
  it("dispatches to the likert formula for a likert question", () => {
    const q = likertQuestion("q1");
    const pos = likertPosition("c1", "q1", -2);
    expect(calculateQuestionSimilarity(2, pos, q)).toBe(0);
  });

  it("dispatches to the choice formula for a choice question", () => {
    const q = choiceQuestion("q2");
    const pos = choicePosition("c1", "q2", "option-b");
    expect(calculateQuestionSimilarity("option-b", pos, q)).toBe(1);
  });

  it("returns null rather than a guess when the position's own type doesn't carry a value", () => {
    const q = likertQuestion("q1");
    const undocumented = likertPosition("c1", "q1", null);
    expect(calculateQuestionSimilarity(1, undocumented, q)).toBeNull();
  });
});

describe("computeMatchResults", () => {
  it("D. 'Sans opinion' (value: null) excludes the question from the calculation", () => {
    const q1 = likertQuestion("q1");
    const q2 = likertQuestion("q2");
    const c1 = candidate("c1");
    const positions = [likertPosition(c1.id, "q1", 2), likertPosition(c1.id, "q2", -2)];
    const answers: UserAnswer[] = [
      { question_id: "q1", value: 2 }, // perfect match
      { question_id: "q2", value: null }, // skipped — must not drag the score down
    ];

    const [result] = computeMatchResults(answers, [c1], positions, [q1, q2]);
    expect(result.comparableQuestions).toBe(1);
    expect(result.score).toBe(100);
  });

  it("G. a candidate with no documented position on a question is excluded for that candidate only", () => {
    const q1 = likertQuestion("q1");
    const c1 = candidate("c1");
    const c2 = candidate("c2");
    const positions = [likertPosition(c1.id, "q1", 2)]; // c2 has nothing
    const answers: UserAnswer[] = [{ question_id: "q1", value: 2 }];

    const [r1, r2] = computeMatchResults(answers, [c1, c2], positions, [q1]).sort((a, b) =>
      a.candidate.id.localeCompare(b.candidate.id)
    );
    expect(r1.score).toBe(100);
    expect(r1.comparableQuestions).toBe(1);
    expect(r2.score).toBeNull();
    expect(r2.comparableQuestions).toBe(0);
  });

  it("H. a theme mixing likert and choice questions is still normalized correctly", () => {
    const q1 = likertQuestion("q1");
    const q2 = choiceQuestion("q2");
    const c1 = candidate("c1");
    const positions = [likertPosition(c1.id, "q1", 2), choicePosition(c1.id, "q2", "option-a")];
    const answers: UserAnswer[] = [
      { question_id: "q1", value: 2 }, // likert similarity 1
      { question_id: "q2", value: "option-b" }, // choice similarity 0
    ];

    const [result] = computeMatchResults(answers, [c1], positions, [q1, q2]);
    // theme score = mean(1, 0) = 0.5 -> global score 50, never weighted by
    // question count or by which type contributed it.
    expect(result.score).toBe(50);
    expect(result.themeScores).toHaveLength(1);
    expect(result.themeScores[0].comparableQuestions).toBe(2);
  });

  it("I. a skipped question never influences the score, whatever its type", () => {
    const q1 = likertQuestion("q1");
    const q2 = choiceQuestion("q2");
    const c1 = candidate("c1");
    const positions = [likertPosition(c1.id, "q1", 2), choicePosition(c1.id, "q2", "option-a")];
    const withSkip: UserAnswer[] = [
      { question_id: "q1", value: 2 },
      { question_id: "q2", value: null },
    ];
    const withoutQ2: UserAnswer[] = [{ question_id: "q1", value: 2 }];

    const [withSkipResult] = computeMatchResults(withSkip, [c1], positions, [q1, q2]);
    const [withoutQ2Result] = computeMatchResults(withoutQ2, [c1], positions, [q1, q2]);
    expect(withSkipResult.score).toBe(withoutQ2Result.score);
    expect(withSkipResult.comparableQuestions).toBe(withoutQ2Result.comparableQuestions);
  });

  it("never counts a 'priority' answer as an answered/comparable question", () => {
    const q1 = likertQuestion("q1");
    const priority = likertQuestion("qp", {
      answer_type: "priority",
      options: [{ id: "test", label: "Thème test", theme_id: theme.id }],
    });
    const c1 = candidate("c1");
    const positions = [likertPosition(c1.id, "q1", 2)];
    const answers: UserAnswer[] = [
      { question_id: "q1", value: 2 },
      { question_id: "qp", value: "test" },
    ];

    const [result] = computeMatchResults(answers, [c1], positions, [q1, priority]);
    expect(result.answeredQuestions).toBe(1);
    expect(result.comparableQuestions).toBe(1);
  });

  it("weights a theme higher when the visitor's priority answer points to it", () => {
    const q1 = likertQuestion("q1", { theme_id: theme.id, theme });
    const q2 = likertQuestion("q2", { theme_id: otherTheme.id, theme: otherTheme });
    const c1 = candidate("c1");
    // Perfect match on theme q1, total mismatch on theme q2.
    const positions = [likertPosition(c1.id, "q1", 2), likertPosition(c1.id, "q2", -2)];
    const answers: UserAnswer[] = [
      { question_id: "q1", value: 2 },
      { question_id: "q2", value: 2 },
    ];

    const [unweighted] = computeMatchResults(answers, [c1], positions, [q1, q2]);
    expect(unweighted.score).toBe(50); // mean(100, 0)

    const [weighted] = computeMatchResults(answers, [c1], positions, [q1, q2], { [theme.id]: 2 });
    // theme(q1) now counts twice as much: (100*2 + 0*1) / 3 = 66.67 -> 67
    expect(weighted.score).toBe(67);
  });
});

describe("calculateQuestionDiscrimination", () => {
  it("J. too few documented positions => no indicator, never a guess", () => {
    const q = likertQuestion("q1");
    const positions = [likertPosition("c1", "q1", 2), likertPosition("c2", "q1", 2)]; // only 2
    expect(calculateQuestionDiscrimination(q, positions)).toBeNull();
  });

  it("a wide likert spread reads as 'departage'", () => {
    const q = likertQuestion("q1");
    const positions = ["c1", "c2", "c3", "c4"].map((id, i) =>
      likertPosition(id, "q1", i % 2 === 0 ? 2 : -2)
    );
    expect(calculateQuestionDiscrimination(q, positions)).toBe("departage");
  });

  it("a tight likert cluster reads as 'proches'", () => {
    const q = likertQuestion("q1");
    const positions = ["c1", "c2", "c3", "c4"].map((id) => likertPosition(id, "q1", 1));
    expect(calculateQuestionDiscrimination(q, positions)).toBe("proches");
  });

  it("never has an indicator for a 'priority' question — no candidate ever has a position on one", () => {
    const q = likertQuestion("q1", { answer_type: "priority" });
    expect(calculateQuestionDiscrimination(q, [])).toBeNull();
  });
});

describe("computeThemeWeightsFromPriorityAnswers", () => {
  it("boosts the first priority pick more than the second", () => {
    const p1 = likertQuestion("qp1", {
      answer_type: "priority",
      order_index: 1,
      options: [{ id: "a", label: "A", theme_id: "theme-a" }],
    });
    const p2 = likertQuestion("qp2", {
      answer_type: "priority",
      order_index: 2,
      options: [{ id: "b", label: "B", theme_id: "theme-b" }],
    });
    const answers: UserAnswer[] = [
      { question_id: "qp1", value: "a" },
      { question_id: "qp2", value: "b" },
    ];

    const weights = computeThemeWeightsFromPriorityAnswers(answers, [p1, p2]);
    expect(weights["theme-a"]).toBe(2);
    expect(weights["theme-b"]).toBe(1.5);
  });

  it("returns an empty map when both priority questions are skipped", () => {
    const p1 = likertQuestion("qp1", { answer_type: "priority", options: [{ id: "a", label: "A", theme_id: "theme-a" }] });
    expect(computeThemeWeightsFromPriorityAnswers([{ question_id: "qp1", value: null }], [p1])).toEqual({});
  });
});

describe("computeUserPriorityThemes", () => {
  it("prefers the explicit priority answers over inferring from strong likert opinions", () => {
    const q1 = likertQuestion("q1", { theme_id: theme.id, theme });
    // themeById is only ever built from likert/choice questions' own
    // `.theme` — a real question bank always has one for every theme, so
    // this second question stands in for "any other question on otherTheme".
    const q2 = likertQuestion("q2", { theme_id: otherTheme.id, theme: otherTheme });
    const priority = likertQuestion("qp", {
      answer_type: "priority",
      options: [{ id: "other", label: "Autre thème", theme_id: otherTheme.id }],
    });
    const answers: UserAnswer[] = [
      { question_id: "q1", value: 2 }, // strongly held opinion on `theme`
      { question_id: "qp", value: "other" }, // but explicitly prioritizes `otherTheme`
    ];

    const result = computeUserPriorityThemes(answers, [q1, q2, priority]);
    expect(result.map((t) => t.id)).toEqual([otherTheme.id]);
  });
});
