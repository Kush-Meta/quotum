# Deploy Quotum (public publish surface)

Answer Share lift requires a **publicly crawlable** origin. Localhost is not enough.

## Current public surface (2026-09-15)

| Host | URL | Notes |
| --- | --- | --- |
| **Cloudflare quick tunnel** | https://wright-contain-futures-ends.trycloudflare.com | Live while this cloud agent VM + `cloudflared` run |
| **GitHub** | https://github.com/Kush-Meta/quotum | Source of truth for durable deploys |

Anonymous Vercel temporary deploys are **exhausted** until someone runs `npx vercel login` and deploys under an account (or connects the GitHub repo in the Vercel dashboard).

Verified 200s on the tunnel (absolute discovery URLs included):

- `/`
- `/.well-known/answer-contracts.json` (emits absolute `href` / `answerPage`)
- `/api/publish`
- `/api/publish/contracts/ac_analytics_best_for_startups`
- `/answers/ac_analytics_best_for_startups`
- `/answers/ac_analytics_open_source_alt`
- `/sitemap.xml` · `/robots.txt`
- `/pilot` (live baseline: Northline **0**)

## Durable deploy (do this next)

### Option A — Vercel (recommended for Next.js)

```bash
cd quotum
npx vercel login
npx vercel --prod
# optional: vercel env add PUBLIC_ORIGIN
```

Or: Vercel Dashboard → Add New Project → import `Kush-Meta/quotum`.

Set env `PUBLIC_ORIGIN=https://your-domain` so sitemap/robots stay stable.

### Option B — Render Blueprint

1. Render → New → Blueprint → select `Kush-Meta/quotum`.  
2. Uses `render.yaml` + `Dockerfile`.  
3. Set `PUBLIC_ORIGIN` to the Render URL.

### Option C — Docker anywhere

```bash
docker build -t quotum .
docker run --rm -p 3847:3847 -e PUBLIC_ORIGIN=https://contracts.example.com quotum
```

## Smoke test

```bash
./scripts/smoke-public.sh https://YOUR_ORIGIN
```

## After deploy

Follow [`PHASE2_REMEASURE.md`](./PHASE2_REMEASURE.md) — wait for discovery, capture the same prompt pack, ingest as `--phase treatment`, run `npm run compare:phases`.
