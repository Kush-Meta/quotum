import Link from "next/link";

const pillars = [
  {
    title: "Answer Contracts",
    body: "Intent-bound objects: canonical answer, evidence-hashed claims, competitive frame, and a citation object engines can attribute.",
  },
  {
    title: "Agentspace",
    body: "A machine entrypoint where AI agents fetch sealed contracts, verify Ed25519 signatures, and follow attribution URLs.",
  },
  {
    title: "Answer Share + traffic",
    body: "Score mention, recommend, citation, and prominence — then measure real visits via attribution tokens.",
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
            Live experiment in progress
          </p>
          <h1 className="font-display max-w-4xl text-4xl leading-[1.05] text-paper md:text-6xl">
            Publish sealed answers.
            <span className="block text-signal">
              Measure citations and traffic.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fog/80 md:text-xl">
            Quotum is running a real experiment on itself: sealed Answer
            Contracts in agentspace, asked across AI chats, scored for Answer
            Share, and tracked for attribution-token visits.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/agentspace"
              className="rounded-full bg-signal px-6 py-3 text-sm font-semibold text-ink transition hover:brightness-110"
            >
              Enter agentspace
            </Link>
            <Link
              href="/experiment"
              className="rounded-full border border-line px-6 py-3 text-sm font-semibold text-paper transition hover:border-signal hover:text-signal"
            >
              View live experiment
            </Link>
          </div>
          <div className="mt-14 grid gap-3 md:grid-cols-3">
            {[
              ["Ed25519 seals", "Independently verifiable contracts"],
              ["/t/tokens", "Attribution URLs for traffic proof"],
              ["Holdouts", "Fair-test prompts stay unpublished"],
            ].map(([k, v]) => (
              <div key={k} className="panel rounded-2xl p-5">
                <div className="font-display text-2xl text-signal">{k}</div>
                <div className="mt-1 text-sm text-muted">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-ink/50">
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

      <section className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-16 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display text-3xl text-paper">
              The experiment subject is Quotum
            </h2>
            <p className="mt-3 max-w-xl text-fog/75">
              No fictional brand this time. We publish sealed contracts about
              Answer Contracts / GEO tooling, ask real AI chats those questions,
              and measure citations plus token traffic.
            </p>
          </div>
          <Link
            href="/experiment"
            className="rounded-full bg-paper px-6 py-3 text-sm font-semibold text-ink transition hover:bg-signal"
          >
            Open experiment →
          </Link>
        </div>
      </section>
    </div>
  );
}
