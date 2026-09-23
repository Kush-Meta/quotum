# Status snapshot

Checked: **2026-09-23**

## GitHub (`Kush-Meta/quotum`)

| Item | State |
| --- | --- |
| Default branch `main` README | Sealed Answer Contracts positioning (updated) |
| Site meta / hero on `main` | Sealed positioning (updated) |
| `public/llms.txt` on `main` | Present |
| Experiment branch | `cursor/real-answer-experiment-ebac` — full agentspace + seals |
| **About description** | Still old: “Answer Contracts for generative engines — measure Answer Share” |
| **Homepage URL** | Still empty |
| **Topics** | `answer-contracts`, `generative-engines`, `geo`, `nextjs`, `typescript` (missing answer-share, llm, ai-citation, ed25519, agentspace) |

About is edited only in the GitHub UI (gear next to About). Suggested paste:

- **Description:** `Sealed Answer Contracts for generative engines — publish verifiable answers agents can cite, then measure Answer Share.`
- **Website:** `https://quotum.vercel.app`
- **Topics:** `answer-contracts`, `answer-share`, `geo`, `generative-engines`, `llm`, `ai-citation`, `ed25519`, `nextjs`, `typescript`, `agentspace`

## Production (`https://quotum.vercel.app`)

| Surface | HTTP | Notes |
| --- | --- |
| `/` | 200 | **Old** title/description (“Quotum — Answer Contracts”) |
| `/agentspace` | 200 | Live; 4 sealed contracts |
| `/experiment` | 200 | Live dashboard |
| `/api/agentspace` | 200 | Sealed index |
| `/.well-known/quotum-pubkey.json` | 200 | OK |
| `/sitemap.xml` | 200 | OK |
| `/llms.txt` | **404** | On git `main` / experiment, not on this deploy |

Production is an older experiment deploy: agentspace works, homepage meta + `llms.txt` do not match the latest positioning commits.

## Local (when running)

```bash
cd quotum   # or clone Kush-Meta/quotum
npm install && npm run seal:real && npm run dev
# http://127.0.0.1:3847 — sealed meta + /llms.txt
```

## Immediate gaps

1. Set GitHub About (manual).
2. Redeploy production from `cursor/real-answer-experiment-ebac` (or merge experiment → `main` and deploy `main`) so meta + `llms.txt` match git.
3. Durable traffic store (Vercel filesystem is ephemeral — `/t/` hits reset on cold starts).
4. Run measurement wave 1 (prompts → annotate Answer Share → compare holdouts).
