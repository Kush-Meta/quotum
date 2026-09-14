# Architecture

## Stack

- **Next.js** (App Router) + TypeScript  
- **Tailwind CSS** v4  
- **Zod** for Answer Contract + probe validation  
- File-backed persistence under `data/` (no database required for the pilot slice)

## Directory map

```
quotum/
├── data/
│   ├── contracts.json           # Seed + studio-persisted contracts
│   └── live/
│       ├── baseline.json        # Scored live baseline report
│       ├── captures.raw.json    # Active raw captures (Duck.ai)
│       ├── captures.duckai.json
│       └── captures.serp.json   # Archived Bing/DDG SERP captures
├── docs/                        # Product documentation
├── scripts/
│   └── ingest-live-baseline.ts
└── src/
    ├── app/
    │   ├── page.tsx             # Landing
    │   ├── studio/              # Contract editor UI
    │   ├── publish/             # Human publish surface
    │   ├── pilot/               # Pilot Lab (server-rendered)
    │   ├── answers/[id]/        # Canonical answer pages
    │   ├── spec/                # Spec narrative
    │   ├── .well-known/         # Discovery JSON
    │   └── api/                 # HTTP handlers
    ├── components/
    └── lib/
        ├── schema.ts            # Zod + Answer Share scoring
        ├── store.ts             # Contract read/write + publish index
        ├── pilot.ts             # Seed contracts + simulated probes
        ├── probe.ts             # Live prompt pack + annotation
        └── liveStore.ts         # Read/write baseline.json
```

## Data flow

```
Browser / AI engines
        │
        ▼
 Raw captures (JSON)
        │  npm run ingest:live
        ▼
 annotateProbeForBrand() ──► scoreAnswerShare()
        │
        ▼
 data/live/baseline.json
        │
        ▼
 /pilot  +  GET /api/pilot
```

Publish path:

```
Studio editor ──validate──► data/contracts.json
        │
        ├── GET /api/publish
        ├── GET /api/publish/contracts/:id
        ├── GET /.well-known/answer-contracts.json
        └── GET /answers/:id
```

## Design choices

- **Server-rendered Pilot Lab** — avoids client fetch hangs; scores on the server.  
- **File store** — enough for a single-tenant pilot; swap `store.ts` / `liveStore.ts` for a DB later.  
- **Fictional challenger** — ethical measurement without spoofing a real brand.  
- **Transparent weights** — Answer Share formula is public and stable for before/after comparison.
