# Quotum

**Sealed Answer Contracts for generative engines.**

Quotum lets brands publish **Quotum Answer Contracts** — intent-bound, evidence-hashed, Ed25519-sealed answer objects that AI agents can discover, verify, and cite — then measure **Answer Share** and citation traffic.

Live demo: [https://quotum.vercel.app](https://quotum.vercel.app)  
Agentspace: [https://quotum.vercel.app/agentspace](https://quotum.vercel.app/agentspace)

## Why it exists

SEO gave the web sitemaps for pages. Generative engines compose **answers**. Most GEO tools only watch mentions after the fact. Quotum publishes the object that should get cited — then scores whether it did.

## What this is

| Piece | Role |
| --- | --- |
| **Quotum Answer Contract** | Canonical answer + evidence-hashed claims + citation object for one buyer intent |
| **Agentspace** | Machine entrypoint: sealed JSON, verify API, attribution URLs |
| **Answer Share** | Transparent score: mention · recommend · citation · prominence |
| **Live experiment** | Quotum testing itself on GEO / citation prompts |

## What this is not

- Not an `llms.txt` checklist (complementary hint file — see [`/llms.txt`](https://quotum.vercel.app/llms.txt))
- Not a RAG “output schema” / JSON mode contract inside an LLM pipeline
- Not Microsoft NLWeb `/ask` (on-site chat)
- Not a mention dashboard as the product

## Canonical definition

> An Answer Contract is an intent-bound, evidence-hashed object a brand publishes so generative engines can mention, recommend, and cite a verified answer — not just scrape marketing HTML. Quotum is the framework that publishes those contracts and measures Answer Share.

Source: [definition:answer-contract](https://quotum.vercel.app/answers/ac_quotum_what_is_answer_contract)

## Quick start

```bash
npm install
npm run seal:real
npm run dev
```

Open [http://127.0.0.1:3847](http://127.0.0.1:3847).

## Public surfaces

| URL | Purpose |
| --- | --- |
| [`/agentspace`](https://quotum.vercel.app/agentspace) | Human + machine entrypoint |
| [`/api/agentspace`](https://quotum.vercel.app/api/agentspace) | Sealed contract index |
| [`/api/agentspace/verify`](https://quotum.vercel.app/api/agentspace/verify) | POST verify Ed25519 seal |
| [`/.well-known/quotum-pubkey.json`](https://quotum.vercel.app/.well-known/quotum-pubkey.json) | Public verification key |
| [`/experiment`](https://quotum.vercel.app/experiment) | Live citation + traffic dashboard |
| [`/llms.txt`](https://quotum.vercel.app/llms.txt) | Crawler hint → contracts |

## Real experiment

Quotum is the subject. Sealed contracts live in agentspace. Ask AI chats the measurement prompts, verify seals independently, and track `/t/<token>` traffic.

Docs: [`docs/REAL_EXPERIMENT.md`](./docs/REAL_EXPERIMENT.md)

```bash
npm run seal:real
# Deploy with PUBLIC_ORIGIN=https://your-host
```

## Answer Share

```
Answer Share = 100 × (0.35·mention + 0.30·recommend + 0.25·citation + 0.10·prominence)
```

## Stack

Next.js · TypeScript · Tailwind · Zod · Ed25519 seals

## License

MIT — see [`LICENSE`](./LICENSE).
