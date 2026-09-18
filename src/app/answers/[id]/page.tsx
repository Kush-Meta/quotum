import Link from "next/link";
import { notFound } from "next/navigation";
import { getSealedContract, listContracts } from "@/lib/store";
import { siteOrigin } from "@/lib/publicOrigin";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  const contracts = await listContracts();
  return contracts.map((c) => ({ id: c.id }));
}

export default async function AnswerPage({ params }: Props) {
  const { id } = await params;
  const contract = await getSealedContract(id);
  if (!contract) notFound();

  const origin = siteOrigin();
  const pageUrl = `${origin}/answers/${contract.id}`;
  const attributionUrl = `${origin}/t/${contract.seal.attributionToken}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: contract.intent.promptClass,
    url: pageUrl,
    dateModified: contract.updatedAt,
    about: {
      "@type": "SoftwareApplication",
      name: contract.brand,
      url: `https://${contract.domain}`,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
    },
    mainEntity: {
      "@type": "Answer",
      text: contract.canonicalAnswer,
      dateCreated: contract.policy.lastReviewed,
      author: {
        "@type": "Organization",
        name: contract.brand,
        url: `https://${contract.domain}`,
      },
      citation: contract.citation.quotable,
      url: contract.citation.preferredUrl,
    },
    hasPart: contract.claims.map((claim) => ({
      "@type": "Claim",
      identifier: claim.id,
      text: claim.statement,
      appearance: claim.evidenceUrl,
      datePublished: claim.asOf,
    })),
  };

  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">
        Canonical answer · {contract.intent.buyerStage} · sealed
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

      <section className="panel mt-6 rounded-2xl border border-signal/20 p-6">
        <h2 className="font-mono text-[11px] uppercase tracking-wider text-signal">
          Verification seal
        </h2>
        <dl className="mt-3 grid gap-2 text-sm md:grid-cols-2">
          <div>
            <dt className="text-muted">Algorithm</dt>
            <dd className="font-mono text-paper">{contract.seal.alg}</dd>
          </div>
          <div>
            <dt className="text-muted">Key ID</dt>
            <dd className="font-mono text-paper">{contract.seal.keyId}</dd>
          </div>
          <div className="md:col-span-2">
            <dt className="text-muted">Content hash</dt>
            <dd className="break-all font-mono text-xs text-paper">
              {contract.seal.contentHash}
            </dd>
          </div>
          <div className="md:col-span-2">
            <dt className="text-muted">Signature</dt>
            <dd className="break-all font-mono text-xs text-fog/80">
              {contract.seal.signature}
            </dd>
          </div>
        </dl>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <Link
            href="/.well-known/quotum-pubkey.json"
            className="text-signal hover:underline"
          >
            Public key
          </Link>
          <Link
            href={`/api/agentspace/contracts/${contract.id}`}
            className="text-signal hover:underline"
          >
            Sealed JSON
          </Link>
          <Link href={attributionUrl} className="text-signal hover:underline">
            Attribution URL
          </Link>
        </div>
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
        <Link
          href={`/api/agentspace/contracts/${contract.id}`}
          className="text-signal hover:underline"
        >
          Sealed machine JSON
        </Link>
        <Link href="/agentspace" className="text-signal hover:underline">
          Agentspace
        </Link>
        <Link href="/experiment" className="text-signal hover:underline">
          Live experiment
        </Link>
      </div>
    </article>
  );
}
