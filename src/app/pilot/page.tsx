import Link from "next/link";
import {
  baselineProbes,
  treatmentProbes,
  pilotMeta,
} from "@/lib/pilot";
import { readLiveBaseline } from "@/lib/liveStore";
import {
  scoreAnswerShare,
  type AnswerShareBreakdown,
  type PilotProbe,
} from "@/lib/schema";

export const dynamic = "force-dynamic";

function pct(n: number) {
  return `${Math.round(n * 100)}%`;
}

function ScoreCard({
  label,
  score,
  accent,
}: {
  label: string;
  score: AnswerShareBreakdown;
  accent: string;
}) {
  return (
    <div className="panel rounded-2xl p-6">
      <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
        {label}
      </div>
      <div className={`font-display mt-3 text-5xl ${accent}`}>
        {score.answerShare}
      </div>
      <div className="mt-1 text-sm text-muted">Answer Share / 100</div>
      <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-muted">Mention</dt>
          <dd className="text-paper">{pct(score.mentionRate)}</dd>
        </div>
        <div>
          <dt className="text-muted">Recommend</dt>
          <dd className="text-paper">{pct(score.recommendRate)}</dd>
        </div>
        <div>
          <dt className="text-muted">Citation</dt>
          <dd className="text-paper">{pct(score.citationRate)}</dd>
        </div>
        <div>
          <dt className="text-muted">Prominence</dt>
          <dd className="text-paper">{pct(score.prominence)}</dd>
        </div>
      </dl>
    </div>
  );
}

function ProbeTable({ probes }: { probes: PilotProbe[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line">
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
          {probes.map((probe) => (
            <tr key={probe.id} className="border-t border-line/70">
              <td className="px-4 py-3 font-mono text-xs text-signal">
                {probe.engine}
              </td>
              <td className="max-w-md px-4 py-3 text-fog/85">{probe.prompt}</td>
              <td className="px-4 py-3">{probe.mentionedBrand ? "✓" : "—"}</td>
              <td className="px-4 py-3">{probe.citedDomain ? "✓" : "—"}</td>
              <td className="px-4 py-3">{probe.recommended ? "✓" : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function PilotPage() {
  const live = await readLiveBaseline();
  const simulatedBaseline = scoreAnswerShare(baselineProbes);
  const simulatedTreatment = scoreAnswerShare(treatmentProbes);
  const simulatedDelta = Number(
    (simulatedTreatment.answerShare - simulatedBaseline.answerShare).toFixed(1),
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">
        Pilot Lab · {pilotMeta.vertical}
      </p>
      <h1 className="font-display mt-2 text-4xl text-paper md:text-5xl">
        Live Answer Share pilot
      </h1>
      <p className="mt-4 max-w-3xl text-fog/75">{pilotMeta.hypothesis}</p>
      <p className="mt-2 max-w-3xl text-sm text-muted">
        Challenger: {pilotMeta.brand} · {pilotMeta.domain}
      </p>

      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl text-paper">
              Phase 1 · Live baseline
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted">
              Real engine captures scored for Northline and category incumbents.
              Treatment remeasure happens after contracts + answer pages are
              publicly discoverable.
            </p>
          </div>
          <Link
            href="/.well-known/answer-contracts.json"
            className="rounded-full border border-line px-4 py-2 text-sm text-paper hover:border-signal hover:text-signal"
          >
            Discovery index
          </Link>
        </div>

        {live ? (
          <div className="mt-6 space-y-6">
            <div className="panel rounded-2xl p-5 text-sm text-fog/80">
              <div className="font-mono text-[11px] uppercase tracking-wider text-signal">
                Captured {new Date(live.capturedAt).toLocaleString()}
              </div>
              <p className="mt-2">{live.method}</p>
              <p className="mt-1 text-muted">
                {live.captures.length} captures · {live.promptPack.length} prompts
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <ScoreCard
                label="Northline live baseline"
                score={live.challenger.score}
                accent="text-ember"
              />
              <div className="panel rounded-2xl p-6 md:col-span-2">
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                  Category leaderboard (live)
                </div>
                <ul className="mt-4 space-y-3">
                  {live.leaderboard.map((row, index) => (
                    <li
                      key={row.brandId}
                      className="flex items-center justify-between gap-4 border-t border-line/60 pt-3 first:border-0 first:pt-0"
                    >
                      <div>
                        <span className="font-mono text-xs text-muted">
                          #{index + 1}
                        </span>{" "}
                        <span className="text-paper">{row.brand}</span>
                        <span className="ml-2 font-mono text-[11px] text-muted">
                          {row.domain}
                        </span>
                      </div>
                      <div className="font-display text-2xl text-signal">
                        {row.score.answerShare}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h3 className="font-display text-xl text-paper">
                Northline probe sheet
              </h3>
              <div className="mt-4">
                <ProbeTable probes={live.challenger.probes} />
              </div>
            </div>
          </div>
        ) : (
          <div className="panel mt-6 rounded-2xl p-6">
            <p className="text-paper">Live baseline capture in progress…</p>
            <p className="mt-2 text-sm text-muted">
              Waiting for `data/live/baseline.json`. Simulated reference remains
              below.
            </p>
          </div>
        )}
      </section>

      <section className="mt-14 border-t border-line pt-10">
        <h2 className="font-display text-2xl text-paper">
          Reference · Simulated treatment model
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-muted">
          Kept for methodology comparison only. Not a live engine result.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <ScoreCard
            label="Simulated baseline"
            score={simulatedBaseline}
            accent="text-ember"
          />
          <ScoreCard
            label="Simulated treatment"
            score={simulatedTreatment}
            accent="text-signal"
          />
          <div className="panel rounded-2xl p-6">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
              Simulated delta
            </div>
            <div className="font-display mt-3 text-5xl text-paper">
              +{simulatedDelta}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-2xl text-paper">Published intervention</h2>
        <p className="mt-2 text-sm text-muted">
          Answer Contracts and canonical answer pages are the treatment artifact.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/answers/ac_analytics_best_for_startups"
            className="rounded-full bg-signal px-4 py-2 text-sm font-semibold text-ink"
          >
            Open canonical answer page
          </Link>
          <Link
            href="/publish"
            className="rounded-full border border-line px-4 py-2 text-sm text-paper hover:border-signal hover:text-signal"
          >
            Publish surface
          </Link>
        </div>
      </section>
    </div>
  );
}
