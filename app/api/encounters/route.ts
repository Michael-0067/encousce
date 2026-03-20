import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getSession } from "@/lib/session";

// GET /api/encounters — list user's encounters
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const encounters = await db.encounter.findMany({
    where: { userId: session.user.id },
    orderBy: { lastAccessedAt: "desc" },
    include: {
      scene: { select: { id: true, title: true, coverImage: true } },
      character: { select: { id: true, name: true, primaryType: true } },
    },
  });

  return NextResponse.json({ encounters });
}

// POST /api/encounters — create or resume encounter
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const { sceneId, characterId } = await req.json();
  if (!sceneId || !characterId) {
    return NextResponse.json({ error: "sceneId and characterId are required." }, { status: 400 });
  }

  // Check for existing active encounter with same scene+character
  const existing = await db.encounter.findFirst({
    where: { userId: session.user.id, sceneId, characterId, status: "ACTIVE" },
  });

  if (existing) {
    await db.encounter.update({
      where: { id: existing.id },
      data: { lastAccessedAt: new Date() },
    });
    return NextResponse.json({ encounterId: existing.id });
  }

  // Fetch scene for opening moment
  const scene = await db.scene.findUnique({ where: { id: sceneId } });
  if (!scene) return NextResponse.json({ error: "Scene not found." }, { status: 404 });

  // Create new encounter
  const encounter = await db.encounter.create({
    data: { userId: session.user.id, sceneId, characterId, status: "ACTIVE" },
  });

  // Seed opening moment as first assistant message
  await db.message.create({
    data: {
      encounterId: encounter.id,
      role: "ASSISTANT",
      content: scene.openingMoment,
      heartCost: 0,
    },
  });

  return NextResponse.json({ encounterId: encounter.id });
}
