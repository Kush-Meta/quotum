import { z } from "zod";

export const ClaimSchema = z.object({
  id: z.string().min(1),
  statement: z.string().min(8).max(500),
  evidenceUrl: z.string().url(),
  evidenceHash: z.string().min(8),
  asOf: z.string(),
  scope: z.string().min(2).max(200),
  confidence: z.enum(["high", "medium", "low"]),
});

export const AnswerContractSchema = z.object({
  version: z.literal("0.1.0"),
  id: z.string().min(1),
  brand: z.string().min(1),
  domain: z.string().min(1),
  vertical: z.string().min(1),
  intent: z.object({
    id: z.string().min(1),
    promptClass: z.string().min(4),
    examplePrompts: z.array(z.string().min(4)).min(1).max(20),
    buyerStage: z.enum([
      "discover",
      "compare",
      "shortlist",
      "validate",
      "switch",
    ]),
  }),
  canonicalAnswer: z.string().min(24).max(900),
  claims: z.array(ClaimSchema).min(1).max(40),
  competitiveFrame: z.object({
    axis: z.string().min(2).max(160),
    peers: z.array(z.string().min(1)).min(1).max(12),
    posture: z.string().min(8).max(500),
  }),
  citation: z.object({
    id: z.string().min(1),
    quotable: z.string().min(12).max(480),
    preferredUrl: z.string().url(),
    anchor: z.string().optional(),
  }),
  policy: z.object({
    mayParaphrase: z.boolean(),
    mayRecommend: z.boolean(),
    freshnessSlaDays: z.number().int().positive().max(365),
    lastReviewed: z.string(),
  }),
  eval: z.object({
    successCriteria: z.array(z.string().min(4)).min(1),
    targetMentionRate: z.number().min(0).max(1),
    targetCitationRate: z.number().min(0).max(1),
    targetRecommendRate: z.number().min(0).max(1),
  }),
  updatedAt: z.string(),
});

export type AnswerContract = z.infer<typeof AnswerContractSchema>;
export type Claim = z.infer<typeof ClaimSchema>;

export const PilotProbeSchema = z.object({
  id: z.string(),
  engine: z.enum([
    "duckai",
    "chatgpt",
    "perplexity",
    "gemini",
    "claude",
    "ai_overview",
  ]),
  prompt: z.string(),
  capturedAt: z.string(),
  answerText: z.string(),
  sources: z.array(z.string()),
  mentionedBrand: z.boolean(),
  citedDomain: z.boolean(),
  recommended: z.boolean(),
  firstMentionOffset: z.number().nullable(),
  competitorsMentioned: z.array(z.string()),
  notes: z.string().optional(),
  /** Phase 4 experiment metadata */
  promptId: z.string().optional(),
  intentId: z.string().optional(),
  role: z.enum(["canonical", "paraphrase", "holdout"]).optional(),
  annotatorId: z.string().optional(),
  labelSource: z.enum(["auto", "manual"]).optional(),
});

export type PilotProbe = z.infer<typeof PilotProbeSchema>;

export type AnswerShareBreakdown = {
  mentionRate: number;
  citationRate: number;
  recommendRate: number;
  prominence: number;
  answerShare: number;
  n: number;
  byEngine: Record<
    string,
    {
      mentionRate: number;
      citationRate: number;
      recommendRate: number;
      n: number;
    }
  >;
};

export function validateContract(input: unknown) {
  return AnswerContractSchema.safeParse(input);
}

/** Transparent Answer Share score (0–100). */
export function scoreAnswerShare(probes: PilotProbe[]): AnswerShareBreakdown {
  const n = probes.length;
  if (n === 0) {
    return {
      mentionRate: 0,
      citationRate: 0,
      recommendRate: 0,
      prominence: 0,
      answerShare: 0,
      n: 0,
      byEngine: {},
    };
  }

  const mentionRate = probes.filter((p) => p.mentionedBrand).length / n;
  const citationRate = probes.filter((p) => p.citedDomain).length / n;
  const recommendRate = probes.filter((p) => p.recommended).length / n;

  const prominenceScores = probes.map((p) => {
    if (!p.mentionedBrand || p.firstMentionOffset == null) return 0;
    const len = Math.max(p.answerText.length, 1);
    return Math.max(0, 1 - p.firstMentionOffset / len);
  });
  const prominence =
    prominenceScores.reduce((a, b) => a + b, 0) / prominenceScores.length;

  const answerShare =
    100 *
    (0.35 * mentionRate +
      0.3 * recommendRate +
      0.25 * citationRate +
      0.1 * prominence);

  const engines = [...new Set(probes.map((p) => p.engine))];
  const byEngine: AnswerShareBreakdown["byEngine"] = {};
  for (const engine of engines) {
    const subset = probes.filter((p) => p.engine === engine);
    const sn = subset.length;
    byEngine[engine] = {
      n: sn,
      mentionRate: subset.filter((p) => p.mentionedBrand).length / sn,
      citationRate: subset.filter((p) => p.citedDomain).length / sn,
      recommendRate: subset.filter((p) => p.recommended).length / sn,
    };
  }

  return {
    mentionRate,
    citationRate,
    recommendRate,
    prominence,
    answerShare: Math.round(answerShare * 10) / 10,
    n,
    byEngine,
  };
}

export function evidenceHash(input: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return `fnv1a_${(h >>> 0).toString(16).padStart(8, "0")}`;
}
