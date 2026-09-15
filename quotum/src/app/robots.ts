import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const origin =
    process.env.PUBLIC_ORIGIN?.replace(/\/$/, "") ?? "http://127.0.0.1:3847";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/answers/", "/api/publish", "/.well-known/"],
        disallow: ["/studio", "/api/contracts", "/api/validate"],
      },
    ],
    sitemap: `${origin}/sitemap.xml`,
    host: origin,
  };
}
