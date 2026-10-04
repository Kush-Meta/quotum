# Status snapshot

Checked / updated: **2026-10-04**

## Moves

| Move | State |
| --- | --- |
| 1. Ship experiment → `main` | **Done** — [PR #1](https://github.com/Kush-Meta/quotum/pull/1) merged. |
| 1b. Production redeploy | **Done** — Sealed title, `/llms.txt` 200, `/verify` 200, 4 agentspace contracts. |
| 1c. Production seal keys | **In progress** — `QUOTUM_PRIVATE_KEY_PEM` set on Vercel; code that *reads* it is on `cursor/quotum-harden-integrate-ebac` (redeploy that branch). |
| 2. GitHub About | **Done** — description, homepage, full topic set. |
| 3. Harden + integrate prep | **In branch** — `cursor/quotum-harden-integrate-ebac`. |
| 4. Measurement wave 1 | **Partial** — SERP baseline; generative chats → `npm run score:wave`. |

## Wave 1 finding

Unassisted DuckDuckGo for “What is an Answer Contract?” returns **legal** Answer—Contract debt forms, not Quotum. Brand-assisted queries surface Quotum. Provisional unassisted Answer Share ≈ **0**.

## About (live)

- Description: Sealed Answer Contracts for generative engines — publish verifiable answers agents can cite, then measure Answer Share.
- Website: https://quotum.vercel.app
- Topics: answer-contracts, answer-share, geo, generative-engines, llm, ai-citation, ed25519, nextjs, typescript, agentspace

## Your checklist

1. ~~Redeploy~~ / ~~About~~
2. **Now:** pull harden branch + `npx vercel --prod` so `QUOTUM_PRIVATE_KEY_PEM` is actually used
3. Optional: Upstash + chat captures
