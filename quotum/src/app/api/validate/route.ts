import { NextResponse } from "next/server";
import { AnswerContractSchema } from "@/lib/schema";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = AnswerContractSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { valid: false, errors: parsed.error.flatten() },
      { status: 400 },
    );
  }
  return NextResponse.json({
    valid: true,
    contract: parsed.data,
    summary: {
      claims: parsed.data.claims.length,
      prompts: parsed.data.intent.examplePrompts.length,
      peers: parsed.data.competitiveFrame.peers.length,
      citationId: parsed.data.citation.id,
    },
  });
}
