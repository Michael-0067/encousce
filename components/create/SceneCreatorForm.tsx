"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  SETTINGS,
  SETTING_LABELS,
  SUB_LOCATIONS,
  TIME_OF_DAY,
  LIGHTING,
  ATMOSPHERE,
  RELATIONSHIP_DYNAMICS,
  LEAD_INTENTS,
  EMOTIONAL_TONES,
  ENCOUNTER_GOALS,
  SCENE_GENERATION_COST,
} from "@/lib/constants";

interface GeneratedScene {
  id: string;
  title: string;
  coverImage: string | null;
  setting: string;
  subLocation: string;
  teaserText: string | null;
  status: string;
}

export default function SceneCreatorForm({ balance }: { balance: number }) {
  const router = useRouter();
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [generated, setGenerated] = useState<GeneratedScene | null>(null);
  const [publishing, setPublishing] = useState(false);

  const [form, setForm] = useState({
    // Section A
    title: "",
    setting: "",
    subLocation: "",
    timeOfDay: "Evening",
    lighting: "Warm ambient",
    atmosphere: "Intimate",
    environmentDetails: "",
    // Section B
    coreSituation: "",
    relationshipDynamic: "",
    leadIntent: "",
    openingMoment: "",
    emotionalTone: "",
    emotionalHook: "",
    encounterGoal: "",
  });

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSettingChange(value: string) {
    setForm((f) => ({ ...f, setting: value, subLocation: "" }));
  }

  const subLocations = form.setting ? (SUB_LOCATIONS[form.setting] ?? []) : [];

  function isReady() {
    return (
      form.title.trim() &&
      form.setting &&
      form.subLocation &&
      form.timeOfDay &&
      form.lighting &&
      form.atmosphere &&
      form.coreSituation.trim() &&
      form.relationshipDynamic &&
      form.leadIntent &&
      form.openingMoment.trim() &&
      form.emotionalTone &&
      form.emotionalHook.trim() &&
      form.encounterGoal
    );
  }

  const canAfford = balance >= SCENE_GENERATION_COST;

  async function handleGenerate() {
    if (!isReady() || !canAfford) return;
    setError("");
    setGenerating(true);

    const res = await fetch("/api/create/scene", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setGenerating(false);

    if (!res.ok) {
      setError(data.error || "Generation failed. Please try again.");
      return;
    }

    setGenerated(data.scene);
  }

  async function handlePublish() {
    if (!generated) return;
    setPublishing(true);
    await fetch(`/api/create/scene/${generated.id}`, {
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
          {generated.coverImage ? (
            <div className="relative" style={{ aspectRatio: "2/1" }}>
              <img
                src={generated.coverImage}
                alt={generated.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-enc-surface via-transparent to-transparent" />
            </div>
          ) : (
            <div className="h-48 bg-gradient-to-br from-enc-plum-dark via-enc-surface to-enc-bg" />
          )}

          <div className="p-6 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-enc-muted text-xs uppercase tracking-wide">
                {SETTING_LABELS[generated.setting] ?? generated.setting}
              </span>
              <span className="text-enc-dim text-xs">·</span>
              <span className="text-enc-dim text-xs">{generated.subLocation}</span>
            </div>
            <h2 className="font-serif text-2xl text-enc-cream">{generated.title}</h2>
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
            {publishing ? "Publishing…" : "Publish Scene"}
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
          <h2 className="font-serif text-xl text-enc-cream">Where are we?</h2>
          <p className="text-enc-dim text-sm mt-1">Visual environment and setting.</p>
        </div>

        <Field label="Scene Title *">
          <input
            className="enc-input"
            placeholder="e.g. The Rain-Soaked Rooftop"
            value={form.title}
            maxLength={80}
            onChange={(e) => set("title", e.target.value)}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Setting *">
            <select
              className="enc-input"
              value={form.setting}
              onChange={(e) => handleSettingChange(e.target.value)}
            >
              <option value="" disabled>Select…</option>
              {SETTINGS.map((s) => (
                <option key={s} value={s}>{SETTING_LABELS[s]}</option>
              ))}
            </select>
          </Field>

          <Field label="Location *">
            <select
              className="enc-input"
              value={form.subLocation}
              onChange={(e) => set("subLocation", e.target.value)}
              disabled={!form.setting}
            >
              <option value="" disabled>
                {form.setting ? "Select…" : "Choose setting first"}
              </option>
              {subLocations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Field label="Time of Day *">
            <select className="enc-input" value={form.timeOfDay} onChange={(e) => set("timeOfDay", e.target.value)}>
              {TIME_OF_DAY.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Lighting *">
            <select className="enc-input" value={form.lighting} onChange={(e) => set("lighting", e.target.value)}>
              {LIGHTING.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </Field>
          <Field label="Atmosphere *">
            <select className="enc-input" value={form.atmosphere} onChange={(e) => set("atmosphere", e.target.value)}>
              {ATMOSPHERE.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </Field>
        </div>

        <Field label="Environment Details" hint="Optional — what stands out in the space? Max 120 chars">
          <input
            className="enc-input"
            placeholder="e.g. Rain against tall windows. A single lamp on. The city below, indifferent."
            value={form.environmentDetails}
            maxLength={120}
            onChange={(e) => set("environmentDetails", e.target.value)}
          />
          {form.environmentDetails && <CharCount value={form.environmentDetails} max={120} />}
        </Field>
      </section>

      {/* Section B */}
      <section className="space-y-6">
        <div className="border-b border-enc-border pb-3">
          <h2 className="font-serif text-xl text-enc-cream">What&apos;s happening right now?</h2>
          <p className="text-enc-dim text-sm mt-1">Situation, tension, and entry moment.</p>
        </div>

        <Field label="Core Situation *" hint="What just happened or is happening? Max 150 chars">
          <textarea
            className="enc-input min-h-[70px] resize-none"
            placeholder="What just happened or is happening right now?"
            value={form.coreSituation}
            maxLength={150}
            onChange={(e) => set("coreSituation", e.target.value)}
          />
          <CharCount value={form.coreSituation} max={150} />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Relationship Dynamic *">
            <select className="enc-input" value={form.relationshipDynamic} onChange={(e) => set("relationshipDynamic", e.target.value)}>
              <option value="" disabled>Select…</option>
              {RELATIONSHIP_DYNAMICS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </Field>
          <Field label="Lead&apos;s Intent *">
            <select className="enc-input" value={form.leadIntent} onChange={(e) => set("leadIntent", e.target.value)}>
              <option value="" disabled>Select…</option>
              {LEAD_INTENTS.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </Field>
        </div>

        <Field label="Opening Moment *" hint="Present tense. What's happening the exact moment user enters. Max 120 chars">
          <textarea
            className="enc-input min-h-[70px] resize-none"
            placeholder="What is happening the exact moment the user enters?"
            value={form.openingMoment}
            maxLength={120}
            onChange={(e) => set("openingMoment", e.target.value)}
          />
          <CharCount value={form.openingMoment} max={120} />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Emotional Tone *">
            <select className="enc-input" value={form.emotionalTone} onChange={(e) => set("emotionalTone", e.target.value)}>
              <option value="" disabled>Select…</option>
              {EMOTIONAL_TONES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Encounter Goal *">
            <select className="enc-input" value={form.encounterGoal} onChange={(e) => set("encounterGoal", e.target.value)}>
              <option value="" disabled>Select…</option>
              {ENCOUNTER_GOALS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </Field>
        </div>

        <Field label="Emotional Hook *" hint="What is left unsaid? Max 120 chars">
          <input
            className="enc-input"
            placeholder="What is left unsaid?"
            value={form.emotionalHook}
            maxLength={120}
            onChange={(e) => set("emotionalHook", e.target.value)}
          />
          {form.emotionalHook && <CharCount value={form.emotionalHook} max={120} />}
        </Field>

      </section>

      {error && <p className="enc-error">{error}</p>}

      {!canAfford && (
        <p className="text-enc-rose text-sm">
          You need {SCENE_GENERATION_COST} Hearts to generate a scene.{" "}
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
            `Generate Scene · ${SCENE_GENERATION_COST} ♥`
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

function CharCount({ value, max }: { value: string; max: number }) {
  const count = value.length;
  const near = count >= max * 0.85;
  return (
    <p className={`text-xs text-right mt-1 ${near ? "text-enc-rose" : "text-enc-dim"}`}>
      {count}/{max}
    </p>
  );
}
