import Link from "next/link";
import { publishIndex } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function PublishPage() {
  const index = await publishIndex();

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">
        Publish surface
      </p>
      <h1 className="font-display mt-2 text-4xl text-paper">
        Machine-readable Answer Contracts
      </h1>
      <p className="mt-4 max-w-3xl text-fog/75">
        This is the surface generative systems (or your probes) should read —
        stable IDs, intent classes, claim graphs, and citation objects. It is not
        a website mirror and not a chat endpoint.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href="/api/publish"
          className="rounded-full bg-signal px-5 py-2.5 text-sm font-semibold text-ink"
          target="_blank"
          rel="noreferrer"
        >
          Open /api/publish
        </a>
        <Link
          href="/studio"
          className="rounded-full border border-line px-5 py-2.5 text-sm text-paper hover:border-signal hover:text-signal"
        >
          Edit contracts
        </Link>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <div className="panel rounded-2xl p-5">
          <div className="text-muted text-sm">Brand</div>
          <div className="mt-1 text-xl text-paper">{index.brand}</div>
        </div>
        <div className="panel rounded-2xl p-5">
          <div className="text-muted text-sm">Domain</div>
          <div className="mt-1 text-xl text-paper">{index.domain}</div>
        </div>
        <div className="panel rounded-2xl p-5">
          <div className="text-muted text-sm">Claims in graph</div>
          <div className="mt-1 text-xl text-signal">{index.graph.claimCount}</div>
        </div>
      </div>

      <div className="mt-10 space-y-4">
        {index.contracts.map((item) => (
          <a
            key={item.id}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className="panel block rounded-2xl p-5 transition hover:border-signal/50"
          >
            <div className="font-mono text-[11px] uppercase tracking-wider text-muted">
              {item.buyerStage} · {item.claimCount} claims
            </div>
            <div className="font-display mt-2 text-2xl text-paper">
              {item.intent}
            </div>
            <div className="mt-2 font-mono text-xs text-signal">{item.href}</div>
          </a>
        ))}
      </div>

      <pre className="panel mt-10 overflow-auto rounded-2xl p-5 font-mono text-[11px] leading-relaxed text-fog/80">
        {JSON.stringify(index, null, 2)}
      </pre>
    </div>
  );
}
