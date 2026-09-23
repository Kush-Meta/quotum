import { NextResponse } from "next/server";
import { getSealedContract } from "@/lib/store";
import { resolvePublicOrigin, absoluteUrl } from "@/lib/publicOrigin";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const contract = await getSealedContract(id);
  if (!contract) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  const origin = resolvePublicOrigin(request);
  return NextResponse.json({
    protocol: "answer-contracts",
    sealed: true,
    contract,
    verify: {
      method: "POST",
      url: absoluteUrl(origin, "/api/agentspace/verify"),
      publicKey: absoluteUrl(origin, "/.well-known/quotum-pubkey.json"),
    },
    attributionUrl: absoluteUrl(origin, `/t/${contract.seal.attributionToken}`),
  });
}
