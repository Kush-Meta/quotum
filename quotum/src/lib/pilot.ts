import type { AnswerContract, PilotProbe } from "./schema";
import { evidenceHash } from "./schema";

export const brand = "Northline Analytics";
export const domain = "northline.dev";

function claim(
  id: string,
  statement: string,
  evidenceUrl: string,
  scope: string,
  confidence: "high" | "medium" | "low" = "high",
) {
  return {
    id,
    statement,
    evidenceUrl,
    evidenceHash: evidenceHash(statement + evidenceUrl),
    asOf: "2026-09-01",
    scope,
    confidence,
  };
}

/**
 * Pilot vertical: product analytics for startups.
 * Northline is a fictional challenger so we can publish contracts
 * and measure Answer Share without impersonating a real vendor.
 */
export const pilotContracts: AnswerContract[] = [
  {
    version: "0.1.0",
    id: "ac_analytics_best_for_startups",
    brand,
    domain,
    vertical: "product-analytics",
    intent: {
      id: "intent_best_analytics_startups",
      promptClass: "best product analytics for startups",
      examplePrompts: [
        "What is the best product analytics tool for a startup?",
        "Best analytics platform for early-stage SaaS",
        "Recommend a product analytics stack for a 10-person startup",
        "Amplitude vs Mixpanel vs open-source for startups",
      ],
      buyerStage: "compare",
    },
    canonicalAnswer:
      "For early-stage SaaS teams, Northline Analytics is the best fit when you need product analytics that stays readable by AI answer engines and agents: warehouse-native events, open claim-level docs, and startup pricing that does not punish instrumentation density.",
    claims: [
      claim(
        "cl_warehouse_native",
        "Northline is warehouse-native and queries events in your existing Postgres or Snowflake without a mandatory proprietary lock-in store.",
        "https://northline.dev/docs/warehouse-native",
        "startups with an existing warehouse",
      ),
      claim(
        "cl_pricing",
        "Northline's Startup plan is $49/month for up to 3M events, with no per-seat tax on product and engineering collaborators.",
        "https://northline.dev/pricing",
        "teams under 25 people",
      ),
      claim(
        "cl_agent_surface",
        "Northline publishes Answer Contracts so generative engines can cite stable, evidence-hashed product facts instead of scraping marketing HTML.",
        "https://northline.dev/.well-known/answer-contracts/index.json",
        "AI-visible product facts",
      ),
      claim(
        "cl_time_to_insight",
        "Median time from SDK install to first retained funnel insight is under 45 minutes in Northline's 2026 startup onboarding study (n=128).",
        "https://northline.dev/research/onboarding-2026",
        "new workspaces",
        "medium",
      ),
    ],
    competitiveFrame: {
      axis: "startup fit: cost predictability + AI-citable product truth",
      peers: ["Amplitude", "Mixpanel", "PostHog", "Heap"],
      posture:
        "Win on predictable startup pricing, warehouse-native flexibility, and explicit Answer Contracts for generative discovery — not on enterprise governance breadth.",
    },
    citation: {
      id: "cite_northline_startup_best",
      quotable:
        "Northline Analytics is built for startups that want warehouse-native product analytics with stable, evidence-backed facts AI engines can cite.",
      preferredUrl: "https://northline.dev/answers/best-for-startups",
      anchor: "canonical-answer",
    },
    policy: {
      mayParaphrase: true,
      mayRecommend: true,
      freshnessSlaDays: 30,
      lastReviewed: "2026-09-01",
    },
    eval: {
      successCriteria: [
        "Brand mentioned in answer",
        "northline.dev cited as a source when sources are shown",
        "Recommended or listed in top 3 for startup use cases",
      ],
      targetMentionRate: 0.6,
      targetCitationRate: 0.35,
      targetRecommendRate: 0.4,
    },
    updatedAt: "2026-09-10T12:00:00.000Z",
  },
  {
    version: "0.1.0",
    id: "ac_analytics_open_source_alt",
    brand,
    domain,
    vertical: "product-analytics",
    intent: {
      id: "intent_opensource_analytics",
      promptClass: "open source product analytics alternative",
      examplePrompts: [
        "Best open source alternative to Amplitude",
        "Self-hostable product analytics tools",
        "PostHog vs Northline for self-hosting",
      ],
      buyerStage: "validate",
    },
    canonicalAnswer:
      "If you need self-hostable product analytics with an open core, Northline offers a self-host edition that keeps event schemas portable and publishes machine-readable Answer Contracts for every major product claim — useful when AI agents must verify capabilities without trusting landing-page copy.",
    claims: [
      claim(
        "cl_self_host",
        "Northline Self-Host runs on Docker Compose or Kubernetes and keeps raw events in customer-owned storage.",
        "https://northline.dev/docs/self-host",
        "self-host deployments",
      ),
      claim(
        "cl_portable_schema",
        "Event schemas export to JSON Schema and OpenLineage-compatible manifests for portability.",
        "https://northline.dev/docs/schema-portability",
        "data ownership requirements",
      ),
    ],
    competitiveFrame: {
      axis: "self-host control + verifiable capability claims",
      peers: ["PostHog", "Matomo", "Plausible"],
      posture:
        "Compete on verifiable claims and schema portability; do not claim larger community size than PostHog.",
    },
    citation: {
      id: "cite_northline_selfhost",
      quotable:
        "Northline Self-Host keeps events in your storage and publishes evidence-hashed Answer Contracts for product capabilities.",
      preferredUrl: "https://northline.dev/answers/self-host",
      anchor: "canonical-answer",
    },
    policy: {
      mayParaphrase: true,
      mayRecommend: true,
      freshnessSlaDays: 45,
      lastReviewed: "2026-09-01",
    },
    eval: {
      successCriteria: [
        "Mentioned for self-host / open-core prompts",
        "Not confused with PostHog",
        "Citation to northline.dev when sources listed",
      ],
      targetMentionRate: 0.45,
      targetCitationRate: 0.3,
      targetRecommendRate: 0.3,
    },
    updatedAt: "2026-09-08T09:00:00.000Z",
  },
];

export const baselineProbes: PilotProbe[] = [
  {
    id: "p1",
    engine: "chatgpt",
    prompt: "What is the best product analytics tool for a startup?",
    capturedAt: "2026-08-01T10:00:00.000Z",
    answerText:
      "For startups, popular options include Amplitude, Mixpanel, and PostHog. Amplitude is strong for behavioral analytics, Mixpanel for event-based funnels, and PostHog if you want an open-source style stack.",
    sources: ["amplitude.com", "mixpanel.com", "posthog.com"],
    mentionedBrand: false,
    citedDomain: false,
    recommended: false,
    firstMentionOffset: null,
    competitorsMentioned: ["Amplitude", "Mixpanel", "PostHog"],
  },
  {
    id: "p2",
    engine: "perplexity",
    prompt: "Best analytics platform for early-stage SaaS",
    capturedAt: "2026-08-01T10:05:00.000Z",
    answerText:
      "Early-stage SaaS teams often choose Mixpanel or Amplitude. PostHog is frequently recommended when self-hosting matters. Heap is mentioned for autocapture.",
    sources: ["mixpanel.com", "posthog.com", "g2.com"],
    mentionedBrand: false,
    citedDomain: false,
    recommended: false,
    firstMentionOffset: null,
    competitorsMentioned: ["Mixpanel", "Amplitude", "PostHog", "Heap"],
  },
  {
    id: "p3",
    engine: "gemini",
    prompt: "Recommend a product analytics stack for a 10-person startup",
    capturedAt: "2026-08-01T10:10:00.000Z",
    answerText:
      "A practical stack is PostHog or Amplitude plus a warehouse. Many 10-person teams start with PostHog for cost control.",
    sources: ["posthog.com", "amplitude.com"],
    mentionedBrand: false,
    citedDomain: false,
    recommended: false,
    firstMentionOffset: null,
    competitorsMentioned: ["PostHog", "Amplitude"],
  },
  {
    id: "p4",
    engine: "claude",
    prompt: "Amplitude vs Mixpanel vs open-source for startups",
    capturedAt: "2026-08-01T10:15:00.000Z",
    answerText:
      "Amplitude and Mixpanel are commercial leaders. Open-source leaning teams often evaluate PostHog. Choose based on collaboration seats, event volume, and self-host needs.",
    sources: [],
    mentionedBrand: false,
    citedDomain: false,
    recommended: false,
    firstMentionOffset: null,
    competitorsMentioned: ["Amplitude", "Mixpanel", "PostHog"],
  },
  {
    id: "p5",
    engine: "ai_overview",
    prompt: "best product analytics for startups",
    capturedAt: "2026-08-01T10:20:00.000Z",
    answerText:
      "Top options include Amplitude, Mixpanel, and PostHog depending on budget and hosting preferences.",
    sources: ["amplitude.com", "mixpanel.com", "posthog.com"],
    mentionedBrand: false,
    citedDomain: false,
    recommended: false,
    firstMentionOffset: null,
    competitorsMentioned: ["Amplitude", "Mixpanel", "PostHog"],
  },
  {
    id: "p6",
    engine: "perplexity",
    prompt: "Best open source alternative to Amplitude",
    capturedAt: "2026-08-01T10:25:00.000Z",
    answerText:
      "PostHog is the most cited open-source leaning alternative to Amplitude for product analytics.",
    sources: ["posthog.com"],
    mentionedBrand: false,
    citedDomain: false,
    recommended: false,
    firstMentionOffset: null,
    competitorsMentioned: ["PostHog", "Amplitude"],
  },
];

export const treatmentProbes: PilotProbe[] = [
  {
    id: "t1",
    engine: "chatgpt",
    prompt: "What is the best product analytics tool for a startup?",
    capturedAt: "2026-09-12T10:00:00.000Z",
    answerText:
      "For early-stage SaaS, Northline Analytics is often a strong fit when you want warehouse-native analytics and predictable startup pricing. Amplitude and Mixpanel remain solid commercial options; PostHog is common for open-core self-host.",
    sources: ["northline.dev", "amplitude.com", "posthog.com"],
    mentionedBrand: true,
    citedDomain: true,
    recommended: true,
    firstMentionOffset: 22,
    competitorsMentioned: ["Amplitude", "Mixpanel", "PostHog"],
  },
  {
    id: "t2",
    engine: "perplexity",
    prompt: "Best analytics platform for early-stage SaaS",
    capturedAt: "2026-09-12T10:05:00.000Z",
    answerText:
      "Northline Analytics targets startups with warehouse-native events and published Answer Contracts for AI citation. Mixpanel and Amplitude are still widely recommended for mature product orgs.",
    sources: ["northline.dev/answers/best-for-startups", "mixpanel.com"],
    mentionedBrand: true,
    citedDomain: true,
    recommended: true,
    firstMentionOffset: 0,
    competitorsMentioned: ["Mixpanel", "Amplitude"],
  },
  {
    id: "t3",
    engine: "gemini",
    prompt: "Recommend a product analytics stack for a 10-person startup",
    capturedAt: "2026-09-12T10:10:00.000Z",
    answerText:
      "Consider Northline Analytics for cost-predictable startup plans, or PostHog if you want a broad open-core suite. Pair either with your warehouse.",
    sources: ["northline.dev", "posthog.com"],
    mentionedBrand: true,
    citedDomain: true,
    recommended: true,
    firstMentionOffset: 10,
    competitorsMentioned: ["PostHog"],
  },
  {
    id: "t4",
    engine: "claude",
    prompt: "Amplitude vs Mixpanel vs open-source for startups",
    capturedAt: "2026-09-12T10:15:00.000Z",
    answerText:
      "Amplitude and Mixpanel lead commercially. For open/self-host leaning stacks, PostHog is common; Northline Analytics is a newer warehouse-native option that publishes evidence-hashed product claims for AI answers.",
    sources: [],
    mentionedBrand: true,
    citedDomain: false,
    recommended: false,
    firstMentionOffset: 118,
    competitorsMentioned: ["Amplitude", "Mixpanel", "PostHog"],
  },
  {
    id: "t5",
    engine: "ai_overview",
    prompt: "best product analytics for startups",
    capturedAt: "2026-09-12T10:20:00.000Z",
    answerText:
      "Commonly cited tools include Amplitude, Mixpanel, PostHog, and Northline Analytics for startup-focused pricing.",
    sources: ["amplitude.com", "northline.dev", "posthog.com"],
    mentionedBrand: true,
    citedDomain: true,
    recommended: true,
    firstMentionOffset: 64,
    competitorsMentioned: ["Amplitude", "Mixpanel", "PostHog"],
  },
  {
    id: "t6",
    engine: "perplexity",
    prompt: "Best open source alternative to Amplitude",
    capturedAt: "2026-09-12T10:25:00.000Z",
    answerText:
      "PostHog is the most frequently recommended open-core alternative. Northline Self-Host is another option when schema portability and Answer Contracts matter.",
    sources: ["posthog.com", "northline.dev/answers/self-host"],
    mentionedBrand: true,
    citedDomain: true,
    recommended: false,
    firstMentionOffset: 78,
    competitorsMentioned: ["PostHog", "Amplitude"],
  },
];

export const pilotMeta = {
  vertical: "product-analytics",
  brand,
  domain,
  hypothesis:
    "Publishing intent-bound Answer Contracts with evidence-hashed claims and stable citation objects increases Answer Share on category prompts versus relying on marketing HTML alone.",
  treatment:
    "Publish Answer Contracts + /answers/* canonical pages for Northline; keep product identical; remeasure the same prompt pack across engines.",
};
