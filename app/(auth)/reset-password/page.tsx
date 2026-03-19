"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      return;
    }

    setDone(true);
    setTimeout(() => router.push("/login"), 2500);
  }

  if (!token) {
    return (
      <div className="enc-card text-center">
        <p className="text-enc-rose">This reset link is invalid.</p>
        <Link href="/forgot-password" className="enc-link block mt-4 text-sm">
          Request a new one
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="enc-card text-center">
        <h1 className="font-serif text-2xl text-enc-cream mb-3">Password updated</h1>
        <p className="text-enc-muted text-sm">Redirecting you to sign in…</p>
      </div>
    );
  }

  return (
    <div className="enc-card">
      <h1 className="font-serif text-2xl text-enc-cream mb-2">New password</h1>
      <p className="text-enc-muted text-sm mb-8">Choose a new password for your account.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="enc-label" htmlFor="password">New Password</label>
          <input
            id="password"
            type="password"
            className="enc-input"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </div>

        <div>
          <label className="enc-label" htmlFor="confirm">Confirm Password</label>
          <input
            id="confirm"
            type="password"
            className="enc-input"
            placeholder="Repeat password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </div>

        {error && <p className="enc-error">{error}</p>}

        <button type="submit" className="enc-btn-primary" disabled={loading}>
          {loading ? "Updating…" : "Update Password"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="enc-card text-enc-muted text-sm">Loading…</div>}>
      <ResetForm />
    </Suspense>
  );
}
