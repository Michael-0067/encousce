"use client";

import Link from "next/link";

interface EncounterItem {
  id: string;
  scene: { title: string };
  character: { name: string };
  lastAccessedAt: string | Date;
}

interface Props {
  encounters: EncounterItem[];
  currentId: string;
}

function timeAgo(date: string | Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function EncounterSidebar({ encounters, currentId }: Props) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-enc-border shrink-0">
        <p className="text-enc-dim text-xs uppercase tracking-wide font-medium">Your Encounters</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {encounters.length === 0 ? (
          <div className="p-4 text-enc-dim text-xs text-center mt-4">
            No other encounters yet.
          </div>
        ) : (
          encounters.map((enc) => (
            <Link
              key={enc.id}
              href={`/encounter/${enc.id}`}
              className={`block px-4 py-3 border-b border-enc-border/50 hover:bg-enc-surface-2 transition-colors ${
                enc.id === currentId ? "bg-enc-surface-2 border-l-2 border-l-enc-plum" : ""
              }`}
            >
              <p className={`text-sm leading-snug truncate ${enc.id === currentId ? "text-enc-cream" : "text-enc-cream-muted"}`}>
                {enc.scene.title}
              </p>
              <p className="text-enc-muted text-xs mt-0.5 truncate">{enc.character.name}</p>
              <p className="text-enc-dim text-[10px] mt-1">{timeAgo(enc.lastAccessedAt)}</p>
            </Link>
          ))
        )}
      </div>

      <div className="p-4 border-t border-enc-border shrink-0">
        <Link
          href="/browse"
          className="block text-center text-enc-muted hover:text-enc-cream text-xs transition-colors"
        >
          ← Browse scenes
        </Link>
      </div>
    </div>
  );
}
