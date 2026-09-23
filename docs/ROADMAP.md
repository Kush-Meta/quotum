# Quotum roadmap

Where we are, what to do next, and what can wait.

## North star

Brands publish **sealed Answer Contracts** that generative engines can discover, verify, and cite — then Quotum measures **Answer Share** and attribution traffic. Quotum itself is the first real subject ([REAL_EXPERIMENT.md](./REAL_EXPERIMENT.md)).

## Done (keep)

- Contract schema + Answer Share formula
- Agentspace (index, sealed JSON, verify API, pubkey)
- Ed25519 seals + `/t/<token>` attribution redirects
- Live experiment dashboard + holdout prompts
- Positioning copy on git (`README`, layout meta, homepage, `llms.txt`)
- Northline / Phase 1–4 harness as **archive** (methodology, not the product story)

## Now (next 3 moves)

### 1. Ship the positioning deploy

Production still serves old homepage meta and 404s `/llms.txt`, while `/agentspace` is live.

On the Mac (or any machine with Vercel auth):

```bash
git clone https://github.com/Kush-Meta/quotum.git && cd quotum
git checkout cursor/real-answer-experiment-ebac
git pull
# Optional: merge into main if Vercel tracks main
npx vercel --prod
# Set PUBLIC_ORIGIN=https://quotum.vercel.app in the Vercel project env
```

**Done when:**

- `https://quotum.vercel.app/` title contains “Sealed Answer Contracts”
- `https://quotum.vercel.app/llms.txt` returns 200 plaintext
- Agentspace still lists 4 sealed contracts

### 2. Finish GitHub About

Manual (UI only): description, website `https://quotum.vercel.app`, expanded topics — see [STATUS.md](./STATUS.md).

### 3. Measurement wave 1

1. Ask the published prompts (ChatGPT / Perplexity / Gemini / Claude / Duck.ai).
2. Prefer citing `/t/<token>` URLs when the model offers a link.
3. Annotate mention / recommend / citation / prominence → Answer Share.
4. Leave holdouts unpublished until after wave 1.
5. Record captures under `data/live/` (templates already exist).

**Done when:** one scored table for published intents + zero/near-zero expectation on holdouts + any `/t/` hits logged (even if ephemeral).

## Next (after wave 1)

| Priority | Work | Why |
| --- | --- | --- |
| P0 | Durable traffic store (KV / Postgres / Turso) | `/tmp` traffic dies on Vercel cold start |
| P0 | Merge experiment → `main` (or point Vercel at experiment) | One source of truth for deploy |
| P1 | Google Search Console + sitemap ping | Organic discovery for answer pages |
| P1 | Third-party mentions (short post / gist / HN Show) | Break “Answer Contract” term collision with RAG schemas |
| P1 | Publish one holdout after wave 1; remeasure | Causal contrast |
| P2 | Studio polish for non-Quotum brands | Productize beyond self-experiment |
| P2 | Multi-origin seals (customer pubkey on their domain) | Real multi-tenant story |

## Explicitly not next

- Auth / billing / multi-tenant SaaS shell
- Replacing `llms.txt` (complement it; don’t fight the tip file)
- Expanding to more fictional brands before wave 1 scores exist
- Another large schema rewrite

## Decision log (lightweight)

| Decision | Choice |
| --- | --- |
| Subject | Quotum itself, not Northline |
| Proof | Ed25519 seal + attribution token, not “trust us” |
| Score | Transparent Answer Share weights (see [ANSWER_SHARE.md](./ANSWER_SHARE.md)) |
| Discovery | Agentspace + answer pages + optional `llms.txt` hint |
| Promo | Unique phrasing + third-party refs before more self-host SEO |

## Doc map

Start at [docs/README.md](./README.md). Canonical product thesis: [OVERVIEW.md](./OVERVIEW.md). Live experiment: [REAL_EXPERIMENT.md](./REAL_EXPERIMENT.md).
