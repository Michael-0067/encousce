import { db } from "@/lib/prisma";
import AdminCharacterTable from "@/components/admin/AdminCharacterTable";

export default async function AdminCharactersPage() {
  const characters = await db.character.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { username: true } } },
  });

  const rows = characters.map((c) => ({
    id: c.id,
    name: c.name,
    primaryType: c.primaryType,
    secondaryTrait: c.secondaryTrait ?? "",
    tier: c.tier,
    status: c.status,
    author: c.author.username,
    selectionCount: c.selectionCount,
    createdAt: c.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl text-enc-cream">Characters</h1>
      <AdminCharacterTable rows={rows} />
    </div>
  );
}
