import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/session";
import { getUserBalance } from "@/lib/wallet";
import { db } from "@/lib/prisma";
import EncounterScreen from "@/components/encounter/EncounterScreen";

export default async function EncounterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;

  const encounter = await db.encounter.findUnique({
    where: { id },
    include: {
      scene: true,
      character: true,
      messages: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!encounter || encounter.userId !== session.user.id) notFound();

  // Update lastAccessedAt
  await db.encounter.update({ where: { id }, data: { lastAccessedAt: new Date() } });

  // Fetch all user encounters for sidebar
  const encounters = await db.encounter.findMany({
    where: { userId: session.user.id },
    orderBy: { lastAccessedAt: "desc" },
    include: {
      scene: { select: { title: true } },
      character: { select: { name: true } },
    },
    take: 30,
  });

  const balance = await getUserBalance(session.user.id);
  const isAdmin = session.user.role === "ADMIN";

  // Serialize dates for client
  const serialized = {
    ...encounter,
    lastAccessedAt: encounter.lastAccessedAt.toISOString(),
    createdAt: encounter.createdAt.toISOString(),
    updatedAt: encounter.updatedAt.toISOString(),
    messages: encounter.messages.map((m) => ({
      ...m,
      createdAt: m.createdAt.toISOString(),
    })),
  };

  const serializedEncounters = encounters.map((e) => ({
    ...e,
    lastAccessedAt: e.lastAccessedAt.toISOString(),
    createdAt: e.createdAt.toISOString(),
    updatedAt: e.updatedAt.toISOString(),
  }));

  return (
    <div className="h-[calc(100vh-3.5rem)]">
      <EncounterScreen
        encounter={serialized}
        encounters={serializedEncounters}
        balance={balance}
        isAdmin={isAdmin}
      />
    </div>
  );
}
