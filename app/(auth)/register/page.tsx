"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, password }),
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
      <h1 className="font-serif text-2xl text-enc-cream mb-2">Create account</h1>
      <p className="text-enc-muted text-sm mb-8">Start your first encounter today.</p>

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
          <label className="enc-label" htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            className="enc-input"
            placeholder="yourname"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
            minLength={3}
            maxLength={30}
          />
        </div>

        <div>
          <label className="enc-label" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="enc-input"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            minLength={8}
          />
        </div>

        {error && <p className="enc-error">{error}</p>}

        <button type="submit" className="enc-btn-primary" disabled={loading}>
          {loading ? "Creating account…" : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-enc-muted text-sm text-center">
        Already have an account?{" "}
        <Link href="/login" className="enc-link">
          Sign in
        </Link>
      </p>
    </div>
  );
}
