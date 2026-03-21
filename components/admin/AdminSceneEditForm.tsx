"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SETTINGS, LEAD_TYPES, CONTENT_TIERS, SETTING_LABELS, LEAD_TYPE_LABELS } from "@/lib/constants";

interface SceneFields {
  id: string;
  title: string;
  setting: string;
  coreSituation: string;
  emotionalHook: string;
  openingMoment: string;
  toneTags: string;
  allowedType1: string;
  allowedType2: string;
  coverImage: string;
  imagePrompt: string;
  status: string;
  tier: string;
}

export default function AdminSceneEditForm({ scene }: { scene: SceneFields }) {
  const router = useRouter();
  const [form, setForm] = useState(scene);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  function set(field: keyof SceneFields, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    const res = await fetch(`/api/admin/scenes/${scene.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      router.refresh();
    } else {
      setError("Save failed.");
    }
  }

  return (
    <div className="space-y-5">
      <Field label="Title">
        <input value={form.title} onChange={(e) => set("title", e.target.value)} className={inputCls} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Setting">
          <select value={form.setting} onChange={(e) => set("setting", e.target.value)} className={inputCls}>
            {SETTINGS.map((s) => <option key={s} value={s}>{SETTING_LABELS[s]}</option>)}
          </select>
        </Field>
        <Field label="Tier">
          <select value={form.tier} onChange={(e) => set("tier", e.target.value)} className={inputCls}>
            {CONTENT_TIERS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Status">
          <select value={form.status} onChange={(e) => set("status", e.target.value)} className={inputCls}>
            {["DRAFT", "PUBLISHED", "HIDDEN", "ARCHIVED"].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Allowed Type 1">
          <select value={form.allowedType1} onChange={(e) => set("allowedType1", e.target.value)} className={inputCls}>
            {LEAD_TYPES.map((t) => <option key={t} value={t}>{LEAD_TYPE_LABELS[t]}</option>)}
          </select>
        </Field>
      </div>

      <Field label="Allowed Type 2 (optional)">
        <select value={form.allowedType2} onChange={(e) => set("allowedType2", e.target.value)} className={inputCls}>
          <option value="">None</option>
          {LEAD_TYPES.map((t) => <option key={t} value={t}>{LEAD_TYPE_LABELS[t]}</option>)}
        </select>
      </Field>

      <Field label="Emotional Hook">
        <input value={form.emotionalHook} onChange={(e) => set("emotionalHook", e.target.value)} className={inputCls} />
      </Field>

      <Field label="Core Situation">
        <textarea value={form.coreSituation} onChange={(e) => set("coreSituation", e.target.value)} rows={3} className={textareaCls} />
      </Field>

      <Field label="Opening Moment">
        <textarea value={form.openingMoment} onChange={(e) => set("openingMoment", e.target.value)} rows={4} className={textareaCls} />
      </Field>

      <Field label="Tone Tags (JSON array)">
        <input value={form.toneTags} onChange={(e) => set("toneTags", e.target.value)} className={inputCls} placeholder='["romantic","tense"]' />
      </Field>

      <Field label="Cover Image URL">
        <input value={form.coverImage} onChange={(e) => set("coverImage", e.target.value)} className={inputCls} />
      </Field>

      <Field label="Image Prompt">
        <textarea value={form.imagePrompt} onChange={(e) => set("imagePrompt", e.target.value)} rows={2} className={textareaCls} />
      </Field>

      {error && <p className="text-enc-rose text-sm">{error}</p>}

      <div className="flex items-center gap-4 pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-enc-plum hover:bg-enc-plum-light text-enc-cream text-sm font-medium px-5 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
        <button onClick={() => router.back()} className="text-enc-dim hover:text-enc-muted text-sm transition-colors">
          Back
        </button>
        {saved && <span className="text-green-400 text-sm">Saved.</span>}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-enc-dim text-xs uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full bg-enc-surface border border-enc-border text-enc-cream text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-enc-plum transition-colors";
const textareaCls = inputCls + " resize-none";
