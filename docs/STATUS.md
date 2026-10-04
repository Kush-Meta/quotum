# Status snapshot

Checked / updated: **2026-10-04**

## Moves

| Move | State |
| --- | --- |
| 1. Ship experiment → `main` | **Done** — [PR #1](https://github.com/Kush-Meta/quotum/pull/1) merged. `main` includes agentspace, experiment, `/t/`, seals, `llms.txt`. |
| 1b. Production redeploy | **Pending** — Vercel still serves old homepage meta and `/llms.txt` 404. You: `npx vercel --prod` with `PUBLIC_ORIGIN=https://quotum.vercel.app`. See [COLLAB.md](./COLLAB.md). |
| 2. GitHub About | **Pending** — UI paste (no API). See below. |
| 3. Harden + integrate prep | **In branch** — `cursor/quotum-harden-integrate-ebac`: durable Upstash traffic, `audit:llmstxt`, `score:wave`, `/verify`, Quotum brand for scoring. |
| 4. Measurement wave 1 | **Partial** — SERP baseline in [`data/live/wave1.results.json`](../data/live/wave1.results.json). Generative chat scoring: paste into template → `npm run score:wave`. Holdouts unpublished. |

## Wave 1 finding

Unassisted DuckDuckGo for “What is an Answer Contract?” returns **legal** Answer—Contract debt forms, not Quotum (term collision). Brand-assisted queries surface Quotum. Provisional unassisted Answer Share ≈ **0**.

## About paste

- Description: `Sealed Answer Contracts for generative engines — publish verifiable answers agents can cite, then measure Answer Share.`
- Website: `https://quotum.vercel.app`
- Topics: `answer-contracts`, `answer-share`, `geo`, `generative-engines`, `llm`, `ai-citation`, `ed25519`, `nextjs`, `typescript`, `agentspace`

## Your checklist

Full steps: [COLLAB.md](./COLLAB.md). Short version: (1) redeploy, (2) About, (3) optional Upstash + chat captures.
