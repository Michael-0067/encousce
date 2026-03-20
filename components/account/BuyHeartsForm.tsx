"use client";

import { useState } from "react";

const PACKS = [
  { hearts: 500,   label: "500 Hearts",    price: "$5.00"  },
  { hearts: 1000,  label: "1,000 Hearts",  price: "$10.00" },
  { hearts: 2500,  label: "2,500 Hearts",  price: "$25.00" },
  { hearts: 5000,  label: "5,000 Hearts",  price: "$50.00" },
  { hearts: 10000, label: "10,000 Hearts", price: "$100.00" },
];

export default function BuyHeartsForm() {
  const [selected, setSelected] = useState(PACKS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePurchase() {
    setError("");
    setLoading(true);

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hearts: selected.hearts }),
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
        <label className="enc-label">Select a pack</label>
        <p className="text-enc-dim text-xs mb-3">1 Heart = $0.01 — no bundles or markups</p>
        <div className="space-y-2">
          {PACKS.map((pack) => (
            <button
              key={pack.hearts}
              type="button"
              onClick={() => setSelected(pack)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-colors ${
                selected.hearts === pack.hearts
                  ? "border-enc-plum bg-enc-plum/10 text-enc-cream"
                  : "border-enc-border bg-enc-surface text-enc-muted hover:border-enc-plum/50 hover:text-enc-cream"
              }`}
            >
              <span className="text-enc-rose font-medium">♥ {pack.label}</span>
              <span className={selected.hearts === pack.hearts ? "text-enc-cream" : "text-enc-dim"}>
                {pack.price}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-xl border border-enc-border bg-enc-surface p-4 flex items-center justify-between">
        <div>
          <div className="text-enc-rose font-serif text-2xl">♥ {selected.label}</div>
          <div className="text-enc-dim text-xs mt-0.5">added to your wallet on confirmation</div>
        </div>
        <div className="text-right">
          <div className="text-enc-cream font-medium text-lg">{selected.price}</div>
          <div className="text-enc-dim text-xs mt-0.5">via Stripe</div>
        </div>
      </div>

      {error && <p className="text-enc-rose text-sm">{error}</p>}

      <button
        onClick={handlePurchase}
        disabled={loading}
        className="bg-enc-plum hover:bg-enc-plum-light disabled:opacity-40 disabled:cursor-not-allowed text-enc-cream font-medium px-6 py-3 rounded-xl transition-colors w-full"
      >
        {loading
          ? "Redirecting to Stripe…"
          : `Purchase ♥ ${selected.label} for ${selected.price}`}
      </button>

      <p className="text-enc-dim text-xs text-center">
        You will be redirected to Stripe to complete payment securely.
        Hearts are added to your wallet immediately on confirmation.
      </p>
    </div>
  );
}
