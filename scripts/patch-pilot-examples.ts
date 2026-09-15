import { readFileSync, writeFileSync } from "fs";

type Contract = {
  id: string;
  intent: { examplePrompts: string[] };
};

const contracts = JSON.parse(
  readFileSync("data/contracts.json", "utf8"),
) as Contract[];
let pilot = readFileSync("src/lib/pilot.ts", "utf8");

for (const c of contracts) {
  const idIdx = pilot.indexOf(`id: "${c.id}"`);
  if (idIdx < 0) {
    console.warn("missing", c.id);
    continue;
  }
  const slice = pilot.slice(idIdx, idIdx + 1600);
  const m = slice.match(/examplePrompts:\s*\[[\s\S]*?\],/);
  if (!m) {
    console.warn("no examplePrompts near", c.id);
    continue;
  }
  const pretty = `examplePrompts: [\n${c.intent.examplePrompts
    .map((t) => `        ${JSON.stringify(t)},`)
    .join("\n")}\n      ],`;
  pilot =
    pilot.slice(0, idIdx) +
    slice.replace(m[0], pretty) +
    pilot.slice(idIdx + slice.length);
  console.log("patched", c.id, c.intent.examplePrompts.length);
}

writeFileSync("src/lib/pilot.ts", pilot);
console.log("pilot.ts updated");
