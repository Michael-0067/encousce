import Link from "next/link";
import { db } from "@/lib/prisma";

export default async function AdminDashboard() {
  const [sceneCount, characterCount, userCount, encounterCount] = await Promise.all([
    db.scene.count(),
    db.character.count(),
    db.user.count(),
    db.encounter.count(),
  ]);

  const stats = [
    { label: "Scenes", count: sceneCount, href: "/admin/scenes" },
    { label: "Characters", count: characterCount, href: "/admin/characters" },
    { label: "Users", count: userCount, href: "/admin/users" },
    { label: "Encounters", count: encounterCount, href: null },
  ];

  return (
    <div className="space-y-8">
      <h1 className="font-serif text-2xl text-enc-cream">Dashboard</h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map(({ label, count, href }) => (
          <div key={label} className="rounded-xl border border-enc-border bg-enc-surface/40 p-6">
            <p className="text-enc-dim text-xs uppercase tracking-wide mb-2">{label}</p>
            <p className="text-enc-cream text-3xl font-light tabular-nums">{count.toLocaleString()}</p>
            {href && (
              <Link href={href} className="text-enc-plum text-xs hover:text-enc-plum-light transition-colors mt-3 inline-block">
                Manage →
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
