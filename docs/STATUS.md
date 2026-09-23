# Status snapshot

Checked / updated: **2026-09-23**

## Execution in progress

| Move | State |
| --- | --- |
| 1. Ship experiment → `main` + redeploy | PR [#1](https://github.com/Kush-Meta/quotum/pull/1) open (conflicts). Ship branch `cursor/ship-experiment-main-ebac` started (has `llms.txt`). Vercel CLI has no token in this environment — Mac `npx vercel --prod` still required if GitHub→Vercel auto-deploy is off. |
| 2. GitHub About | Still needs UI paste (no API). |
| 3. Measurement wave 1 | SERP baseline recorded in `data/live/wave1.results.json`. Generative chat scoring still manual. |

## GitHub

| Item | State |
| --- | --- |
| README / meta on git | Sealed positioning present |
| About description | Still old |
| Homepage | Empty |
| Topics | Partial |

## Production (`https://quotum.vercel.app`)

| Surface | Notes |
| --- | --- |
| `/agentspace` | Live (4 sealed contracts) |
| `/` meta | Still old until redeploy |
| `/llms.txt` | 404 until redeploy |

## Wave 1 finding (so far)

Unassisted DuckDuckGo queries for “What is an Answer Contract?” hit **legal** Answer—Contract forms, not Quotum. Brand-assisted queries surface Quotum. Next: score generative chats; keep holdouts unpublished.

## About paste

- Description: `Sealed Answer Contracts for generative engines — publish verifiable answers agents can cite, then measure Answer Share.`
- Website: `https://quotum.vercel.app`
- Topics: `answer-contracts`, `answer-share`, `geo`, `generative-engines`, `llm`, `ai-citation`, `ed25519`, `nextjs`, `typescript`, `agentspace`
