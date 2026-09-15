# Overview

## Thesis

Search engines ranked **pages**. Generative engines compose **answers**.

Most GEO tooling measures *mentions* after the fact. Quotum starts one layer earlier: companies publish **Answer Contracts** — intent-bound, evidence-hashed, citation-ready objects — then measure whether those contracts increase **Answer Share** on category prompts.

## Product pieces

1. **Answer Contract** — publishable unit of answer intent  
2. **Publish surface** — machine-readable index + discovery document (not a chatbot, not `llms.txt`)  
3. **Canonical answer pages** — human + crawler readable `/answers/<id>`  
4. **Answer Share** — transparent score across mention / recommend / citation / prominence  
5. **Results** — marketer-readable baseline vs after-publish measurement for one vertical (`/pilot`)

## What Quotum is not

| Nearby idea | Why Quotum differs |
| --- | --- |
| `llms.txt` | File tip for crawlers; not intent-bound claims with evidence hashes |
| Microsoft NLWeb `/ask` | On-site Q&A endpoint; Quotum publishes contracts *into* engines |
| Mention dashboards | Observability only; Quotum ships the intervention + the score |
| Fake brand SEO | Pilot uses fictional **Northline Analytics** — never impersonates a real vendor |

## Current status

- **Phase 1 (done):** live baseline Answer Share for product-analytics prompts  
- **Phase 3 (done, pre-deploy):** full prompt-pack contract coverage, denser claims, JSON-LD, coverage gate  
- **Phase 4 (done, pre-deploy):** robust multi-engine experiment harness (15×3 + holdouts, A/A, κ, power)
- **Phase 2 (next):** durable public host, then remeasure the same prompt pack  
- Challenger **Northline Analytics** scores **0** at baseline (expected)
