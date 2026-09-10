import { describe, expect, it } from "vitest";
import { splitFigures } from "./figures";

/** Raccourci de lecture : ne garde que les grandeurs repérées. */
function figures(text: string): string[] {
  return splitFigures(text)
    .filter((s) => s.isFigure)
    .map((s) => s.text);
}

describe("splitFigures", () => {
  it("repère un montant, un pourcentage et une durée", () => {
    expect(figures("125 milliards d'euros")).toEqual(["125 milliards"]);
    expect(figures("un déficit limité à 3 % du PIB")).toEqual(["3 %"]);
    expect(figures("la retraite à 62 ans")).toEqual(["62 ans"]);
  });

  it("garde les séparateurs de milliers français", () => {
    expect(figures("porter le SMIC à 1 600 euros net")).toEqual(["1 600 euros"]);
    expect(figures("100 000 € d'amende")).toEqual(["100 000 €"]);
  });

  it("ignore un nombre sans unité — une date n'est pas une grandeur", () => {
    expect(figures("Le 31 août 2026, elle a annoncé")).toEqual([]);
    expect(figures("l'article 49, alinéa 3 de la Constitution")).toEqual([]);
  });

  it("repère plusieurs grandeurs dans une même phrase", () => {
    expect(figures("4 ans de prison dont 2 ans avec sursis et 45 mois d'inéligibilité")).toEqual([
      "4 ans",
      "2 ans",
      "45 mois",
    ]);
  });

  it("restitue le texte d'origine à l'identique une fois recollé", () => {
    const text = "Un plan de 125 milliards d'euros sur 5 ans, soit 3 % du PIB.";
    expect(splitFigures(text).map((s) => s.text).join("")).toBe(text);
  });

  it("renvoie toujours au moins un segment", () => {
    expect(splitFigures("")).toEqual([{ text: "", isFigure: false }]);
  });
});
