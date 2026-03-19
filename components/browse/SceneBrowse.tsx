"use client";

import { useState, useCallback } from "react";
import SceneCard, { SceneData } from "./SceneCard";
import SceneModal from "./SceneModal";
import ContentRow from "./ContentRow";
import { SETTINGS, SETTING_LABELS } from "@/lib/constants";

interface TieredScenes {
  system: SceneData[];
  featured: SceneData[];
  community: SceneData[];
}

interface Props {
  initial: TieredScenes;
}

export default function SceneBrowse({ initial }: Props) {
  const [scenes, setScenes] = useState<TieredScenes>(initial);
  const [setting, setSetting] = useState("ALL");
  const [sort, setSort] = useState("popular");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<SceneData | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<{ tier: string; index: number } | null>(null);

  const fetchScenes = useCallback(async (newSetting: string, newSort: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ sort: newSort });
      if (newSetting !== "ALL") params.set("setting", newSetting);
      const res = await fetch(`/api/scenes?${params}`);
      const data = await res.json();
      setScenes(data);
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

  function openModal(scene: SceneData, tier: string, index: number) {
    setSelected(scene);
    setSelectedIndex({ tier, index });
  }

  function closeModal() {
    setSelected(null);
    setSelectedIndex(null);
  }

  function navigate(dir: "prev" | "next") {
    if (!selectedIndex) return;
    const tierScenes = scenes[selectedIndex.tier as keyof TieredScenes];
    const newIndex = selectedIndex.index + (dir === "prev" ? -1 : 1);
    if (newIndex < 0 || newIndex >= tierScenes.length) return;
    setSelected(tierScenes[newIndex]);
    setSelectedIndex({ ...selectedIndex, index: newIndex });
  }

  const tiers: Array<{ key: keyof TieredScenes; label: string }> = [
    { key: "system", label: "SYSTEM" },
    { key: "featured", label: "FEATURED" },
    { key: "community", label: "COMMUNITY" },
  ];

  return (
    <>
      {/* filter bar */}
      <div className={`flex items-center gap-2 mb-8 transition-opacity ${loading ? "opacity-50" : ""}`}>
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
      <div className="space-y-10">
        {tiers.map(({ key, label }) => (
          <ContentRow
            key={key}
            tier={label}
            count={scenes[key].length}
            sort={sort}
            onSortChange={handleSortChange}
            empty="No scenes here yet."
          >
            {scenes[key].map((scene, i) => (
              <div
                key={scene.id}
                className="flex-none"
                style={{ width: "calc(33.333% - 0.667rem)" }}
              >
                <SceneCard scene={scene} onClick={(s) => openModal(s, key, i)} />
              </div>
            ))}
          </ContentRow>
        ))}
      </div>

      {selected && selectedIndex && (
        <SceneModal
          scene={selected}
          onClose={closeModal}
          onPrev={() => navigate("prev")}
          onNext={() => navigate("next")}
          hasPrev={selectedIndex.index > 0}
          hasNext={selectedIndex.index < scenes[selectedIndex.tier as keyof TieredScenes].length - 1}
        />
      )}
    </>
  );
}
