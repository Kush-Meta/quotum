"use client";

import { useMemo, useState } from "react";
import type { AnswerContract } from "@/lib/schema";

export function ContractEditor({ initial }: { initial: AnswerContract }) {
  const [contract, setContract] = useState(initial);
  const [status, setStatus] = useState<string | null>(null);
  const [validation, setValidation] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const json = useMemo(
    () => JSON.stringify(contract, null, 2),
    [contract],
  );

  async function validate() {
    setBusy(true);
    setStatus(null);
    setValidation("Validating…");
    try {
      const res = await fetch("/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contract),
      });
      const data = await res.json();
      if (!res.ok || data.valid === false) {
        setValidation(
          `Invalid — ${JSON.stringify(data.errors?.fieldErrors ?? data.error ?? data)}`,
        );
        return;
      }
      setValidation(
        `Valid · ${data.summary.claims} claims · citation ${data.summary.citationId}`,
      );
    } catch (err) {
      setValidation(
        `Validation request failed — ${err instanceof Error ? err.message : "unknown error"}`,
      );
    } finally {
      setBusy(false);
    }
  }

  async function save() {
    setBusy(true);
    setStatus("Saving…");
    try {
      const res = await fetch(`/api/contracts/${contract.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contract),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus(`Save failed: ${data.error ?? "unknown error"}`);
      } else {
        setContract(data.contract);
        setStatus(`Saved ${new Date(data.contract.updatedAt).toLocaleString()}`);
      }
    } catch (err) {
      setStatus(
        `Save request failed — ${err instanceof Error ? err.message : "unknown error"}`,
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-5">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">
            Contract editor
          </p>
          <h1 className="font-display mt-2 text-4xl text-paper">
            {contract.intent.promptClass}
          </h1>
        </div>

        <label className="block space-y-2">
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
            Canonical answer
          </span>
          <textarea
            className="panel min-h-36 w-full rounded-2xl p-4 text-sm leading-relaxed text-paper outline-none ring-signal/40 focus:ring-2"
            value={contract.canonicalAnswer}
            onChange={(e) =>
              setContract({ ...contract, canonicalAnswer: e.target.value })
            }
          />
        </label>

        <label className="block space-y-2">
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
            Competitive posture
          </span>
          <textarea
            className="panel min-h-24 w-full rounded-2xl p-4 text-sm leading-relaxed text-paper outline-none ring-signal/40 focus:ring-2"
            value={contract.competitiveFrame.posture}
            onChange={(e) =>
              setContract({
                ...contract,
                competitiveFrame: {
                  ...contract.competitiveFrame,
                  posture: e.target.value,
                },
              })
            }
          />
        </label>

        <label className="block space-y-2">
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
            Citation quotable
          </span>
          <textarea
            className="panel min-h-24 w-full rounded-2xl p-4 text-sm leading-relaxed text-paper outline-none ring-signal/40 focus:ring-2"
            value={contract.citation.quotable}
            onChange={(e) =>
              setContract({
                ...contract,
                citation: { ...contract.citation, quotable: e.target.value },
              })
            }
          />
        </label>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              void validate();
            }}
            className="rounded-full border border-line px-5 py-2.5 text-sm text-paper hover:border-signal hover:text-signal disabled:opacity-50"
          >
            {busy && validation?.startsWith("Validating")
              ? "Validating…"
              : "Validate"}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              void save();
            }}
            className="rounded-full bg-signal px-5 py-2.5 text-sm font-semibold text-ink hover:brightness-110 disabled:opacity-50"
          >
            {busy && status?.startsWith("Saving") ? "Saving…" : "Save contract"}
          </button>
        </div>
        <div aria-live="polite" className="space-y-2">
          {validation && (
            <p
              data-testid="validation-banner"
              className={`rounded-xl px-4 py-3 font-mono text-xs ${
                validation.startsWith("Valid ·")
                  ? "bg-signal/15 text-signal"
                  : validation.startsWith("Validating")
                    ? "bg-fog/10 text-muted"
                    : "bg-ember/15 text-ember"
              }`}
            >
              {validation}
            </p>
          )}
          {status && (
            <p
              data-testid="save-banner"
              className="rounded-xl bg-fog/5 px-4 py-3 font-mono text-xs text-muted"
            >
              {status}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-5">
        <div className="panel rounded-2xl p-5">
          <h2 className="font-display text-xl text-paper">Claims</h2>
          <ul className="mt-4 space-y-4">
            {contract.claims.map((claim) => (
              <li key={claim.id} className="border-t border-line pt-4 first:border-0 first:pt-0">
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted">
                  {claim.id} · {claim.confidence}
                </div>
                <p className="mt-2 text-sm text-fog/90">{claim.statement}</p>
                <p className="mt-2 font-mono text-[11px] text-signal/80">
                  {claim.evidenceHash}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="panel rounded-2xl p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-xl text-paper">Machine JSON</h2>
            <a
              href={`/api/publish/contracts/${contract.id}`}
              className="font-mono text-[11px] text-signal hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              /api/publish/contracts/{contract.id}
            </a>
          </div>
          <pre className="mt-4 max-h-[420px] overflow-auto rounded-xl bg-ink p-4 font-mono text-[11px] leading-relaxed text-fog/80">
            {json}
          </pre>
        </div>
      </div>
    </div>
  );
}
