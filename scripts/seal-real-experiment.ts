#!/usr/bin/env tsx
import { promises as fs } from "fs";
import path from "path";
import { realContracts } from "../src/lib/realExperiment";
import { resealAll } from "../src/lib/store";
import { getPublicKeyDocument } from "../src/lib/seal";

async function main() {
  const dataDir = path.join(process.cwd(), "data");
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(
    path.join(dataDir, "contracts.json"),
    JSON.stringify(realContracts, null, 2),
    "utf8",
  );
  const sealed = await resealAll();
  const pubkey = await getPublicKeyDocument();
  console.log(
    JSON.stringify(
      {
        contracts: realContracts.length,
        sealed: sealed.length,
        keyId: pubkey.keyId,
        tokens: sealed.map((c) => ({
          id: c.id,
          token: c.seal.attributionToken,
          hash: c.seal.contentHash.slice(0, 16),
        })),
      },
      null,
      2,
    ),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
