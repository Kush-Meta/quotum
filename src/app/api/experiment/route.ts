import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { packStats } from "@/lib/promptPack";
import { buildPhase4Coverage } from "@/lib/coverage";
import { listContracts } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const manifestPath = path.join(
    process.cwd(),
    "data",
    "live",
    "experiment.manifest.json",
  );
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  const contracts = await listContracts();
  const coverage = buildPhase4Coverage(contracts);
  const stats = packStats();

  return NextResponse.json(
    {
      manifest,
      pack: stats,
      coverage: {
        phase: coverage.phase,
        measurementCovered: coverage.coveredCount,
        measurementTotal: coverage.promptCount,
        uncovered: coverage.uncovered,
        holdoutLeaks: coverage.holdoutLeaks,
      },
      gates: {
        phase4MeasurementCoverage: coverage.uncovered.length === 0,
        holdoutsNotOnContracts: coverage.holdoutLeaks.length === 0,
        recommendedN: stats.measurementCaptures,
        phase1N: stats.phase1Count,
      },
    },
    {
      headers: {
        "Cache-Control": "no-store",
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
}
