import { NextResponse } from "next/server";
import { buildPromptCoverage } from "@/lib/coverage";
import { listContracts } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const contracts = await listContracts();
  const report = buildPromptCoverage(contracts);
  return NextResponse.json(report, {
    headers: {
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
      "X-Answer-Contracts": "0.1.0",
    },
  });
}
