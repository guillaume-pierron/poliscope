import { describe, expect, it } from "vitest";
import { describeRemaining } from "./election-countdown";
import { activeElection } from "@/lib/data/local/elections";

const SCRUTIN = "2027-04-18";

describe("describeRemaining", () => {
  it("compte les jours entiers restants", () => {
    expect(describeRemaining(SCRUTIN, new Date("2027-04-15T00:00:00"))).toBe("dans 3 jours");
    expect(describeRemaining(SCRUTIN, new Date("2027-04-17T00:00:00"))).toBe("dans 1 jour");
  });

  it("passe aux heures et minutes le dernier jour", () => {
    expect(describeRemaining(SCRUTIN, new Date("2027-04-17T18:30:00"))).toBe("dans 5 h 30 min");
    expect(describeRemaining(SCRUTIN, new Date("2027-04-17T23:20:00"))).toBe("dans 40 min");
  });

  it("dit « aujourd'hui » pendant toute la journée du scrutin", () => {
    expect(describeRemaining(SCRUTIN, new Date("2027-04-18T00:00:00"))).toBe("aujourd'hui");
    expect(describeRemaining(SCRUTIN, new Date("2027-04-18T23:59:00"))).toBe("aujourd'hui");
  });

  it("n'affiche jamais de décompte négatif une fois le scrutin passé", () => {
    expect(describeRemaining(SCRUTIN, new Date("2027-04-19T00:00:00"))).toBeNull();
    expect(describeRemaining(SCRUTIN, new Date("2028-01-01T12:00:00"))).toBeNull();
  });

  it("ignore une date invalide plutôt que d'afficher « NaN »", () => {
    expect(describeRemaining("pas une date", new Date("2027-01-01T00:00:00"))).toBeNull();
  });
});

describe("date du scrutin", () => {
  it("le décompte s'appuie sur la date de l'élection active, pas sur une constante", () => {
    expect(activeElection.round_date).toBe(SCRUTIN);
    expect(describeRemaining(activeElection.round_date!, new Date("2027-04-16T00:00:00"))).toBe(
      "dans 2 jours"
    );
  });
});
