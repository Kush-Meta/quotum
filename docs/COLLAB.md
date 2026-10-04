# Collaborative checklist

What **you** do (needs your Mac / GitHub / Vercel login) vs what lands in git.

## You — three moves

### 1. Redeploy production from `main` (or this branch after merge)

On your Mac (Vercel CLI already logged in):

```bash
cd ~/quotum   # or fresh clone
git fetch origin
git checkout cursor/quotum-harden-integrate-ebac && git pull
npx vercel --prod
```

In Vercel project env, set:

- `PUBLIC_ORIGIN=https://quotum.vercel.app`
- **Required for seal verify:** `QUOTUM_PRIVATE_KEY_PEM` = contents of the private key that sealed `data/sealed-contracts.json` (same PEM you use locally under `data/keys/ed25519.private.pem`)
- Optional (durable `/t/` hits): `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` from a free Upstash Redis DB

After changing the private key env, redeploy. Then check:

```bash
curl -s https://quotum.vercel.app/.well-known/quotum-pubkey.json | jq .keyId
# must match seal.keyId on a sealed contract
```

**Done when:**

- Homepage title contains “Sealed Answer Contracts”
- `https://quotum.vercel.app/llms.txt` returns 200 plaintext
- `https://quotum.vercel.app/verify` loads and can verify a sealed contract
- Agentspace still lists the sealed contracts

### 2. GitHub About (UI only — no API)

Repo → ⚙️ About:

- **Description:** `Sealed Answer Contracts for generative engines — publish verifiable answers agents can cite, then measure Answer Share.`
- **Website:** `https://quotum.vercel.app`
- **Topics:** `answer-contracts`, `answer-share`, `geo`, `generative-engines`, `llm`, `ai-citation`, `ed25519`, `nextjs`, `typescript`, `agentspace`

### 3. Wave 1 generative captures (optional but unlocks Answer Share)

1. Copy `data/live/wave1.chats.template.json` → `wave1.chats.json`
2. Ask ChatGPT / Perplexity / Claude / Gemini / Duck.ai the published prompts
3. Paste full answers + any cited URLs into the JSON
4. Run: `npm run score:wave -- data/live/wave1.chats.json`
5. Commit `wave1.answer-share.json` when you want it in the repo

Leave holdout prompts unpublished until after this wave.

## Already in this branch (agent)

| Piece | What it does |
| --- | --- |
| Upstash-backed `traffic.ts` | Durable attribution hits when Redis env is set |
| `npm run audit:llmstxt` | CI-friendly check that `llms.txt` links sealed contracts |
| `npm run score:wave` | Turns chat captures into Answer Share JSON |
| `/verify` | Browser seal check against agentspace + pubkey |
| Quotum in `TRACKED_BRANDS` | Wave scoring targets Quotum, not Northline |
| `QUOTUM_PRIVATE_KEY_PEM` | Durable seal key on Vercel (no ephemeral keypairs) |

## After those three

Then we can layer GEO Optimizer / complementary `llms.txt` tooling / MCP packaging — not before the live surface and About match git.
