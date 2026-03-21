"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  SETTINGS, SETTING_LABELS, LEAD_TYPES, LEAD_TYPE_LABELS, CONTENT_TIERS,
  SUB_LOCATIONS, TIME_OF_DAY, LIGHTING, ATMOSPHERE,
  RELATIONSHIP_DYNAMICS, LEAD_INTENTS, EMOTIONAL_TONES, ENCOUNTER_GOALS,
} from "@/lib/constants";

interface SceneFields {
  id: string;
  title: string;
  setting: string;
  subLocation: string;
  timeOfDay: string;
  lighting: string;
  atmosphere: string;
  environmentDetails: string;
  coreSituation: string;
  relationshipDynamic: string;
  leadIntent: string;
  openingMoment: string;
  emotionalTone: string;
  emotionalHook: string;
  encounterGoal: string;
  allowedType1: string;
  allowedType2: string;
  generatedPrompt: string;
  imagePrompt: string;
  teaserText: string;
  coverImage: string;
  toneTags: string;
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

  const subLocations = form.setting ? (SUB_LOCATIONS[form.setting] ?? []) : [];

  async function handleSave() {
    setSaving(true);
    setError("");
    const res = await fetch(`/api/admin/scenes/${scene.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) { setSaved(true); router.refresh(); }
    else setError("Save failed.");
  }

  return (
    <div className="space-y-6">
      <Section title="Identity">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Tier">
            <select value={form.tier} onChange={(e) => set("tier", e.target.value)} className={inputCls}>
              {CONTENT_TIERS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Status">
            <select value={form.status} onChange={(e) => set("status", e.target.value)} className={inputCls}>
              {["DRAFT", "PUBLISHED", "HIDDEN", "ARCHIVED"].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Title">
          <input value={form.title} onChange={(e) => set("title", e.target.value)} className={inputCls} />
        </Field>
      </Section>

      <Section title="Section A — Environment">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Setting">
            <select value={form.setting} onChange={(e) => set("setting", e.target.value)} className={inputCls}>
              {SETTINGS.map((s) => <option key={s} value={s}>{SETTING_LABELS[s]}</option>)}
            </select>
          </Field>
          <Field label="Sub-Location">
            <select value={form.subLocation} onChange={(e) => set("subLocation", e.target.value)} className={inputCls}>
              <option value="">Custom / None</option>
              {subLocations.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
            </select>
          </Field>
          <Field label="Time of Day">
            <select value={form.timeOfDay} onChange={(e) => set("timeOfDay", e.target.value)} className={inputCls}>
              {TIME_OF_DAY.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Lighting">
            <select value={form.lighting} onChange={(e) => set("lighting", e.target.value)} className={inputCls}>
              {LIGHTING.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </Field>
          <Field label="Atmosphere">
            <select value={form.atmosphere} onChange={(e) => set("atmosphere", e.target.value)} className={inputCls}>
              {ATMOSPHERE.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Environment Details">
          <input value={form.environmentDetails} onChange={(e) => set("environmentDetails", e.target.value)} className={inputCls} maxLength={120} />
        </Field>
      </Section>

      <Section title="Section B — Situation">
        <Field label="Core Situation">
          <textarea value={form.coreSituation} onChange={(e) => set("coreSituation", e.target.value)} rows={2} className={textareaCls} maxLength={150} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Relationship Dynamic">
            <select value={form.relationshipDynamic} onChange={(e) => set("relationshipDynamic", e.target.value)} className={inputCls}>
              {RELATIONSHIP_DYNAMICS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </Field>
          <Field label="Lead Intent">
            <select value={form.leadIntent} onChange={(e) => set("leadIntent", e.target.value)} className={inputCls}>
              {LEAD_INTENTS.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </Field>
          <Field label="Emotional Tone">
            <select value={form.emotionalTone} onChange={(e) => set("emotionalTone", e.target.value)} className={inputCls}>
              {EMOTIONAL_TONES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Encounter Goal">
            <select value={form.encounterGoal} onChange={(e) => set("encounterGoal", e.target.value)} className={inputCls}>
              {ENCOUNTER_GOALS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Opening Moment">
          <textarea value={form.openingMoment} onChange={(e) => set("openingMoment", e.target.value)} rows={3} className={textareaCls} maxLength={120} />
        </Field>
        <Field label="Emotional Hook">
          <input value={form.emotionalHook} onChange={(e) => set("emotionalHook", e.target.value)} className={inputCls} maxLength={120} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Allowed Lead Type 1">
            <select value={form.allowedType1} onChange={(e) => set("allowedType1", e.target.value)} className={inputCls}>
              {LEAD_TYPES.map((t) => <option key={t} value={t}>{LEAD_TYPE_LABELS[t]}</option>)}
            </select>
          </Field>
          <Field label="Allowed Lead Type 2">
            <select value={form.allowedType2} onChange={(e) => set("allowedType2", e.target.value)} className={inputCls}>
              <option value="">None</option>
              {LEAD_TYPES.map((t) => <option key={t} value={t}>{LEAD_TYPE_LABELS[t]}</option>)}
            </select>
          </Field>
        </div>
      </Section>

      <Section title="Generated Content">
        <Field label="Generated Prompt">
          <textarea value={form.generatedPrompt} onChange={(e) => set("generatedPrompt", e.target.value)} rows={6} className={textareaCls} />
        </Field>
        <Field label="Teaser Text">
          <input value={form.teaserText} onChange={(e) => set("teaserText", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Image Prompt">
          <textarea value={form.imagePrompt} onChange={(e) => set("imagePrompt", e.target.value)} rows={3} className={textareaCls} />
        </Field>
        <Field label="Cover Image URL / Data URL">
          <textarea value={form.coverImage} onChange={(e) => set("coverImage", e.target.value)} rows={2} className={textareaCls} placeholder="https://... or data:image/png;base64,..." />
        </Field>
        <Field label="Tone Tags (JSON array, admin-only)">
          <input value={form.toneTags} onChange={(e) => set("toneTags", e.target.value)} className={inputCls} placeholder='["romantic","tense"]' />
        </Field>
      </Section>

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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4 border border-enc-border rounded-xl p-5">
      <h3 className="text-enc-dim text-xs uppercase tracking-wide border-b border-enc-border pb-2">{title}</h3>
      {children}
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
