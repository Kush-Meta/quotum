# Annotation rubric — Answer Share binary labels

Use this when dual-labeling captures for Phase 4 inter-rater checks.

## Fields

### `mentionedBrand` (Northline)

**True** if the answer text clearly names Northline / Northline Analytics (case-insensitive word boundary).  
**False** if only incumbents appear, or the name is a different product.

### `citedDomain` (northline.dev)

**True** if `sources[]` contains a URL/host referencing `northline.dev` (with or without scheme/www).  
**False** if Northline is mentioned but no northline.dev source is listed.

### `recommended`

**True** only if Northline is mentioned **and** a recommend cue appears near the mention (≈80 chars before / 120 after), e.g. best, recommend, top choice, ideal, prefer, go with, choose, great option, best fit.  
**False** if mentioned neutrally/negatively, or only listed without endorsement cues.

## Process

1. Auto labels come from `annotateProbeForBrand`.
2. Human reviews a ≥30% sample (stratify by engine + role).
3. On disagreement, adjudicate with this rubric; store final labels in `manualLabels` on the capture before ingest.
4. Run `npm run interrater -- data/live/annotations.dual.json` — target κ ≥ 0.6 per field.
