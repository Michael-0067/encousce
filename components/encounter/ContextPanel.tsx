"use client";

import { LEAD_TYPE_LABELS, SETTING_LABELS } from "@/lib/constants";

interface Props {
  scene: {
    title: string;
    coverImage: string | null;
    emotionalHook: string;
    setting: string;
  };
  character: {
    name: string;
    portraitImage: string | null;
    primaryType: string;
    interactionStyle: string;
  };
  isAdmin: boolean;
  onReset: () => void;
  onDelete: () => void;
}

export default function ContextPanel({ scene, character, isAdmin, onReset, onDelete }: Props) {
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Scene */}
      <div className="shrink-0">
        <div className="relative h-40">
          {scene.coverImage ? (
            <img src={scene.coverImage} alt={scene.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-enc-plum-dark via-enc-surface to-enc-bg" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-enc-surface to-transparent" />
        </div>
        <div className="px-4 pt-3 pb-4 border-b border-enc-border">
          <p className="text-enc-dim text-[10px] uppercase tracking-wide mb-1">
            {SETTING_LABELS[scene.setting] || scene.setting}
          </p>
          <h3 className="font-serif text-base text-enc-cream leading-snug">{scene.title}</h3>
          <p className="text-enc-rose text-xs italic mt-1 leading-relaxed line-clamp-2">
            {scene.emotionalHook}
          </p>
        </div>
      </div>

      {/* Character */}
      <div className="px-4 py-4 border-b border-enc-border shrink-0">
        <div className="flex items-start gap-3">
          <div className="relative w-12 h-16 rounded-lg overflow-hidden shrink-0 border border-enc-border">
            {character.portraitImage ? (
              <img src={character.portraitImage} alt={character.name} className="w-full h-full object-cover object-top" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-enc-plum-dark to-enc-surface" />
            )}
          </div>
          <div className="min-w-0">
            <span className="text-enc-rose text-[10px] border border-enc-rose/40 px-1.5 py-0.5 rounded uppercase tracking-wide">
              {LEAD_TYPE_LABELS[character.primaryType] || character.primaryType}
            </span>
            <h3 className="font-serif text-base text-enc-cream mt-1">{character.name}</h3>
            <p className="text-enc-muted text-xs leading-relaxed mt-0.5 line-clamp-2">
              {character.interactionStyle}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-4 space-y-2 mt-auto">
        <button
          onClick={onReset}
          className="w-full text-enc-muted hover:text-enc-rose border border-enc-border hover:border-enc-rose/50 text-xs py-2 rounded-lg transition-colors"
        >
          Reset encounter
        </button>
        <button
          onClick={onDelete}
          className="w-full text-enc-dim hover:text-enc-rose/70 border border-enc-border/50 hover:border-enc-rose/30 text-xs py-2 rounded-lg transition-colors"
        >
          Delete encounter
        </button>
        {isAdmin && (
          <p className="text-enc-dim text-[10px] text-center">Admin — hearts bypassed</p>
        )}
      </div>
    </div>
  );
}
