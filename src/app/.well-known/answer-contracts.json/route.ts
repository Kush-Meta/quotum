import { NextResponse } from "next/server";
import { listContracts } from "@/lib/store";

export async function GET() {
  const contracts = await listContracts();
  const body = {
    version: "0.1.0",
    protocol: "answer-contracts",
    description:
      "Discovery index for Answer Contracts. Intent-bound claims with evidence hashes and citation objects.",
    brand: contracts[0]?.brand ?? null,
    domain: contracts[0]?.domain ?? null,
    generatedAt: new Date().toISOString(),
    contracts: contracts.map((c) => ({
      id: c.id,
      intent: c.intent.promptClass,
      href: `/api/publish/contracts/${c.id}`,
      answerPage: `/answers/${c.id}`,
      updatedAt: c.updatedAt,
      claimCount: c.claims.length,
    })),
  };

  return NextResponse.json(body, {
    headers: {
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
      "X-Answer-Contracts": "0.1.0",
    },
  });
}
