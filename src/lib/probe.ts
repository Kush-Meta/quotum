import type { PilotProbe } from "./schema";
import { scoreAnswerShare, type AnswerShareBreakdown } from "./schema";

export const LIVE_PROMPT_PACK = [
  "What is the best product analytics tool for a startup?",
  "Best analytics platform for early-stage SaaS",
  "Recommend a product analytics stack for a 10-person startup",
  "Amplitude vs Mixpanel vs open-source for startups",
  "Best open source alternative to Amplitude",
  "best product analytics for startups",
] as const;

export const TRACKED_BRANDS = [
  {
    id: "northline",
    brand: "Northline Analytics",
    domain: "northline.dev",
    aliases: ["northline"],
  },
  {
    id: "amplitude",
    brand: "Amplitude",
    domain: "amplitude.com",
    aliases: ["amplitude"],
  },
  {
    id: "mixpanel",
    brand: "Mixpanel",
    domain: "mixpanel.com",
    aliases: ["mixpanel"],
  },
  {
    id: "posthog",
    brand: "PostHog",
    domain: "posthog.com",
    aliases: ["posthog", "post hog"],
  },
  {
    id: "heap",
    brand: "Heap",
    domain: "heap.io",
    aliases: ["heap analytics", "heap.io", "heap"],
  },
] as const;

export type TrackedBrand = (typeof TRACKED_BRANDS)[number];

export type RawLiveCapture = {
  id: string;
  engine: PilotProbe["engine"];
  prompt: string;
  capturedAt: string;
  answerText: string;
  sources: string[];
  notes?: string;
};

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function findBrandMention(
  text: string,
  brand: TrackedBrand,
): number | null {
  const hay = text.toLowerCase();
  for (const alias of brand.aliases) {
    const re = new RegExp(`\\b${escapeRegExp(alias.toLowerCase())}\\b`, "i");
    const match = re.exec(hay);
    if (match) return match.index;
  }
  // Prefer full brand string as fallback
  const full = hay.indexOf(brand.brand.toLowerCase());
  return full >= 0 ? full : null;
}

export function domainCited(sources: string[], domain: string): boolean {
  const needle = domain.toLowerCase().replace(/^www\./, "");
  return sources.some((source) => {
    const s = source.toLowerCase();
    return s.includes(needle);
  });
}

export function isRecommended(
  answerText: string,
  brand: TrackedBrand,
  mentionOffset: number | null,
): boolean {
  if (mentionOffset == null) return false;
  const windowStart = Math.max(0, mentionOffset - 80);
  const windowEnd = Math.min(answerText.length, mentionOffset + brand.brand.length + 120);
  const window = answerText.slice(windowStart, windowEnd).toLowerCase();
  const cues = [
    "best",
    "recommend",
    "recommended",
    "top choice",
    "strong fit",
    "ideal",
    "prefer",
    "go with",
    "choose",
    "great option",
    "best fit",
  ];
  return cues.some((cue) => window.includes(cue));
}

export function annotateProbeForBrand(
  raw: RawLiveCapture,
  brand: TrackedBrand,
): PilotProbe {
  const mentionOffset = findBrandMention(raw.answerText, brand);
  const mentionedBrand = mentionOffset != null;
  const citedDomain = domainCited(raw.sources, brand.domain);
  const recommended = isRecommended(raw.answerText, brand, mentionOffset);
  const competitorsMentioned = TRACKED_BRANDS.filter(
    (b) => b.id !== brand.id && findBrandMention(raw.answerText, b) != null,
  ).map((b) => b.brand);

  return {
    id: `${raw.id}__${brand.id}`,
    engine: raw.engine,
    prompt: raw.prompt,
    capturedAt: raw.capturedAt,
    answerText: raw.answerText,
    sources: raw.sources,
    mentionedBrand,
    citedDomain,
    recommended,
    firstMentionOffset: mentionOffset,
    competitorsMentioned,
    notes: raw.notes,
  };
}

export type BrandShareRow = {
  brandId: string;
  brand: string;
  domain: string;
  score: AnswerShareBreakdown;
};

export function scoreCategoryShare(
  captures: RawLiveCapture[],
): BrandShareRow[] {
  return TRACKED_BRANDS.map((brand) => {
    const probes = captures.map((capture) =>
      annotateProbeForBrand(capture, brand),
    );
    return {
      brandId: brand.id,
      brand: brand.brand,
      domain: brand.domain,
      score: scoreAnswerShare(probes),
    };
  }).sort((a, b) => b.score.answerShare - a.score.answerShare);
}

export type LiveBaselineReport = {
  version: "0.1.0";
  phase: "baseline";
  vertical: "product-analytics";
  capturedAt: string;
  method: string;
  promptPack: string[];
  trackedBrands: Array<{ id: string; brand: string; domain: string }>;
  captures: RawLiveCapture[];
  leaderboard: BrandShareRow[];
  challenger: {
    brandId: "northline";
    brand: string;
    domain: string;
    score: AnswerShareBreakdown;
    probes: PilotProbe[];
  };
};
