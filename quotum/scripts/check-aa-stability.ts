/**
 * A/A stability check for Quotum Answer Share scoring.
 *
 * 1) Re-annotate the same captures twice → scores must match
 * 2) Split-half (even/odd capture index) → report absolute delta
 *
 *   npm run aa:check
 *   npm run aa:check -- data/live/captures.raw.json
 */
import { promises as fs } from "fs";
import path from "path";
import {
  TRACKED_BRANDS,
  scoreCategoryShare,
  type RawLiveCapture,
} from "../src/lib/probe";

function northlineShare(captures: RawLiveCapture[]) {
  const rows = scoreCategoryShare(captures);
  return rows.find((r) => r.brandId === "northline")?.score.answerShare ?? 0;
}

function leaderboardFingerprint(captures: RawLiveCapture[]) {
  return scoreCategoryShare(captures)
    .map((r) => `${r.brandId}:${r.score.answerShare}`)
    .join("|");
}

async function main() {
  const input =
    process.argv[2] ?? path.join(process.cwd(), "data", "live", "captures.raw.json");
  const raw = JSON.parse(await fs.readFile(path.resolve(input), "utf8")) as RawLiveCapture[];
  if (!Array.isArray(raw) || raw.length === 0) {
    throw new Error("captures file must be a non-empty array");
  }

  const pass1 = leaderboardFingerprint(raw);
  const pass2 = leaderboardFingerprint(raw);
  const aaIdentical = pass1 === pass2;

  const even = raw.filter((_, i) => i % 2 === 0);
  const odd = raw.filter((_, i) => i % 2 === 1);
  const evenShare = northlineShare(even);
  const oddShare = northlineShare(odd);
  const splitDelta = Math.abs(evenShare - oddShare);

  console.log("Phase 4 · A/A stability");
  console.log("======================");
  console.log(`Captures: ${raw.length}`);
  console.log(`Tracked brands: ${TRACKED_BRANDS.length}`);
  console.log(`Re-ingest identical: ${aaIdentical ? "PASS" : "FAIL"}`);
  console.log(`Fingerprint: ${pass1}`);
  console.log(`Split-half Northline even/odd: ${evenShare} / ${oddShare} (Δ=${splitDelta})`);
  console.log(
    `Split-half note: with Phase 1 n=${raw.length} and Northline=0, both halves should be 0.`,
  );

  if (!aaIdentical) process.exit(1);
  console.log("\nA/A gate: PASS");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
