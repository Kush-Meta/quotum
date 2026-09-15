/**
 * Phase 4 gate: measurement prompts covered; holdouts must not leak onto contracts.
 *
 *   npm run coverage:phase4
 */
import { listContracts } from "../src/lib/store";
import {
  assertFullPromptCoverage,
  buildPhase4Coverage,
} from "../src/lib/coverage";
import { packStats } from "../src/lib/promptPack";

async function main() {
  const contracts = await listContracts();
  const report = buildPhase4Coverage(contracts);
  const stats = packStats();

  console.log("Phase 4 · Measurement coverage + holdout leak check");
  console.log("====================================================");
  console.log(
    `Pack: ${stats.measurementCount} measurement · ${stats.holdoutCount} holdouts · engines ${stats.primaryEngines.join(",")}`,
  );
  console.log(
    `Covered ${report.coveredCount}/${report.promptCount} measurement prompts`,
  );
  console.log("");
  for (const row of report.rows) {
    const mark = row.covered ? "OK" : "MISSING";
    console.log(
      `${mark.padEnd(7)} [${row.role}] ${row.prompt}`,
    );
    console.log(
      `        → ${row.covered ? row.contractIds.join(", ") : "(none)"}`,
    );
  }
  if (report.holdoutLeaks.length) {
    console.log("\nHoldout leaks:");
    for (const h of report.holdoutLeaks) console.log(`  ! ${h}`);
  } else {
    console.log("\nHoldout leak check: PASS (none on contracts)");
  }

  assertFullPromptCoverage(report);
  console.log("\nPhase 4 coverage gate: PASS");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
