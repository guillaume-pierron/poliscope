import { NextResponse } from "next/server";
import { getAllPositions, getCandidates, getQuestions } from "@/lib/data/queries";

/**
 * Serves the public data needed to score the Match: candidates, their
 * documented positions, and the question bank. Nothing about a visitor's
 * own answers ever transits through the server — this endpoint only ever
 * returns the same public dataset shown on /candidats.
 */
export async function GET() {
  const [candidates, positions, questions] = await Promise.all([
    getCandidates(),
    getAllPositions(),
    getQuestions(),
  ]);

  return NextResponse.json(
    { candidates, positions, questions },
    { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" } }
  );
}
