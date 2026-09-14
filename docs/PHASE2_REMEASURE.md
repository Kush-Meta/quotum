# Phase 2 — Public treatment & remeasure

Goal: publish Answer Contracts on a **crawlable** origin, then remeasure the same prompt pack and compare to Phase 1 baseline.

Phase 1 baseline (Duck.ai, n=6): Northline Analytics **0**, PostHog **89.7**, Amplitude **62.1**, Mixpanel **36.8**, Heap **13.2**.  
Artifact: `data/live/baseline.json`.

## A. Public publish checklist

Deploy Quotum so these URLs return 200 on the public host:

- [x] `GET /` — landing
- [x] `GET /.well-known/answer-contracts.json` — discovery index
- [x] `GET /api/publish` — contract index
- [x] `GET /api/publish/contracts/<id>` — machine contract JSON (every seeded id)
- [x] `GET /answers/<id>` — canonical answer pages (every seeded id)
- [x] `GET /pilot` — Pilot Lab (shows live baseline)

Seeded contract ids (from `data/contracts.json`):

- `ac_analytics_best_for_startups`
- `ac_analytics_open_source_alt`

Record the public origin here:

```
PUBLIC_ORIGIN=https://temporary-snappy-cello-o9ij081.vercel.app
DEPLOYED_AT=2026-09-14T04:56:00Z
DEPLOY_METHOD=vercel-temporary   # claim ASAP — see docs/DEPLOY.md
TUNNEL_BACKUP=https://scheduling-cosmetic-justify-kent.trycloudflare.com
CLAIM_URL=https://vercel.com/claim-deployment?code=be9de08c-a308-4b94-a20d-711bdd71d606
```

Smoke results (2026-09-14): all required surfaces returned **200**, discovery lists 2 Northline contracts, `/api/pilot` live leaderboard shows Northline **0**.

### Smoke commands

```bash
ORIGIN=https://YOUR_HOST
curl -sS -o /dev/null -w "%{http_code}\n" "$ORIGIN/"
curl -sS -o /dev/null -w "%{http_code}\n" "$ORIGIN/.well-known/answer-contracts.json"
curl -sS -o /dev/null -w "%{http_code}\n" "$ORIGIN/api/publish"
curl -sS "$ORIGIN/.well-known/answer-contracts.json" | head -c 400; echo
curl -sS -o /dev/null -w "%{http_code}\n" "$ORIGIN/answers/ac_analytics_best_for_startups"
```

## B. Discovery wait

Engines do not index instantly. After deploy:

1. Confirm surfaces are reachable **without** auth, cookies, or IP allowlists.
2. Optionally submit the origin / key URLs to search consoles if you use them.
3. Wait before remeasure (typical: days–weeks depending on engine; document whatever window you use).

```
INDEX_WAIT_STARTED=
INDEX_WAIT_ENDED=
NOTES=
```

## C. Remeasure protocol (same as Phase 1)

1. Use the **same** prompt pack (`LIVE_PROMPT_PACK` in `src/lib/probe.ts`).
2. Capture generative answers from the **same** engine family when possible (Duck.ai / GPT-class; add Perplexity if unlocked).
3. Write `RawLiveCapture[]` JSON → e.g. `data/live/captures.phase2.json`.
4. Ingest:

```bash
npm run ingest:live -- data/live/captures.phase2.json
# Review data/live/baseline.json (or copy to baseline.phase2.json before overwrite)
```

5. Do **not** change scoring weights between phases.

### Capture shape

```json
[
  {
    "id": "phase2_01",
    "engine": "chatgpt",
    "prompt": "What is the best product analytics tool for a startup?",
    "capturedAt": "2026-09-28T12:00:00.000Z",
    "answerText": "…",
    "sources": ["https://…"],
    "notes": "Phase 2 remeasure against PUBLIC_ORIGIN"
  }
]
```

## D. Success criteria

| Signal | Target |
| --- | --- |
| Northline mention rate | > 0 (any mention is the first win) |
| Northline Answer Share | > 0 vs Phase 1 = 0 |
| `northline.dev` citation | ≥ 1 probe when sources are shown |
| Category rank | Document delta vs PostHog / Amplitude / Mixpanel / Heap |

Qualitative: competitive frame in answers should match published posture (not invented peers).

## E. Report template

```
Phase 2 report
--------------
Public origin:
Capture engine(s):
n prompts:
Northline Answer Share (phase1 → phase2): 0 → 
PostHog / Amplitude / Mixpanel / Heap:
Notable answer excerpts:
Whether /.well-known or /answers URLs appeared as citations:
Next iteration (if flat): claim density / quotable citation / public sitemap / wait longer
```

## F. Deploy options in this repo

| Method | How |
| --- | --- |
| **Vercel** | From `quotum/`: `npx vercel --prod` (or claim a `--temporary` deploy). Config: `vercel.json`. |
| **Render** | Connect GitHub repo; Blueprint: `render.yaml` + `Dockerfile`. |
| **Docker** | `docker build -t quotum . && docker run -p 3847:3847 quotum` behind any HTTPS proxy. |
| **Tunnel (dev)** | `cloudflared tunnel --url http://127.0.0.1:3847` for a short-lived public URL while iterating. |

Localhost alone cannot produce generative-engine lift until contracts are publicly discoverable.
