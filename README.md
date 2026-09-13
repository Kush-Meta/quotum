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
cd quotum
npm install
npm run dev
```

Open [http://127.0.0.1:3847](http://127.0.0.1:3847).

## Pilot vertical

**Product analytics for startups** — fictional brand *Northline Analytics* so we can publish contracts and measure Answer Share without impersonating a real vendor.

- Studio: edit / validate contracts  
- Publish: machine-readable graph  
- Pilot Lab: baseline **0** → treatment **82.8** Answer Share on the demo probe pack  

Scoring (transparent):

```
Answer Share = 100 × (0.35·mention + 0.30·recommend + 0.25·citation + 0.10·prominence)
```

## API

- `GET /api/publish` — contract index  
- `GET /api/publish/contracts/:id` — single contract  
- `GET /api/pilot` — baseline/treatment scores  
- `POST /api/validate` — schema validation  
- `GET/PUT /api/contracts` — studio persistence  

## Stack

Next.js · TypeScript · Tailwind · Zod
