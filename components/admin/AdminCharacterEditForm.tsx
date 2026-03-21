"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LEAD_TYPES, CONTENT_TIERS, LEAD_TYPE_LABELS, SETTINGS, SETTING_LABELS } from "@/lib/constants";

interface CharacterFields {
  id: string;
  name: string;
  primaryType: string;
  secondaryType: string;
  compatibleSettings: string;
  corePersonality: string;
  interactionStyle: string;
  dialogueTone: string;
  behaviorRules: string;
  portraitImage: string;
  imagePrompt: string;
  status: string;
  tier: string;
}

export default function AdminCharacterEditForm({ character }: { character: CharacterFields }) {
  const router = useRouter();
  const [form, setForm] = useState(character);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  function set(field: keyof CharacterFields, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    const res = await fetch(`/api/admin/characters/${character.id}`, {
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
      <Field label="Name">
        <input value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Primary Type">
          <select value={form.primaryType} onChange={(e) => set("primaryType", e.target.value)} className={inputCls}>
            {LEAD_TYPES.map((t) => <option key={t} value={t}>{LEAD_TYPE_LABELS[t]}</option>)}
          </select>
        </Field>
        <Field label="Secondary Type (optional)">
          <select value={form.secondaryType} onChange={(e) => set("secondaryType", e.target.value)} className={inputCls}>
            <option value="">None</option>
            {LEAD_TYPES.map((t) => <option key={t} value={t}>{LEAD_TYPE_LABELS[t]}</option>)}
          </select>
        </Field>
      </div>

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

      <Field label="Compatible Settings (JSON array)">
        <div className="flex gap-2 flex-wrap">
          {SETTINGS.map((s) => {
            let arr: string[] = [];
            try { arr = JSON.parse(form.compatibleSettings); } catch {}
            const checked = arr.includes(s);
            return (
              <label key={s} className="flex items-center gap-1.5 text-sm text-enc-muted cursor-pointer">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    const next = checked ? arr.filter((x) => x !== s) : [...arr, s];
                    set("compatibleSettings", JSON.stringify(next));
                  }}
                  className="accent-enc-plum"
                />
                {SETTING_LABELS[s]}
              </label>
            );
          })}
        </div>
      </Field>

      <Field label="Core Personality">
        <textarea value={form.corePersonality} onChange={(e) => set("corePersonality", e.target.value)} rows={3} className={textareaCls} />
      </Field>

      <Field label="Interaction Style">
        <textarea value={form.interactionStyle} onChange={(e) => set("interactionStyle", e.target.value)} rows={2} className={textareaCls} />
      </Field>

      <Field label="Dialogue Tone">
        <textarea value={form.dialogueTone} onChange={(e) => set("dialogueTone", e.target.value)} rows={2} className={textareaCls} />
      </Field>

      <Field label="Behavior Rules">
        <textarea value={form.behaviorRules} onChange={(e) => set("behaviorRules", e.target.value)} rows={3} className={textareaCls} />
      </Field>

      <Field label="Portrait Image URL">
        <input value={form.portraitImage} onChange={(e) => set("portraitImage", e.target.value)} className={inputCls} />
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
