import { promises as fs } from "fs";
import path from "path";
import { pilotContracts } from "./pilot";
import { AnswerContractSchema, type AnswerContract } from "./schema";

const dataDir = path.join(process.cwd(), "data");
const contractsPath = path.join(dataDir, "contracts.json");

async function ensureStore() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(contractsPath);
  } catch {
    await fs.writeFile(
      contractsPath,
      JSON.stringify(pilotContracts, null, 2),
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
  return { ok: true, contract: parsed.data };
}

export async function publishIndex() {
  const contracts = await listContracts();
  return {
    version: "0.1.0",
    generatedAt: new Date().toISOString(),
    protocol: "answer-contracts",
    description:
      "Machine-native Answer Contracts for generative engines. Not llms.txt. Not a chatbot. Intent-bound claims with evidence hashes and citation objects.",
    brand: contracts[0]?.brand ?? null,
    domain: contracts[0]?.domain ?? null,
    contracts: contracts.map((c) => ({
      id: c.id,
      href: `/api/publish/contracts/${c.id}`,
      intent: c.intent.promptClass,
      buyerStage: c.intent.buyerStage,
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
