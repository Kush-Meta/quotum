import type { MetadataRoute } from "next";
import { listContracts } from "@/lib/store";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin =
    process.env.PUBLIC_ORIGIN?.replace(/\/$/, "") ?? "http://127.0.0.1:3847";
  const contracts = await listContracts();
  const now = new Date();

  return [
    {
      url: `${origin}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${origin}/publish`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${origin}/pilot`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${origin}/.well-known/answer-contracts.json`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    ...contracts.map((c) => ({
      url: `${origin}/answers/${c.id}`,
      lastModified: new Date(c.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.95,
    })),
  ];
}
