import { promises as fs } from "fs";
import path from "path";
import { realContracts } from "./realExperiment";
import { ensureKeyPair, sealContract, type SealedContract } from "./seal";
import { AnswerContractSchema, type AnswerContract } from "./schema";

const dataDir = path.join(process.cwd(), "data");
const contractsPath = path.join(dataDir, "contracts.json");
const sealedPath = path.join(dataDir, "sealed-contracts.json");

async function ensureStore() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(contractsPath);
  } catch {
    await fs.writeFile(
      contractsPath,
      JSON.stringify(realContracts, null, 2),
      "utf8",
    );
  }
}

export async function listContracts(): Promise<AnswerContract[]> {
  await ensureStore();
  const raw = await fs.readFile(contractsPath, "utf8");
  const parsed = JSON.parse(raw) as unknown;
  const arr = Array.isArray(parsed) ? parsed : [];
  return arr
    .map((item) => AnswerContractSchema.safeParse(item))
    .filter((r) => r.success)
    .map((r) => r.data);
}

export async function getContract(
  id: string,
): Promise<AnswerContract | null> {
  const all = await listContracts();
  return all.find((c) => c.id === id) ?? null;
}

export async function saveContract(
  contract: AnswerContract,
): Promise<{ ok: true; contract: AnswerContract } | { ok: false; error: string }> {
  const parsed = AnswerContractSchema.safeParse({
    ...contract,
    updatedAt: new Date().toISOString(),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.message };
  }
  await ensureStore();
  const all = await listContracts();
  const idx = all.findIndex((c) => c.id === parsed.data.id);
  if (idx >= 0) all[idx] = parsed.data;
  else all.push(parsed.data);
  await fs.writeFile(contractsPath, JSON.stringify(all, null, 2), "utf8");
  await resealAll();
  return { ok: true, contract: parsed.data };
}

export async function resealAll(): Promise<SealedContract[]> {
  await ensureKeyPair();
  const contracts = await listContracts();
  const sealed: SealedContract[] = [];
  for (const c of contracts) {
    sealed.push(await sealContract(c));
  }
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(sealedPath, JSON.stringify(sealed, null, 2), "utf8");
  return sealed;
}

export async function listSealedContracts(): Promise<SealedContract[]> {
  try {
    const raw = await fs.readFile(sealedPath, "utf8");
    const parsed = JSON.parse(raw) as SealedContract[];
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {
    /* reseal below */
  }
  try {
    return await resealAll();
  } catch (err) {
    console.error("[store] resealAll failed", err);
    return [];
  }
}

export async function getSealedContract(
  id: string,
): Promise<SealedContract | null> {
  const all = await listSealedContracts();
  return all.find((c) => c.id === id) ?? null;
}

export async function findByAttributionToken(
  token: string,
): Promise<SealedContract | null> {
  const all = await listSealedContracts();
  return all.find((c) => c.seal.attributionToken === token) ?? null;
}

export async function publishIndex(origin: string | null = null) {
  const contracts = await listSealedContracts();
  const abs = (p: string) =>
    origin ? `${origin}${p.startsWith("/") ? p : `/${p}`}` : p;

  return {
    version: "0.2.0",
    generatedAt: new Date().toISOString(),
    protocol: "answer-contracts",
    agentspace: abs("/agentspace"),
    verify: abs("/api/agentspace/verify"),
    publicKey: abs("/.well-known/quotum-pubkey.json"),
    description:
      "Machine-native sealed Answer Contracts for generative engines. Intent-bound claims with evidence hashes, Ed25519 seals, and attribution tokens.",
    brand: contracts[0]?.brand ?? null,
    domain: contracts[0]?.domain ?? null,
    origin,
    contracts: contracts.map((c) => ({
      id: c.id,
      href: abs(`/api/publish/contracts/${c.id}`),
      sealedHref: abs(`/api/agentspace/contracts/${c.id}`),
      answerPage: abs(`/answers/${c.id}`),
      attributionUrl: abs(`/t/${c.seal.attributionToken}`),
      intent: c.intent.promptClass,
      buyerStage: c.intent.buyerStage,
      contentHash: c.seal.contentHash,
      keyId: c.seal.keyId,
      updatedAt: c.updatedAt,
      claimCount: c.claims.length,
    })),
    graph: {
      brands: [...new Set(contracts.map((c) => c.brand))],
      intents: contracts.map((c) => c.intent.id),
      claimCount: contracts.reduce((n, c) => n + c.claims.length, 0),
    },
  };
}
