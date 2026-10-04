"use client";

import { useState } from "react";

type VerifyResult = {
  ok: boolean;
  reasons?: string[];
  error?: string;
};

export default function VerifyPage() {
  const [contractUrl, setContractUrl] = useState(
    "/api/agentspace/contracts/ac_quotum_what_is_answer_contract",
  );
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [preview, setPreview] = useState<string>("");

  async function runVerify() {
    setStatus("loading");
    setResult(null);
    try {
      const sealedRes = await fetch(contractUrl);
      if (!sealedRes.ok) {
        setResult({ ok: false, error: `fetch_failed_${sealedRes.status}` });
        setStatus("done");
        return;
      }
      const payload = await sealedRes.json();
      // /api/agentspace/contracts/[id] wraps as { contract, sealed, verify, ... }
      const sealedContract =
        payload?.contract && typeof payload.contract === "object"
          ? payload.contract
          : payload;
      const { seal, ...contract } = sealedContract;
      if (!seal) {
        setResult({ ok: false, error: "missing_seal_on_contract" });
        setStatus("done");
        return;
      }
      setPreview(JSON.stringify({ id: contract.id, seal }, null, 2));
      const verifyRes = await fetch("/api/agentspace/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contract, seal }),
      });
      const body = (await verifyRes.json()) as VerifyResult;
      setResult(body);
      setStatus("done");
    } catch (err) {
      setResult({
        ok: false,
        error: err instanceof Error ? err.message : "verify_failed",
      });
      setStatus("done");
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <p className="text-xs uppercase tracking-[0.2em] text-signal">
        Independent seal check
      </p>
      <h1 className="font-display mt-3 text-4xl text-paper">
        Verify a Quotum Answer Contract
      </h1>
      <p className="mt-4 text-fog/75">
        Fetch a sealed contract from agentspace and check its Ed25519 signature
        against the on-origin public key — no account required.
      </p>

      <label className="mt-8 block text-sm text-muted">
        Contract URL
        <input
          className="mt-2 w-full rounded-xl border border-line bg-ink px-4 py-3 font-mono text-sm text-paper"
          value={contractUrl}
          onChange={(e) => setContractUrl(e.target.value)}
        />
      </label>

      <button
        type="button"
        onClick={runVerify}
        disabled={status === "loading"}
        className="mt-6 rounded-full bg-signal px-6 py-3 text-sm font-semibold text-ink disabled:opacity-60"
      >
        {status === "loading" ? "Verifying…" : "Verify seal"}
      </button>

      {result && (
        <div
          className={`mt-8 rounded-2xl border p-5 ${
            result.ok
              ? "border-signal/40 bg-signal/10"
              : "border-ember/40 bg-ember/10"
          }`}
        >
          <div className="font-display text-2xl text-paper">
            {result.ok ? "Seal valid" : "Seal invalid"}
          </div>
          {!result.ok && (
            <p className="mt-2 font-mono text-sm text-fog/80">
              {(result.reasons ?? [result.error]).filter(Boolean).join(", ")}
            </p>
          )}
          {preview && (
            <pre className="mt-4 overflow-x-auto rounded-xl border border-line/60 bg-ink/80 p-4 text-xs text-fog/70">
              {preview}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
