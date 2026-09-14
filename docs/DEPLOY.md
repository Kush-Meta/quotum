# Deploy Quotum (public publish surface)

Answer Share lift requires a **publicly crawlable** origin. Localhost is not enough.

## Current public surfaces

| Host | URL | Notes |
| --- | --- | --- |
| **Vercel (temporary)** | https://temporary-snappy-cello-o9ij081.vercel.app | Anonymous deploy — **claim within ~60 minutes** to keep it |
| **Claim link** | https://vercel.com/claim-deployment?code=be9de08c-a308-4b94-a20d-711bdd71d606 | Converts the temporary deploy into your Vercel account |
| **Cloudflare quick tunnel** | https://scheduling-cosmetic-justify-kent.trycloudflare.com | Live while the cloud agent VM + `cloudflared` session run |

Verified 200s on both hosts:

- `/`
- `/.well-known/answer-contracts.json`
- `/api/publish`
- `/api/publish/contracts/ac_analytics_best_for_startups`
- `/answers/ac_analytics_best_for_startups`
- `/answers/ac_analytics_open_source_alt`
- `/pilot` (live baseline: Northline **0**)

## Recommended durable path

### Option A — Claim the Vercel temporary deploy (fastest)

1. Open the claim link above while logged into Vercel.  
2. Keep the project; optionally add a custom domain (e.g. `contracts.northline.dev`).  
3. From `quotum/` thereafter:

```bash
npx vercel login
npx vercel --prod
```

### Option B — Render Blueprint

1. Push this repo to GitHub (already at https://github.com/Kush-Meta/quotum).  
2. In Render → New → Blueprint → select the repo.  
3. Uses `render.yaml` + `Dockerfile`.

### Option C — Docker anywhere

```bash
docker build -t quotum .
docker run --rm -p 3847:3847 quotum
```

Put TLS termination (Caddy, nginx, Cloudflare) in front.

## Smoke test

```bash
./scripts/smoke-public.sh https://YOUR_ORIGIN
```

## After deploy

Follow [`PHASE2_REMEASURE.md`](./PHASE2_REMEASURE.md) — wait for discovery, remeasure the same prompt pack, compare to `data/live/baseline.json`.
