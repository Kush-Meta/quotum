# Quotum

**Answer Contracts for generative engines.**

SEO gave the web sitemaps for pages. Quotum gives companies **contracts for answers** — intent-bound, evidence-hashed, citation-ready objects — plus a transparent **Answer Share** score so you can run a real pilot and measure lift.

## What this is

| Piece | Role |
| --- | --- |
| **Answer Contract** | Canonical answer + claims + competitive frame + citation object for one buyer intent |
| **Publish surface** | Machine index at `/api/publish` (not llms.txt, not a chatbot) |
| **Results** (`/pilot`) | Marketer-readable baseline vs after-publish Answer Share for Northline |

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

## Phase 4 (robust experiment — done)

Multi-engine / paraphrase / holdout harness before durable deploy. Target n=45 measurement captures. See [`docs/PHASE4_ROBUST.md`](./docs/PHASE4_ROBUST.md).

```bash
npm run coverage:phase4
npm run aa:check
npm run power:guide
npm run report:robust
```

## Phase 3 (pre-deploy — done)

Full prompt-pack Answer Contract coverage, denser claims, JSON-LD on answer pages, and `npm run coverage:prompts`. See [`docs/PHASE3_COVERAGE.md`](./docs/PHASE3_COVERAGE.md).

## Public deploy (Phase 2)

Contracts must be on a crawlable host for generative engines to cite them.

- Deploy guide: [`docs/DEPLOY.md`](./docs/DEPLOY.md)
- Remeasure protocol: [`docs/PHASE2_REMEASURE.md`](./docs/PHASE2_REMEASURE.md)
- Smoke test: `./scripts/smoke-public.sh https://YOUR_ORIGIN`
- Set `PUBLIC_ORIGIN=https://your-host` so `/sitemap.xml`, `/robots.txt`, and discovery indexes emit absolute URLs

**Live tunnel (ephemeral, while this agent VM runs):**  
https://wright-contain-futures-ends.trycloudflare.com  

For a durable host: `npx vercel login && npx vercel --prod` (or Render Blueprint — see `docs/DEPLOY.md`).

## Pilot vertical

**Product analytics for startups** — fictional brand *Northline Analytics* (`northline.dev`) so we can publish contracts and measure Answer Share without impersonating a real vendor.

- Studio: edit / validate contracts  
- Publish: machine-readable graph + `/.well-known/answer-contracts.json`  
- Canonical answers: `/answers/<contract-id>`  
- Results: **live baseline** story for marketers + Phase 2 treatment slot + simulated reference  
 

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

### Treatment (Phase 2 — tooling ready)

1. Keep a public crawlable origin up (tunnel or durable host).
2. Wait for discovery (document window in `docs/PHASE2_REMEASURE.md`).
3. Fill `data/live/captures.phase2.template.json` → `captures.phase2.json`.
4. Ingest and compare:

```bash
npm run ingest:live -- data/live/captures.phase2.json --phase treatment
npm run compare:phases
```

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
