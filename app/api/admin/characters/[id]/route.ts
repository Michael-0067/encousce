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
    "name", "primaryType", "secondaryType", "compatibleSettings",
    "corePersonality", "interactionStyle", "dialogueTone", "behaviorRules",
    "portraitImage", "imagePrompt", "status", "tier",
  ];
  const data: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) data[key] = body[key];
  }

  if ("secondaryType" in data && data.secondaryType === "") data.secondaryType = null;
  if ("portraitImage" in data && data.portraitImage === "") data.portraitImage = null;
  if ("imagePrompt" in data && data.imagePrompt === "") data.imagePrompt = null;

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
