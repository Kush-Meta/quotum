export default function SpecPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">
        Spec v0.1
      </p>
      <h1 className="font-display mt-2 text-4xl text-paper">
        Answer Contracts protocol
      </h1>
      <div className="prose-like mt-8 space-y-8 text-sm leading-relaxed text-fog/80">
        <section>
          <h2 className="font-display text-2xl text-paper">Problem</h2>
          <p className="mt-3">
            Generative engines synthesize answers from messy HTML, third-party
            blogs, and forums. Companies lack a publish primitive that says: for
            this buyer intent, here is our canonical answer, evidence-backed
            claims, competitive frame, and the citation object we want attributed.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl text-paper">Object model</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              <strong className="text-paper">Intent</strong> — prompt class,
              example prompts, buyer stage
            </li>
            <li>
              <strong className="text-paper">Canonical answer</strong> — the
              paragraph you want synthesized or quoted
            </li>
            <li>
              <strong className="text-paper">Claims</strong> — atomic statements
              with evidence URL + hash, scope, confidence, as-of date
            </li>
            <li>
              <strong className="text-paper">Competitive frame</strong> — axis,
              peers, posture
            </li>
            <li>
              <strong className="text-paper">Citation object</strong> — stable id,
              quotable string, preferred URL
            </li>
            <li>
              <strong className="text-paper">Policy + eval</strong> — paraphrase /
              recommend rights, freshness SLA, success criteria and targets
            </li>
          </ul>
        </section>
        <section>
          <h2 className="font-display text-2xl text-paper">Non-goals</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Not an llms.txt replacement checklist</li>
            <li>Not an on-site /ask chatbot (NLWeb territory)</li>
            <li>Not a mention-tracking SaaS as the product</li>
            <li>Does not claim vendor engines will adopt the format on day one</li>
          </ul>
        </section>
        <section>
          <h2 className="font-display text-2xl text-paper">Answer Share</h2>
          <p className="mt-3">
            Answer Share = 100 × (0.35·mention + 0.30·recommend + 0.25·citation +
            0.10·prominence). Use a fixed prompt pack, capture engine answers,
            score baseline vs treatment after publishing contracts.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl text-paper">Pilot vertical</h2>
          <p className="mt-3">
            Product analytics for startups. Fictional brand Northline Analytics
            so the experiment does not impersonate a real vendor. Publish
            contracts for category prompts, then measure Answer Share lift.
          </p>
        </section>
      </div>
    </div>
  );
}
