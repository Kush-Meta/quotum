# Status snapshot

Checked / updated: **2026-09-23**

## Execution in progress

| Move | State |
| --- | --- |
| 1. Ship experiment → `main` + redeploy | PR [#1](https://github.com/Kush-Meta/quotum/pull/1) open (conflicts). Ship branch `cursor/ship-experiment-main-ebac` in progress. Vercel CLI has no token here — Mac `npx vercel --prod` if auto-deploy is off. |
| 2. GitHub About | Still needs UI paste (no API). |
| 3. Measurement wave 1 | SERP baseline in `data/live/wave1.results.json`. Generative chat scoring still manual. |

## Wave 1 finding (so far)

Unassisted DuckDuckGo queries for “What is an Answer Contract?” hit **legal** Answer—Contract forms, not Quotum. Brand-assisted queries surface Quotum. Keep holdouts unpublished.

## About paste

- Description: `Sealed Answer Contracts for generative engines — publish verifiable answers agents can cite, then measure Answer Share.`
- Website: `https://quotum.vercel.app`
- Topics: `answer-contracts`, `answer-share`, `geo`, `generative-engines`, `llm`, `ai-citation`, `ed25519`, `nextjs`, `typescript`, `agentspace`
