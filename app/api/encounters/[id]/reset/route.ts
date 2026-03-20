import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const { id: encounterId } = await params;

  const encounter = await db.encounter.findUnique({
    where: { id: encounterId },
    include: { scene: true },
  });

  if (!encounter || encounter.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  // Delete all messages
  await db.message.deleteMany({ where: { encounterId } });

  // Re-seed opening moment
  await db.message.create({
    data: {
      encounterId,
      role: "ASSISTANT",
      content: encounter.scene.openingMoment,
      heartCost: 0,
    },
  });

  // Update encounter
  await db.encounter.update({
    where: { id: encounterId },
    data: { status: "ACTIVE", lastAccessedAt: new Date() },
  });

  // Track engagement
  await db.engagementEvent.create({
    data: { userId: session.user.id, eventType: "encounter_reset", encounterId },
  }).catch(() => {});

  return NextResponse.json({ success: true });
}
