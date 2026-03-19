"use client";

import { LEAD_TYPE_LABELS } from "@/lib/constants";

const TYPE_GRADIENTS: Record<string, string> = {
  DOMINANT: "from-[#1a0a0a] via-[#2a0f0f] to-enc-plum-dark",
  MYSTERIOUS: "from-[#0a0a1a] via-enc-plum-dark to-[#0a0a0f]",
  PROTECTIVE: "from-[#0a1a0a] via-[#0f2a0f] to-enc-surface",
  PLAYFUL: "from-enc-plum-dark via-[#2a1a2a] to-enc-surface",
  SHY: "from-[#1a0f1a] via-enc-surface to-[#1a1a2a]",
  AUTHORITATIVE: "from-[#1a1008] via-[#2a1a08] to-enc-surface",
};

export interface CharacterData {
  id: string;
  name: string;
  portraitImage: string | null;
  primaryType: string;
  secondaryType: string | null;
  corePersonality: string;
  interactionStyle: string;
  tier: string;
}

interface Props {
  character: CharacterData;
  onClick: (character: CharacterData) => void;
}

export default function CharacterCard({ character, onClick }: Props) {
  const gradient = TYPE_GRADIENTS[character.primaryType] || TYPE_GRADIENTS.MYSTERIOUS;

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

      <div className="absolute bottom-0 left-0 right-0 p-4 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-enc-rose text-[10px] border border-enc-rose/40 px-1.5 py-0.5 rounded uppercase tracking-wide">
            {LEAD_TYPE_LABELS[character.primaryType] || character.primaryType}
          </span>
        </div>
        <h3 className="font-serif text-lg text-enc-cream leading-snug">
          {character.name}
        </h3>
        <p className="text-enc-cream-muted text-xs line-clamp-2 leading-relaxed">
          {character.interactionStyle}
        </p>
      </div>
    </button>
  );
}
