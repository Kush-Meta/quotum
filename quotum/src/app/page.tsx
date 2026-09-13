import Link from "next/link";

const pillars = [
  {
    title: "Answer Contracts",
    body: "Intent-bound objects: canonical answer, evidence-hashed claims, competitive frame, and a citation object engines can attribute.",
  },
  {
    title: "Publish Surface",
    body: "A machine-native index — not llms.txt, not a chatbot, not another HTML page hoping to be scraped correctly.",
  },
  {
    title: "Answer Share",
    body: "Transparent score from mention, recommendation, citation, and prominence across ChatGPT, Perplexity, Gemini, Claude, and AI Overviews.",
  },
];

const contrasts = [
  ["llms.txt", "A markdown sitemap hint. Quotum binds answers to buyer intents with proof."],
  ["NLWeb /ask", "Conversational API over your site. Quotum targets off-site generative answer share."],
  ["GEO dashboards", "They watch mentions. Quotum publishes the object that should get cited — then measures lift."],
];

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 grid-fade opacity-60" />
        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-16 md:pt-24">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-signal">
            <span className="h-1.5 w-1.5 rounded-full bg-signal" />
            Own your share of the answer
          </p>
          <h1 className="font-display max-w-4xl text-4xl leading-[1.05] text-paper md:text-6xl">
            Stop optimizing websites for agents.
            <span className="block text-signal">
              Publish Answer Contracts instead.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fog/80 md:text-xl">
            Quotum is a framework for companies that want generative engines to
            mention, recommend, and cite them — with a publishable contract
            format and a causal pilot loop that proves lift.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/studio"
              className="rounded-full bg-signal px-6 py-3 text-sm font-semibold text-ink transition hover:brightness-110"
            >
              Open Studio
            </Link>
            <Link
              href="/pilot"
              className="rounded-full border border-line px-6 py-3 text-sm font-semibold text-paper transition hover:border-signal hover:text-signal"
            >
              See the product-analytics pilot
            </Link>
          </div>
          <div className="mt-14 grid gap-3 md:grid-cols-3">
            {[
              ["0 → 82.8", "Answer Share in pilot treatment"],
              ["6 prompts × 5 engines", "Fixed probe pack"],
              ["Evidence-hashed claims", "Citations you can audit"],
            ].map(([k, v]) => (
              <div key={k} className="panel rounded-2xl p-5">
                <div className="font-display text-2xl text-signal">{k}</div>
                <div className="mt-1 text-sm text-muted">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-ink-soft/40">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-16 md:grid-cols-3">
          {pillars.map((item) => (
            <div key={item.title}>
              <h2 className="font-display text-2xl text-paper">{item.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-fog/75">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-display text-3xl text-paper">What this is not</h2>
        <div className="mt-8 space-y-4">
          {contrasts.map(([title, body]) => (
            <div
              key={title}
              className="panel flex flex-col gap-2 rounded-2xl p-5 md:flex-row md:items-baseline md:gap-8"
            >
              <div className="min-w-40 font-mono text-xs uppercase tracking-wider text-ember">
                {title}
              </div>
              <p className="text-sm leading-relaxed text-fog/80">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-16 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display text-3xl text-paper">
              Pilot vertical: product analytics
            </h2>
            <p className="mt-3 max-w-xl text-fog/75">
              Northline Analytics (fictional challenger) publishes contracts for
              category prompts, then we score baseline vs treatment Answer Share.
            </p>
          </div>
          <Link
            href="/pilot"
            className="rounded-full bg-paper px-6 py-3 text-sm font-semibold text-ink transition hover:bg-signal"
          >
            Open Pilot Lab →
          </Link>
        </div>
      </section>
    </div>
  );
}
