"use client";

import { useState } from "react";

interface Props {
  sceneName: string;
  characterName: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

export default function DeleteModal({
  sceneName,
  characterName,
  onConfirm,
  onCancel,
  loading,
}: Props) {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-enc-surface border border-enc-border rounded-2xl p-8 max-w-sm w-full space-y-5">
        <div className="text-center">
          <h2 className="font-serif text-xl text-enc-cream mb-2">Delete this encounter?</h2>
          <p className="text-enc-muted text-sm leading-relaxed">
            Your encounter in{" "}
            <span className="text-enc-cream italic">{sceneName}</span> with{" "}
            <span className="text-enc-cream italic">{characterName}</span> and all
            messages within it will be permanently deleted. This cannot be undone.
          </p>
        </div>

        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-0.5 accent-enc-rose shrink-0 w-4 h-4 cursor-pointer"
          />
          <span className="text-enc-muted text-sm leading-snug group-hover:text-enc-cream transition-colors">
            I understand this encounter will be permanently deleted
          </span>
        </label>

        <div className="flex gap-3 pt-1">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 border border-enc-border hover:border-enc-plum text-enc-muted hover:text-enc-cream py-2.5 rounded-lg transition-colors text-sm disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!confirmed || loading}
            className="flex-1 bg-enc-rose-muted hover:bg-enc-rose text-enc-cream py-2.5 rounded-lg transition-colors text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
