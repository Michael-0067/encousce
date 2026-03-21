"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  VISUAL_SEX,
  GENDER_EXPRESSION,
  RACE_ETHNICITY,
  APPARENT_AGE,
  BUILD,
  PRESENCE,
  HAIR_STYLE,
  HAIR_COLOR,
  EYE_COLOR,
  LEAD_TYPES,
  LEAD_TYPE_LABELS,
  SECONDARY_TRAITS,
  INTERACTION_STYLES,
  DIALOGUE_TONES,
  EMOTIONAL_STARTING_STATES,
  CHARACTER_GENERATION_COST,
} from "@/lib/constants";

interface GeneratedCharacter {
  id: string;
  name: string;
  portraitImage: string | null;
  primaryType: string;
  secondaryTrait: string | null;
  teaserText: string | null;
  status: string;
}

const BEHAVIOR_PLACEHOLDER = [
  "maintains composure",
  "does not over-explain",
  "does not assume things about the user",
  "reads the room before responding",
];

function BehaviorList({
  label,
  hint,
  values,
  onChange,
}: {
  label: string;
  hint: string;
  values: string[];
  onChange: (next: string[]) => void;
}) {
  function update(i: number, val: string) {
    const next = [...values];
    next[i] = val;
    onChange(next);
  }
  function add() {
    if (values.length < 4) onChange([...values, ""]);
  }
  function remove(i: number) {
    if (values.length > 2) onChange(values.filter((_, idx) => idx !== i));
  }

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <label className="enc-label">{label}</label>
        <span className="text-enc-dim text-xs">{hint}</span>
      </div>
      <div className="space-y-2">
        {values.map((v, i) => (
          <div key={i} className="flex gap-2">
            <input
              className="enc-input flex-1 text-sm"
              placeholder={BEHAVIOR_PLACEHOLDER[i] ?? "brief behavior description"}
              value={v}
              maxLength={80}
              onChange={(e) => update(i, e.target.value)}
            />
            {values.length > 2 && (
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-enc-dim hover:text-enc-rose text-sm px-2 transition-colors"
                title="Remove"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
      {values.length < 4 && (
        <button
          type="button"
          onClick={add}
          className="text-enc-dim hover:text-enc-muted text-xs transition-colors"
        >
          + Add another
        </button>
      )}
    </div>
  );
}

export default function CharacterCreatorForm({ balance }: { balance: number }) {
  const router = useRouter();
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [generated, setGenerated] = useState<GeneratedCharacter | null>(null);
  const [publishing, setPublishing] = useState(false);

  const [form, setForm] = useState({
    // Section A
    name: "",
    visualSex: "Unspecified",
    genderExpression: "Unspecified",
    raceEthnicity: "",
    apparentAge: "30s",
    build: "Athletic",
    presence: "Controlled",
    hairStyle: "Short",
    hairColor: "Brown",
    eyeColor: "Brown",
    distinguishingFeature: "",
    // Section B
    primaryType: "",
    secondaryTrait: "",
    corePersonality: "",
    interactionStyle: "",
    dialogueTone: "",
    emotionalStartingState: "",
    alwaysBehaviors: ["", ""],
    neverBehaviors: ["", ""],
  });

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function isReady() {
    const alwaysFilled = form.alwaysBehaviors.filter((b) => b.trim()).length >= 2;
    const neverFilled = form.neverBehaviors.filter((b) => b.trim()).length >= 2;
    return (
      form.name.trim() &&
      form.primaryType &&
      form.corePersonality.trim() &&
      form.interactionStyle &&
      form.dialogueTone &&
      form.emotionalStartingState &&
      alwaysFilled &&
      neverFilled
    );
  }

  const canAfford = balance >= CHARACTER_GENERATION_COST;

  async function handleGenerate() {
    if (!isReady() || !canAfford) return;
    setError("");
    setGenerating(true);

    const res = await fetch("/api/create/character", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        alwaysBehaviors: form.alwaysBehaviors.filter((b) => b.trim()),
        neverBehaviors: form.neverBehaviors.filter((b) => b.trim()),
      }),
    });

    const data = await res.json();
    setGenerating(false);

    if (!res.ok) {
      setError(data.error || "Generation failed. Please try again.");
      return;
    }

    setGenerated(data.character);
  }

  async function handlePublish() {
    if (!generated) return;
    setPublishing(true);
    await fetch(`/api/create/character/${generated.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "PUBLISHED" }),
    });
    router.push("/browse");
  }

  // ── Preview screen ────────────────────────────────────────────────────────
  if (generated) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="rounded-2xl overflow-hidden border border-enc-border bg-enc-surface">
          {generated.portraitImage ? (
            <div className="relative h-80">
              <img
                src={generated.portraitImage}
                alt={generated.name}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-enc-surface via-transparent to-transparent" />
            </div>
          ) : (
            <div className="h-80 bg-gradient-to-br from-enc-plum-dark via-enc-surface to-enc-bg" />
          )}

          <div className="p-6 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-enc-rose text-xs border border-enc-rose/40 px-2 py-0.5 rounded uppercase tracking-wide">
                {LEAD_TYPE_LABELS[generated.primaryType] ?? generated.primaryType}
              </span>
              {generated.secondaryTrait && (
                <span className="text-enc-dim text-xs border border-enc-dim/40 px-2 py-0.5 rounded uppercase tracking-wide">
                  {generated.secondaryTrait}
                </span>
              )}
            </div>

            <h2 className="font-serif text-2xl text-enc-cream">{generated.name}</h2>

            {generated.teaserText && (
              <p className="text-enc-cream-muted text-sm leading-relaxed italic">
                {generated.teaserText}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <button
            onClick={handlePublish}
            disabled={publishing}
            className="w-full bg-enc-plum hover:bg-enc-plum-light text-enc-cream font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {publishing ? "Publishing…" : "Publish Character"}
          </button>
          <button
            onClick={() => router.push("/browse")}
            className="w-full border border-enc-border hover:border-enc-plum text-enc-muted hover:text-enc-cream py-3 rounded-lg transition-colors text-sm"
          >
            Save as Draft — finish later
          </button>
        </div>
      </div>
    );
  }

  // ── Creator form ──────────────────────────────────────────────────────────
  return (
    <form onSubmit={(e) => { e.preventDefault(); handleGenerate(); }} className="space-y-12">

      {/* Section A */}
      <section className="space-y-6">
        <div className="border-b border-enc-border pb-3">
          <h2 className="font-serif text-xl text-enc-cream">Who are they?</h2>
          <p className="text-enc-dim text-sm mt-1">Visual identity and first impression.</p>
        </div>

        <Field label="Name *">
          <input
            className="enc-input"
            placeholder="e.g. Elara, Marcus, The Stranger"
            value={form.name}
            maxLength={50}
            onChange={(e) => set("name", e.target.value)}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Visual Sex">
            <Select value={form.visualSex} onChange={(v) => set("visualSex", v)}>
              {VISUAL_SEX.map((v) => <option key={v} value={v}>{v}</option>)}
            </Select>
          </Field>
          <Field label="Gender Expression">
            <Select value={form.genderExpression} onChange={(v) => set("genderExpression", v)}>
              {GENDER_EXPRESSION.map((v) => <option key={v} value={v}>{v}</option>)}
            </Select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Race / Ethnicity">
            <Select value={form.raceEthnicity} onChange={(v) => set("raceEthnicity", v)}>
              <option value="">Unspecified</option>
              {RACE_ETHNICITY.map((v) => <option key={v} value={v}>{v}</option>)}
            </Select>
          </Field>
          <Field label="Apparent Age">
            <Select value={form.apparentAge} onChange={(v) => set("apparentAge", v)}>
              {APPARENT_AGE.map((v) => <option key={v} value={v}>{v}</option>)}
            </Select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Build">
            <Select value={form.build} onChange={(v) => set("build", v)}>
              {BUILD.map((v) => <option key={v} value={v}>{v}</option>)}
            </Select>
          </Field>
          <Field label="Presence">
            <Select value={form.presence} onChange={(v) => set("presence", v)}>
              {PRESENCE.map((v) => <option key={v} value={v}>{v}</option>)}
            </Select>
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Field label="Hair Style">
            <Select value={form.hairStyle} onChange={(v) => set("hairStyle", v)}>
              {HAIR_STYLE.map((v) => <option key={v} value={v}>{v}</option>)}
            </Select>
          </Field>
          <Field label="Hair Color">
            <Select value={form.hairColor} onChange={(v) => set("hairColor", v)}>
              {HAIR_COLOR.map((v) => <option key={v} value={v}>{v}</option>)}
            </Select>
          </Field>
          <Field label="Eye Color">
            <Select value={form.eyeColor} onChange={(v) => set("eyeColor", v)}>
              {EYE_COLOR.map((v) => <option key={v} value={v}>{v}</option>)}
            </Select>
          </Field>
        </div>

        <Field label="Distinguishing Feature" hint="Optional — one detail, max 50 chars">
          <input
            className="enc-input"
            placeholder="e.g. a scar along the jaw, ink-dark eyes"
            value={form.distinguishingFeature}
            maxLength={50}
            onChange={(e) => set("distinguishingFeature", e.target.value)}
          />
          {form.distinguishingFeature && (
            <CharCount value={form.distinguishingFeature} max={50} />
          )}
        </Field>
      </section>

      {/* Section B */}
      <section className="space-y-6">
        <div className="border-b border-enc-border pb-3">
          <h2 className="font-serif text-xl text-enc-cream">How do they feel in a moment?</h2>
          <p className="text-enc-dim text-sm mt-1">Personality, behavior, and interaction style.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Primary Archetype *">
            <Select
              value={form.primaryType}
              onChange={(v) => set("primaryType", v)}
              placeholder="Select…"
            >
              <option value="" disabled>Select…</option>
              {LEAD_TYPES.map((t) => (
                <option key={t} value={t}>{LEAD_TYPE_LABELS[t]}</option>
              ))}
            </Select>
          </Field>
          <Field label="Secondary Trait" hint="Optional">
            <Select value={form.secondaryTrait} onChange={(v) => set("secondaryTrait", v)}>
              <option value="">None</option>
              {SECONDARY_TRAITS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </Select>
          </Field>
        </div>

        <Field label="Core Personality *" hint="What kind of presence do they have?">
          <textarea
            className="enc-input min-h-[80px] resize-none"
            placeholder="What kind of presence do they have? How do they affect the room?"
            value={form.corePersonality}
            maxLength={200}
            onChange={(e) => set("corePersonality", e.target.value)}
          />
          <CharCount value={form.corePersonality} max={200} />
        </Field>

        <Field label="Interaction Style *" hint="How they engage with the user">
          <Select
            value={form.interactionStyle}
            onChange={(v) => set("interactionStyle", v)}
          >
            <option value="" disabled>Select…</option>
            {INTERACTION_STYLES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
        </Field>

        <Field label="Dialogue Tone *" hint="How they sound">
          <Select value={form.dialogueTone} onChange={(v) => set("dialogueTone", v)}>
            <option value="" disabled>Select…</option>
            {DIALOGUE_TONES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Select>
        </Field>

        <Field label="Emotional Starting State *" hint="Where they are at the opening moment">
          <Select
            value={form.emotionalStartingState}
            onChange={(v) => set("emotionalStartingState", v)}
          >
            <option value="" disabled>Select…</option>
            {EMOTIONAL_STARTING_STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
        </Field>

        <BehaviorList
          label="Always *"
          hint="2 – 4 entries required"
          values={form.alwaysBehaviors}
          onChange={(v) => setForm((f) => ({ ...f, alwaysBehaviors: v }))}
        />

        <BehaviorList
          label="Never *"
          hint="2 – 4 entries required"
          values={form.neverBehaviors}
          onChange={(v) => setForm((f) => ({ ...f, neverBehaviors: v }))}
        />
      </section>

      {error && <p className="enc-error">{error}</p>}

      {!canAfford && (
        <p className="text-enc-rose text-sm">
          You need {CHARACTER_GENERATION_COST} Hearts to generate a character.{" "}
          <a href="/account/hearts" className="underline hover:text-enc-cream transition-colors">
            Buy Hearts
          </a>
        </p>
      )}

      <div className="pb-8">
        <button
          type="submit"
          disabled={!isReady() || !canAfford || generating}
          className="w-full bg-enc-plum hover:bg-enc-plum-light text-enc-cream font-medium py-4 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-base"
        >
          {generating ? (
            <span className="flex items-center justify-center gap-3">
              <span className="inline-block w-4 h-4 border-2 border-enc-cream/30 border-t-enc-cream rounded-full animate-spin" />
              Generating…
            </span>
          ) : (
            `Generate Character · ${CHARACTER_GENERATION_COST} ♥`
          )}
        </button>
        {!isReady() && (
          <p className="text-center text-enc-dim text-xs mt-3">
            Complete all required fields to unlock generation.
          </p>
        )}
      </div>
    </form>
  );
}

// ── Small helpers ─────────────────────────────────────────────────────────────

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <label className="enc-label">{label}</label>
        {hint && <span className="text-enc-dim text-xs">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function Select({
  value,
  onChange,
  placeholder,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  children: React.ReactNode;
}) {
  return (
    <select
      className="enc-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {placeholder && <option value="" disabled>{placeholder}</option>}
      {children}
    </select>
  );
}

function CharCount({ value, max }: { value: string; max: number }) {
  const count = value.length;
  const near = count >= max * 0.85;
  return (
    <p className={`text-xs text-right mt-1 ${near ? "text-enc-rose" : "text-enc-dim"}`}>
      {count}/{max}
    </p>
  );
}
