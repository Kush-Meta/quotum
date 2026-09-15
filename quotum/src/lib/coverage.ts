import type { AnswerContract } from "./schema";
import { LIVE_PROMPT_PACK } from "./probe";

export type PromptCoverageRow = {
  prompt: string;
  contractIds: string[];
  covered: boolean;
};

export type PromptCoverageReport = {
  version: "0.1.0";
  phase: "phase3";
  generatedAt: string;
  promptCount: number;
  coveredCount: number;
  uncovered: string[];
  rows: PromptCoverageRow[];
  contracts: Array<{
    id: string;
    promptClass: string;
    examplePromptCount: number;
    claimCount: number;
  }>;
};

/** Map each LIVE_PROMPT_PACK prompt to contracts that list it in examplePrompts. */
export function buildPromptCoverage(
  contracts: AnswerContract[],
): PromptCoverageReport {
  const rows: PromptCoverageRow[] = LIVE_PROMPT_PACK.map((prompt) => {
    const contractIds = contracts
      .filter((c) => c.intent.examplePrompts.includes(prompt))
      .map((c) => c.id);
    return {
      prompt,
      contractIds,
      covered: contractIds.length > 0,
    };
  });

  const uncovered = rows.filter((r) => !r.covered).map((r) => r.prompt);

  return {
    version: "0.1.0",
    phase: "phase3",
    generatedAt: new Date().toISOString(),
    promptCount: rows.length,
    coveredCount: rows.filter((r) => r.covered).length,
    uncovered,
    rows,
    contracts: contracts.map((c) => ({
      id: c.id,
      promptClass: c.intent.promptClass,
      examplePromptCount: c.intent.examplePrompts.length,
      claimCount: c.claims.length,
    })),
  };
}

export function assertFullPromptCoverage(report: PromptCoverageReport): void {
  if (report.uncovered.length > 0) {
    throw new Error(
      `Phase 3 coverage incomplete. Uncovered prompts:\n- ${report.uncovered.join("\n- ")}`,
    );
  }
}
