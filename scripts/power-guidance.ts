/**
 * Rule-of-thumb power / n guidance for Answer Share mention-rate lift.
 *
 * Uses a normal approximation for two-proportion comparison:
 *   n_per_arm ≈ 2 * (zα + zβ)^2 * p̄(1-p̄) / (p1-p0)^2
 *
 *   npm run power:guide
 *   npm run power:guide -- --p0 0 --p1 0.2 --power 0.8
 */
function zFor(powerOrAlpha: number, tail: "one" | "two" = "two"): number {
  // Common critical values
  const table: Record<string, number> = {
    "0.8": 0.8416,
    "0.85": 1.0364,
    "0.9": 1.2816,
    "0.95": 1.6449,
    "0.975": 1.96,
    "0.99": 2.3263,
  };
  if (tail === "two" && Math.abs(powerOrAlpha - 0.05) < 1e-9) return 1.96;
  if (tail === "one" && Math.abs(powerOrAlpha - 0.05) < 1e-9) return 1.6449;
  const key = String(powerOrAlpha);
  if (table[key] != null) return table[key];
  return 0.8416;
}

function parseArgs(argv: string[]) {
  const get = (name: string, fallback: number) => {
    const idx = argv.indexOf(`--${name}`);
    if (idx >= 0 && argv[idx + 1]) return Number(argv[idx + 1]);
    return fallback;
  };
  return {
    p0: get("p0", 0),
    p1: get("p1", 0.2),
    alpha: get("alpha", 0.05),
    power: get("power", 0.8),
  };
}

function main() {
  const { p0, p1, alpha, power } = parseArgs(process.argv.slice(2));
  const delta = Math.abs(p1 - p0);
  if (delta <= 0) throw new Error("p1 must differ from p0");
  const pBar = (p0 + p1) / 2;
  const zAlpha = zFor(alpha, "two");
  const zBeta = zFor(power);
  const nPerArm =
    (2 * (zAlpha + zBeta) ** 2 * pBar * (1 - pBar)) / delta ** 2;
  const n = Math.ceil(nPerArm);

  console.log("Phase 4 · Power / n guidance");
  console.log("============================");
  console.log(`Baseline mention rate p0: ${p0}`);
  console.log(`Target mention rate   p1: ${p1}`);
  console.log(`Alpha (two-sided):        ${alpha}`);
  console.log(`Power:                    ${power}`);
  console.log(`Recommended n (per arm):  ${n}`);
  console.log("");
  console.log("Quotum mapping:");
  console.log(`  Phase 1 n = 6 (too small; Northline=${p0})`);
  console.log(
    "  Phase 4 target ≈ 15 measurement prompts × 3 engines = 45 observations",
  );
  console.log(
    `  ${45 >= n ? "45 ≥ recommended n → design meets rule-of-thumb" : "45 < recommended n → add engines or paraphrases"}`,
  );
}

main();
