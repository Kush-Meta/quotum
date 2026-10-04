import { promises as fs } from "fs";
import path from "path";

const UPSTASH_KEY = "quotum:traffic:v1";

function trafficPaths(): string[] {
  const bundled = path.join(process.cwd(), "data", "live", "traffic.json");
  if (process.env.VERCEL) {
    return ["/tmp/quotum-data/traffic.json", bundled];
  }
  return [bundled];
}

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
  backend?: "upstash" | "filesystem";
};

function emptyStore(backend: TrafficStore["backend"] = "filesystem"): TrafficStore {
  return { updatedAt: new Date().toISOString(), hits: [], backend };
}

function upstashConfigured(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
  );
}

async function upstashGet(): Promise<TrafficStore | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    const res = await fetch(`${url}/get/${encodeURIComponent(UPSTASH_KEY)}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { result?: string | null };
    if (!json.result) return emptyStore("upstash");
    const parsed = JSON.parse(json.result) as TrafficStore;
    if (!parsed || !Array.isArray(parsed.hits)) return emptyStore("upstash");
    return { ...parsed, backend: "upstash" };
  } catch (err) {
    console.error("[traffic] upstash get failed", err);
    return null;
  }
}

async function upstashSet(store: TrafficStore): Promise<boolean> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return false;
  try {
    const payload = JSON.stringify({ ...store, backend: "upstash" });
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(["SET", UPSTASH_KEY, payload]),
    });
    return res.ok;
  } catch (err) {
    console.error("[traffic] upstash set failed", err);
    return false;
  }
}

async function readFileStore(): Promise<TrafficStore> {
  for (const file of trafficPaths()) {
    try {
      const raw = await fs.readFile(file, "utf8");
      const parsed = JSON.parse(raw) as TrafficStore;
      if (parsed && Array.isArray(parsed.hits)) {
        return { ...parsed, backend: "filesystem" };
      }
    } catch {
      /* try next */
    }
  }
  return emptyStore("filesystem");
}

async function writeFileStore(store: TrafficStore) {
  const primary = trafficPaths()[0];
  try {
    await fs.mkdir(path.dirname(primary), { recursive: true });
    await fs.writeFile(
      primary,
      JSON.stringify({ ...store, backend: "filesystem" }, null, 2),
      "utf8",
    );
  } catch (err) {
    console.error("[traffic] write failed", err);
  }
}

async function readStore(): Promise<TrafficStore> {
  if (upstashConfigured()) {
    const remote = await upstashGet();
    if (remote) return remote;
  }
  return readFileStore();
}

async function writeStore(store: TrafficStore) {
  if (upstashConfigured()) {
    const ok = await upstashSet(store);
    if (ok) return;
  }
  await writeFileStore(store);
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
    backend: store.backend ?? (upstashConfigured() ? "upstash" : "filesystem"),
    durable: upstashConfigured(),
    byContract,
    bySource,
    byEngine,
    recent: store.hits.slice(0, 25),
  };
}

export async function listTraffic(): Promise<TrafficStore> {
  return readStore();
}
