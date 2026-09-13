"use client";

import { useEffect, useState } from "react";
import type { AnswerShareBreakdown, PilotProbe } from "@/lib/schema";

type PilotResponse = {
  meta: {
    vertical: string;
    brand: string;
    domain: string;
    hypothesis: string;
    treatment: string;
  };
  baseline: { score: AnswerShareBreakdown; probes: PilotProbe[] };
  treatment: { score: AnswerShareBreakdown; probes: PilotProbe[] };
  delta: {
    answerShare: number;
    mentionRate: number;
    citationRate: number;
    recommendRate: number;
  };
};

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
        <thead className="bg-ink-soft/80 font-mono text-[11px] uppercase tracking-wider text-muted">
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

export default function PilotPage() {
  const [data, setData] = useState<PilotResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/pilot")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load pilot");
        return res.json();
      })
      .then(setData)
      .catch((err: Error) => setError(err.message));
  }, []);

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-12 text-ember">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-12 text-muted">
        Loading pilot lab…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">
        Pilot Lab · {data.meta.vertical}
      </p>
      <h1 className="font-display mt-2 text-4xl text-paper md:text-5xl">
        Answer Share experiment
      </h1>
      <p className="mt-4 max-w-3xl text-fog/75">{data.meta.hypothesis}</p>
      <p className="mt-2 max-w-3xl text-sm text-muted">
        Treatment: {data.meta.treatment}
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <ScoreCard
          label="Baseline (HTML only)"
          score={data.baseline.score}
          accent="text-ember"
        />
        <ScoreCard
          label="Treatment (Answer Contracts)"
          score={data.treatment.score}
          accent="text-signal"
        />
        <div className="panel rounded-2xl p-6">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            Delta
          </div>
          <div className="font-display mt-3 text-5xl text-paper">
            +{data.delta.answerShare}
          </div>
          <div className="mt-1 text-sm text-muted">Answer Share points</div>
          <ul className="mt-6 space-y-2 text-sm text-fog/80">
            <li>Mention +{pct(data.delta.mentionRate)}</li>
            <li>Recommend +{pct(data.delta.recommendRate)}</li>
            <li>Citation +{pct(data.delta.citationRate)}</li>
          </ul>
        </div>
      </div>

      <div className="mt-12 space-y-8">
        <div>
          <h2 className="font-display text-2xl text-paper">Baseline probes</h2>
          <p className="mt-2 text-sm text-muted">
            Same prompt pack, before publishing contracts.
          </p>
          <div className="mt-4">
            <ProbeTable probes={data.baseline.probes} />
          </div>
        </div>
        <div>
          <h2 className="font-display text-2xl text-paper">Treatment probes</h2>
          <p className="mt-2 text-sm text-muted">
            Simulated post-publish outcomes for the pilot demo. Replace with live
            engine captures for a real experiment.
          </p>
          <div className="mt-4">
            <ProbeTable probes={data.treatment.probes} />
          </div>
        </div>
      </div>

      <div className="panel mt-12 rounded-2xl p-6">
        <h2 className="font-display text-2xl text-paper">Scoring model</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-fog/75">
          Answer Share = 100 × (0.35·mention rate + 0.30·recommend rate +
          0.25·citation rate + 0.10·prominence). Prominence rewards earlier brand
          mentions in the answer text. No black-box “AI visibility” index — every
          term maps to a probe field.
        </p>
      </div>
    </div>
  );
}
