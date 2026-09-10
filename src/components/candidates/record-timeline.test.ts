import { describe, expect, it } from "vitest";
import { sortTimelineEntries, type TimelineEntry } from "./record-timeline";

function entry(partial: Partial<TimelineEntry> & { id: string }): TimelineEntry {
  return {
    title: "",
    subtitle: "",
    start: null,
    end: null,
    isOngoing: false,
    ...partial,
  };
}

describe("sortTimelineEntries", () => {
  it("place les entrées en cours avant les entrées terminées, quelle que soit leur date de début", () => {
    const ongoing = entry({ id: "ongoing", start: "2010", isOngoing: true });
    const past = entry({ id: "past", start: "2020", end: "2022" });
    expect(sortTimelineEntries([past, ongoing]).map((e) => e.id)).toEqual(["ongoing", "past"]);
  });

  it("trie les entrées terminées de la plus récente à la plus ancienne", () => {
    const older = entry({ id: "older", start: "2000", end: "2004" });
    const newer = entry({ id: "newer", start: "2015", end: "2019" });
    expect(sortTimelineEntries([older, newer]).map((e) => e.id)).toEqual(["newer", "older"]);
  });

  it("ne fabrique jamais d'ordre entre deux entrées sans aucune date", () => {
    const a = entry({ id: "a" });
    const b = entry({ id: "b" });
    expect(sortTimelineEntries([a, b]).map((e) => e.id)).toEqual(["a", "b"]);
  });
});
