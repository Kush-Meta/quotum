import { NextResponse } from "next/server";
import { listContracts, saveContract } from "@/lib/store";
import { AnswerContractSchema } from "@/lib/schema";

export async function GET() {
  const contracts = await listContracts();
  return NextResponse.json({ contracts });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = AnswerContractSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid Answer Contract", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const result = await saveContract(parsed.data);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ contract: result.contract });
}
