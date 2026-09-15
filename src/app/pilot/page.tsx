import Link from "next/link";
import { baselineProbes, treatmentProbes } from "@/lib/pilot";
import { buildPromptCoverage, buildPhase4Coverage } from "@/lib/coverage";
import { packStats } from "@/lib/promptPack";
import { readLiveBaseline, readLiveTreatment } from "@/lib/liveStore";
import { scoreAnswerShare, type PilotProbe } from "@/lib/schema";
import { listContracts } from "@/lib/store";

export const dynamic = "force-dynamic";

function pct(n: number) {
  return `${Math.round(n * 100)}%`;
}

function ShareBar({ value }: { value: number }) {
  const width = Math.max(0, Math.min(100, value));
  return (
    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
      <div
        className="h-full rounded-full bg-signal"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

function StatusChip({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${
        ok
          ? "border-signal/40 bg-signal/10 text-signal"
          : "border-line text-muted"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${ok ? "bg-signal" : "bg-muted"}`}
      />
      {label}
    </span>
  );
}

function MetricCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="panel rounded-2xl p-5">
      <div className="text-xs uppercase tracking-[0.16em] text-muted">
        {label}
      </div>
      <div className="font-display mt-2 text-3xl text-paper">{value}</div>
      <p className="mt-2 text-sm leading-relaxed text-fog/70">{hint}</p>
    </div>
  );
}

function BuyerQuestionRow({
  prompt,
  mentioned,
  cited,
  recommended,
}: {
  prompt: string;
  mentioned: boolean;
  cited: boolean;
  recommended: boolean;
}) {
  const outcome = recommended
    ? "Recommended"
    : mentioned
      ? "Mentioned only"
      : "Not in the answer";
  const tone = recommended
    ? "text-signal"
    : mentioned
      ? "text-paper"
      : "text-ember";

  return (
    <div className="grid gap-3 border-t border-line/60 py-4 first:border-0 first:pt-0 md:grid-cols-[1fr_auto] md:items-center">
      <div>
        <p className="text-sm text-fog/85">&ldquo;{prompt}&rdquo;</p>
        <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-muted">
          <span>Named: {mentioned ? "Yes" : "No"}</span>
          <span>&middot;</span>
          <span>Linked: {cited ? "Yes" : "No"}</span>
          <span>&middot;</span>
          <span>Recommended: {recommended ? "Yes" : "No"}</span>
        </div>
      </div>
      <div className={`font-display text-lg ${tone}`}>{outcome}</div>
    </div>
  );
}

export default async function PilotPage() {
  const live = await readLiveBaseline();
  const liveTreatment = await readLiveTreatment();
  const contracts = await listContracts();
  const coverage = buildPromptCoverage(contracts);
  const phase4Coverage = buildPhase4Coverage(contracts);
  const pack = packStats();

  const simulatedBaseline = scoreAnswerShare(baselineProbes);
  const simulatedTreatment = scoreAnswerShare(treatmentProbes);
  const simulatedDelta = Number(
    (simulatedTreatment.answerShare - simulatedBaseline.answerShare).toFixed(1),
  );

  const liveScore = live?.challenger.score ?? null;
  const treatmentScore = liveTreatment?.challenger.score ?? null;
  const liveDelta =
    liveScore && treatmentScore
      ? Number((treatmentScore.answerShare - liveScore.answerShare).toFixed(1))
      : null;

  const leader = live?.leaderboard[0];
  const northlineRank =
    live?.leaderboard.findIndex((row) => row.brandId === "northline") ?? -1;

  const answersReady =
    phase4Coverage.uncovered.length === 0 &&
    phase4Coverage.holdoutLeaks.length === 0;

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <section className="relative overflow-hidden rounded-[2rem] border border-line p-8 md:p-12">
        <div className="pointer-events-none absolute inset-0 grid-fade opacity-40" />
        <div className="relative">
          <p className="text-xs uppercase tracking-[0.2em] text-signal">
            Northline results &middot; Product analytics
          </p>
          <h1 className="font-display mt-3 max-w-3xl text-4xl leading-tight text-paper md:text-6xl">
            When buyers ask AI for product analytics,{" "}
            <span className="text-ember">Northline does not show up.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-fog/75">
            We asked the buying questions marketers care about — best for
            startups, Amplitude vs Mixpanel, open-source alternatives — and
            scored who AI answers actually name, cite, and recommend.
          </p>
          <p className="mt-4 max-w-2xl rounded-2xl border border-ember/30 bg-ember/5 px-4 py-3 text-sm leading-relaxed text-fog/85">
            <span className="text-ember">Takeaway for stakeholders:</span>{" "}
            Northline&apos;s Answer Share is{" "}
            <span className="text-paper">
              {liveScore ? liveScore.answerShare : 0}
            </span>{" "}
            today
            {leader ? (
              <>
                {" "}
                while {leader.brand} leads at{" "}
                <span className="text-paper">{leader.score.answerShare}</span>
              </>
            ) : null}
            . The play is publish clear answers for those questions, then
            remeasure the same ones.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <StatusChip ok={!!live} label="Baseline measured" />
            <StatusChip
              ok={coverage.coveredCount === coverage.promptCount}
              label="Answer pages ready"
            />
            <StatusChip
              ok={!!liveTreatment}
              label={
                liveTreatment
                  ? "After-publish lift measured"
                  : "After-publish lift pending"
              }
            />
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-[1.15fr_1fr]">
        <div className="panel rounded-[1.75rem] p-8">
          <p className="text-xs uppercase tracking-[0.18em] text-muted">
            Northline AI visibility today
          </p>
          <div className="mt-4 flex items-end gap-3">
            <div className="font-display text-7xl text-ember md:text-8xl">
              {liveScore ? liveScore.answerShare : "—"}
            </div>
            <div className="pb-3 text-muted">/ 100 Answer Share</div>
          </div>
          <ShareBar value={liveScore?.answerShare ?? 0} />
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-fog/75">
            Answer Share is a simple visibility score: how often Northline is
            named, recommended, linked as a source, and how early it appears.
            Zero today is expected — Answer Contracts are not on a durable public
            host yet.
          </p>
          {leader ? (
            <p className="mt-4 text-sm text-fog/70">
              Category leader right now:{" "}
              <span className="text-paper">{leader.brand}</span> at{" "}
              <span className="font-display text-signal">
                {leader.score.answerShare}
              </span>
              {northlineRank >= 0 ? (
                <>
                  {" "}
                  &middot; Northline ranks #{northlineRank + 1} of{" "}
                  {live?.leaderboard.length}
                </>
              ) : null}
            </p>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <MetricCard
            label="Named in answers"
            value={liveScore ? pct(liveScore.mentionRate) : "—"}
            hint="Did the AI mention Northline by name?"
          />
          <MetricCard
            label="Recommended"
            value={liveScore ? pct(liveScore.recommendRate) : "—"}
            hint="Did the AI suggest Northline as a fit?"
          />
          <MetricCard
            label="Linked as a source"
            value={liveScore ? pct(liveScore.citationRate) : "—"}
            hint="Did northline.dev appear in citations?"
          />
          <MetricCard
            label="Buyer questions tested"
            value={String(live?.captures.length ?? pack.phase1Count)}
            hint="Same questions get re-asked after publish."
          />
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-3xl text-paper">
          Who shows up when buyers ask AI
        </h2>
        <p className="mt-2 max-w-2xl text-fog/70">
          Live category leaderboard from the baseline run — the market Northline
          has to earn share from.
        </p>
        {live ? (
          <div className="mt-6 space-y-3">
            {live.leaderboard.map((row, index) => {
              const isUs = row.brandId === "northline";
              return (
                <div
                  key={row.brandId}
                  className={`panel rounded-2xl px-5 py-4 ${
                    isUs ? "border-ember/40" : ""
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-muted">
                        #{index + 1}
                      </span>
                      <div>
                        <div className="text-paper">
                          {row.brand}
                          {isUs ? (
                            <span className="ml-2 text-xs text-ember">
                              your brand
                            </span>
                          ) : null}
                        </div>
                        <div className="text-xs text-muted">{row.domain}</div>
                      </div>
                    </div>
                    <div className="font-display text-3xl text-signal">
                      {row.score.answerShare}
                    </div>
                  </div>
                  <ShareBar value={row.score.answerShare} />
                </div>
              );
            })}
            <p className="pt-2 text-xs text-muted">
              Captured {new Date(live.capturedAt).toLocaleDateString()} &middot;{" "}
              {live.method}
            </p>
          </div>
        ) : (
          <div className="panel mt-6 rounded-2xl p-6 text-sm text-muted">
            Baseline capture still loading.
          </div>
        )}
      </section>

      <section className="mt-14">
        <h2 className="font-display text-3xl text-paper">
          The experiment, in plain English
        </h2>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-fog/80">
          <span className="text-paper">Hypothesis:</span> If we publish clear,
          evidence-backed answers for the questions buyers ask AI, Northline
          should start showing up in those answers — and we can measure that as
          Answer Share lift.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="panel rounded-2xl p-6">
            <div className="text-xs uppercase tracking-[0.16em] text-ember">
              Step 1 &middot; Today
            </div>
            <h3 className="font-display mt-3 text-xl text-paper">
              Measure the blank slate
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-fog/70">
              Ask real buying questions. Score who gets named, recommended, and
              linked. Northline starts at 0 — that is the honest baseline.
            </p>
          </div>
          <div className="panel rounded-2xl p-6">
            <div className="text-xs uppercase tracking-[0.16em] text-signal">
              Step 2 &middot; Publish
            </div>
            <h3 className="font-display mt-3 text-xl text-paper">
              Put answers where AI can find them
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-fog/70">
              Publish Answer Contracts and clear answer pages for each buying
              question — machine-readable answers with proof, not another blog
              post.
            </p>
          </div>
          <div className="panel rounded-2xl p-6">
            <div className="text-xs uppercase tracking-[0.16em] text-paper">
              Step 3 &middot; Remeasure
            </div>
            <h3 className="font-display mt-3 text-xl text-paper">
              Ask the same questions again
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-fog/70">
              After discovery, re-run the same questions (plus paraphrases and
              surprise prompts) and report Northline&apos;s Answer Share lift.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-3xl text-paper">
          What buyers asked — and how Northline fared
        </h2>
        <p className="mt-2 max-w-2xl text-fog/70">
          Each row is a real question from the baseline run.
        </p>
        <div className="panel mt-6 rounded-[1.5rem] px-5 py-2 md:px-8">
          {live?.challenger.probes?.length ? (
            live.challenger.probes.map((probe: PilotProbe) => (
              <BuyerQuestionRow
                key={probe.id}
                prompt={probe.prompt}
                mentioned={probe.mentionedBrand}
                cited={probe.citedDomain}
                recommended={probe.recommended}
              />
            ))
          ) : (
            <p className="py-6 text-sm text-muted">No live probes yet.</p>
          )}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-3xl text-paper">
          How we keep the test fair
        </h2>
        <p className="mt-2 max-w-2xl text-fog/70">
          More than one wording, more than one AI, and a few surprise questions
          we do not coach — so the lift number is something a marketer can trust.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Buying intents"
            value={String(pack.intentCount)}
            hint="Core jobs like ‘best for startups’ or ‘open-source alt’."
          />
          <MetricCard
            label="Question variants"
            value={String(pack.measurementCount)}
            hint="Same intent, different wording — so we are not gaming one phrase."
          />
          <MetricCard
            label="Surprise questions"
            value={String(pack.holdoutCount)}
            hint="Held-back prompts we do not put on contracts until after scoring."
          />
          <MetricCard
            label="AI surfaces"
            value={String(pack.primaryEngines.length)}
            hint={pack.primaryEngines.join(" · ")}
          />
        </div>
        <div className="panel mt-4 rounded-2xl p-5 text-sm text-fog/75">
          <p>
            Target sample after publish:{" "}
            <span className="text-paper">
              {pack.measurementCaptures} scored answers
            </span>{" "}
            ({pack.measurementCount} questions &times;{" "}
            {pack.primaryEngines.length} AIs). Baseline today used{" "}
            {pack.phase1Count} answers — enough to prove invisibility, not enough
            alone to claim durable lift.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <StatusChip
              ok={answersReady}
              label={
                answersReady
                  ? "All buyer questions have an answer page"
                  : "Some buyer questions still need an answer page"
              }
            />
            <StatusChip
              ok={phase4Coverage.holdoutLeaks.length === 0}
              label={
                phase4Coverage.holdoutLeaks.length === 0
                  ? "Surprise questions stay uncoached"
                  : "Surprise questions leaked onto contracts"
              }
            />
          </div>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-3xl text-paper">
          After we publish — did visibility improve?
        </h2>
        {liveTreatment && treatmentScore ? (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <MetricCard
              label="Before"
              value={String(liveScore?.answerShare ?? 0)}
              hint="Northline Answer Share at baseline"
            />
            <MetricCard
              label="After"
              value={String(treatmentScore.answerShare)}
              hint="Northline Answer Share after Answer Contracts went live"
            />
            <MetricCard
              label="Lift"
              value={`${liveDelta != null && liveDelta > 0 ? "+" : ""}${liveDelta ?? 0}`}
              hint="Change in AI visibility score"
            />
          </div>
        ) : (
          <div className="panel mt-6 rounded-[1.5rem] p-8">
            <p className="font-display text-2xl text-paper">
              Remeasurement starts after public publish + discovery.
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fog/70">
              Contracts and answer pages are prepared. Once they are on a public
              host AI systems can crawl, we wait for discovery, ask the same
              buyer questions again, and this section becomes a before/after
              scorecard.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/publish"
                className="rounded-full bg-signal px-5 py-2.5 text-sm font-semibold text-ink"
              >
                View publish surface
              </Link>
              <Link
                href="/answers/ac_analytics_best_for_startups"
                className="rounded-full border border-line px-5 py-2.5 text-sm text-paper hover:border-signal hover:text-signal"
              >
                Preview a buyer answer page
              </Link>
            </div>
          </div>
        )}
      </section>

      <section className="mt-14">
        <h2 className="font-display text-3xl text-paper">
          What &ldquo;good&rdquo; could look like
        </h2>
        <p className="mt-2 max-w-2xl text-fog/70">
          Illustrative model only — not a live engine result. Useful for setting
          stakeholder expectations.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="panel rounded-2xl p-6">
            <div className="text-xs uppercase tracking-[0.16em] text-muted">
              Modeled before
            </div>
            <div className="font-display mt-3 text-5xl text-ember">
              {simulatedBaseline.answerShare}
            </div>
            <ShareBar value={simulatedBaseline.answerShare} />
          </div>
          <div className="panel rounded-2xl p-6">
            <div className="text-xs uppercase tracking-[0.16em] text-muted">
              Modeled after
            </div>
            <div className="font-display mt-3 text-5xl text-signal">
              {simulatedTreatment.answerShare}
            </div>
            <ShareBar value={simulatedTreatment.answerShare} />
          </div>
          <div className="panel rounded-2xl p-6">
            <div className="text-xs uppercase tracking-[0.16em] text-muted">
              Modeled lift
            </div>
            <div className="font-display mt-3 text-5xl text-paper">
              +{simulatedDelta}
            </div>
            <p className="mt-3 text-sm text-fog/70">
              Live truth replaces this once treatment captures are in.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-14 rounded-[1.75rem] border border-signal/30 bg-signal/5 p-8 md:p-10">
        <h2 className="font-display text-3xl text-paper">
          What to do with this
        </h2>
        <ol className="mt-5 list-decimal space-y-3 pl-5 text-fog/80">
          <li>
            Share the baseline: Northline is invisible on category AI answers
            today (Answer Share 0).
          </li>
          <li>
            Keep the prepared answer pages public and crawlable so engines can
            discover them.
          </li>
          <li>
            After discovery, remeasure the same buyer questions and report lift
            as a simple before &rarr; after scorecard.
          </li>
        </ol>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/publish"
            className="rounded-full bg-signal px-5 py-2.5 text-sm font-semibold text-ink"
          >
            Open publish checklist
          </Link>
          <Link
            href="/studio"
            className="rounded-full border border-line px-5 py-2.5 text-sm text-paper hover:border-signal hover:text-signal"
          >
            Edit Answer Contracts
          </Link>
          <Link
            href="/spec"
            className="rounded-full border border-line px-5 py-2.5 text-sm text-paper hover:border-signal hover:text-signal"
          >
            Read the method
          </Link>
        </div>
      </section>

      <details className="panel mt-14 rounded-[1.5rem] p-6">
        <summary className="cursor-pointer font-display text-xl text-paper">
          Details for analysts
        </summary>
        <div className="mt-6 space-y-8 text-sm text-fog/75">
          <div>
            <h3 className="text-paper">Coverage map</h3>
            <p className="mt-1 text-muted">
              Covered {coverage.coveredCount}/{coverage.promptCount} baseline
              prompts &middot; {coverage.contracts.length} contracts
            </p>
            <ul className="mt-3 space-y-2">
              {coverage.rows.map((row) => (
                <li
                  key={row.prompt}
                  className="flex flex-col gap-1 border-t border-line/50 pt-2 md:flex-row md:justify-between"
                >
                  <span>{row.prompt}</span>
                  <span className="font-mono text-xs text-signal">
                    {row.covered ? row.contractIds.join(", ") : "uncovered"}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-paper">Robust pack targets</h3>
            <p className="mt-2">
              Measurement {pack.measurementCount} &middot; Holdouts{" "}
              {pack.holdoutCount} &middot; Engines{" "}
              {pack.primaryEngines.join(", ")} &middot; Target captures{" "}
              {pack.measurementCaptures}
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <Link
                href="/api/experiment"
                className="text-signal hover:underline"
              >
                /api/experiment
              </Link>
              <Link href="/api/coverage" className="text-signal hover:underline">
                /api/coverage
              </Link>
              <Link href="/api/pilot" className="text-signal hover:underline">
                /api/pilot
              </Link>
            </div>
          </div>

          {live ? (
            <div>
              <h3 className="text-paper">Raw probe sheet</h3>
              <div className="mt-3 overflow-x-auto rounded-xl border border-line">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-ink/60 font-mono text-[11px] uppercase tracking-wider text-muted">
                    <tr>
                      <th className="px-4 py-3">Engine</th>
                      <th className="px-4 py-3">Prompt</th>
                      <th className="px-4 py-3">Mention</th>
                      <th className="px-4 py-3">Cite</th>
                      <th className="px-4 py-3">Rec</th>
                    </tr>
                  </thead>
                  <tbody>
                    {live.challenger.probes.map((probe: PilotProbe) => (
                      <tr key={probe.id} className="border-t border-line/70">
                        <td className="px-4 py-3 font-mono text-xs text-signal">
                          {probe.engine}
                        </td>
                        <td className="max-w-md px-4 py-3">{probe.prompt}</td>
                        <td className="px-4 py-3">
                          {probe.mentionedBrand ? "✓" : "—"}
                        </td>
                        <td className="px-4 py-3">
                          {probe.citedDomain ? "✓" : "—"}
                        </td>
                        <td className="px-4 py-3">
                          {probe.recommended ? "✓" : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {liveScore ? (
                <>
                  <dl className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                    <div>
                      <dt className="text-muted">Mention rate</dt>
                      <dd className="text-paper">
                        {pct(liveScore.mentionRate)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted">Recommend rate</dt>
                      <dd className="text-paper">
                        {pct(liveScore.recommendRate)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted">Citation rate</dt>
                      <dd className="text-paper">
                        {pct(liveScore.citationRate)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted">Prominence</dt>
                      <dd className="text-paper">
                        {pct(liveScore.prominence)}
                      </dd>
                    </div>
                  </dl>
                  <p className="mt-3 text-xs text-muted">
                    Formula: 100 &times; (0.35&middot;mention + 0.30&middot;recommend +
                    0.25&middot;citation + 0.10&middot;prominence)
                  </p>
                </>
              ) : null}
            </div>
          ) : null}
        </div>
      </details>
    </div>
  );
}
