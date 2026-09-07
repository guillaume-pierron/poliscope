import { describe, expect, it } from "vitest";
import { formatCentral, formatCount, formatRange } from "./format";

describe("formatRange", () => {
  it("renders a real min/max interval rather than a fake single decimal", () => {
    expect(formatRange(6, 7.5, 9, "Md€")).toBe("6 à 9 Md€");
  });

  it("falls back to central when min/max are absent", () => {
    expect(formatRange(null, 7.5, null, "Md€")).toBe("7,5 Md€");
  });

  it("falls back to whichever single bound is present", () => {
    expect(formatRange(50, null, null, "€/mois")).toBe("50 €/mois");
  });

  it("returns null (never 0 or a blank string) when nothing is documented", () => {
    expect(formatRange(null, null, null, "€/mois")).toBeNull();
  });

  it("collapses to a single value when min equals max", () => {
    expect(formatRange(16.8, 16.8, 16.8, "Md€")).toBe("16,8 Md€");
  });

  it("signs a positive household gain with a leading +", () => {
    expect(formatRange(42, null, 61, "€/mois", { signed: true })).toBe("+42 à +61 €/mois");
  });
});

describe("formatCentral / formatCount", () => {
  it("formatCentral returns null rather than '0' when central is absent", () => {
    expect(formatCentral(null, "€/mois")).toBeNull();
  });

  it("formatCount groups thousands the French way", () => {
    // fr-FR uses a narrow no-break space (U+202F) as thousands separator —
    // compare against the same Intl call rather than a hand-typed literal.
    expect(formatCount(2_200_000)).toBe(new Intl.NumberFormat("fr-FR").format(2_200_000));
  });

  it("formatCount returns null rather than '0' when absent", () => {
    expect(formatCount(null)).toBeNull();
  });
});
