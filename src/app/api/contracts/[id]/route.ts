import { NextResponse } from "next/server";
import { getContract, saveContract } from "@/lib/store";
import { AnswerContractSchema } from "@/lib/schema";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const contract = await getContract(id);
  if (!contract) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ contract });
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const parsed = AnswerContractSchema.safeParse({ ...body, id });
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
