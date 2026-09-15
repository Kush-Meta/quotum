/**
 * Phase 3 gate: every LIVE_PROMPT_PACK prompt must map to ≥1 Answer Contract.
 *
 *   npm run coverage:prompts
 */
import { listContracts } from "../src/lib/store";
import {
  assertFullPromptCoverage,
  buildPromptCoverage,
} from "../src/lib/coverage";

async function main() {
  const contracts = await listContracts();
  const report = buildPromptCoverage(contracts);

  console.log("Phase 3 · Prompt → contract coverage");
  console.log("====================================");
  console.log(
    `Covered ${report.coveredCount}/${report.promptCount} LIVE_PROMPT_PACK prompts`,
  );
  console.log("");
  for (const row of report.rows) {
    const mark = row.covered ? "OK" : "MISSING";
    const ids = row.covered ? row.contractIds.join(", ") : "(none)";
    console.log(`${mark.padEnd(7)} ${row.prompt}`);
    console.log(`        → ${ids}`);
  }
  console.log("");
  console.log("Contracts:");
  for (const c of report.contracts) {
    console.log(
      `  ${c.id}  claims=${c.claimCount}  examples=${c.examplePromptCount}  (${c.promptClass})`,
    );
  }

  assertFullPromptCoverage(report);
  console.log("\nPhase 3 coverage gate: PASS");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
