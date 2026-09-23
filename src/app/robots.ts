import type { MetadataRoute } from "next";
import { siteOrigin } from "@/lib/publicOrigin";

export default function robots(): MetadataRoute.Robots {
  const origin = siteOrigin();

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/answers/", "/api/publish", "/.well-known/", "/agentspace", "/api/agentspace"],
        disallow: ["/studio", "/api/contracts", "/api/validate"],
      },
    ],
    sitemap: `${origin}/sitemap.xml`,
    host: origin,
  };
}
