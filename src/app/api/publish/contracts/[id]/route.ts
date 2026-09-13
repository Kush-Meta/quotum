import { NextResponse } from "next/server";
import { getContract } from "@/lib/store";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const contract = await getContract(id);
  if (!contract) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(contract, {
    headers: {
      "Cache-Control": "no-store",
      "X-Answer-Contracts": "0.1.0",
      "X-Citation-Object": contract.citation.id,
    },
  });
}
