"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import CharacterCard, { CharacterData } from "./CharacterCard";
import CharacterModal from "./CharacterModal";
import ContentRow from "./ContentRow";

interface TieredCharacters {
  system: CharacterData[];
  featured: CharacterData[];
  community: CharacterData[];
}

interface Props {
  initial: TieredCharacters;
  sceneId: string;
  sceneTitle: string;
}

export default function LeadBrowse({ initial, sceneId, sceneTitle }: Props) {
  const router = useRouter();
  const [characters, setCharacters] = useState<TieredCharacters>(initial);
  const [sort, setSort] = useState("popular");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<CharacterData | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<{ tier: string; index: number } | null>(null);

  const fetchCharacters = useCallback(async (newSort: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/characters?sceneId=${sceneId}&sort=${newSort}`);
      const data = await res.json();
      setCharacters(data);
    } finally {
      setLoading(false);
    }
  }, [sceneId]);

  function handleSortChange(newSort: string) {
    setSort(newSort);
    fetchCharacters(newSort);
  }

  function openModal(character: CharacterData, tier: string, index: number) {
    setSelected(character);
    setSelectedIndex({ tier, index });
  }

  function closeModal() {
    setSelected(null);
    setSelectedIndex(null);
  }

  function navigate(dir: "prev" | "next") {
    if (!selectedIndex) return;
    const tierChars = characters[selectedIndex.tier as keyof TieredCharacters];
    const newIndex = selectedIndex.index + (dir === "prev" ? -1 : 1);
    if (newIndex < 0 || newIndex >= tierChars.length) return;
    setSelected(tierChars[newIndex]);
    setSelectedIndex({ ...selectedIndex, index: newIndex });
  }

  function handleConfirm(characterId: string) {
    router.push(`/encounter/new?sceneId=${sceneId}&characterId=${characterId}`);
  }

  const tiers: Array<{ key: keyof TieredCharacters; label: string }> = [
    { key: "system", label: "SYSTEM" },
    { key: "featured", label: "FEATURED" },
    { key: "community", label: "COMMUNITY" },
  ];

  const total = characters.system.length + characters.featured.length + characters.community.length;

  return (
    <>
      <div className={`transition-opacity ${loading ? "opacity-50" : ""}`}>
        {total === 0 ? (
          <div className="rounded-xl border border-enc-border bg-enc-surface/40 py-16 text-center">
            <p className="text-enc-cream-muted mb-2">No compatible leads found for this scene.</p>
            <p className="text-enc-dim text-sm">Try creating a character that matches this scene&apos;s lead types.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {tiers.map(({ key, label }) => (
              <ContentRow
                key={key}
                tier={label}
                count={characters[key].length}
                sort={sort}
                onSortChange={handleSortChange}
                empty="No leads in this tier yet."
              >
                {characters[key].map((character, i) => (
                  <div
                    key={character.id}
                    className="flex-none"
                    style={{ width: "calc(33.333% - 0.667rem)" }}
                  >
                    <CharacterCard
                      character={character}
                      onClick={(c) => openModal(c, key, i)}
                    />
                  </div>
                ))}
              </ContentRow>
            ))}
          </div>
        )}
      </div>

      {selected && selectedIndex && (
        <CharacterModal
          character={selected}
          sceneId={sceneId}
          onClose={closeModal}
          onPrev={() => navigate("prev")}
          onNext={() => navigate("next")}
          hasPrev={selectedIndex.index > 0}
          hasNext={selectedIndex.index < characters[selectedIndex.tier as keyof TieredCharacters].length - 1}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
}
