import Link from "next/link";

const pillars = [
  {
    title: "Quotum Answer Contracts",
    body: "Intent-bound objects: canonical answer, evidence-hashed claims, competitive frame, and a citation object engines can attribute — sealed with Ed25519.",
  },
  {
    title: "Publish surface",
    body: "A machine-native index where agents fetch contracts — not just an llms.txt hint file, and not an on-site chatbot.",
  },
  {
    title: "Answer Share",
    body: "Transparent score from mention, recommendation, citation, and prominence — so you can measure whether sealed answers actually get cited.",
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 grid-fade opacity-60" />
        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-16 md:pt-24">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-signal">
            <span className="h-1.5 w-1.5 rounded-full bg-signal" />
            Quotum Answer Contracts
          </p>
          <h1 className="font-display max-w-4xl text-4xl leading-[1.05] text-paper md:text-6xl">
            Quotum
            <span className="mt-2 block text-signal">
              Sealed answers AI engines can verify and cite.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fog/80 md:text-xl">
            Publish intent-bound, evidence-hashed Answer Contracts on your
            domain. Generative engines can discover and cite them — and you
            measure Answer Share across the answers that matter.
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
              View results
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-ink/50">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-16 md:grid-cols-3">
          {pillars.map((item) => (
            <div key={item.title}>
              <h2 className="font-display text-2xl text-paper">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-fog/75">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
