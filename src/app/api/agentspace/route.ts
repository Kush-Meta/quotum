import { NextResponse } from "next/server";
import { listSealedContracts, publishIndex } from "@/lib/store";
import { resolvePublicOrigin } from "@/lib/publicOrigin";
import { realExperimentMeta, realHoldoutPrompts } from "@/lib/realExperiment";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const origin = resolvePublicOrigin(request);
  const index = await publishIndex(origin);
  const sealed = await listSealedContracts();

  return NextResponse.json({
    space: "agentspace",
    version: "0.1.0",
    purpose:
      "Machine entrypoint for AI agents and web tools. Fetch sealed contracts, verify signatures, follow attribution URLs.",
    experiment: realExperimentMeta,
    holdoutsUnpublished: realHoldoutPrompts,
    index,
    contracts: sealed.map((c) => ({
      id: c.id,
      intent: c.intent.promptClass,
      canonicalAnswer: c.canonicalAnswer,
      citation: c.citation,
      seal: c.seal,
      urls: {
        json: origin
          ? `${origin}/api/agentspace/contracts/${c.id}`
          : `/api/agentspace/contracts/${c.id}`,
        answer: origin
          ? `${origin}/answers/${c.id}`
          : `/answers/${c.id}`,
        attribution: origin
          ? `${origin}/t/${c.seal.attributionToken}`
          : `/t/${c.seal.attributionToken}`,
      },
    })),
  });
}
