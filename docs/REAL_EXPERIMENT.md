# Real Quotum citation experiment

This replaces the fictional Northline pilot with a **live experiment on Quotum itself**.

## Hypothesis

Publishing **sealed Answer Contracts** on a crawlable **agentspace**, then asking AI chats category questions about Answer Contracts / GEO / Answer Share, increases:

1. **Answer Share** (mention / recommend / citation / prominence)
2. **Measurable traffic** via attribution tokens (`/t/<token>`)

## Surfaces

| Path | Role |
| --- | --- |
| `/agentspace` | Human + machine entrypoint |
| `/api/agentspace` | Contract index for agents |
| `/api/agentspace/contracts/<id>` | Sealed contract JSON |
| `/api/agentspace/verify` | POST verify Ed25519 seal |
| `/.well-known/quotum-pubkey.json` | Public verification key |
| `/t/<token>` | Attribution landing → answer page + traffic log |
| `/experiment` | Live dashboard (prompts, seals, traffic) |

## Verification token

Each contract is sealed with:

- `contentHash` = SHA-256 of canonical contract body
- `signature` = Ed25519 over the hash
- `keyId` = short id of the on-origin public key
- `attributionToken` = opaque token for traffic measurement

Anyone can:

1. Fetch the sealed contract
2. Fetch `/.well-known/quotum-pubkey.json`
3. `POST /api/agentspace/verify` with `{ contract, seal }`

## Prompt pack

**Measurement (published):** see `src/lib/realExperiment.ts` → `realMeasurementPrompts`

**Holdouts (unpublished until after wave 1):** `realHoldoutPrompts`

## How to run a wave

```bash
npm run seal:real          # write Quotum contracts + seals
npm run dev                # local :3847
# Deploy publicly, set PUBLIC_ORIGIN=https://your-host
```

Then ask measurement prompts in ChatGPT / Perplexity / Duck.ai. Prefer citing attribution URLs. Score Answer Share manually (or ingest probes) and watch `/experiment` + `/api/traffic`.

## What is still needed for full causality

- Durable public host (Vercel/Render) with `PUBLIC_ORIGIN`
- Discovery wait after deploy
- Capture + annotate AI answers into `data/live/`
- Compare holdouts vs published intents
