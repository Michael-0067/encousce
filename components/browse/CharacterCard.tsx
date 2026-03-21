"use client";

import { LEAD_TYPE_LABELS } from "@/lib/constants";

const TYPE_GRADIENTS: Record<string, string> = {
  DOMINANT:   "from-[#1a0a0a] via-[#2a0f0f] to-enc-plum-dark",
  PROTECTIVE: "from-[#0a1a0a] via-[#0f2a0f] to-enc-surface",
  MYSTERIOUS: "from-[#0a0a1a] via-enc-plum-dark to-[#0a0a0f]",
  CHARMING:   "from-[#1a0a12] via-[#2a0f1f] to-enc-plum-dark",
  PLAYFUL:    "from-enc-plum-dark via-[#2a1a2a] to-enc-surface",
  STOIC:      "from-[#0f0f0f] via-[#1a1a1a] to-enc-surface",
  DANGEROUS:  "from-[#1a0505] via-[#2a0808] to-enc-plum-dark",
  GENTLE:     "from-[#0a1015] via-[#0f1820] to-enc-surface",
  CONFIDENT:  "from-[#100a1a] via-[#1a0f2a] to-enc-surface",
  GUARDED:    "from-[#0a0a10] via-[#12121a] to-enc-surface",
};

export interface CharacterData {
  id: string;
  name: string;
  portraitImage: string | null;
  primaryType: string;
  secondaryTrait?: string | null;
  teaserText?: string | null;
  tier: string;
}

interface Props {
  character: CharacterData;
  onClick: (character: CharacterData) => void;
  isFavorited?: boolean;
  onToggleFavorite?: (character: CharacterData) => void;
}

export default function CharacterCard({ character, onClick, isFavorited, onToggleFavorite }: Props) {
  const gradient = TYPE_GRADIENTS[character.primaryType] ?? TYPE_GRADIENTS.MYSTERIOUS;

  return (
    <button
      onClick={() => onClick(character)}
      className="group relative w-full rounded-xl overflow-hidden cursor-pointer border border-enc-border hover:border-enc-rose transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-enc-rose/10 text-left"
      style={{ aspectRatio: "3/4" }}
    >
      {character.portraitImage ? (
        <img
          src={character.portraitImage}
          alt={character.name}
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

      {onToggleFavorite && (
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(character); }}
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

      <div className="absolute bottom-0 left-0 right-0 p-4 space-y-1">
        <span className="text-enc-rose text-[10px] border border-enc-rose/40 px-1.5 py-0.5 rounded uppercase tracking-wide">
          {LEAD_TYPE_LABELS[character.primaryType] ?? character.primaryType}
        </span>
        <h3 className="font-serif text-lg text-enc-cream leading-snug">
          {character.name}
        </h3>
        {character.teaserText && (
          <p className="text-enc-cream-muted text-xs line-clamp-2 leading-relaxed italic">
            {character.teaserText}
          </p>
        )}
      </div>
    </button>
  );
}
