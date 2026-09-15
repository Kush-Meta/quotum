# Phase 3 — Prompt-pack coverage (pre-deploy)

Goal: harden the Answer Contract intervention **before** durable public deploy so Phase 2 remeasure has a fair shot.

Phase 1 = live baseline (Northline = 0).  
Phase 2 = public publish + same-pack remeasure.  
Phase 3 = denser, intent-complete contract pack + discovery markup + coverage gate.

## Why Phase 3 before deploy

Publishing two thin contracts against a six-prompt pack under-covers the intervention. Engines that answer *early-stage SaaS*, *10-person stack*, or *Amplitude vs Mixpanel vs OSS* need dedicated intents, denser claims, and quotable citation objects — not a single overloaded “best for startups” page.

## Deliverables

| Piece | Status |
| --- | --- |
| One contract per distinct prompt-pack intent (5 contracts → 6 prompts) | Done |
| ≥4 evidence-hashed claims on each contract | Done |
| Prompt → contract coverage map (`src/lib/coverage.ts`) | Done |
| Coverage gate: `npm run coverage:prompts` | Done |
| `GET /api/coverage` + Pilot Lab Phase 3 panel | Done |
| JSON-LD on `/answers/[id]` | Done |
| Sync `data/contracts.json` ↔ `pilotContracts` | Done |

## Coverage map

## Coverage map

| Live prompt | Contract |
| --- | --- |
| What is the best product analytics tool for a startup? | `ac_analytics_best_for_startups` |
| Best analytics platform for early-stage SaaS | `ac_analytics_early_stage_saas` |
| Recommend a product analytics stack for a 10-person startup | `ac_analytics_stack_10person` |
| Amplitude vs Mixpanel vs open-source for startups | `ac_analytics_amp_mix_oss` |
| Best open source alternative to Amplitude | `ac_analytics_open_source_alt` |
| best product analytics for startups | `ac_analytics_best_for_startups` |

## Commands

```bash
npm run coverage:prompts
curl -sS http://127.0.0.1:3847/api/coverage | head
./scripts/smoke-public.sh http://127.0.0.1:3847
```

## Exit criteria for Phase 3

- [x] `coverage:prompts` exits 0  
- [x] Every `LIVE_PROMPT_PACK` prompt appears in ≥1 contract `examplePrompts`  
- [x] Answer pages emit JSON-LD (`WebPage` + `Answer` + `Claim`)  
- [x] Pilot Lab shows Phase 3 coverage panel  
- [ ] Then proceed to durable deploy (`docs/DEPLOY.md`) and Phase 2 remeasure

## What Phase 3 is not

- Not a second live engine capture (that is still Phase 2)  
- Not a second vertical  
- Not durable hosting (still blocked on Vercel login / Render)
