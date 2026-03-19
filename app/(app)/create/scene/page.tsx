"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SETTINGS, SETTING_LABELS, LEAD_TYPES, LEAD_TYPE_LABELS } from "@/lib/constants";

export default function CreateScenePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    coverImage: "",
    setting: "",
    coreSituation: "",
    emotionalHook: "",
    openingMoment: "",
    toneTags: "",
    allowedType1: "",
    allowedType2: "",
    status: "DRAFT",
  });

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent, publish = false) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/create/scene", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, status: publish ? "PUBLISHED" : "DRAFT" }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) { setError(data.error || "Something went wrong."); return; }
    router.push("/browse");
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 text-enc-dim text-sm mb-8">
        <Link href="/browse" className="hover:text-enc-muted transition-colors">Browse</Link>
        <span>›</span>
        <span className="text-enc-cream-muted">Create Scene</span>
      </div>

      <h1 className="font-serif text-3xl text-enc-cream mb-2">Create a Scene</h1>
      <p className="text-enc-muted text-sm mb-8">Build the moment. Others will step into it.</p>

      <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
        <div>
          <label className="enc-label">Scene Title *</label>
          <input className="enc-input" placeholder="e.g. The Rain-Soaked Rooftop" value={form.title} onChange={(e) => set("title", e.target.value)} required />
        </div>

        <div>
          <label className="enc-label">Cover Image URL</label>
          <input className="enc-input" placeholder="https://..." value={form.coverImage} onChange={(e) => set("coverImage", e.target.value)} />
          <p className="text-enc-dim text-xs mt-1">Optional. A direct link to the scene&apos;s cover image.</p>
        </div>

        <div>
          <label className="enc-label">Setting *</label>
          <select className="enc-input" value={form.setting} onChange={(e) => set("setting", e.target.value)} required>
            <option value="">Select a setting…</option>
            {SETTINGS.map((s) => (
              <option key={s} value={s}>{SETTING_LABELS[s]}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="enc-label">Core Situation *</label>
          <textarea className="enc-input min-h-[80px] resize-y" placeholder="Describe the situation the user finds themselves in." value={form.coreSituation} onChange={(e) => set("coreSituation", e.target.value)} required />
        </div>

        <div>
          <label className="enc-label">Emotional Hook *</label>
          <input className="enc-input" placeholder="e.g. You weren't supposed to be here. Neither was he." value={form.emotionalHook} onChange={(e) => set("emotionalHook", e.target.value)} required />
          <p className="text-enc-dim text-xs mt-1">One line. The tension that pulls them in.</p>
        </div>

        <div>
          <label className="enc-label">Opening Moment *</label>
          <textarea className="enc-input min-h-[100px] resize-y" placeholder="The first thing that happens when the user enters this scene. Set the atmosphere." value={form.openingMoment} onChange={(e) => set("openingMoment", e.target.value)} required />
          <p className="text-enc-dim text-xs mt-1">This is the scene&apos;s first message. Make it count.</p>
        </div>

        <div>
          <label className="enc-label">Tone Tags</label>
          <input className="enc-input" placeholder="e.g. Slow burn, Tension, Forbidden" value={form.toneTags} onChange={(e) => set("toneTags", e.target.value)} />
          <p className="text-enc-dim text-xs mt-1">Comma-separated. Optional.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="enc-label">Lead Type 1 *</label>
            <select className="enc-input" value={form.allowedType1} onChange={(e) => set("allowedType1", e.target.value)} required>
              <option value="">Select…</option>
              {LEAD_TYPES.map((t) => (
                <option key={t} value={t}>{LEAD_TYPE_LABELS[t]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="enc-label">Lead Type 2 (optional)</label>
            <select className="enc-input" value={form.allowedType2} onChange={(e) => set("allowedType2", e.target.value)}>
              <option value="">None</option>
              {LEAD_TYPES.map((t) => (
                <option key={t} value={t}>{LEAD_TYPE_LABELS[t]}</option>
              ))}
            </select>
          </div>
        </div>

        {error && <p className="enc-error">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="flex-1 border border-enc-border hover:border-enc-plum text-enc-cream-muted hover:text-enc-cream py-3 rounded-lg transition-colors disabled:opacity-50">
            {loading ? "Saving…" : "Save as Draft"}
          </button>
          <button type="button" disabled={loading} onClick={(e) => handleSubmit(e, true)} className="flex-1 bg-enc-plum hover:bg-enc-plum-light text-enc-cream font-medium py-3 rounded-lg transition-colors disabled:opacity-50">
            {loading ? "Publishing…" : "Publish"}
          </button>
        </div>
      </form>
    </div>
  );
}
