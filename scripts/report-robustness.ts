/**
 * Emit a Phase 4 robustness markdown report from baseline (+ optional treatment).
 *
 *   npm run report:robust
 *   npm run report:robust -- data/live/baseline.json data/live/treatment.json
 */
import { promises as fs } from "fs";
import path from "path";
import type { LiveBaselineReport } from "../src/lib/probe";
import { packStats } from "../src/lib/promptPack";
import { readFileSync } from "fs";

async function loadReport(p: string): Promise<LiveBaselineReport | null> {
  try {
    return JSON.parse(await fs.readFile(p, "utf8")) as LiveBaselineReport;
  } catch {
    return null;
  }
}

function brandShare(report: LiveBaselineReport, brandId: string) {
  return (
    report.leaderboard.find((r) => r.brandId === brandId)?.score.answerShare ??
    null
  );
}

async function main() {
  const baselinePath =
    process.argv[2] ??
    path.join(process.cwd(), "data", "live", "baseline.json");
  const treatmentPath =
    process.argv[3] ??
    path.join(process.cwd(), "data", "live", "treatment.json");

  const baseline = await loadReport(baselinePath);
  const treatment = await loadReport(treatmentPath);
  const manifest = JSON.parse(
    readFileSync(
      path.join(process.cwd(), "data", "live", "experiment.manifest.json"),
      "utf8",
    ),
  );
  const stats = packStats();

  const lines: string[] = [];
  lines.push("# Quotum robustness report");
  lines.push("");
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push(`Manifest: ${manifest.id} (${manifest.version})`);
  lines.push("");
  lines.push("## Design");
  lines.push("");
  lines.push(`- Measurement prompts: ${stats.measurementCount}`);
  lines.push(`- Holdouts: ${stats.holdoutCount}`);
  lines.push(`- Primary engines: ${stats.primaryEngines.join(", ")}`);
  lines.push(`- Target measurement captures: ${stats.measurementCaptures}`);
  lines.push(`- Phase 1 continuity prompts: ${stats.phase1Count}`);
  lines.push("");
  lines.push("## Phase 1 baseline");
  lines.push("");
  if (!baseline) {
    lines.push("_No baseline.json found._");
  } else {
    lines.push(`- Captured: ${baseline.capturedAt}`);
    lines.push(`- Method: ${baseline.method}`);
    lines.push(`- n captures: ${baseline.captures.length}`);
    lines.push("");
    lines.push("| Brand | Answer Share |");
    lines.push("| --- | ---: |");
    for (const row of baseline.leaderboard) {
      lines.push(`| ${row.brand} | ${row.score.answerShare} |`);
    }
  }
  lines.push("");
  lines.push("## Phase 2 treatment");
  lines.push("");
  if (!treatment) {
    lines.push(
      "_No treatment.json yet. Fill `data/live/captures.phase4.template.json` after public deploy + discovery, ingest with `--phase treatment`, then re-run this report._",
    );
  } else {
    lines.push(`- Captured: ${treatment.capturedAt}`);
    lines.push(`- n captures: ${treatment.captures.length}`);
    lines.push("");
    lines.push("| Brand | Phase 1 | Phase 2 | Δ |");
    lines.push("| --- | ---: | ---: | ---: |");
    const ids = [
      ...new Set([
        ...baseline!.leaderboard.map((r) => r.brandId),
        ...treatment.leaderboard.map((r) => r.brandId),
      ]),
    ];
    for (const id of ids) {
      const b = baseline ? brandShare(baseline, id) : null;
      const t = brandShare(treatment, id);
      const name =
        treatment.leaderboard.find((r) => r.brandId === id)?.brand ??
        baseline?.leaderboard.find((r) => r.brandId === id)?.brand ??
        id;
      const delta = b != null && t != null ? (t - b).toFixed(1) : "—";
      lines.push(`| ${name} | ${b ?? "—"} | ${t ?? "—"} | ${delta} |`);
    }
  }
  lines.push("");
  lines.push("## Robustness checklist");
  lines.push("");
  for (const item of (manifest.successCriteria?.secondary ?? []) as string[]) {
    lines.push(`- [ ] ${item}`);
  }
  lines.push(`- [ ] ${manifest.successCriteria?.primary ?? "(see manifest)"}`);
  lines.push("");
  lines.push("## Next actions");
  lines.push("");
  lines.push("1. Keep public origin crawlable (`docs/DEPLOY.md`).");
  lines.push("2. Capture Phase 4 matrix (`data/live/captures.phase4.template.json`).");
  lines.push("3. Dual-annotate ≥30% sample (`data/live/annotations.dual.template.json`).");
  lines.push("4. `npm run ingest:live -- data/live/captures.phase4.json --phase treatment`");
  lines.push("5. `npm run aa:check && npm run compare:phases && npm run report:robust`");
  lines.push("");

  const out = path.join(process.cwd(), "data", "live", "robustness-report.md");
  await fs.writeFile(out, lines.join("\n"), "utf8");
  console.log(lines.join("\n"));
  console.log(`\nWrote ${out}`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
