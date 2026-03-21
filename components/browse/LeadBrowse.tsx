"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import CharacterCard, { CharacterData } from "./CharacterCard";
import CharacterModal from "./CharacterModal";
import ContentRow from "./ContentRow";

interface AllCharacters {
  yours:     CharacterData[] | null;  // null = not logged in
  favorites: CharacterData[] | null;  // null = not logged in
  system:    CharacterData[];
  featured:  CharacterData[];
  community: CharacterData[];
}

interface Props {
  initial: AllCharacters;
  sceneId: string;
  sceneTitle: string;
}

type TierKey = "yours" | "favorites" | "system" | "featured" | "community";

export default function LeadBrowse({ initial, sceneId, sceneTitle }: Props) {
  const router = useRouter();

  const [tiered, setTiered] = useState({
    system:    initial.system,
    featured:  initial.featured,
    community: initial.community,
  });
  const [favoriteCharacters, setFavoriteCharacters] = useState<CharacterData[]>(
    initial.favorites ?? []
  );
  const [sort, setSort]       = useState("popular");
  const [loading, setLoading] = useState(false);

  const [selected, setSelected]         = useState<CharacterData | null>(null);
  const [selectedTier, setSelectedTier] = useState<TierKey | null>(null);
  const [selectedIdx, setSelectedIdx]   = useState<number | null>(null);

  const isLoggedIn = initial.favorites !== null;
  const favoriteIds = new Set(favoriteCharacters.map((c) => c.id));

  const fetchCharacters = useCallback(async (newSort: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/characters?sceneId=${sceneId}&sort=${newSort}`);
      const data = await res.json();
      setTiered(data);
    } finally {
      setLoading(false);
    }
  }, [sceneId]);

  function handleSortChange(newSort: string) {
    setSort(newSort);
    fetchCharacters(newSort);
  }

  async function handleToggleFavorite(character: CharacterData) {
    const wasFavorited = favoriteIds.has(character.id);
    setFavoriteCharacters((prev) =>
      wasFavorited ? prev.filter((c) => c.id !== character.id) : [character, ...prev]
    );
    try {
      const res = await fetch(`/api/favorites/character/${character.id}`, { method: "POST" });
      if (!res.ok) throw new Error();
    } catch {
      setFavoriteCharacters((prev) =>
        wasFavorited ? [character, ...prev] : prev.filter((c) => c.id !== character.id)
      );
    }
  }

  function getCharsForTier(key: TierKey): CharacterData[] {
    if (key === "yours")     return initial.yours ?? [];
    if (key === "favorites") return favoriteCharacters;
    return tiered[key];
  }

  function openModal(character: CharacterData, tier: TierKey, index: number) {
    setSelected(character);
    setSelectedTier(tier);
    setSelectedIdx(index);
  }

  function closeModal() {
    setSelected(null);
    setSelectedTier(null);
    setSelectedIdx(null);
  }

  function navigate(dir: "prev" | "next") {
    if (!selectedTier || selectedIdx === null) return;
    const arr = getCharsForTier(selectedTier);
    const newIdx = selectedIdx + (dir === "prev" ? -1 : 1);
    if (newIdx < 0 || newIdx >= arr.length) return;
    setSelected(arr[newIdx]);
    setSelectedIdx(newIdx);
  }

  function handleConfirm(characterId: string) {
    router.push(`/encounter/new?sceneId=${sceneId}&characterId=${characterId}`);
  }

  // Personal rows: only shown when logged in and non-empty
  const personalRows: Array<{ key: TierKey; label: string }> = [];
  if (isLoggedIn) {
    if (getCharsForTier("yours").length > 0)
      personalRows.push({ key: "yours", label: "Your Characters" });
    if (getCharsForTier("favorites").length > 0)
      personalRows.push({ key: "favorites", label: "Favorites" });
  }

  const mainRows: Array<{ key: TierKey; label: string }> = [
    { key: "system",    label: "SYSTEM" },
    { key: "featured",  label: "FEATURED" },
    { key: "community", label: "COMMUNITY" },
  ];

  const allRows = [...personalRows, ...mainRows];
  const total = initial.system.length + initial.featured.length + initial.community.length;

  return (
    <>
      <div className={`transition-opacity ${loading ? "opacity-50" : ""}`}>
        {total === 0 && personalRows.length === 0 ? (
          <div className="rounded-xl border border-enc-border bg-enc-surface/40 py-16 text-center">
            <p className="text-enc-cream-muted mb-2">No compatible leads found for this scene.</p>
            <p className="text-enc-dim text-sm">Try creating a character that matches this scene&apos;s lead types.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {allRows.map(({ key, label }) => {
              const data = getCharsForTier(key);
              const isPersonal = key === "yours" || key === "favorites";
              return (
                <ContentRow
                  key={key}
                  tier={label}
                  count={data.length}
                  sort={sort}
                  onSortChange={handleSortChange}
                  hideSort={isPersonal}
                  empty={key === "yours" ? "No characters yet." : "No favorites yet."}
                >
                  {data.map((character, i) => (
                    <div
                      key={character.id}
                      className="flex-none"
                      style={{ width: "160px" }}
                    >
                      <CharacterCard
                        character={character}
                        onClick={(c) => openModal(c, key, i)}
                        isFavorited={favoriteIds.has(character.id)}
                        onToggleFavorite={isLoggedIn ? handleToggleFavorite : undefined}
                      />
                    </div>
                  ))}
                </ContentRow>
              );
            })}
          </div>
        )}
      </div>

      {selected && selectedTier && selectedIdx !== null && (
        <CharacterModal
          character={selected}
          sceneId={sceneId}
          onClose={closeModal}
          onPrev={() => navigate("prev")}
          onNext={() => navigate("next")}
          hasPrev={selectedIdx > 0}
          hasNext={selectedIdx < getCharsForTier(selectedTier).length - 1}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
}
