# API reference

Base URL (local): `http://127.0.0.1:3847`

## Contracts

### `GET /api/contracts`

List all Answer Contracts.

### `POST /api/contracts`

Create / replace contracts (body depends on handler — see Studio save flow).

### `GET /api/contracts/[id]`

Fetch one contract.

### `PUT /api/contracts/[id]`

Upsert one contract (body: `AnswerContract`).

### `POST /api/validate`

Validate an Answer Contract payload.

**Body:** unknown JSON  
**200:** `{ ok: true, contract }`  
**400:** `{ ok: false, error }` (Zod issues)

## Publish

### `GET /api/publish`

Machine index of published contracts (ids, intents, hrefs, claim counts).

### `GET /api/publish/contracts/[id]`

Full contract JSON for crawlers / agents.

Headers include `X-Answer-Contracts: 0.1.0`.

### `GET /.well-known/answer-contracts.json`

Discovery document: protocol metadata + contract list with `href` and answer page links.

CORS: `Access-Control-Allow-Origin: *`

## Pilot

### `GET /api/pilot`

```json
{
  "meta": { "vertical": "…", "brand": "Northline Analytics", "…" },
  "simulated": {
    "baseline": { "score": { }, "probes": [] },
    "treatment": { "score": { }, "probes": [] },
    "delta": { "answerShare": 82.8 }
  },
  "live": { }
}
```

`live` is the scored baseline report from `data/live/baseline.json`, or `null` if missing.

## UI routes

| Route | Purpose |
| --- | --- |
| `/` | Landing |
| `/studio` | Contract list |
| `/studio/[id]` | Editor |
| `/publish` | Human publish surface |
| `/pilot` | Live + simulated Answer Share lab |
| `/answers/[id]` | Canonical answer page |
| `/spec` | Spec narrative |
