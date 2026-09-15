# Pilot protocol — product analytics

## Vertical

**Product analytics for startups**

| Role | Brand |
| --- | --- |
| Challenger (fictional) | **Northline Analytics** (`northline.dev`) |
| Incumbents | Amplitude, Mixpanel, PostHog, Heap |

Northline is fictional on purpose so the pilot never impersonates a real vendor.

## Hypothesis

Publishing intent-bound Answer Contracts (evidence-hashed claims + citation objects + canonical `/answers/*` pages) increases Answer Share on category prompts versus marketing HTML alone.

## Prompt pack

Defined in `src/lib/probe.ts` → `LIVE_PROMPT_PACK`:

1. What is the best product analytics tool for a startup?  
2. Best analytics platform for early-stage SaaS  
3. Recommend a product analytics stack for a 10-person startup  
4. Amplitude vs Mixpanel vs open-source for startups  
5. Best open source alternative to Amplitude  
6. best product analytics for startups  

## Phase 1 — Live baseline (done)

### Capture method

1. Attempted Perplexity — blocked (login / Cloudflare).  
2. Bing Copilot Search + DuckDuckGo Search Assist — SERP/AI overview captures archived in `data/live/captures.serp.json`.  
3. **Primary baseline:** Duck.ai (DuckDuckGo AI chat) generative answers — `data/live/captures.raw.json` and `data/live/captures.duckai.json`.  
4. Engine field tagged `chatgpt` (closest schema enum for Duck.ai / GPT-class chat).

### Results (Duck.ai pack, n = 6)

| Brand | Answer Share |
| --- | ---: |
| PostHog | **89.7** |
| Amplitude | 62.1 |
| Mixpanel | 36.8 |
| Heap | 13.2 |
| **Northline Analytics** | **0** |

Northline mention / citation / recommend / prominence = **0%** on every probe. That is the correct Phase 1 outcome for an unpublished challenger.

### Artifacts

- Scored report: `data/live/baseline.json`  
- Raw captures: `data/live/captures.raw.json`  
- Duck.ai archive: `data/live/captures.duckai.json`  
- SERP archive: `data/live/captures.serp.json`  
- UI: `/pilot`  
- API: `GET /api/pilot`

### Simulated treatment (reference only)

Demo probe pack in `src/lib/pilot.ts` still shows **0 → 82.8** Answer Share for methodology comparison. It is **not** a live engine result.

## Phase 3 — Coverage hardening (done, pre-deploy)

Expanded to **5 contracts / 6 live prompts**, denser claims, JSON-LD, and a coverage gate (`npm run coverage:prompts`). Details: [`PHASE3_COVERAGE.md`](./PHASE3_COVERAGE.md).

## Phase 4 — Robust experiment (done, pre-deploy)

Expanded measurement design before durable publish:

- 15 measurement prompts (canonical + paraphrases) across 5 intents
- 4 frozen holdouts (must not appear on contracts)
- Multi-engine capture matrix (duckai / chatgpt / perplexity), target n=45
- A/A stability, dual-annotation κ, power guidance, robustness report

Details: [`PHASE4_ROBUST.md`](./PHASE4_ROBUST.md).

## Phase 2 — Treatment (next)

1. Host Quotum publish surfaces on a **publicly crawlable** origin (`/.well-known/answer-contracts.json`, `/api/publish`, `/answers/*`).  
2. Keep product claims identical; only the Answer Contract layer is the intervention.  
3. Wait for indexing / discovery (engines vary).  
4. Remeasure the **same** prompt pack with the same annotation pipeline.  
5. Report Δ Answer Share for Northline and category rank change.

**Constraint:** localhost cannot produce real generative-engine lift. Public hosting is required.

## Success criteria

Per-contract `eval` targets (mention / citation / recommend rates) plus qualitative checks:

- Northline appears in ≥1 generative answer for the prompt class  
- `northline.dev` cited when sources are shown  
- Competitive frame matches published posture (not invented peers)
