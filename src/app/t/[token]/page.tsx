import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { findByAttributionToken } from "@/lib/store";
import { recordHit } from "@/lib/traffic";

export const dynamic = "force-dynamic";

export default async function AttributionLanding({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const sealed = await findByAttributionToken(token);
  const h = await headers();

  try {
    await recordHit({
      token,
      contractId: sealed?.id ?? null,
      path: `/t/${token}`,
      referrer: h.get("referer"),
      userAgent: h.get("user-agent"),
      source: "attribution_landing",
    });
  } catch (err) {
    console.error("[attribution] recordHit failed", err);
  }

  if (!sealed) {
    redirect("/agentspace");
  }

  redirect(
    `/answers/${sealed.id}?utm_source=ai_citation&utm_medium=attribution_token&utm_campaign=${sealed.id}&t=${token}`,
  );
}
