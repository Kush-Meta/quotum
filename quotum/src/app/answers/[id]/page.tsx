import Link from "next/link";
import { notFound } from "next/navigation";
import { getContract, listContracts } from "@/lib/store";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  const contracts = await listContracts();
  return contracts.map((c) => ({ id: c.id }));
}

export default async function AnswerPage({ params }: Props) {
  const { id } = await params;
  const contract = await getContract(id);
  if (!contract) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">
        Canonical answer · {contract.intent.buyerStage}
      </p>
      <h1
        id={contract.citation.anchor ?? "canonical-answer"}
        className="font-display mt-3 text-4xl leading-tight text-paper"
      >
        {contract.intent.promptClass}
      </h1>
      <p className="mt-2 text-sm text-muted">
        {contract.brand} · {contract.domain} · reviewed{" "}
        {contract.policy.lastReviewed}
      </p>

      <section className="panel mt-8 rounded-2xl p-6">
        <h2 className="font-mono text-[11px] uppercase tracking-wider text-muted">
          Canonical answer
        </h2>
        <p className="mt-3 text-lg leading-relaxed text-paper">
          {contract.canonicalAnswer}
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl text-paper">Claims</h2>
        <ul className="mt-4 space-y-4">
          {contract.claims.map((claim) => (
            <li key={claim.id} className="panel rounded-2xl p-5">
              <div className="font-mono text-[10px] uppercase tracking-wider text-muted">
                {claim.id} · {claim.confidence} · as of {claim.asOf}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-fog/90">
                {claim.statement}
              </p>
              <p className="mt-2 text-xs text-muted">Scope: {claim.scope}</p>
              <a
                href={claim.evidenceUrl}
                className="mt-3 inline-block font-mono text-[11px] text-signal hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                Evidence → {claim.evidenceUrl}
              </a>
              <p className="mt-1 font-mono text-[10px] text-muted">
                hash {claim.evidenceHash}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel mt-10 rounded-2xl p-6">
        <h2 className="font-display text-xl text-paper">Citation object</h2>
        <blockquote className="mt-3 border-l-2 border-signal pl-4 text-fog/90">
          {contract.citation.quotable}
        </blockquote>
        <p className="mt-3 font-mono text-xs text-muted">
          id: {contract.citation.id}
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl text-paper">Competitive frame</h2>
        <p className="mt-2 text-sm text-fog/80">
          Axis: {contract.competitiveFrame.axis}
        </p>
        <p className="mt-2 text-sm text-fog/80">
          Peers: {contract.competitiveFrame.peers.join(", ")}
        </p>
        <p className="mt-2 text-sm text-fog/80">
          {contract.competitiveFrame.posture}
        </p>
      </section>

      <div className="mt-10 flex flex-wrap gap-3 text-sm">
        <Link href={`/api/publish/contracts/${contract.id}`} className="text-signal hover:underline">
          Machine contract JSON
        </Link>
        <Link href="/.well-known/answer-contracts.json" className="text-signal hover:underline">
          Discovery index
        </Link>
        <Link href="/pilot" className="text-signal hover:underline">
          Pilot Lab
        </Link>
      </div>
    </article>
  );
}
