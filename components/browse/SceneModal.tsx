"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SceneData } from "./SceneCard";
import { SETTING_LABELS } from "@/lib/constants";

interface Props {
  scene: SceneData & {
    coreSituation?: string;
    emotionalTone?: string;
    atmosphere?: string;
    subLocation?: string;
  };
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export default function SceneModal({ scene, onClose, onPrev, onNext, hasPrev, hasNext }: Props) {
  const router = useRouter();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev && onPrev) onPrev();
      if (e.key === "ArrowRight" && hasNext && onNext) onNext();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  function handleConfirm() {
    router.push(`/browse/${scene.id}/leads`);
  }

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
          {scene.coverImage ? (
            <img src={scene.coverImage} alt={scene.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-enc-plum-dark via-enc-surface to-enc-bg" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-enc-surface to-transparent" />

          {hasPrev && (
            <button
              onClick={onPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-black/50 hover:bg-black/70 text-enc-cream rounded-full transition-colors"
            >‹</button>
          )}
          {hasNext && (
            <button
              onClick={onNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-black/50 hover:bg-black/70 text-enc-cream rounded-full transition-colors"
            >›</button>
          )}

          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center bg-black/50 hover:bg-black/70 text-enc-muted hover:text-enc-cream rounded-full transition-colors text-sm"
          >✕</button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-enc-muted text-xs uppercase tracking-wide">
                {SETTING_LABELS[scene.setting] ?? scene.setting}
              </span>
              {scene.subLocation && (
                <>
                  <span className="text-enc-dim text-xs">·</span>
                  <span className="text-enc-dim text-xs">{scene.subLocation}</span>
                </>
              )}
              {scene.emotionalTone && (
                <span className="text-enc-dim text-[10px] border border-enc-dim/40 px-1.5 py-0.5 rounded">
                  {scene.emotionalTone}
                </span>
              )}
            </div>
            <h2 className="font-serif text-2xl text-enc-cream">{scene.title}</h2>
          </div>

          {(scene.teaserText || scene.emotionalHook) && (
            <p className="text-enc-rose text-sm italic">
              {scene.teaserText || scene.emotionalHook}
            </p>
          )}

          {scene.coreSituation && (
            <p className="text-enc-cream-muted text-sm leading-relaxed">{scene.coreSituation}</p>
          )}

        </div>

        <div className="px-6 pb-6 shrink-0">
          <button
            onClick={handleConfirm}
            className="w-full bg-enc-plum hover:bg-enc-plum-light text-enc-cream font-medium py-3 rounded-lg transition-colors"
          >
            Enter this scene →
          </button>
        </div>
      </div>
    </div>
  );
}
