import type { MetadataRoute } from "next";
import { listContracts, listSealedContracts } from "@/lib/store";
import { siteOrigin } from "@/lib/publicOrigin";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = siteOrigin();
  const contracts = await listContracts();
  const sealed = await listSealedContracts();
  const now = new Date();

  return [
    {
      url: `${origin}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${origin}/agentspace`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${origin}/experiment`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${origin}/publish`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${origin}/.well-known/answer-contracts.json`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${origin}/.well-known/quotum-pubkey.json`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...contracts.map((c) => ({
      url: `${origin}/answers/${c.id}`,
      lastModified: new Date(c.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.95,
    })),
    ...sealed.map((c) => ({
      url: `${origin}/t/${c.seal.attributionToken}`,
      lastModified: new Date(c.seal.sealedAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
