"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  SETTINGS, SETTING_LABELS,
  LEAD_TYPES, LEAD_TYPE_LABELS, SECONDARY_TRAITS, CONTENT_TIERS,
  VISUAL_SEX, GENDER_EXPRESSION, RACE_ETHNICITY, APPARENT_AGE,
  BUILD, PRESENCE, HAIR_STYLE, HAIR_COLOR, EYE_COLOR,
  INTERACTION_STYLES, DIALOGUE_TONES, EMOTIONAL_STARTING_STATES,
} from "@/lib/constants";

interface CharacterFields {
  id: string;
  name: string;
  visualSex: string;
  genderExpression: string;
  raceEthnicity: string;
  apparentAge: string;
  build: string;
  presence: string;
  hairStyle: string;
  hairColor: string;
  eyeColor: string;
  distinguishingFeature: string;
  primaryType: string;
  secondaryTrait: string;
  corePersonality: string;
  interactionStyle: string;
  dialogueTone: string;
  emotionalStartingState: string;
  alwaysBehaviors: string;
  neverBehaviors: string;
  generatedPrompt: string;
  imagePrompt: string;
  teaserText: string;
  portraitImage: string;
  setting: string;
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
    if (res.ok) { setSaved(true); router.refresh(); }
    else setError("Save failed.");
  }

  return (
    <div className="space-y-6">
      <Section title="Identity">
        <Field label="Name">
          <input value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls} />
        </Field>
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
      </Section>

      <Section title="Section A — Visual">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Visual Sex">
            <select value={form.visualSex} onChange={(e) => set("visualSex", e.target.value)} className={inputCls}>
              {VISUAL_SEX.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </Field>
          <Field label="Gender Expression">
            <select value={form.genderExpression} onChange={(e) => set("genderExpression", e.target.value)} className={inputCls}>
              {GENDER_EXPRESSION.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </Field>
          <Field label="Race / Ethnicity">
            <select value={form.raceEthnicity} onChange={(e) => set("raceEthnicity", e.target.value)} className={inputCls}>
              <option value="">Unspecified</option>
              {RACE_ETHNICITY.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </Field>
          <Field label="Apparent Age">
            <select value={form.apparentAge} onChange={(e) => set("apparentAge", e.target.value)} className={inputCls}>
              {APPARENT_AGE.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </Field>
          <Field label="Build">
            <select value={form.build} onChange={(e) => set("build", e.target.value)} className={inputCls}>
              {BUILD.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </Field>
          <Field label="Presence">
            <select value={form.presence} onChange={(e) => set("presence", e.target.value)} className={inputCls}>
              {PRESENCE.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </Field>
          <Field label="Hair Style">
            <select value={form.hairStyle} onChange={(e) => set("hairStyle", e.target.value)} className={inputCls}>
              {HAIR_STYLE.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </Field>
          <Field label="Hair Color">
            <select value={form.hairColor} onChange={(e) => set("hairColor", e.target.value)} className={inputCls}>
              {HAIR_COLOR.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </Field>
          <Field label="Eye Color">
            <select value={form.eyeColor} onChange={(e) => set("eyeColor", e.target.value)} className={inputCls}>
              {EYE_COLOR.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Distinguishing Feature">
          <input value={form.distinguishingFeature} onChange={(e) => set("distinguishingFeature", e.target.value)} className={inputCls} maxLength={50} />
        </Field>
      </Section>

      <Section title="Section B — Personality">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Primary Archetype">
            <select value={form.primaryType} onChange={(e) => set("primaryType", e.target.value)} className={inputCls}>
              {LEAD_TYPES.map((t) => <option key={t} value={t}>{LEAD_TYPE_LABELS[t]}</option>)}
            </select>
          </Field>
          <Field label="Secondary Trait">
            <select value={form.secondaryTrait} onChange={(e) => set("secondaryTrait", e.target.value)} className={inputCls}>
              <option value="">None</option>
              {SECONDARY_TRAITS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Interaction Style">
            <select value={form.interactionStyle} onChange={(e) => set("interactionStyle", e.target.value)} className={inputCls}>
              {INTERACTION_STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Dialogue Tone">
            <select value={form.dialogueTone} onChange={(e) => set("dialogueTone", e.target.value)} className={inputCls}>
              {DIALOGUE_TONES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Emotional Starting State">
            <select value={form.emotionalStartingState} onChange={(e) => set("emotionalStartingState", e.target.value)} className={inputCls}>
              {EMOTIONAL_STARTING_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Core Personality">
          <textarea value={form.corePersonality} onChange={(e) => set("corePersonality", e.target.value)} rows={3} className={textareaCls} maxLength={200} />
        </Field>
        <Field label="Always Behaviors (JSON array)">
          <textarea value={form.alwaysBehaviors} onChange={(e) => set("alwaysBehaviors", e.target.value)} rows={2} className={textareaCls} />
        </Field>
        <Field label="Never Behaviors (JSON array)">
          <textarea value={form.neverBehaviors} onChange={(e) => set("neverBehaviors", e.target.value)} rows={2} className={textareaCls} />
        </Field>
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
        <Field label="Portrait Image URL / Data URL">
          <textarea value={form.portraitImage} onChange={(e) => set("portraitImage", e.target.value)} rows={2} className={textareaCls} placeholder="https://... or data:image/png;base64,..." />
        </Field>
        <Field label="Setting">
          <select value={form.setting} onChange={(e) => set("setting", e.target.value)} className={inputCls}>
            {SETTINGS.map((s) => <option key={s} value={s}>{SETTING_LABELS[s]}</option>)}
          </select>
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
