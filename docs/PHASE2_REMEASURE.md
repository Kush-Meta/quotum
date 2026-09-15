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
PUBLIC_ORIGIN=https://wright-contain-futures-ends.trycloudflare.com
DEPLOYED_AT=2026-09-15T00:29:00Z
DEPLOY_METHOD=cloudflare-quick-tunnel
DURABLE_NEXT=vercel-login-or-render-blueprint   # see docs/DEPLOY.md
```

Smoke results (2026-09-15): all required surfaces **200** on the tunnel; discovery emits **absolute** contract URLs; `/sitemap.xml` + `/robots.txt` live; `/api/pilot` shows Northline **0**.

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

## Phase 2 workflow (after public deploy)

1. Confirm smoke: `./scripts/smoke-public.sh https://YOUR_ORIGIN`
2. Wait for discovery (document window in this file).
3. Copy template → captures:

```bash
cp data/live/captures.phase2.template.json data/live/captures.phase2.json
# Fill answerText / sources / capturedAt for each prompt
```

4. Ingest as treatment (does **not** overwrite Phase 1 baseline):

```bash
npm run ingest:live -- data/live/captures.phase2.json --phase treatment
```

5. Compare:

```bash
npm run compare:phases
```

6. Review `/pilot` Phase 2 section + `data/live/treatment.json`.

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
