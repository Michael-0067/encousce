"use client";

import { useState, useCallback } from "react";
import SceneCard, { SceneData } from "./SceneCard";
import SceneModal from "./SceneModal";
import ContentRow from "./ContentRow";
import { SETTINGS, SETTING_LABELS } from "@/lib/constants";

interface AllScenes {
  yours:     SceneData[] | null;  // null = not logged in
  favorites: SceneData[] | null;  // null = not logged in
  system:    SceneData[];
  featured:  SceneData[];
  community: SceneData[];
}

interface Props {
  initial: AllScenes;
}

type TierKey = "yours" | "favorites" | "system" | "featured" | "community";

export default function SceneBrowse({ initial }: Props) {
  const [tiered, setTiered] = useState({
    system:    initial.system,
    featured:  initial.featured,
    community: initial.community,
  });
  const [favoriteScenes, setFavoriteScenes] = useState<SceneData[]>(initial.favorites ?? []);
  const [setting, setSetting] = useState("ALL");
  const [sort, setSort]       = useState("popular");
  const [loading, setLoading] = useState(false);

  const [selected, setSelected]       = useState<SceneData | null>(null);
  const [selectedTier, setSelectedTier] = useState<TierKey | null>(null);
  const [selectedIdx, setSelectedIdx]   = useState<number | null>(null);

  const isLoggedIn = initial.favorites !== null;
  const favoriteIds = new Set(favoriteScenes.map((s) => s.id));

  const fetchScenes = useCallback(async (newSetting: string, newSort: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ sort: newSort });
      if (newSetting !== "ALL") params.set("setting", newSetting);
      const res = await fetch(`/api/scenes?${params}`);
      const data = await res.json();
      setTiered(data);
    } finally {
      setLoading(false);
    }
  }, []);

  function handleSettingChange(s: string) {
    setSetting(s);
    fetchScenes(s, sort);
  }

  function handleSortChange(newSort: string) {
    setSort(newSort);
    fetchScenes(setting, newSort);
  }

  async function handleToggleFavorite(scene: SceneData) {
    const wasFavorited = favoriteIds.has(scene.id);
    setFavoriteScenes((prev) =>
      wasFavorited ? prev.filter((s) => s.id !== scene.id) : [scene, ...prev]
    );
    try {
      const res = await fetch(`/api/favorites/scene/${scene.id}`, { method: "POST" });
      if (!res.ok) throw new Error();
    } catch {
      // Revert on failure
      setFavoriteScenes((prev) =>
        wasFavorited ? [scene, ...prev] : prev.filter((s) => s.id !== scene.id)
      );
    }
  }

  function getScenesForTier(key: TierKey): SceneData[] {
    if (key === "yours")
      return (initial.yours ?? []).filter((s) => setting === "ALL" || s.setting === setting);
    if (key === "favorites")
      return favoriteScenes.filter((s) => setting === "ALL" || s.setting === setting);
    return tiered[key];
  }

  function openModal(scene: SceneData, tier: TierKey, index: number) {
    setSelected(scene);
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
    const arr = getScenesForTier(selectedTier);
    const newIdx = selectedIdx + (dir === "prev" ? -1 : 1);
    if (newIdx < 0 || newIdx >= arr.length) return;
    setSelected(arr[newIdx]);
    setSelectedIdx(newIdx);
  }

  // Personal rows: only shown when logged in and non-empty
  const personalRows: Array<{ key: TierKey; label: string }> = [];
  if (isLoggedIn) {
    if (getScenesForTier("yours").length > 0)
      personalRows.push({ key: "yours", label: "Your Scenes" });
    if (getScenesForTier("favorites").length > 0)
      personalRows.push({ key: "favorites", label: "Favorites" });
  }

  const mainRows: Array<{ key: TierKey; label: string }> = [
    { key: "system",    label: "SYSTEM" },
    { key: "featured",  label: "FEATURED" },
    { key: "community", label: "COMMUNITY" },
  ];

  const allRows = [...personalRows, ...mainRows];

  return (
    <>
      {/* filter bar */}
      <div className={`flex items-center gap-2 mb-8 flex-wrap transition-opacity ${loading ? "opacity-50" : ""}`}>
        <button
          onClick={() => handleSettingChange("ALL")}
          className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
            setting === "ALL"
              ? "bg-enc-plum text-enc-cream"
              : "text-enc-muted hover:text-enc-cream border border-enc-border hover:border-enc-plum"
          }`}
        >
          All
        </button>
        {SETTINGS.map((s) => (
          <button
            key={s}
            onClick={() => handleSettingChange(s)}
            className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
              setting === s
                ? "bg-enc-plum text-enc-cream"
                : "text-enc-muted hover:text-enc-cream border border-enc-border hover:border-enc-plum"
            }`}
          >
            {SETTING_LABELS[s]}
          </button>
        ))}
      </div>

      {/* rows */}
      <div className="space-y-6">
        {allRows.map(({ key, label }) => {
          const data = getScenesForTier(key);
          const isPersonal = key === "yours" || key === "favorites";
          return (
            <ContentRow
              key={key}
              tier={label}
              count={data.length}
              sort={sort}
              onSortChange={handleSortChange}
              hideSort={isPersonal}
              empty={key === "yours" ? "No scenes yet." : "No favorites yet."}
            >
              {data.map((scene, i) => (
                <div
                  key={scene.id}
                  className="flex-none"
                  style={{ width: "160px" }}
                >
                  <SceneCard
                    scene={scene}
                    onClick={(s) => openModal(s, key, i)}
                    isFavorited={favoriteIds.has(scene.id)}
                    onToggleFavorite={isLoggedIn ? handleToggleFavorite : undefined}
                  />
                </div>
              ))}
            </ContentRow>
          );
        })}
      </div>

      {selected && selectedTier && selectedIdx !== null && (
        <SceneModal
          scene={selected}
          onClose={closeModal}
          onPrev={() => navigate("prev")}
          onNext={() => navigate("next")}
          hasPrev={selectedIdx > 0}
          hasNext={selectedIdx < getScenesForTier(selectedTier).length - 1}
        />
      )}
    </>
  );
}
