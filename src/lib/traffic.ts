import { promises as fs } from "fs";
import path from "path";

const trafficPath = path.join(process.cwd(), "data", "live", "traffic.json");

export type TrafficHit = {
  id: string;
  at: string;
  token: string;
  contractId: string | null;
  path: string;
  referrer: string | null;
  userAgent: string | null;
  source: "attribution_landing" | "answer_page" | "agentspace" | "manual";
  engineGuess: string | null;
};

export type TrafficStore = {
  updatedAt: string;
  hits: TrafficHit[];
};

async function readStore(): Promise<TrafficStore> {
  try {
    const raw = await fs.readFile(trafficPath, "utf8");
    return JSON.parse(raw) as TrafficStore;
  } catch {
    return { updatedAt: new Date().toISOString(), hits: [] };
  }
}

async function writeStore(store: TrafficStore) {
  await fs.mkdir(path.dirname(trafficPath), { recursive: true });
  await fs.writeFile(trafficPath, JSON.stringify(store, null, 2), "utf8");
}

function guessEngine(ua: string | null, referrer: string | null): string | null {
  const blob = `${ua ?? ""} ${referrer ?? ""}`.toLowerCase();
  if (blob.includes("perplexity")) return "perplexity";
  if (blob.includes("chatgpt") || blob.includes("openai")) return "chatgpt";
  if (blob.includes("claude") || blob.includes("anthropic")) return "claude";
  if (blob.includes("gemini") || blob.includes("google")) return "gemini";
  if (blob.includes("duckduckgo") || blob.includes("duckai")) return "duckai";
  if (blob.includes("bing")) return "bing";
  return null;
}

export async function recordHit(input: {
  token: string;
  contractId?: string | null;
  path: string;
  referrer?: string | null;
  userAgent?: string | null;
  source: TrafficHit["source"];
}): Promise<TrafficHit> {
  const store = await readStore();
  const hit: TrafficHit = {
    id: `hit_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    at: new Date().toISOString(),
    token: input.token,
    contractId: input.contractId ?? null,
    path: input.path,
    referrer: input.referrer ?? null,
    userAgent: input.userAgent ?? null,
    source: input.source,
    engineGuess: guessEngine(input.userAgent ?? null, input.referrer ?? null),
  };
  store.hits.unshift(hit);
  store.hits = store.hits.slice(0, 2000);
  store.updatedAt = hit.at;
  await writeStore(store);
  return hit;
}

export async function trafficSummary() {
  const store = await readStore();
  const byContract: Record<string, number> = {};
  const bySource: Record<string, number> = {};
  const byEngine: Record<string, number> = {};
  for (const hit of store.hits) {
    const cid = hit.contractId ?? "unknown";
    byContract[cid] = (byContract[cid] ?? 0) + 1;
    bySource[hit.source] = (bySource[hit.source] ?? 0) + 1;
    const eng = hit.engineGuess ?? "unknown";
    byEngine[eng] = (byEngine[eng] ?? 0) + 1;
  }
  return {
    totalHits: store.hits.length,
    updatedAt: store.updatedAt,
    byContract,
    bySource,
    byEngine,
    recent: store.hits.slice(0, 25),
  };
}

export async function listTraffic(): Promise<TrafficStore> {
  return readStore();
}
