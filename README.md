# Quotum

**Answer Contracts for generative engines.**

SEO gave the web sitemaps for pages. Quotum gives companies **contracts for answers** — intent-bound, evidence-hashed, citation-ready objects — plus a transparent **Answer Share** score so you can run a real pilot and measure lift.

## What this is

| Piece | Role |
| --- | --- |
| **Answer Contract** | Canonical answer + claims + competitive frame + citation object for one buyer intent |
| **Publish surface** | Machine index at `/api/publish` (not llms.txt, not a chatbot) |
| **Pilot Lab** | Baseline vs treatment Answer Share for a product-analytics vertical |

## What this is not

- Not an `llms.txt` checklist
- Not Microsoft NLWeb `/ask` (on-site chat)
- Not a GEO mention dashboard as the product

## Quick start

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:3847](http://127.0.0.1:3847).

Full docs: [`docs/`](./docs/README.md).

## Public deploy (Phase 2)

Contracts must be on a crawlable host for generative engines to cite them.

- Deploy guide: [`docs/DEPLOY.md`](./docs/DEPLOY.md)
- Remeasure protocol: [`docs/PHASE2_REMEASURE.md`](./docs/PHASE2_REMEASURE.md)
- Smoke test: `./scripts/smoke-public.sh https://YOUR_ORIGIN`

Temporary public preview (claim to keep):  
https://temporary-snappy-cello-o9ij081.vercel.app  
Claim: https://vercel.com/claim-deployment?code=be9de08c-a308-4b94-a20d-711bdd71d606

## Pilot vertical

**Product analytics for startups** — fictional brand *Northline Analytics* (`northline.dev`) so we can publish contracts and measure Answer Share without impersonating a real vendor.

- Studio: edit / validate contracts  
- Publish: machine-readable graph + `/.well-known/answer-contracts.json`  
- Canonical answers: `/answers/<contract-id>`  
- Pilot Lab: **live baseline** + simulated treatment reference  

### Live baseline (Phase 1 — done)

| Brand | Answer Share |
| --- | ---: |
| PostHog | **89.7** |
| Amplitude | 62.1 |
| Mixpanel | 36.8 |
| Heap | 13.2 |
| **Northline Analytics** | **0** |

Capture engine: Duck.ai (Perplexity blocked by login). Prior Bing/DDG SERP captures kept at `data/live/captures.serp.json`.

```bash
npm run ingest:live -- data/live/captures.raw.json
```

### Treatment (Phase 2 — next)

Publish Answer Contracts + canonical `/answers/*` pages on a crawlable host, then remeasure the same prompt pack. Localhost cannot produce real generative-engine lift until contracts are publicly discoverable.

```
Answer Share = 100 × (0.35·mention + 0.30·recommend + 0.25·citation + 0.10·prominence)
```

Simulated treatment on the demo probe pack still shows **0 → 82.8** for methodology comparison only.

## API

- `GET /api/publish` — contract index  
- `GET /api/publish/contracts/:id` — single contract  
- `GET /.well-known/answer-contracts.json` — discovery index  
- `GET /api/pilot` — simulated + live baseline scores  
- `POST /api/validate` — schema validation  
- `GET/POST /api/contracts` · `GET/PUT /api/contracts/:id` — studio persistence  

## Stack

Next.js · TypeScript · Tailwind · Zod

## License

MIT — see [`LICENSE`](./LICENSE).
