import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.user.role !== "ADMIN") return null;
  return session;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();

  const allowed = [
    "name",
    "visualSex", "genderExpression", "raceEthnicity", "apparentAge",
    "build", "presence", "hairStyle", "hairColor", "eyeColor", "distinguishingFeature",
    "primaryType", "secondaryTrait", "corePersonality", "interactionStyle",
    "dialogueTone", "emotionalStartingState", "alwaysBehaviors", "neverBehaviors",
    "generatedPrompt", "imagePrompt", "teaserText", "portraitImage",
    "compatibleSettings", "status", "tier",
  ];
  const data: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) data[key] = body[key];
  }

  const nullableStrings = ["raceEthnicity", "distinguishingFeature", "secondaryTrait", "portraitImage", "imagePrompt", "teaserText", "generatedPrompt"];
  for (const field of nullableStrings) {
    if (field in data && data[field] === "") data[field] = null;
  }

  const character = await db.character.update({ where: { id }, data });
  return NextResponse.json(character);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  await db.character.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
