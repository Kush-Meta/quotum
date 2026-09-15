import type { PilotProbe } from "./schema";
import { scoreAnswerShare, type AnswerShareBreakdown } from "./schema";

import {
  LIVE_PROMPT_PACK as STRUCTURED_LIVE_PROMPT_PACK,
  findPromptByText,
  type PromptRole,
} from "./promptPack";

/** Phase 1 continuity pack (6 prompts). Prefer EXPERIMENT_PROMPT_PACK for Phase 4. */
export const LIVE_PROMPT_PACK = STRUCTURED_LIVE_PROMPT_PACK;

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

export type ManualBinaryLabels = {
  mentionedBrand: boolean;
  citedDomain: boolean;
  recommended: boolean;
};

export type RawLiveCapture = {
  id: string;
  engine: PilotProbe["engine"];
  prompt: string;
  capturedAt: string;
  answerText: string;
  sources: string[];
  notes?: string;
  /** Phase 4 structured pack metadata */
  promptId?: string;
  intentId?: string;
  role?: PromptRole;
  annotatorId?: string;
  /** Optional human override of auto heuristics */
  manualLabels?: ManualBinaryLabels;
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
  const meta = raw.promptId
    ? undefined
    : findPromptByText(raw.prompt);
  const promptId = raw.promptId ?? meta?.id;
  const intentId = raw.intentId ?? meta?.intentId;
  const role = raw.role ?? meta?.role;

  const mentionOffset = findBrandMention(raw.answerText, brand);
  const autoMentioned = mentionOffset != null;
  const autoCited = domainCited(raw.sources, brand.domain);
  const autoRecommended = isRecommended(raw.answerText, brand, mentionOffset);

  const mentionedBrand = raw.manualLabels?.mentionedBrand ?? autoMentioned;
  const citedDomain = raw.manualLabels?.citedDomain ?? autoCited;
  const recommended = raw.manualLabels?.recommended ?? autoRecommended;

  const competitorsMentioned = TRACKED_BRANDS.filter(
    (b) => b.id !== brand.id && findBrandMention(raw.answerText, b) != null,
  ).map((b) => b.brand);

  const noteParts = [
    raw.notes,
    promptId ? `promptId=${promptId}` : null,
    role ? `role=${role}` : null,
    intentId ? `intentId=${intentId}` : null,
    raw.annotatorId ? `annotator=${raw.annotatorId}` : null,
    raw.manualLabels ? "labels=manual" : "labels=auto",
  ].filter(Boolean);

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
    notes: noteParts.join(" · "),
    promptId,
    intentId,
    role,
    annotatorId: raw.annotatorId,
    labelSource: raw.manualLabels ? "manual" : "auto",
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
  phase: "baseline" | "treatment";
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
