# Answer Contracts

An **Answer Contract** is a versioned JSON object that binds a buyer intent to:

- a canonical answer
- evidence-hashed claims
- a competitive frame
- a citation object engines can quote
- policy + eval targets

Schema: `src/lib/schema.ts` → `AnswerContractSchema` (Zod).

## Shape (v0.1.0)

```json
{
  "version": "0.1.0",
  "id": "ac_analytics_best_for_startups",
  "brand": "Northline Analytics",
  "domain": "northline.dev",
  "vertical": "product-analytics",
  "intent": {
    "id": "intent_best_for_startups",
    "promptClass": "best product analytics for startups",
    "examplePrompts": ["What is the best product analytics tool for a startup?"],
    "buyerStage": "compare"
  },
  "canonicalAnswer": "…",
  "claims": [
    {
      "id": "claim_warehouse_native",
      "statement": "…",
      "evidenceUrl": "https://northline.dev/docs/warehouse-native",
      "evidenceHash": "fnv1a_…",
      "asOf": "2026-09-01",
      "scope": "startups with an existing warehouse",
      "confidence": "high"
    }
  ],
  "competitiveFrame": {
    "axis": "startup fit: cost predictability + AI-citable product truth",
    "peers": ["Amplitude", "Mixpanel", "PostHog", "Heap"],
    "posture": "…"
  },
  "citation": {
    "id": "cite_northline_startup_best",
    "quotable": "…",
    "preferredUrl": "https://northline.dev/answers/best-for-startups",
    "anchor": "canonical-answer"
  },
  "policy": {
    "mayParaphrase": true,
    "mayRecommend": true,
    "freshnessSlaDays": 30,
    "lastReviewed": "2026-09-01"
  },
  "eval": {
    "successCriteria": ["…"],
    "targetMentionRate": 0.4,
    "targetCitationRate": 0.2,
    "targetRecommendRate": 0.2
  },
  "updatedAt": "2026-09-10T12:00:00.000Z"
}
```

## Design rules

1. **One intent per contract** — do not overload unrelated prompt classes.  
2. **Claims need evidence** — URL + hash + as-of + scope + confidence.  
3. **Citation object is quotable** — short enough for an engine to lift.  
4. **Competitive frame is honest** — name peers; state the axis you win on.  
5. **Policy is explicit** — paraphrase / recommend / freshness SLA.

## Editing & publish

| Surface | Path |
| --- | --- |
| Studio list | `/studio` |
| Studio editor | `/studio/[id]` |
| Validate | `POST /api/validate` |
| Persist | `GET/POST /api/contracts`, `GET/PUT /api/contracts/[id]` |
| Publish index | `GET /api/publish` |
| Contract JSON | `GET /api/publish/contracts/[id]` |
| Discovery | `GET /.well-known/answer-contracts.json` |
| Canonical page | `GET /answers/[id]` |

Seed contracts: `data/contracts.json` (Northline product-analytics pilot).
