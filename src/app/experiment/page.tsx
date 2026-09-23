import Link from "next/link";
import { listSealedContracts } from "@/lib/store";
import { trafficSummary } from "@/lib/traffic";
import {
  realExperimentMeta,
  realHoldoutPrompts,
  realMeasurementPrompts,
} from "@/lib/realExperiment";
import { getPublicKeyDocument } from "@/lib/seal";

export const dynamic = "force-dynamic";

export default async function ExperimentPage() {
  const sealed = await listSealedContracts();
  const traffic = await trafficSummary();
  const pubkey = await getPublicKeyDocument();

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <section className="relative overflow-hidden rounded-[2rem] border border-line p-8 md:p-12">
        <div className="pointer-events-none absolute inset-0 grid-fade opacity-40" />
        <div className="relative">
          <p className="text-xs uppercase tracking-[0.2em] text-signal">
            Live experiment · not a simulated pilot
          </p>
          <h1 className="font-display mt-3 max-w-3xl text-4xl leading-tight text-paper md:text-5xl">
            {realExperimentMeta.name}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-fog/75">
            {realExperimentMeta.hypothesis}
          </p>
          <p className="mt-4 max-w-2xl rounded-2xl border border-signal/30 bg-signal/5 px-4 py-3 text-sm text-fog/85">
            Subject: <span className="text-paper">{realExperimentMeta.subject}</span>{" "}
            on <span className="text-paper">{realExperimentMeta.domain}</span>.
            Contracts are sealed with key{" "}
            <span className="font-mono text-signal">{pubkey.keyId}</span>.
          </p>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-4">
        <div className="panel rounded-2xl p-5">
          <div className="text-xs uppercase tracking-[0.16em] text-muted">
            Sealed contracts
          </div>
          <div className="font-display mt-2 text-3xl text-paper">
            {sealed.length}
          </div>
        </div>
        <div className="panel rounded-2xl p-5">
          <div className="text-xs uppercase tracking-[0.16em] text-muted">
            Measurement prompts
          </div>
          <div className="font-display mt-2 text-3xl text-paper">
            {realMeasurementPrompts.length}
          </div>
        </div>
        <div className="panel rounded-2xl p-5">
          <div className="text-xs uppercase tracking-[0.16em] text-muted">
            Holdouts
          </div>
          <div className="font-display mt-2 text-3xl text-ember">
            {realHoldoutPrompts.length}
          </div>
        </div>
        <div className="panel rounded-2xl p-5">
          <div className="text-xs uppercase tracking-[0.16em] text-muted">
            Attribution hits
          </div>
          <div className="font-display mt-2 text-3xl text-signal">
            {traffic.totalHits}
          </div>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-3xl text-paper">What we measure</h2>
        <ul className="mt-4 space-y-2 text-fog/80">
          {realExperimentMeta.primaryMetrics.map((m) => (
            <li key={m} className="border-t border-line/50 pt-2">
              {m}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-3xl text-paper">
          How to run the wave
        </h2>
        <ol className="mt-5 list-decimal space-y-3 pl-5 text-fog/80">
          <li>
            Deploy this origin publicly and set{" "}
            <code className="font-mono text-signal">PUBLIC_ORIGIN</code>.
          </li>
          <li>
            Confirm agentspace + pubkey are crawlable (
            <Link href="/agentspace" className="text-signal hover:underline">
              /agentspace
            </Link>
            ).
          </li>
          <li>
            Ask the measurement prompts in ChatGPT, Perplexity, Duck.ai — score
            mention / recommend / cite.
          </li>
          <li>
            Prefer citing attribution URLs (
            <code className="font-mono text-xs text-signal">/t/…</code>) and
            watch hits below.
          </li>
          <li>Keep holdouts unpublished until after wave 1.</li>
        </ol>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/agentspace"
            className="rounded-full bg-signal px-5 py-2.5 text-sm font-semibold text-ink"
          >
            Open agentspace
          </Link>
          <Link
            href="/api/traffic"
            className="rounded-full border border-line px-5 py-2.5 text-sm text-paper hover:border-signal hover:text-signal"
          >
            Traffic JSON
          </Link>
          <Link
            href="/pilot"
            className="rounded-full border border-line px-5 py-2.5 text-sm text-paper hover:border-signal hover:text-signal"
          >
            Legacy Northline results
          </Link>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-3xl text-paper">
          Measurement prompt pack
        </h2>
        <div className="panel mt-6 rounded-2xl px-5 py-2">
          {realMeasurementPrompts.map((p) => (
            <div
              key={p}
              className="border-t border-line/60 py-3 text-sm text-fog/85 first:border-0"
            >
              &ldquo;{p}&rdquo;
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-3xl text-paper">Traffic so far</h2>
        <p className="mt-2 text-fog/70">
          Hits recorded when someone opens an attribution token URL. AI
          referrals without that path still need manual Answer Share scoring.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="panel rounded-2xl p-5">
            <div className="text-xs uppercase tracking-[0.16em] text-muted">
              By source
            </div>
            <ul className="mt-3 space-y-1 text-sm">
              {Object.entries(traffic.bySource).map(([k, v]) => (
                <li key={k} className="flex justify-between gap-4">
                  <span className="text-fog/70">{k}</span>
                  <span className="text-paper">{v}</span>
                </li>
              ))}
              {Object.keys(traffic.bySource).length === 0 ? (
                <li className="text-muted">No hits yet</li>
              ) : null}
            </ul>
          </div>
          <div className="panel rounded-2xl p-5">
            <div className="text-xs uppercase tracking-[0.16em] text-muted">
              By engine guess
            </div>
            <ul className="mt-3 space-y-1 text-sm">
              {Object.entries(traffic.byEngine).map(([k, v]) => (
                <li key={k} className="flex justify-between gap-4">
                  <span className="text-fog/70">{k}</span>
                  <span className="text-paper">{v}</span>
                </li>
              ))}
              {Object.keys(traffic.byEngine).length === 0 ? (
                <li className="text-muted">No hits yet</li>
              ) : null}
            </ul>
          </div>
          <div className="panel rounded-2xl p-5">
            <div className="text-xs uppercase tracking-[0.16em] text-muted">
              By contract
            </div>
            <ul className="mt-3 space-y-1 text-sm">
              {Object.entries(traffic.byContract).map(([k, v]) => (
                <li key={k} className="flex justify-between gap-4">
                  <span className="truncate text-fog/70">{k}</span>
                  <span className="text-paper">{v}</span>
                </li>
              ))}
              {Object.keys(traffic.byContract).length === 0 ? (
                <li className="text-muted">No hits yet</li>
              ) : null}
            </ul>
          </div>
        </div>
        {traffic.recent.length > 0 ? (
          <div className="panel mt-4 overflow-x-auto rounded-2xl">
            <table className="min-w-full text-left text-sm">
              <thead className="font-mono text-[11px] uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-4 py-3">When</th>
                  <th className="px-4 py-3">Contract</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Engine</th>
                </tr>
              </thead>
              <tbody>
                {traffic.recent.map((hit) => (
                  <tr key={hit.id} className="border-t border-line/70">
                    <td className="px-4 py-3 text-muted">
                      {new Date(hit.at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-signal">
                      {hit.contractId ?? "—"}
                    </td>
                    <td className="px-4 py-3">{hit.source}</td>
                    <td className="px-4 py-3">{hit.engineGuess ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>
    </div>
  );
}
