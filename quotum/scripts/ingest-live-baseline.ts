/**
 * Ingest raw live captures into a scored baseline or treatment report.
 *
 * Usage:
 *   npx tsx scripts/ingest-live-baseline.ts path/to/captures.json [--phase baseline|treatment]
 *
 * Capture file shape: RawLiveCapture[]
 */
import { promises as fs } from "fs";
import path from "path";
import {
  LIVE_PROMPT_PACK,
  TRACKED_BRANDS,
  annotateProbeForBrand,
  scoreCategoryShare,
  type LiveBaselineReport,
  type RawLiveCapture,
} from "../src/lib/probe";

async function main() {
  const args = process.argv.slice(2);
  const input = args.find((a) => !a.startsWith("--"));
  const phaseArg = args.find((a) => a.startsWith("--phase="));
  const phaseFlagIdx = args.indexOf("--phase");
  const phase =
    (phaseArg?.split("=")[1] as "baseline" | "treatment" | undefined) ??
    (phaseFlagIdx >= 0
      ? (args[phaseFlagIdx + 1] as "baseline" | "treatment")
      : "baseline");

  if (!input || (phase !== "baseline" && phase !== "treatment")) {
    console.error(
      "Usage: npx tsx scripts/ingest-live-baseline.ts <captures.json> [--phase baseline|treatment]",
    );
    process.exit(1);
  }

  const abs = path.resolve(input);
  const raw = JSON.parse(await fs.readFile(abs, "utf8")) as RawLiveCapture[];
  if (!Array.isArray(raw) || raw.length === 0) {
    throw new Error("captures.json must be a non-empty array");
  }

  const northline = TRACKED_BRANDS.find((b) => b.id === "northline");
  if (!northline) throw new Error("northline brand missing");

  const leaderboard = scoreCategoryShare(raw);
  const challengerProbes = raw.map((capture) =>
    annotateProbeForBrand(capture, northline),
  );
  const challengerScore = leaderboard.find((row) => row.brandId === "northline");
  if (!challengerScore) throw new Error("northline missing from leaderboard");

  const report: LiveBaselineReport = {
    version: "0.1.0",
    phase,
    vertical: "product-analytics",
    capturedAt: new Date().toISOString(),
    method:
      phase === "treatment"
        ? "Phase 2 treatment remeasure after public Answer Contract publish. Same prompt pack and annotation pipeline as baseline."
        : "Live browser captures against generative engines, annotated for mention/citation/recommend/prominence across tracked brands.",
    promptPack: [...LIVE_PROMPT_PACK],
    trackedBrands: TRACKED_BRANDS.map(({ id, brand, domain }) => ({
      id,
      brand,
      domain,
    })),
    captures: raw,
    leaderboard,
    challenger: {
      brandId: "northline",
      brand: northline.brand,
      domain: northline.domain,
      score: challengerScore.score,
      probes: challengerProbes,
    },
  };

  const outDir = path.join(process.cwd(), "data", "live");
  await fs.mkdir(outDir, { recursive: true });
  const outName = phase === "treatment" ? "treatment.json" : "baseline.json";
  const outPath = path.join(outDir, outName);
  await fs.writeFile(outPath, JSON.stringify(report, null, 2), "utf8");

  // Keep a dated copy for audit
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  await fs.writeFile(
    path.join(outDir, `${phase}.${stamp}.json`),
    JSON.stringify(report, null, 2),
    "utf8",
  );

  console.log(`Wrote ${outPath}`);
  console.log("Leaderboard:");
  for (const row of leaderboard) {
    console.log(
      `  ${row.brand.padEnd(22)} ${String(row.score.answerShare).padStart(5)}  (n=${row.score.n})`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
