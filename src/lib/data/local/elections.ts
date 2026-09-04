import type { Election } from "@/lib/types";

export const elections: Election[] = [
  {
    id: "election-presidentielle-2027",
    slug: "presidentielle-2027",
    name: "Élection présidentielle 2027",
    kind: "presidentielle",
    // Dates fixées par le Conseil des ministres du 1er juillet 2026.
    round_date: "2027-04-18",
    second_round_date: "2027-05-02",
    is_active: true,
  },
];

export const activeElection = elections[0];
