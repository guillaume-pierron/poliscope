import type { Election } from "@/lib/types";

export const elections: Election[] = [
  {
    id: "election-presidentielle-2027",
    slug: "presidentielle-2027",
    name: "Élection présidentielle 2027",
    kind: "presidentielle",
    round_date: "2027-04-11",
    is_active: true,
  },
];

export const activeElection = elections[0];
