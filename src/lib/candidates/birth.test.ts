import { describe, expect, it } from "vitest";
import { formatBirth } from "./birth";
import { candidates } from "@/lib/data/local/candidates";

describe("formatBirth", () => {
  it("écrit une date complète en toutes lettres et donne l'âge révolu", () => {
    expect(formatBirth("1951-08-19", new Date("2026-09-08"))).toEqual({
      date: "19 août 1951",
      age: "75 ans",
    });
  });

  it("n'incrémente l'âge qu'après l'anniversaire", () => {
    expect(formatBirth("1951-08-19", new Date("2026-08-18")).age).toBe("74 ans");
    expect(formatBirth("1951-08-19", new Date("2026-08-19")).age).toBe("75 ans");
  });

  it("laisse l'année seule sans âge quand la source ne donne pas le jour", () => {
    expect(formatBirth("1960", new Date("2026-09-08"))).toEqual({ date: "1960", age: null });
  });

  it("ne calcule pas d'âge sur une valeur qui n'est pas une date", () => {
    expect(formatBirth("inconnue").age).toBeNull();
  });
});

describe("données d'état civil des candidats", () => {
  it("ne contient que des dates complètes ou des années seules", () => {
    for (const candidate of candidates) {
      if (!candidate.birth_date) continue;
      expect(candidate.birth_date, candidate.slug).toMatch(/^\d{4}(-\d{2}-\d{2})?$/);
    }
  });

  it("associe toujours un lieu de naissance à une date de naissance", () => {
    for (const candidate of candidates) {
      if (!candidate.birth_date) continue;
      expect(candidate.birth_place, candidate.slug).toBeTruthy();
    }
  });

  it("ne renseigne jamais une précision de fonction sans la fonction elle-même", () => {
    for (const candidate of candidates) {
      if (!candidate.current_role_detail) continue;
      expect(candidate.current_role, candidate.slug).toBeTruthy();
    }
  });
});
