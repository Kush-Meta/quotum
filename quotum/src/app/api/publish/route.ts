import { NextResponse } from "next/server";
import { publishIndex } from "@/lib/store";
import { resolvePublicOrigin } from "@/lib/publicOrigin";

export async function GET(request: Request) {
  const origin = resolvePublicOrigin(request);
  const index = await publishIndex(origin);
  return NextResponse.json(index, {
    headers: {
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
      "X-Answer-Contracts": "0.1.0",
    },
  });
}
