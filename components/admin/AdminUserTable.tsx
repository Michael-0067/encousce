"use client";

import { useState } from "react";

interface UserRow {
  id: string;
  username: string;
  email: string;
  role: string;
  status: string;
  encounters: number;
  scenes: number;
  characters: number;
  createdAt: string;
}

export default function AdminUserTable({ rows }: { rows: UserRow[] }) {
  const [saving, setSaving] = useState<string | null>(null);
  const [localRows, setLocalRows] = useState(rows);

  async function handleChange(id: string, field: "role" | "status", value: string) {
    setSaving(id);
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
    setSaving(null);
    if (res.ok) {
      setLocalRows((prev) =>
        prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
      );
    }
  }

  return (
    <div className="rounded-xl border border-enc-border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-enc-surface border-b border-enc-border">
          <tr>
            <th className="text-left text-enc-dim font-medium px-4 py-3">User</th>
            <th className="text-left text-enc-dim font-medium px-4 py-3 hidden sm:table-cell">Email</th>
            <th className="text-left text-enc-dim font-medium px-4 py-3">Role</th>
            <th className="text-left text-enc-dim font-medium px-4 py-3">Status</th>
            <th className="text-right text-enc-dim font-medium px-4 py-3 hidden md:table-cell">Enc</th>
            <th className="text-right text-enc-dim font-medium px-4 py-3 hidden lg:table-cell">Scenes</th>
            <th className="text-right text-enc-dim font-medium px-4 py-3 hidden lg:table-cell">Chars</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-enc-border">
          {localRows.map((row) => (
            <tr key={row.id} className={`transition-colors ${saving === row.id ? "opacity-50" : "hover:bg-enc-surface/30"}`}>
              <td className="px-4 py-3 text-enc-cream">{row.username}</td>
              <td className="px-4 py-3 text-enc-dim hidden sm:table-cell">{row.email}</td>
              <td className="px-4 py-3">
                <select
                  value={row.role}
                  onChange={(e) => handleChange(row.id, "role", e.target.value)}
                  disabled={saving === row.id}
                  className="bg-enc-surface border border-enc-border text-enc-cream text-xs rounded px-2 py-1 focus:outline-none focus:border-enc-plum"
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </td>
              <td className="px-4 py-3">
                <select
                  value={row.status}
                  onChange={(e) => handleChange(row.id, "status", e.target.value)}
                  disabled={saving === row.id}
                  className="bg-enc-surface border border-enc-border text-enc-cream text-xs rounded px-2 py-1 focus:outline-none focus:border-enc-plum"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                  <option value="DISABLED">DISABLED</option>
                </select>
              </td>
              <td className="px-4 py-3 text-enc-dim text-right hidden md:table-cell">{row.encounters}</td>
              <td className="px-4 py-3 text-enc-dim text-right hidden lg:table-cell">{row.scenes}</td>
              <td className="px-4 py-3 text-enc-dim text-right hidden lg:table-cell">{row.characters}</td>
            </tr>
          ))}
          {localRows.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-enc-dim text-sm">No users found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
