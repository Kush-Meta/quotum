import { NextResponse } from "next/server";
import { publishIndex } from "@/lib/store";

export async function GET() {
  const index = await publishIndex();
  return NextResponse.json(index, {
    headers: {
      "Cache-Control": "no-store",
      "X-Answer-Contracts": "0.1.0",
    },
  });
}
