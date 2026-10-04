import {
  createHash,
  createPrivateKey,
  createPublicKey,
  generateKeyPairSync,
  sign,
  verify,
} from "crypto";
import { promises as fs } from "fs";
import path from "path";
import type { AnswerContract } from "./schema";

const keysDir = process.env.VERCEL
  ? "/tmp/quotum-data/keys"
  : path.join(process.cwd(), "data", "keys");
const bundledPublicPath = path.join(
  process.cwd(),
  "data",
  "keys",
  "ed25519.public.pem",
);
const privatePath =
  process.env.QUOTUM_PRIVATE_KEY_PATH ||
  path.join(keysDir, "ed25519.private.pem");
const publicPath = path.join(keysDir, "ed25519.public.pem");

export type ContractSeal = {
  alg: "Ed25519";
  keyId: string;
  contentHash: string;
  signature: string;
  sealedAt: string;
  /** Opaque attribution token for traffic measurement */
  attributionToken: string;
};

export type SealedContract = AnswerContract & {
  seal: ContractSeal;
};

function canonicalBytes(contract: AnswerContract): Buffer {
  const body = {
    version: contract.version,
    id: contract.id,
    brand: contract.brand,
    domain: contract.domain,
    vertical: contract.vertical,
    intent: contract.intent,
    canonicalAnswer: contract.canonicalAnswer,
    claims: contract.claims,
    competitiveFrame: contract.competitiveFrame,
    citation: contract.citation,
    policy: contract.policy,
    eval: contract.eval,
  };
  return Buffer.from(JSON.stringify(body), "utf8");
}

export function contentHash(contract: AnswerContract): string {
  return createHash("sha256").update(canonicalBytes(contract)).digest("hex");
}

/** Vercel env values often store PEM with literal \n instead of real newlines. */
function normalizePem(pem: string): string {
  const trimmed = pem.trim().replace(/\\n/g, "\n");
  if (!trimmed.includes("BEGIN")) {
    throw new Error("invalid_pem_missing_header");
  }
  return trimmed.endsWith("\n") ? trimmed : `${trimmed}\n`;
}

function keyIdFromPublicPem(publicKeyPem: string): string {
  return createHash("sha256").update(publicKeyPem).digest("hex").slice(0, 16);
}

function publicPemFromPrivate(privateKeyPem: string): string {
  const privateKey = createPrivateKey(privateKeyPem);
  const publicKey = createPublicKey(privateKey);
  return publicKey.export({ type: "spki", format: "pem" }).toString();
}

export async function ensureKeyPair(): Promise<{
  publicKeyPem: string;
  privateKeyPem: string;
  keyId: string;
}> {
  // 1) Durable env private key (preferred on Vercel)
  const envPrivate = process.env.QUOTUM_PRIVATE_KEY_PEM?.trim();
  if (envPrivate) {
    const privateKeyPem = normalizePem(envPrivate);
    const envPublic = process.env.QUOTUM_PUBLIC_KEY_PEM?.trim();
    const publicKeyPem = envPublic
      ? normalizePem(envPublic)
      : publicPemFromPrivate(privateKeyPem);
    return {
      privateKeyPem,
      publicKeyPem,
      keyId: keyIdFromPublicPem(publicKeyPem),
    };
  }

  await fs.mkdir(keysDir, { recursive: true }).catch(() => undefined);
  let privateKeyPem: string | null = null;
  let publicKeyPem: string | null = null;

  try {
    privateKeyPem = await fs.readFile(privatePath, "utf8");
  } catch {
    privateKeyPem = null;
  }

  try {
    publicKeyPem = await fs.readFile(publicPath, "utf8");
  } catch {
    try {
      publicKeyPem = await fs.readFile(bundledPublicPath, "utf8");
    } catch {
      publicKeyPem = null;
    }
  }

  if (privateKeyPem && !publicKeyPem) {
    publicKeyPem = publicPemFromPrivate(privateKeyPem);
  }

  // 2) Local filesystem keypair
  if (privateKeyPem && publicKeyPem) {
    return {
      privateKeyPem,
      publicKeyPem,
      keyId: keyIdFromPublicPem(publicKeyPem),
    };
  }

  // 3) Never mint ephemeral keys on Vercel — that breaks sealed contracts.
  if (process.env.VERCEL) {
    throw new Error(
      "Missing QUOTUM_PRIVATE_KEY_PEM on Vercel. Set the PEM that sealed data/sealed-contracts.json.",
    );
  }

  // 4) Local bootstrap only
  const { privateKey, publicKey } = generateKeyPairSync("ed25519");
  privateKeyPem = privateKey.export({ type: "pkcs8", format: "pem" }).toString();
  publicKeyPem = publicKey.export({ type: "spki", format: "pem" }).toString();
  try {
    await fs.writeFile(privatePath, privateKeyPem, { mode: 0o600 });
    await fs.writeFile(publicPath, publicKeyPem, "utf8");
  } catch (err) {
    console.error("[seal] key write failed (ok on read-only hosts)", err);
  }

  return {
    privateKeyPem,
    publicKeyPem,
    keyId: keyIdFromPublicPem(publicKeyPem),
  };
}

export async function getPublicKeyDocument() {
  const { publicKeyPem, keyId } = await ensureKeyPair();
  return {
    protocol: "quotum-seal",
    version: "0.1.0",
    alg: "Ed25519",
    keyId,
    publicKeyPem,
    verifyEndpoint: "/api/agentspace/verify",
    wellKnown: "/.well-known/quotum-pubkey.json",
  };
}

function attributionTokenFor(contractId: string, hash: string): string {
  return createHash("sha256")
    .update(`attr:${contractId}:${hash}`)
    .digest("base64url")
    .slice(0, 22);
}

export async function sealContract(
  contract: AnswerContract,
): Promise<SealedContract> {
  const { privateKeyPem, keyId } = await ensureKeyPair();
  const hash = contentHash(contract);
  const signature = sign(null, Buffer.from(hash, "utf8"), privateKeyPem).toString(
    "base64url",
  );
  const seal: ContractSeal = {
    alg: "Ed25519",
    keyId,
    contentHash: hash,
    signature,
    sealedAt: new Date().toISOString(),
    attributionToken: attributionTokenFor(contract.id, hash),
  };
  return { ...contract, seal };
}

export async function verifySealedContract(input: {
  contract: AnswerContract;
  seal: ContractSeal;
  publicKeyPem?: string;
}): Promise<{ ok: boolean; reasons: string[] }> {
  const reasons: string[] = [];
  const { publicKeyPem, keyId } = await ensureKeyPair();
  const pem = input.publicKeyPem ?? publicKeyPem;
  const expectedHash = contentHash(input.contract);
  if (expectedHash !== input.seal.contentHash) {
    reasons.push("content_hash_mismatch");
  }
  if (input.seal.keyId !== keyId && !input.publicKeyPem) {
    reasons.push("key_id_mismatch");
  }
  if (input.seal.alg !== "Ed25519") {
    reasons.push("unsupported_alg");
  }
  const valid = verify(
    null,
    Buffer.from(input.seal.contentHash, "utf8"),
    pem,
    Buffer.from(input.seal.signature, "base64url"),
  );
  if (!valid) reasons.push("signature_invalid");
  return { ok: reasons.length === 0, reasons };
}
