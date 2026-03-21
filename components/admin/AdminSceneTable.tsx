"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SceneRow {
  id: string;
  title: string;
  setting: string;
  tier: string;
  status: string;
  author: string;
  clickCount: number;
  createdAt: string;
}

export default function AdminSceneTable({ rows }: { rows: SceneRow[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (confirm !== id) { setConfirm(id); return; }
    setDeleting(id);
    await fetch(`/api/admin/scenes/${id}`, { method: "DELETE" });
    setDeleting(null);
    setConfirm(null);
    router.refresh();
  }

  return (
    <div className="rounded-xl border border-enc-border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-enc-surface border-b border-enc-border">
          <tr>
            <th className="text-left text-enc-dim font-medium px-4 py-3">Title</th>
            <th className="text-left text-enc-dim font-medium px-4 py-3 hidden sm:table-cell">Setting</th>
            <th className="text-left text-enc-dim font-medium px-4 py-3 hidden md:table-cell">Tier</th>
            <th className="text-left text-enc-dim font-medium px-4 py-3 hidden md:table-cell">Status</th>
            <th className="text-left text-enc-dim font-medium px-4 py-3 hidden lg:table-cell">Author</th>
            <th className="text-right text-enc-dim font-medium px-4 py-3 hidden lg:table-cell">Clicks</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-enc-border">
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-enc-surface/30 transition-colors">
              <td className="px-4 py-3 text-enc-cream">{row.title}</td>
              <td className="px-4 py-3 text-enc-muted hidden sm:table-cell capitalize">{row.setting.toLowerCase()}</td>
              <td className="px-4 py-3 hidden md:table-cell">
                <TierBadge tier={row.tier} />
              </td>
              <td className="px-4 py-3 hidden md:table-cell">
                <StatusBadge status={row.status} />
              </td>
              <td className="px-4 py-3 text-enc-dim hidden lg:table-cell">{row.author}</td>
              <td className="px-4 py-3 text-enc-dim text-right hidden lg:table-cell">{row.clickCount}</td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-3">
                  <Link
                    href={`/admin/scenes/${row.id}/edit`}
                    className="text-enc-plum hover:text-enc-plum-light text-xs transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(row.id)}
                    disabled={deleting === row.id}
                    className={`text-xs transition-colors ${
                      confirm === row.id
                        ? "text-enc-rose font-medium"
                        : "text-enc-dim hover:text-enc-rose"
                    }`}
                  >
                    {confirm === row.id ? "Confirm?" : "Delete"}
                  </button>
                  {confirm === row.id && (
                    <button
                      onClick={() => setConfirm(null)}
                      className="text-enc-dim text-xs hover:text-enc-muted transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-enc-dim text-sm">No scenes found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function TierBadge({ tier }: { tier: string }) {
  const colors: Record<string, string> = {
    SYSTEM: "text-enc-rose border-enc-rose/40",
    FEATURED: "text-enc-plum-light border-enc-plum/40",
    COMMUNITY: "text-enc-dim border-enc-dim/40",
  };
  return (
    <span className={`text-[10px] border px-1.5 py-0.5 rounded uppercase tracking-wide ${colors[tier] ?? colors.COMMUNITY}`}>
      {tier}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PUBLISHED: "text-green-400 border-green-400/40",
    DRAFT: "text-enc-dim border-enc-dim/40",
    HIDDEN: "text-yellow-500 border-yellow-500/40",
    ARCHIVED: "text-enc-dim border-enc-dim/20",
  };
  return (
    <span className={`text-[10px] border px-1.5 py-0.5 rounded uppercase tracking-wide ${colors[status] ?? colors.DRAFT}`}>
      {status}
    </span>
  );
}
