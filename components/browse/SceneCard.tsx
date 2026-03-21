"use client";

import { SETTING_LABELS } from "@/lib/constants";

const SETTING_GRADIENTS: Record<string, string> = {
  MODERN:     "from-enc-bg via-enc-plum-dark to-enc-surface",
  FANTASY:    "from-[#0a0a1a] via-[#1a0a2e] to-[#0f0a1f]",
  HISTORICAL: "from-[#1a1208] via-[#2a1e0a] to-[#1a1208]",
};

export interface SceneData {
  id: string;
  title: string;
  coverImage: string | null;
  setting: string;
  subLocation?: string;
  emotionalHook: string;
  teaserText?: string | null;
  tier: string;
  clickCount: number;
}

interface Props {
  scene: SceneData;
  onClick: (scene: SceneData) => void;
  isFavorited?: boolean;
  onToggleFavorite?: (scene: SceneData) => void;
}

export default function SceneCard({ scene, onClick, isFavorited, onToggleFavorite }: Props) {
  const gradient = SETTING_GRADIENTS[scene.setting] ?? SETTING_GRADIENTS.MODERN;
  const displayTeaser = scene.teaserText || scene.emotionalHook;

  return (
    <button
      onClick={() => onClick(scene)}
      className="group relative w-full rounded-xl overflow-hidden cursor-pointer border border-enc-border hover:border-enc-plum transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-enc-plum/10 text-left"
      style={{ aspectRatio: "2/3" }}
    >
      {scene.coverImage ? (
        <img
          src={scene.coverImage}
          alt={scene.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      {onToggleFavorite && (
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(scene); }}
          className={`absolute top-2 right-2 z-10 w-7 h-7 flex items-center justify-center rounded-full transition-all
            ${isFavorited
              ? "bg-enc-rose/20 text-enc-rose opacity-100"
              : "bg-black/40 text-enc-dim opacity-0 group-hover:opacity-100 hover:text-enc-rose"
            }`}
          title={isFavorited ? "Remove from favorites" : "Add to favorites"}
        >
          <span className="text-sm leading-none">{isFavorited ? "★" : "☆"}</span>
        </button>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-3 space-y-1">
        <div className="flex items-center gap-1">
          <span className="text-enc-cream-muted text-[9px] uppercase tracking-wide">
            {SETTING_LABELS[scene.setting] ?? scene.setting}
          </span>
          {scene.subLocation && (
            <>
              <span className="text-enc-cream-muted text-[9px]">·</span>
              <span className="text-enc-cream-muted text-[9px]">{scene.subLocation}</span>
            </>
          )}
        </div>
        <h3 className="font-serif text-sm text-enc-cream leading-snug line-clamp-2">
          {scene.title}
        </h3>
        {displayTeaser && (
          <p className="text-enc-cream-muted text-[10px] leading-relaxed line-clamp-2 italic">
            {displayTeaser}
          </p>
        )}
      </div>
    </button>
  );
}
