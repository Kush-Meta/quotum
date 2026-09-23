import { NextResponse } from "next/server";
import { trafficSummary, listTraffic, recordHit } from "@/lib/traffic";

export const dynamic = "force-dynamic";

export async function GET() {
  const summary = await trafficSummary();
  const store = await listTraffic();
  return NextResponse.json({ summary, store });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    token?: string;
    contractId?: string;
    path?: string;
    source?: "manual";
  } | null;
  if (!body?.token) {
    return NextResponse.json({ error: "token_required" }, { status: 400 });
  }
  const hit = await recordHit({
    token: body.token,
    contractId: body.contractId ?? null,
    path: body.path ?? "/api/traffic",
    referrer: request.headers.get("referer"),
    userAgent: request.headers.get("user-agent"),
    source: "manual",
  });
  return NextResponse.json({ ok: true, hit });
}
