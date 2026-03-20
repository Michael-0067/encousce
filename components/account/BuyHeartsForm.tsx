"use client";

import { useState } from "react";

const MIN_HEARTS = 500;

export default function BuyHeartsForm() {
  const [qty, setQty] = useState(500);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dollars = (qty / 100).toFixed(2);

  async function handlePurchase() {
    setError("");
    setLoading(true);

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hearts: qty }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong. Please try again.");
      return;
    }

    if (data.url) {
      window.location.href = data.url;
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="enc-label">How many Hearts?</label>
        <p className="text-enc-dim text-xs mb-3">
          1 Heart = $0.01 — minimum purchase is {MIN_HEARTS.toLocaleString()} Hearts ($5.00)
        </p>
        <div className="flex items-center gap-4">
          <input
            type="number"
            min={MIN_HEARTS}
            step={100}
            value={qty}
            onChange={(e) => {
              const v = Math.max(MIN_HEARTS, Math.floor(Number(e.target.value)));
              setQty(v);
            }}
            className="enc-input w-36 tabular-nums"
          />
          <div className="text-enc-muted text-sm">
            = <span className="text-enc-cream font-medium">${dollars}</span>
          </div>
        </div>
      </div>

      {/* Visual summary */}
      <div className="rounded-xl border border-enc-border bg-enc-surface p-4 flex items-center justify-between">
        <div>
          <div className="text-enc-rose font-serif text-2xl">♥ {qty.toLocaleString()}</div>
          <div className="text-enc-dim text-xs mt-0.5">Hearts added to your wallet</div>
        </div>
        <div className="text-right">
          <div className="text-enc-cream font-medium text-lg">${dollars}</div>
          <div className="text-enc-dim text-xs mt-0.5">charged via Stripe</div>
        </div>
      </div>

      {error && (
        <p className="text-enc-rose text-sm">{error}</p>
      )}

      <button
        onClick={handlePurchase}
        disabled={loading || qty < MIN_HEARTS}
        className="bg-enc-plum hover:bg-enc-plum-light disabled:opacity-40 disabled:cursor-not-allowed text-enc-cream font-medium px-6 py-3 rounded-xl transition-colors w-full"
      >
        {loading ? "Redirecting to Stripe…" : `Purchase ♥ ${qty.toLocaleString()} for $${dollars}`}
      </button>

      <p className="text-enc-dim text-xs text-center">
        You will be redirected to Stripe to complete payment. Hearts are added to your wallet immediately upon confirmation.
      </p>
    </div>
  );
}
