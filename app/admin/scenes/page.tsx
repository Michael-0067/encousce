import { db } from "@/lib/prisma";
import AdminSceneTable from "@/components/admin/AdminSceneTable";

export default async function AdminScenesPage() {
  const scenes = await db.scene.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { username: true } } },
  });

  const rows = scenes.map((s) => ({
    id: s.id,
    title: s.title,
    setting: s.setting,
    tier: s.tier,
    status: s.status,
    author: s.author.username,
    clickCount: s.clickCount,
    createdAt: s.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl text-enc-cream">Scenes</h1>
      <AdminSceneTable rows={rows} />
    </div>
  );
}
