/**
 * Compare Phase 1 baseline vs Phase 2 treatment Answer Share reports.
 *
 * Usage:
 *   npx tsx scripts/compare-phases.ts
 *   npx tsx scripts/compare-phases.ts data/live/baseline.json data/live/treatment.json
 */
import { promises as fs } from "fs";
import path from "path";
import type { LiveBaselineReport } from "../src/lib/probe";

async function loadReport(p: string): Promise<LiveBaselineReport> {
  return JSON.parse(await fs.readFile(p, "utf8")) as LiveBaselineReport;
}

function rowShare(report: LiveBaselineReport, brandId: string): number | null {
  const row = report.leaderboard.find((r) => r.brandId === brandId);
  return row ? row.score.answerShare : null;
}

async function main() {
  const baselinePath =
    process.argv[2] ?? path.join(process.cwd(), "data", "live", "baseline.json");
  const treatmentPath =
    process.argv[3] ?? path.join(process.cwd(), "data", "live", "treatment.json");

  const baseline = await loadReport(baselinePath);
  let treatment: LiveBaselineReport | null = null;
  try {
    treatment = await loadReport(treatmentPath);
  } catch {
    console.log(`No treatment report at ${treatmentPath}`);
    console.log("Phase 1 baseline only:\n");
  }

  const brandIds = [
    ...new Set([
      ...baseline.leaderboard.map((r) => r.brandId),
      ...(treatment?.leaderboard.map((r) => r.brandId) ?? []),
    ]),
  ];

  console.log("Answer Share comparison");
  console.log("=======================");
  console.log(`Baseline:  ${baseline.capturedAt}  (${baseline.method.slice(0, 72)}…)`);
  if (treatment) {
    console.log(`Treatment: ${treatment.capturedAt}  (${treatment.method.slice(0, 72)}…)`);
  }
  console.log("");
  console.log(
    `${"Brand".padEnd(22)} ${"Phase1".padStart(8)} ${"Phase2".padStart(8)} ${"Delta".padStart(8)}`,
  );

  for (const id of brandIds) {
    const b = rowShare(baseline, id);
    const t = treatment ? rowShare(treatment, id) : null;
    const brand =
      baseline.leaderboard.find((r) => r.brandId === id)?.brand ??
      treatment?.leaderboard.find((r) => r.brandId === id)?.brand ??
      id;
    const delta =
      b != null && t != null ? (t - b).toFixed(1) : "—";
    console.log(
      `${brand.padEnd(22)} ${String(b ?? "—").padStart(8)} ${String(t ?? "—").padStart(8)} ${String(delta).padStart(8)}`,
    );
  }

  const northB = rowShare(baseline, "northline") ?? 0;
  const northT = treatment ? rowShare(treatment, "northline") : null;
  console.log("");
  if (northT == null) {
    console.log(
      "Next: publish publicly, wait for discovery, capture Phase 2 answers, then:\n  npm run ingest:live -- data/live/captures.phase2.json --phase treatment\n  npm run compare:phases",
    );
  } else if (northT > northB) {
    console.log(`Northline lift: ${northB} → ${northT}  (+${(northT - northB).toFixed(1)})`);
  } else if (northT === northB) {
    console.log(
      `Northline unchanged at ${northT}. Iterate contracts / wait longer / broaden engines.`,
    );
  } else {
    console.log(`Northline regress: ${northB} → ${northT}. Inspect captures and citations.`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
