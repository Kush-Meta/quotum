# Runbook

## Prerequisites

- Node.js 20+  
- npm

## Install & run

```bash
cd quotum
npm install
npm run dev
```

App: [http://127.0.0.1:3847](http://127.0.0.1:3847)

Other scripts:

```bash
npm run typecheck
npm run build
npm run ingest:live -- data/live/captures.raw.json
```

## Studio workflow

1. Open `/studio`  
2. Edit a contract → **Validate** → **Save**  
3. Confirm `/api/publish/contracts/<id>` returns JSON  
4. Open `/answers/<id>` for the canonical page  

## Live baseline ingest

1. Capture generative answers for each prompt in `LIVE_PROMPT_PACK`.  
2. Write `RawLiveCapture[]` JSON:

```json
[
  {
    "id": "duck_01",
    "engine": "chatgpt",
    "prompt": "What is the best product analytics tool for a startup?",
    "capturedAt": "2026-09-14T04:30:00.000Z",
    "answerText": "…",
    "sources": ["https://posthog.com"],
    "notes": "Duck.ai capture"
  }
]
```

Allowed `engine` values: `chatgpt` | `perplexity` | `gemini` | `claude` | `ai_overview`.

3. Ingest:

```bash
npm run ingest:live -- data/live/captures.raw.json
```

4. Refresh `/pilot` — Northline score + category leaderboard update from `data/live/baseline.json`.

## Remeasure checklist (Phase 2)

- [ ] Public HTTPS host with `/`, `/answers/*`, `/api/publish`, `/.well-known/answer-contracts.json`  
- [ ] Same prompt pack as Phase 1  
- [ ] Same annotation / scoring code  
- [ ] Record capture timestamps + engine notes  
- [ ] Diff Northline Answer Share and category rank vs `data/live/baseline.json`  
- [ ] Keep raw captures immutable alongside the new scored report  

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| Validate appears dead | Browse via `127.0.0.1` (see `next.config` `allowedDevOrigins`) |
| Pilot shows “capture in progress” | Ensure `data/live/baseline.json` exists; re-run ingest |
| Cross-origin HMR warnings | Use port `3847` on `127.0.0.1` |
