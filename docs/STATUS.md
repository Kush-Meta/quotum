# Status snapshot

Checked / updated: **2026-10-04**

## Moves

| Move | State |
| --- | --- |
| 1. Ship experiment → `main` | **Done** — [PR #1](https://github.com/Kush-Meta/quotum/pull/1) merged. |
| 1b. Production redeploy | **Done** — Sealed title, `/llms.txt` 200, `/verify` 200, 4 agentspace contracts. |
| 1c. Production seal keys | **Broken** — live pubkey `keyId` ≠ sealed contracts. Fix via durable prod key env or re-seal. |
| 2. GitHub About | **Almost** — description + homepage set. Topics still need the zsh-quoted `gh api` PUT (brackets were globbed). |
| 3. Harden + integrate prep | **In branch** — `cursor/quotum-harden-integrate-ebac`. |
| 4. Measurement wave 1 | **Partial** — SERP baseline; generative chats → `npm run score:wave`. |

## Wave 1 finding

Unassisted DuckDuckGo for “What is an Answer Contract?” returns **legal** Answer—Contract debt forms, not Quotum. Brand-assisted queries surface Quotum. Provisional unassisted Answer Share ≈ **0**.

## About (current)

- Description: ✅ `Sealed Answer Contracts for generative engines — publish verifiable answers agents can cite, then measure Answer Share.`
- Website: ✅ `https://quotum.vercel.app`
- Topics still missing: `answer-share`, `llm`, `ai-citation`, `ed25519`, `agentspace` (plus keep existing)

## Your checklist

1. ~~Redeploy~~
2. About — finish topics (zsh-quoted command), then seal-key fix
3. Optional: Upstash + chat captures
