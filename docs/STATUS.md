# Status snapshot

Checked / updated: **2026-09-23**

## Moves

| Move | State |
| --- | --- |
| 1. Ship experiment → `main` | **Done** — [PR #1](https://github.com/Kush-Meta/quotum/pull/1) merged. `main` now includes agentspace, experiment, `/t/`, seals, `llms.txt`. |
| 1b. Production redeploy | **Pending** — Vercel still serves old homepage meta and `/llms.txt` 404 after ~90s. Run on Mac: `cd ~/quotum && git checkout main && git pull && npx vercel --prod` with `PUBLIC_ORIGIN=https://quotum.vercel.app`. |
| 2. GitHub About | **Pending** — UI paste (no API). See below. |
| 3. Measurement wave 1 | **Partial** — SERP baseline in [`data/live/wave1.results.json`](../data/live/wave1.results.json). Generative chat scoring still manual. Holdouts unpublished. |

## Wave 1 finding

Unassisted DuckDuckGo for “What is an Answer Contract?” returns **legal** Answer—Contract debt forms, not Quotum (term collision). Brand-assisted queries surface Quotum. Provisional unassisted Answer Share ≈ **0**.

## About paste

- Description: `Sealed Answer Contracts for generative engines — publish verifiable answers agents can cite, then measure Answer Share.`
- Website: `https://quotum.vercel.app`
- Topics: `answer-contracts`, `answer-share`, `geo`, `generative-engines`, `llm`, `ai-citation`, `ed25519`, `nextjs`, `typescript`, `agentspace`
