/**
 * Validate public/llms.txt shape and that it links every sealed agentspace contract.
 * Usage: npx tsx scripts/audit-llmstxt.ts
 */
import { promises as fs } from "fs";
import path from "path";

async function main() {
  const root = process.cwd();
  const llmsPath = path.join(root, "public", "llms.txt");
  const sealedPath = path.join(root, "data", "sealed-contracts.json");

  const llms = await fs.readFile(llmsPath, "utf8");
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!llms.startsWith("# ")) {
    errors.push("Missing H1 title (# ...)");
  }
  if (!llms.includes("> ")) {
    errors.push("Missing blockquote summary (> ...)");
  }
  if (!/^## /m.test(llms)) {
    errors.push("Missing H2 sections");
  }

  const linkRe = /https?:\/\/[^\s)]+/g;
  const links = llms.match(linkRe) ?? [];
  if (links.length < 4) {
    errors.push(`Expected several absolute links, found ${links.length}`);
  }

  let sealed: { id?: string }[] = [];
  try {
    const raw = JSON.parse(await fs.readFile(sealedPath, "utf8"));
    sealed = Array.isArray(raw) ? raw : raw.contracts ?? [];
  } catch {
    warnings.push("Could not read data/sealed-contracts.json — skipping contract link checks");
  }

  for (const c of sealed) {
    if (!c.id) continue;
    const needle = `/answers/${c.id}`;
    if (!llms.includes(needle) && !llms.includes(`/api/agentspace/contracts/${c.id}`)) {
      errors.push(`llms.txt missing link for sealed contract ${c.id}`);
    }
  }

  if (!llms.toLowerCase().includes("agentspace")) {
    warnings.push("llms.txt does not mention agentspace");
  }
  if (llms.includes("Disallow:") || llms.includes("User-agent:")) {
    errors.push("llms.txt must not contain robots.txt directives");
  }

  for (const w of warnings) console.warn(`warn: ${w}`);
  if (errors.length) {
    for (const e of errors) console.error(`error: ${e}`);
    process.exit(1);
  }
  console.log(
    `ok: llms.txt valid (${links.length} links, ${sealed.length} sealed contracts checked)`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
