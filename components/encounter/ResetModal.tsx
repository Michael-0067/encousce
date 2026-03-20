"use client";

interface Props {
  characterName: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

export default function ResetModal({ characterName, onConfirm, onCancel, loading }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-enc-surface border border-enc-border rounded-2xl p-8 max-w-sm w-full space-y-4 text-center">
        <h2 className="font-serif text-xl text-enc-cream">Reset this encounter?</h2>
        <p className="text-enc-muted text-sm leading-relaxed">
          Your conversation with {characterName} will be cleared and the scene will restart from the beginning.
        </p>
        <div className="flex gap-3 pt-2">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 border border-enc-border hover:border-enc-plum text-enc-muted hover:text-enc-cream py-2.5 rounded-lg transition-colors text-sm disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-enc-rose-muted hover:bg-enc-rose text-enc-cream py-2.5 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
          >
            {loading ? "Resetting…" : "Reset"}
          </button>
        </div>
      </div>
    </div>
  );
}
