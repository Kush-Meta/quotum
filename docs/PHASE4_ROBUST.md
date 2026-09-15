# Phase 4 — Robust experiment design

Phase 1 proved the measurement loop (n=6, Duck.ai, Northline=0).  
Phase 3 covered the 6-prompt pack with Answer Contracts.  
**Phase 4 hardens the experiment** before/while durable deploy so treatment lift is believable.

## Why Phase 1 is not enough

| Gap | Phase 1 | Phase 4 |
| --- | ---: | --- |
| Observations | 6 | 45 measurement (+ 12 holdout) target |
| Engines | 1 (Duck.ai→chatgpt) | duckai + chatgpt + perplexity |
| Wording sensitivity | none | 2 paraphrases / intent |
| Generalization | none | 4 frozen holdouts |
| Annotation QC | auto only | dual-label κ on ≥30% sample |
| Stability | none | A/A re-ingest + split-half |
| Pre-registration | informal | `data/live/experiment.manifest.json` |

## Design summary

- **5 intents × (1 canonical + 2 paraphrases) = 15 measurement prompts**
- **4 holdout prompts** (never on contracts until after analysis)
- **3 primary engines** → **45 measurement captures** target
- Success: Northline Answer Share > 0 on measurement set; lift on ≥2 engines; holdout does not collapse if measurement lifts; κ≥0.6 on dual sample; A/A identical

Source of truth: `src/lib/promptPack.ts` + `data/live/experiment.manifest.json`.

## Capture workflow

1. Deploy public origin (Phase 2 durable host) and wait for discovery.
2. Copy template:

```bash
cp data/live/captures.phase4.template.json data/live/captures.phase4.json
# Fill answerText / sources / capturedAt for each cell
```

3. Optional dual annotation:

```bash
cp data/live/annotations.dual.template.json data/live/annotations.dual.json
# Edit human.* on ≥30% of rows
npm run interrater -- data/live/annotations.dual.json
```

4. Ingest + gates:

```bash
npm run ingest:live -- data/live/captures.phase4.json --phase treatment
npm run aa:check -- data/live/captures.phase4.json
npm run compare:phases
npm run report:robust
```

## Commands

| Script | Purpose |
| --- | --- |
| `npm run coverage:prompts` | Phase 3: 6/6 contract coverage |
| `npm run coverage:phase4` | Measurement coverage + holdout leak check |
| `npm run aa:check` | Re-ingest identity + split-half |
| `npm run power:guide` | Rule-of-thumb n for mention-rate lift |
| `npm run interrater` | Cohen's κ on dual labels |
| `npm run report:robust` | Markdown robustness report |
| `GET /api/experiment` | Manifest + pack stats + gates |

## Holdout policy

Holdouts are frozen. **Do not** add them to Answer Contract `examplePrompts` until after treatment scoring. `coverage:phase4` fails if a holdout leaks onto a contract.

## Pilot UI

`/pilot` → **Phase 4 · Experiment design** panel shows n targets, engines, paraphrase/holdout counts, and gate status.
