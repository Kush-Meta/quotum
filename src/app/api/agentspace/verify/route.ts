import { NextResponse } from "next/server";
import { z } from "zod";
import { AnswerContractSchema } from "@/lib/schema";
import { verifySealedContract, type ContractSeal } from "@/lib/seal";

export const dynamic = "force-dynamic";

const BodySchema = z.object({
  contract: AnswerContractSchema,
  seal: z.object({
    alg: z.literal("Ed25519"),
    keyId: z.string(),
    contentHash: z.string(),
    signature: z.string(),
    sealedAt: z.string(),
    attributionToken: z.string(),
  }),
  publicKeyPem: z.string().optional(),
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "invalid_body", details: parsed.error.message },
      { status: 400 },
    );
  }
  const result = await verifySealedContract({
    contract: parsed.data.contract,
    seal: parsed.data.seal as ContractSeal,
    publicKeyPem: parsed.data.publicKeyPem,
  });
  return NextResponse.json(result);
}

export async function GET() {
  return NextResponse.json({
    method: "POST",
    body: {
      contract: "AnswerContract",
      seal: "ContractSeal",
      publicKeyPem: "optional override; defaults to on-origin key",
    },
  });
}
