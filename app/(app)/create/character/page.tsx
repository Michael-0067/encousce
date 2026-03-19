"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SETTINGS, SETTING_LABELS, LEAD_TYPES, LEAD_TYPE_LABELS } from "@/lib/constants";

export default function CreateCharacterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    portraitImage: "",
    primaryType: "",
    secondaryType: "",
    compatibleSettings: [] as string[],
    corePersonality: "",
    interactionStyle: "",
    dialogueTone: "",
    behaviorRules: "",
    status: "DRAFT",
  });

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function toggleSetting(s: string) {
    setForm((f) => ({
      ...f,
      compatibleSettings: f.compatibleSettings.includes(s)
        ? f.compatibleSettings.filter((x) => x !== s)
        : [...f.compatibleSettings, s],
    }));
  }

  async function handleSubmit(e: React.FormEvent, publish = false) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/create/character", {
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
        <span className="text-enc-cream-muted">Create Character</span>
      </div>

      <h1 className="font-serif text-3xl text-enc-cream mb-2">Create a Character</h1>
      <p className="text-enc-muted text-sm mb-8">Cast a lead. They&apos;ll carry the encounter.</p>

      <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
        <div>
          <label className="enc-label">Character Name *</label>
          <input className="enc-input" placeholder="e.g. Elara, Marcus, The Stranger" value={form.name} onChange={(e) => set("name", e.target.value)} required />
        </div>

        <div>
          <label className="enc-label">Portrait Image URL</label>
          <input className="enc-input" placeholder="https://..." value={form.portraitImage} onChange={(e) => set("portraitImage", e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="enc-label">Primary Type *</label>
            <select className="enc-input" value={form.primaryType} onChange={(e) => set("primaryType", e.target.value)} required>
              <option value="">Select…</option>
              {LEAD_TYPES.map((t) => (
                <option key={t} value={t}>{LEAD_TYPE_LABELS[t]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="enc-label">Secondary Type (optional)</label>
            <select className="enc-input" value={form.secondaryType} onChange={(e) => set("secondaryType", e.target.value)}>
              <option value="">None</option>
              {LEAD_TYPES.map((t) => (
                <option key={t} value={t}>{LEAD_TYPE_LABELS[t]}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="enc-label">Compatible Settings</label>
          <div className="flex gap-2 flex-wrap mt-1">
            {SETTINGS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toggleSetting(s)}
                className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
                  form.compatibleSettings.includes(s)
                    ? "bg-enc-plum border-enc-plum text-enc-cream"
                    : "border-enc-border text-enc-muted hover:border-enc-plum hover:text-enc-cream"
                }`}
              >
                {SETTING_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="enc-label">Core Personality *</label>
          <textarea className="enc-input min-h-[80px] resize-y" placeholder="How does this character think and feel? What drives them?" value={form.corePersonality} onChange={(e) => set("corePersonality", e.target.value)} required />
        </div>

        <div>
          <label className="enc-label">Interaction Style *</label>
          <textarea className="enc-input min-h-[80px] resize-y" placeholder="How do they engage with the user? Bold, hesitant, warm, guarded?" value={form.interactionStyle} onChange={(e) => set("interactionStyle", e.target.value)} required />
        </div>

        <div>
          <label className="enc-label">Dialogue Tone *</label>
          <textarea className="enc-input min-h-[60px] resize-y" placeholder="How do they speak? Short and intense, poetic and slow, dry and sardonic?" value={form.dialogueTone} onChange={(e) => set("dialogueTone", e.target.value)} required />
        </div>

        <div>
          <label className="enc-label">Behavior Rules *</label>
          <textarea className="enc-input min-h-[80px] resize-y" placeholder="What should this character always or never do? Any limits on tone or content?" value={form.behaviorRules} onChange={(e) => set("behaviorRules", e.target.value)} required />
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
