/**
 * Score a wave of generative-chat captures into Answer Share for Quotum.
 *
 * Usage:
 *   npx tsx scripts/score-wave.ts data/live/wave1.chats.json
 */
import { promises as fs } from "fs";
import path from "path";
import {
  annotateProbeForBrand,
  QUOTUM_BRAND,
  type RawLiveCapture,
} from "../src/lib/probe";
import { scoreAnswerShare } from "../src/lib/schema";
import {
  realHoldoutPrompts,
  realMeasurementPrompts,
} from "../src/lib/realExperiment";

type ChatCapture = {
  prompt: string;
  engine: RawLiveCapture["engine"];
  answerText: string;
  citedUrls?: string[];
  holdout?: boolean;
};

async function main() {
  const file = process.argv[2] ?? "data/live/wave1.chats.json";
  const abs = path.resolve(process.cwd(), file);
  let raw: unknown;
  try {
    raw = JSON.parse(await fs.readFile(abs, "utf8"));
  } catch {
    console.error(`Missing ${file}. Copy data/live/wave1.chats.template.json and paste answers.`);
    process.exit(1);
  }
  const captures: ChatCapture[] = Array.isArray(raw)
    ? raw
    : ((raw as { captures?: ChatCapture[] }).captures ?? []);

  if (!captures.length) {
    console.error(`No captures in ${file}.`);
    process.exit(1);
  }

  const brand = QUOTUM_BRAND;
  const probes = captures.map((c, i) => {
    const sources = c.citedUrls ?? [];
    const rawCapture: RawLiveCapture = {
      id: `wave_${i}_${c.engine}`,
      engine: c.engine,
      prompt: c.prompt,
      capturedAt: new Date().toISOString(),
      answerText: c.answerText,
      sources,
      role: c.holdout || realHoldoutPrompts.includes(c.prompt) ? "holdout" : "canonical",
    };
    return annotateProbeForBrand(rawCapture, brand);
  });

  const score = scoreAnswerShare(probes);
  const out = {
    scoredAt: new Date().toISOString(),
    brand: brand.brand,
    domain: brand.domain,
    n: probes.length,
    answerShare: score,
    byEngine: Object.fromEntries(
      [...new Set(captures.map((c) => c.engine))].map((engine) => {
        const subset = probes.filter((_, idx) => captures[idx].engine === engine);
        return [engine, scoreAnswerShare(subset)];
      }),
    ),
    promptsCovered: [...new Set(captures.map((c) => c.prompt))],
    missingPublishedPrompts: realMeasurementPrompts.filter(
      (p) => !captures.some((c) => c.prompt === p),
    ),
    holdoutPromptsPresent: captures
      .filter((c) => c.holdout || realHoldoutPrompts.includes(c.prompt))
      .map((c) => c.prompt),
  };

  const outPath = path.join(path.dirname(abs), "wave1.answer-share.json");
  await fs.writeFile(outPath, JSON.stringify(out, null, 2));
  console.log(JSON.stringify(out, null, 2));
  console.log(`\nWrote ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
