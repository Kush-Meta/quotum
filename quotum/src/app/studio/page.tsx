import Link from "next/link";
import { listContracts } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function StudioPage() {
  const contracts = await listContracts();

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">
            Studio
          </p>
          <h1 className="font-display mt-2 text-4xl text-paper">
            Answer Contracts
          </h1>
          <p className="mt-3 max-w-2xl text-fog/75">
            Each contract binds a buyer intent to a canonical answer, evidence-hashed
            claims, a competitive frame, and a citation object.
          </p>
        </div>
        <Link
          href="/publish"
          className="rounded-full border border-line px-5 py-2.5 text-sm text-paper hover:border-signal hover:text-signal"
        >
          View publish surface
        </Link>
      </div>

      <div className="mt-10 grid gap-4">
        {contracts.map((contract) => (
          <Link
            key={contract.id}
            href={`/studio/${contract.id}`}
            className="panel group rounded-2xl p-6 transition hover:border-signal/40"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-wider text-muted">
                  {contract.intent.buyerStage} · {contract.vertical}
                </div>
                <h2 className="font-display mt-2 text-2xl text-paper group-hover:text-signal">
                  {contract.intent.promptClass}
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-fog/75">
                  {contract.canonicalAnswer}
                </p>
              </div>
              <div className="shrink-0 space-y-2 text-right font-mono text-xs text-muted">
                <div>{contract.claims.length} claims</div>
                <div>{contract.intent.examplePrompts.length} prompts</div>
                <div>{contract.competitiveFrame.peers.length} peers</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
