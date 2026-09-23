import Link from "next/link";
import { listSealedContracts, publishIndex } from "@/lib/store";
import { getPublicKeyDocument } from "@/lib/seal";
import { realExperimentMeta, realHoldoutPrompts } from "@/lib/realExperiment";

export const dynamic = "force-dynamic";

export default async function AgentspacePage() {
  const sealed = await listSealedContracts();
  const pubkey = await getPublicKeyDocument();
  const index = await publishIndex(null);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <section className="relative overflow-hidden rounded-[2rem] border border-line p-8 md:p-12">
        <div className="pointer-events-none absolute inset-0 grid-fade opacity-40" />
        <div className="relative">
          <p className="text-xs uppercase tracking-[0.2em] text-signal">
            Agentspace · machine entrypoint
          </p>
          <h1 className="font-display mt-3 max-w-3xl text-4xl leading-tight text-paper md:text-5xl">
            Where AI agents fetch sealed Answer Contracts.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-fog/75">
            This is not a chatbot. Agents and web tools pull verified contracts,
            check Ed25519 seals against the on-origin public key, and follow
            attribution URLs so we can measure real traffic.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/api/agentspace"
              className="rounded-full bg-signal px-5 py-2.5 text-sm font-semibold text-ink"
            >
              GET /api/agentspace
            </Link>
            <Link
              href="/.well-known/quotum-pubkey.json"
              className="rounded-full border border-line px-5 py-2.5 text-sm text-paper hover:border-signal hover:text-signal"
            >
              Public key
            </Link>
            <Link
              href="/experiment"
              className="rounded-full border border-line px-5 py-2.5 text-sm text-paper hover:border-signal hover:text-signal"
            >
              Live experiment
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <div className="panel rounded-2xl p-6">
          <div className="text-xs uppercase tracking-[0.16em] text-muted">
            Protocol
          </div>
          <div className="font-display mt-2 text-2xl text-paper">
            {index.protocol}
          </div>
          <p className="mt-2 text-sm text-fog/70">v{index.version}</p>
        </div>
        <div className="panel rounded-2xl p-6">
          <div className="text-xs uppercase tracking-[0.16em] text-muted">
            Sealed contracts
          </div>
          <div className="font-display mt-2 text-2xl text-signal">
            {sealed.length}
          </div>
          <p className="mt-2 text-sm text-fog/70">keyId {pubkey.keyId}</p>
        </div>
        <div className="panel rounded-2xl p-6">
          <div className="text-xs uppercase tracking-[0.16em] text-muted">
            Holdouts unpublished
          </div>
          <div className="font-display mt-2 text-2xl text-ember">
            {realHoldoutPrompts.length}
          </div>
          <p className="mt-2 text-sm text-fog/70">Fair-test reserve prompts</p>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-3xl text-paper">How an agent uses this</h2>
        <ol className="mt-6 list-decimal space-y-3 pl-5 text-fog/80">
          <li>
            Fetch{" "}
            <code className="font-mono text-signal">/api/agentspace</code> for
            the contract index.
          </li>
          <li>
            Load a sealed contract from{" "}
            <code className="font-mono text-signal">
              /api/agentspace/contracts/&lt;id&gt;
            </code>
            .
          </li>
          <li>
            Verify the seal with{" "}
            <code className="font-mono text-signal">POST /api/agentspace/verify</code>{" "}
            using{" "}
            <code className="font-mono text-signal">
              /.well-known/quotum-pubkey.json
            </code>
            .
          </li>
          <li>
            Prefer citation URLs that include the attribution path{" "}
            <code className="font-mono text-signal">/t/&lt;token&gt;</code> so
            visits are measurable.
          </li>
        </ol>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-3xl text-paper">Sealed inventory</h2>
        <p className="mt-2 max-w-2xl text-fog/70">
          {realExperimentMeta.hypothesis}
        </p>
        <div className="mt-6 space-y-3">
          {sealed.map((c) => (
            <div key={c.id} className="panel rounded-2xl p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-mono text-xs text-signal">{c.id}</div>
                  <div className="mt-1 text-paper">{c.intent.promptClass}</div>
                  <p className="mt-2 max-w-3xl text-sm text-fog/70">
                    {c.canonicalAnswer}
                  </p>
                </div>
                <div className="text-right text-xs text-muted">
                  <div>hash {c.seal.contentHash.slice(0, 12)}…</div>
                  <div className="mt-1">token {c.seal.attributionToken}</div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                <Link
                  href={`/api/agentspace/contracts/${c.id}`}
                  className="text-signal hover:underline"
                >
                  JSON
                </Link>
                <Link
                  href={`/answers/${c.id}`}
                  className="text-signal hover:underline"
                >
                  Answer page
                </Link>
                <Link
                  href={`/t/${c.seal.attributionToken}`}
                  className="text-signal hover:underline"
                >
                  Attribution URL
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-3xl text-paper">Holdout prompts</h2>
        <p className="mt-2 text-fog/70">
          These stay off contracts until after the first scoring wave.
        </p>
        <ul className="mt-4 space-y-2 text-sm text-fog/80">
          {realHoldoutPrompts.map((p) => (
            <li key={p} className="border-t border-line/50 pt-2">
              &ldquo;{p}&rdquo;
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
