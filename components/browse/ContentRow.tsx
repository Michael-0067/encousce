"use client";

import { useRef } from "react";
import { TIER_LABELS } from "@/lib/constants";

interface Props {
  tier: string;
  count: number;
  sort: string;
  onSortChange: (sort: string) => void;
  children: React.ReactNode;
  empty?: string;
}

export default function ContentRow({ tier, count, sort, onSortChange, children, empty }: Props) {
  const rowRef = useRef<HTMLDivElement>(null);

  function scroll(dir: "left" | "right") {
    if (!rowRef.current) return;
    const cardWidth = rowRef.current.offsetWidth / 3;
    rowRef.current.scrollBy({ left: dir === "left" ? -cardWidth : cardWidth, behavior: "smooth" });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-enc-cream-muted text-sm font-medium tracking-wide uppercase">
            {TIER_LABELS[tier] || tier}
          </h2>
          {count > 0 && (
            <span className="text-enc-dim text-xs">{count}</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex text-xs gap-2">
            <button
              onClick={() => onSortChange("popular")}
              className={`transition-colors ${sort === "popular" ? "text-enc-cream" : "text-enc-dim hover:text-enc-muted"}`}
            >
              Popular
            </button>
            <span className="text-enc-dim">·</span>
            <button
              onClick={() => onSortChange("recent")}
              className={`transition-colors ${sort === "recent" ? "text-enc-cream" : "text-enc-dim hover:text-enc-muted"}`}
            >
              Recent
            </button>
          </div>
          {count > 3 && (
            <div className="flex gap-1">
              <button
                onClick={() => scroll("left")}
                className="w-6 h-6 flex items-center justify-center text-enc-muted hover:text-enc-cream border border-enc-border hover:border-enc-plum rounded transition-colors text-xs"
              >
                ‹
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-6 h-6 flex items-center justify-center text-enc-muted hover:text-enc-cream border border-enc-border hover:border-enc-plum rounded transition-colors text-xs"
              >
                ›
              </button>
            </div>
          )}
        </div>
      </div>

      {count === 0 ? (
        <div className="rounded-xl border border-enc-border bg-enc-surface/40 py-8 text-center">
          <p className="text-enc-dim text-sm">{empty || "Nothing here yet."}</p>
        </div>
      ) : (
        <div
          ref={rowRef}
          className="flex gap-4 overflow-x-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
