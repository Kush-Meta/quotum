import { writeFileSync } from "fs";
import { measurementPrompts } from "../src/lib/promptPack";
import { pilotContracts } from "../src/lib/pilot";
import { AnswerContractSchema } from "../src/lib/schema";

const byIntent = new Map<string, string[]>();
for (const p of measurementPrompts()) {
  const list = byIntent.get(p.intentId) ?? [];
  list.push(p.text);
  byIntent.set(p.intentId, list);
}

const updated = pilotContracts.map((c) => {
  const texts = byIntent.get(c.intent.id);
  if (!texts) {
    console.warn("No measurement prompts for", c.intent.id);
    return c;
  }
  return {
    ...c,
    intent: {
      ...c.intent,
      examplePrompts: texts,
    },
    updatedAt: "2026-09-15T01:00:00.000Z",
  };
});

for (const c of updated) {
  const r = AnswerContractSchema.safeParse(c);
  if (!r.success) {
    console.error(c.id, r.error.issues);
    process.exit(1);
  }
  console.log(
    c.id,
    "examples",
    c.intent.examplePrompts.length,
    "→",
    c.intent.examplePrompts,
  );
}

writeFileSync(
  "data/contracts.json",
  JSON.stringify(updated, null, 2) + "\n",
);
console.log("wrote data/contracts.json");
