import { NextResponse } from "next/server";
import { getPublicKeyDocument } from "@/lib/seal";

export const dynamic = "force-dynamic";

export async function GET() {
  const doc = await getPublicKeyDocument();
  return NextResponse.json(doc, {
    headers: {
      "Cache-Control": "public, max-age=300",
    },
  });
}
