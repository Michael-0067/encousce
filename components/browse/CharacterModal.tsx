"use client";

import { useEffect } from "react";
import { CharacterData } from "./CharacterCard";
import { LEAD_TYPE_LABELS, SETTING_LABELS } from "@/lib/constants";

interface Props {
  character: CharacterData & {
    corePersonality?: string;
    dialogueTone?: string;
    compatibleSettings?: string[];
    behaviorRules?: string;
  };
  sceneId: string;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  onConfirm: (characterId: string) => void;
}

export default function CharacterModal({
  character,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  onConfirm,
}: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev && onPrev) onPrev();
      if (e.key === "ArrowRight" && hasNext && onNext) onNext();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-enc-surface border border-enc-border rounded-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-56 shrink-0">
          {character.portraitImage ? (
            <img
              src={character.portraitImage}
              alt={character.name}
              className="w-full h-full object-cover object-top"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-enc-plum-dark via-enc-surface to-enc-bg" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-enc-surface to-transparent" />

          {hasPrev && (
            <button
              onClick={onPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-black/50 hover:bg-black/70 text-enc-cream rounded-full transition-colors"
            >
              ‹
            </button>
          )}
          {hasNext && (
            <button
              onClick={onNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-black/50 hover:bg-black/70 text-enc-cream rounded-full transition-colors"
            >
              ›
            </button>
          )}

          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center bg-black/50 hover:bg-black/70 text-enc-muted hover:text-enc-cream rounded-full transition-colors text-sm"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-enc-rose text-xs border border-enc-rose/40 px-2 py-0.5 rounded uppercase tracking-wide">
                {LEAD_TYPE_LABELS[character.primaryType] || character.primaryType}
              </span>
              {character.secondaryType && (
                <span className="text-enc-dim text-xs border border-enc-dim/40 px-2 py-0.5 rounded uppercase tracking-wide">
                  {LEAD_TYPE_LABELS[character.secondaryType] || character.secondaryType}
                </span>
              )}
            </div>
            <h2 className="font-serif text-2xl text-enc-cream">{character.name}</h2>
          </div>

          {character.corePersonality && (
            <p className="text-enc-cream-muted text-sm leading-relaxed">{character.corePersonality}</p>
          )}

          {character.interactionStyle && (
            <p className="text-enc-rose text-sm italic">{character.interactionStyle}</p>
          )}

          {character.compatibleSettings && character.compatibleSettings.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-enc-dim text-xs">Works in:</span>
              {character.compatibleSettings.map((s) => (
                <span key={s} className="text-enc-muted text-xs border border-enc-border px-2 py-0.5 rounded">
                  {SETTING_LABELS[s] || s}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="px-6 pb-6 shrink-0">
          <button
            onClick={() => onConfirm(character.id)}
            className="w-full bg-enc-plum hover:bg-enc-plum-light text-enc-cream font-medium py-3 rounded-lg transition-colors"
          >
            Choose {character.name} →
          </button>
        </div>
      </div>
    </div>
  );
}
