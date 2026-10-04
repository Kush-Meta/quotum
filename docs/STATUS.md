# Status snapshot

Checked / updated: **2026-10-04** (prod rechecked)

## Moves

| Move | State |
| --- | --- |
| 1. Ship experiment → `main` | **Done** — [PR #1](https://github.com/Kush-Meta/quotum/pull/1) merged. |
| 1b. Production redeploy | **Done** — `https://quotum.vercel.app` title is Sealed Answer Contracts; `/llms.txt` 200; `/verify` 200; agentspace lists 4 contracts. |
| 1c. Production seal keys | **Broken** — live pubkey `keyId` ≠ sealed contracts (`signature_invalid`). Private key is gitignored; Vercel generated a different key than the seals were signed with. Fix: set durable `QUOTUM_PRIVATE_KEY_PEM` (or path) on Vercel matching the key that sealed `data/sealed-contracts.json`, redeploy, or re-seal with a fixed prod key. |
| 2. GitHub About | **Pending** — UI paste (no API). See below. |
| 3. Harden + integrate prep | **In branch** — `cursor/quotum-harden-integrate-ebac`. |
| 4. Measurement wave 1 | **Partial** — SERP baseline in [`data/live/wave1.results.json`](../data/live/wave1.results.json). Generative chats → `npm run score:wave`. |

## Wave 1 finding

Unassisted DuckDuckGo for “What is an Answer Contract?” returns **legal** Answer—Contract debt forms, not Quotum (term collision). Brand-assisted queries surface Quotum. Provisional unassisted Answer Share ≈ **0**.

## About paste

- Description: `Sealed Answer Contracts for generative engines — publish verifiable answers agents can cite, then measure Answer Share.`
- Website: `https://quotum.vercel.app`
- Topics: `answer-contracts`, `answer-share`, `geo`, `generative-engines`, `llm`, `ai-citation`, `ed25519`, `nextjs`, `typescript`, `agentspace`

## Your checklist

1. ~~Redeploy~~ **done**
2. **Next:** GitHub About (paste above)
3. Optional: Upstash env + chat captures; fix prod seal key (1c)
