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
- Experiment merged to `main` (PR #1)
- Harden prep in branch: Upstash traffic, `llms.txt` audit, wave scoring CLI, `/verify` demo
- Northline / Phase 1–4 harness as **archive** (methodology, not the product story)

## Now (next 3 moves — needs you)

See [COLLAB.md](./COLLAB.md) and [STATUS.md](./STATUS.md).

### 1. Ship the positioning deploy

Production still serves old homepage meta and 404s `/llms.txt`, while `/agentspace` is live.

```bash
cd ~/quotum && git checkout main && git pull
npx vercel --prod
# Vercel env: PUBLIC_ORIGIN=https://quotum.vercel.app
# Optional: UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
```

**Done when:** homepage title has “Sealed Answer Contracts”, `/llms.txt` 200, `/verify` works after harden merge, agentspace still lists sealed contracts.

### 2. Finish GitHub About

Manual (UI only): description, website `https://quotum.vercel.app`, topics — see [STATUS.md](./STATUS.md).

### 3. Measurement wave 1 (generative)

1. Copy `data/live/wave1.chats.template.json` → `wave1.chats.json` and paste answers.
2. Prefer citing `/t/<token>` URLs when the model offers a link.
3. `npm run score:wave -- data/live/wave1.chats.json`
4. Leave holdouts unpublished until after wave 1.

**Done when:** one scored Answer Share file for published intents + zero/near-zero on holdouts + any `/t/` hits logged (durable if Upstash is set).

## Next (after the three)

| Priority | Work | Why |
| --- | --- | --- |
| P0 | Merge harden branch → `main` + redeploy | `/verify`, durable traffic, scoring CLI live |
| P1 | Google Search Console + sitemap ping | Organic discovery for answer pages |
| P1 | Third-party mentions (short post / gist / HN Show) | Break “Answer Contract” term collision with legal forms / RAG schemas |
| P1 | Publish one holdout after wave 1; remeasure | Causal contrast |
| P2 | GEO Optimizer / geo-watch style watchers (complement, don’t replace seals) | Attractiveness via OSS adjacency |
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
| Traffic | Filesystem local; Upstash REST on Vercel when configured |

## Doc map

Start at [docs/README.md](./README.md). You + agent split: [COLLAB.md](./COLLAB.md). Canonical product thesis: [OVERVIEW.md](./OVERVIEW.md). Live experiment: [REAL_EXPERIMENT.md](./REAL_EXPERIMENT.md).
