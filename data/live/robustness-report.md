# Quotum robustness report

Generated: 2026-09-15T01:03:27.521Z
Manifest: quotum-northline-product-analytics-v4 (0.4.0)

## Design

- Measurement prompts: 15
- Holdouts: 4
- Primary engines: duckai, chatgpt, perplexity
- Target measurement captures: 45
- Phase 1 continuity prompts: 6

## Phase 1 baseline

- Captured: 2026-09-14T04:38:43.600Z
- Method: Live generative-answer captures via Duck.ai (DuckDuckGo AI chat) after Perplexity required login. Answers annotated for mention/citation/recommend/prominence across tracked brands. Engine tagged as chatgpt (closest schema match for Duck.ai/GPT).
- n captures: 6

| Brand | Answer Share |
| --- | ---: |
| PostHog | 89.7 |
| Amplitude | 62.1 |
| Mixpanel | 36.8 |
| Heap | 13.2 |
| Northline Analytics | 0 |

## Phase 2 treatment

_No treatment.json yet. Fill `data/live/captures.phase4.template.json` after public deploy + discovery, ingest with `--phase treatment`, then re-run this report._

## Robustness checklist

- [ ] Lift appears on ≥2 primary engines
- [ ] Lift appears on ≥1 paraphrase per intent for intents with any lift
- [ ] Holdout Northline Answer Share does not collapse to 0 if measurement lift > 0 (generalization check)
- [ ] Inter-rater κ on dual-labeled binary fields ≥ 0.6 when dual sample present
- [ ] A/A re-ingest of identical captures yields identical Answer Share
- [ ] Northline Answer Share on measurement set > 0 after treatment (Phase 1 = 0)

## Next actions

1. Keep public origin crawlable (`docs/DEPLOY.md`).
2. Capture Phase 4 matrix (`data/live/captures.phase4.template.json`).
3. Dual-annotate ≥30% sample (`data/live/annotations.dual.template.json`).
4. `npm run ingest:live -- data/live/captures.phase4.json --phase treatment`
5. `npm run aa:check && npm run compare:phases && npm run report:robust`
