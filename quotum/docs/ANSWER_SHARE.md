# Answer Share

Answer Share is Quotum’s transparent score for how often a brand wins generative answers on a prompt pack.

## Formula

```
Answer Share = 100 × (
  0.35 · mentionRate +
  0.30 · recommendRate +
  0.25 · citationRate +
  0.10 · prominence
)
```

Implemented in `src/lib/schema.ts` → `scoreAnswerShare()`.

| Component | Meaning |
| --- | --- |
| **mentionRate** | Fraction of probes where the brand (or alias) appears |
| **recommendRate** | Fraction where the brand is near recommend cues (`best`, `recommend`, `prefer`, …) |
| **citationRate** | Fraction where the brand’s domain appears in cited sources |
| **prominence** | Mean of `1 - firstMentionOffset / answerLength` when mentioned (else 0) |

## Annotation

For each raw capture + tracked brand, `annotateProbeForBrand()` in `src/lib/probe.ts` sets:

- `mentionedBrand`
- `citedDomain`
- `recommended`
- `firstMentionOffset`
- `competitorsMentioned`

Tracked brands (product-analytics pilot): Northline Analytics, Amplitude, Mixpanel, PostHog, Heap.

## Category leaderboard

`scoreCategoryShare(captures)` scores **every** tracked brand on the same capture set, then sorts by Answer Share. Pilot Lab uses this to compare incumbents vs the challenger on identical prompts.

## What Answer Share is not

- Not a paid-media auction score  
- Not SEO domain authority  
- Not a guarantee of future engine behavior — it is a reproducible measurement on a captured answer set
