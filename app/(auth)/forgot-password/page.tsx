"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setLoading(false);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="enc-card text-center">
        <div className="text-4xl mb-4">✉</div>
        <h1 className="font-serif text-2xl text-enc-cream mb-3">Check your inbox</h1>
        <p className="text-enc-muted text-sm leading-relaxed">
          If an account exists for that email, we&apos;ve sent a password reset link.
          It expires in 1 hour.
        </p>
        <Link href="/login" className="enc-btn-ghost block mt-6">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="enc-card">
      <h1 className="font-serif text-2xl text-enc-cream mb-2">Reset password</h1>
      <p className="text-enc-muted text-sm mb-8">
        Enter your email and we&apos;ll send you a reset link.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="enc-label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="enc-input"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <button type="submit" className="enc-btn-primary" disabled={loading}>
          {loading ? "Sending…" : "Send Reset Link"}
        </button>
      </form>

      <Link href="/login" className="enc-btn-ghost block text-center mt-6">
        Back to sign in
      </Link>
    </div>
  );
}
