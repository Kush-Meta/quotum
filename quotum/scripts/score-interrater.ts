/**
 * Inter-rater agreement (Cohen's κ) on dual-annotated binary labels.
 *
 * Expects JSON:
 * [
 *   {
 *     id: string,
 *     auto: { mentionedBrand, citedDomain, recommended },
 *     human: { mentionedBrand, citedDomain, recommended }
 *   }
 * ]
 *
 *   npm run interrater -- data/live/annotations.dual.json
 */
import { promises as fs } from "fs";
import path from "path";

type Binary = {
  mentionedBrand: boolean;
  citedDomain: boolean;
  recommended: boolean;
};

type DualRow = {
  id: string;
  auto: Binary;
  human: Binary;
};

function cohenKappa(a: boolean[], b: boolean[]): number {
  if (a.length === 0 || a.length !== b.length) return NaN;
  const n = a.length;
  let agree = 0;
  let aTrue = 0;
  let bTrue = 0;
  for (let i = 0; i < n; i++) {
    if (a[i] === b[i]) agree++;
    if (a[i]) aTrue++;
    if (b[i]) bTrue++;
  }
  const p0 = agree / n;
  const pe =
    (aTrue / n) * (bTrue / n) + ((n - aTrue) / n) * ((n - bTrue) / n);
  if (pe === 1) return 1;
  return (p0 - pe) / (1 - pe);
}

async function main() {
  const input = process.argv[2];
  if (!input) {
    console.error(
      "Usage: npm run interrater -- data/live/annotations.dual.json",
    );
    process.exit(1);
  }
  const rows = JSON.parse(
    await fs.readFile(path.resolve(input), "utf8"),
  ) as DualRow[];
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error("dual annotation file must be a non-empty array");
  }

  const fields: (keyof Binary)[] = [
    "mentionedBrand",
    "citedDomain",
    "recommended",
  ];

  console.log("Phase 4 · Inter-rater agreement");
  console.log("================================");
  console.log(`Rows: ${rows.length}`);
  for (const field of fields) {
    const auto = rows.map((r) => r.auto[field]);
    const human = rows.map((r) => r.human[field]);
    const kappa = cohenKappa(auto, human);
    const disputes = rows.filter((r) => r.auto[field] !== r.human[field]);
    console.log(
      `${field.padEnd(16)} κ=${Number.isFinite(kappa) ? kappa.toFixed(3) : "n/a"}  disputes=${disputes.length}`,
    );
    for (const d of disputes.slice(0, 5)) {
      console.log(
        `  ! ${d.id}: auto=${d.auto[field]} human=${d.human[field]}`,
      );
    }
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
