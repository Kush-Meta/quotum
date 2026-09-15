import type { AnswerContract } from "./schema";
import {
  LIVE_PROMPT_PACK,
  EXPERIMENT_PROMPT_PACK,
  measurementPrompts,
  holdoutPrompts,
  packStats,
  type ExperimentPrompt,
} from "./promptPack";

export type PromptCoverageRow = {
  prompt: string;
  promptId?: string;
  role?: ExperimentPrompt["role"];
  intentId?: string;
  contractIds: string[];
  covered: boolean;
};

export type PromptCoverageReport = {
  version: "0.1.0";
  phase: "phase3" | "phase4";
  generatedAt: string;
  promptCount: number;
  coveredCount: number;
  uncovered: string[];
  holdoutLeaks: string[];
  rows: PromptCoverageRow[];
  contracts: Array<{
    id: string;
    promptClass: string;
    examplePromptCount: number;
    claimCount: number;
  }>;
  pack: ReturnType<typeof packStats>;
};

function contractExampleSet(contracts: AnswerContract[]): Set<string> {
  return new Set(contracts.flatMap((c) => c.intent.examplePrompts));
}

/** Phase 3 gate: every LIVE_PROMPT_PACK (phase-1) prompt maps to a contract. */
export function buildPromptCoverage(
  contracts: AnswerContract[],
): PromptCoverageReport {
  const rows: PromptCoverageRow[] = LIVE_PROMPT_PACK.map((prompt) => {
    const meta = EXPERIMENT_PROMPT_PACK.find((p) => p.text === prompt);
    const contractIds = contracts
      .filter((c) => c.intent.examplePrompts.includes(prompt))
      .map((c) => c.id);
    return {
      prompt,
      promptId: meta?.id,
      role: meta?.role,
      intentId: meta?.intentId,
      contractIds,
      covered: contractIds.length > 0,
    };
  });

  const examples = contractExampleSet(contracts);
  const holdoutLeaks = holdoutPrompts()
    .filter((p) => examples.has(p.text))
    .map((p) => p.text);

  return {
    version: "0.1.0",
    phase: "phase3",
    generatedAt: new Date().toISOString(),
    promptCount: rows.length,
    coveredCount: rows.filter((r) => r.covered).length,
    uncovered: rows.filter((r) => !r.covered).map((r) => r.prompt),
    holdoutLeaks,
    rows,
    contracts: contracts.map((c) => ({
      id: c.id,
      promptClass: c.intent.promptClass,
      examplePromptCount: c.intent.examplePrompts.length,
      claimCount: c.claims.length,
    })),
    pack: packStats(),
  };
}

/** Phase 4: measurement prompts (canonical+paraphrase) should be covered; holdouts must not leak. */
export function buildPhase4Coverage(
  contracts: AnswerContract[],
): PromptCoverageReport {
  const examples = contractExampleSet(contracts);
  const rows: PromptCoverageRow[] = measurementPrompts().map((meta) => {
    const contractIds = contracts
      .filter((c) => c.intent.examplePrompts.includes(meta.text))
      .map((c) => c.id);
    return {
      prompt: meta.text,
      promptId: meta.id,
      role: meta.role,
      intentId: meta.intentId,
      contractIds,
      covered: contractIds.length > 0,
    };
  });

  const holdoutLeaks = holdoutPrompts()
    .filter((p) => examples.has(p.text))
    .map((p) => p.text);

  return {
    version: "0.1.0",
    phase: "phase4",
    generatedAt: new Date().toISOString(),
    promptCount: rows.length,
    coveredCount: rows.filter((r) => r.covered).length,
    uncovered: rows.filter((r) => !r.covered).map((r) => r.prompt),
    holdoutLeaks,
    rows,
    contracts: contracts.map((c) => ({
      id: c.id,
      promptClass: c.intent.promptClass,
      examplePromptCount: c.intent.examplePrompts.length,
      claimCount: c.claims.length,
    })),
    pack: packStats(),
  };
}

export function assertFullPromptCoverage(report: PromptCoverageReport): void {
  if (report.uncovered.length > 0) {
    throw new Error(
      `Coverage incomplete. Uncovered prompts:\n- ${report.uncovered.join("\n- ")}`,
    );
  }
  if (report.holdoutLeaks.length > 0) {
    throw new Error(
      `Holdout leak: holdout prompts appear on contracts:\n- ${report.holdoutLeaks.join("\n- ")}`,
    );
  }
}
