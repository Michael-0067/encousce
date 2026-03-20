import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { db } from "@/lib/prisma";

export default async function NewEncounterPage({
  searchParams,
}: {
  searchParams: Promise<{ sceneId?: string; characterId?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { sceneId, characterId } = await searchParams;
  if (!sceneId || !characterId) redirect("/browse");

  // Verify scene and character exist and are published
  const [scene, character] = await Promise.all([
    db.scene.findUnique({ where: { id: sceneId, status: "PUBLISHED" } }),
    db.character.findUnique({ where: { id: characterId, status: "PUBLISHED" } }),
  ]);

  if (!scene || !character) redirect("/browse");

  // Resume existing active encounter if one exists
  const existing = await db.encounter.findFirst({
    where: { userId: session.user.id, sceneId, characterId, status: "ACTIVE" },
  });

  if (existing) {
    await db.encounter.update({
      where: { id: existing.id },
      data: { lastAccessedAt: new Date() },
    });
    redirect(`/encounter/${existing.id}`);
  }

  // Create new encounter
  const encounter = await db.encounter.create({
    data: { userId: session.user.id, sceneId, characterId, status: "ACTIVE" },
  });

  // Seed opening moment
  await db.message.create({
    data: {
      encounterId: encounter.id,
      role: "ASSISTANT",
      content: scene.openingMoment,
      heartCost: 0,
    },
  });

  // Track engagement
  await db.engagementEvent.create({
    data: {
      userId: session.user.id,
      eventType: "encounter_start",
      encounterId: encounter.id,
      sceneId,
      characterId,
    },
  }).catch(() => {});

  redirect(`/encounter/${encounter.id}`);
}
