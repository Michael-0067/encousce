"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      return;
    }

    router.push("/browse");
    router.refresh();
  }

  return (
    <div className="enc-card">
      <h1 className="font-serif text-2xl text-enc-cream mb-2">Welcome back</h1>
      <p className="text-enc-muted text-sm mb-8">Sign in to continue your encounters.</p>

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

        <div>
          <label className="enc-label" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="enc-input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        {error && <p className="enc-error">{error}</p>}

        <button type="submit" className="enc-btn-primary" disabled={loading}>
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <div className="mt-6 flex flex-col gap-3 text-center">
        <Link href="/forgot-password" className="enc-btn-ghost">
          Forgot your password?
        </Link>
        <p className="text-enc-muted text-sm">
          No account?{" "}
          <Link href="/register" className="enc-link">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
