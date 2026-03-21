import { db } from "@/lib/prisma";
import AdminUserTable from "@/components/admin/AdminUserTable";

export default async function AdminUsersPage() {
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      _count: { select: { encounters: true, scenes: true, characters: true } },
    },
  });

  const rows = users.map((u) => ({
    id: u.id,
    username: u.username,
    email: u.email,
    role: u.role,
    status: u.status,
    encounters: u._count.encounters,
    scenes: u._count.scenes,
    characters: u._count.characters,
    createdAt: u.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl text-enc-cream">Users</h1>
      <AdminUserTable rows={rows} />
    </div>
  );
}
