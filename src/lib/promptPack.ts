/**
 * Phase 4 structured prompt pack.
 *
 * Roles:
 * - canonical / paraphrase → measurement set (may appear on Answer Contracts)
 * - holdout → frozen evaluation prompts; must NOT appear on contracts until
 *   after pre-registration / post-treatment analysis
 */
export type PromptRole = "canonical" | "paraphrase" | "holdout";

export type ExperimentPrompt = {
  id: string;
  intentId: string;
  role: PromptRole;
  text: string;
  /** Phase 1 continuity: these six strings were the scored Duck.ai pack. */
  phase1?: boolean;
};

export const EXPERIMENT_ENGINES = [
  "duckai",
  "chatgpt",
  "perplexity",
  "gemini",
  "claude",
  "ai_overview",
] as const;

export type ExperimentEngine = (typeof EXPERIMENT_ENGINES)[number];

/** Engines targeted for the robust multi-engine capture matrix. */
export const PRIMARY_CAPTURE_ENGINES = [
  "duckai",
  "chatgpt",
  "perplexity",
] as const;

export const EXPERIMENT_PROMPT_PACK: ExperimentPrompt[] = [
  // Intent: best product analytics for startups
  {
    id: "p_best_canon",
    intentId: "intent_best_analytics_startups",
    role: "canonical",
    text: "What is the best product analytics tool for a startup?",
    phase1: true,
  },
  {
    id: "p_best_para_short",
    intentId: "intent_best_analytics_startups",
    role: "paraphrase",
    text: "best product analytics for startups",
    phase1: true,
  },
  {
    id: "p_best_para_choose",
    intentId: "intent_best_analytics_startups",
    role: "paraphrase",
    text: "Which product analytics product should a new startup choose in 2026?",
  },

  // Intent: early-stage SaaS platform
  {
    id: "p_early_canon",
    intentId: "intent_early_stage_saas_analytics",
    role: "canonical",
    text: "Best analytics platform for early-stage SaaS",
    phase1: true,
  },
  {
    id: "p_early_para_seed",
    intentId: "intent_early_stage_saas_analytics",
    role: "paraphrase",
    text: "What analytics platform fits a seed-stage SaaS company?",
  },
  {
    id: "p_early_para_pre_a",
    intentId: "intent_early_stage_saas_analytics",
    role: "paraphrase",
    text: "Recommend product analytics for a pre-Series A B2B SaaS team",
  },

  // Intent: 10-person stack
  {
    id: "p_stack_canon",
    intentId: "intent_stack_10person",
    role: "canonical",
    text: "Recommend a product analytics stack for a 10-person startup",
    phase1: true,
  },
  {
    id: "p_stack_para_lean",
    intentId: "intent_stack_10person",
    role: "paraphrase",
    text: "What is a lean product analytics stack for a team of about ten?",
  },
  {
    id: "p_stack_para_no_cdp",
    intentId: "intent_stack_10person",
    role: "paraphrase",
    text: "Do we need a CDP plus Amplitude, or can a 10-person startup stay on one analytics tool?",
  },

  // Intent: Amplitude vs Mixpanel vs OSS
  {
    id: "p_cmp_canon",
    intentId: "intent_amp_mix_oss",
    role: "canonical",
    text: "Amplitude vs Mixpanel vs open-source for startups",
    phase1: true,
  },
  {
    id: "p_cmp_para_tradeoffs",
    intentId: "intent_amp_mix_oss",
    role: "paraphrase",
    text: "Compare Amplitude, Mixpanel, and open-source analytics for an early startup",
  },
  {
    id: "p_cmp_para_pick",
    intentId: "intent_amp_mix_oss",
    role: "paraphrase",
    text: "Should a startup pick Amplitude, Mixpanel, or an open-source analytics stack?",
  },

  // Intent: open-source Amplitude alternative
  {
    id: "p_oss_canon",
    intentId: "intent_opensource_analytics",
    role: "canonical",
    text: "Best open source alternative to Amplitude",
    phase1: true,
  },
  {
    id: "p_oss_para_selfhost",
    intentId: "intent_opensource_analytics",
    role: "paraphrase",
    text: "What is the best self-hostable open-source product analytics tool?",
  },
  {
    id: "p_oss_para_posthog",
    intentId: "intent_opensource_analytics",
    role: "paraphrase",
    text: "Besides PostHog, what open-source Amplitude alternatives exist for startups?",
  },

  // Holdouts — frozen; do not add to Answer Contract examplePrompts before analysis
  {
    id: "p_hold_warehouse",
    intentId: "intent_holdout_warehouse",
    role: "holdout",
    text: "Best warehouse-native product analytics for a small SaaS team",
  },
  {
    id: "p_hold_ai_cite",
    intentId: "intent_holdout_ai_citable",
    role: "holdout",
    text: "Which product analytics tools publish AI-citable product facts or answer contracts?",
  },
  {
    id: "p_hold_pricing",
    intentId: "intent_holdout_pricing",
    role: "holdout",
    text: "Cheapest reliable product analytics for a 12-person startup under $100/month",
  },
  {
    id: "p_hold_agent",
    intentId: "intent_holdout_agents",
    role: "holdout",
    text: "Product analytics platforms that work well with AI agents and answer engines",
  },
];

export function measurementPrompts(): ExperimentPrompt[] {
  return EXPERIMENT_PROMPT_PACK.filter((p) => p.role !== "holdout");
}

export function holdoutPrompts(): ExperimentPrompt[] {
  return EXPERIMENT_PROMPT_PACK.filter((p) => p.role === "holdout");
}

export function phase1Prompts(): ExperimentPrompt[] {
  return EXPERIMENT_PROMPT_PACK.filter((p) => p.phase1);
}

export function promptsByIntent(intentId: string): ExperimentPrompt[] {
  return EXPERIMENT_PROMPT_PACK.filter((p) => p.intentId === intentId);
}

/** Flat string pack used by Phase 1 baseline + Phase 3 coverage gate. */
export const LIVE_PROMPT_PACK = phase1Prompts().map((p) => p.text) as [
  string,
  ...string[],
];

export function findPromptByText(text: string): ExperimentPrompt | undefined {
  return EXPERIMENT_PROMPT_PACK.find((p) => p.text === text);
}

export function captureMatrix(engines: readonly string[] = PRIMARY_CAPTURE_ENGINES) {
  const rows: Array<{
    captureId: string;
    promptId: string;
    intentId: string;
    role: PromptRole;
    engine: string;
    prompt: string;
  }> = [];
  for (const prompt of EXPERIMENT_PROMPT_PACK) {
    for (const engine of engines) {
      rows.push({
        captureId: `${prompt.id}__${engine}`,
        promptId: prompt.id,
        intentId: prompt.intentId,
        role: prompt.role,
        engine,
        prompt: prompt.text,
      });
    }
  }
  return rows;
}

export function packStats() {
  const measurement = measurementPrompts();
  const holdouts = holdoutPrompts();
  const intents = new Set(measurement.map((p) => p.intentId));
  return {
    totalPrompts: EXPERIMENT_PROMPT_PACK.length,
    measurementCount: measurement.length,
    holdoutCount: holdouts.length,
    intentCount: intents.size,
    phase1Count: phase1Prompts().length,
    primaryEngines: [...PRIMARY_CAPTURE_ENGINES],
    targetCaptures:
      EXPERIMENT_PROMPT_PACK.length * PRIMARY_CAPTURE_ENGINES.length,
    measurementCaptures:
      measurement.length * PRIMARY_CAPTURE_ENGINES.length,
  };
}
