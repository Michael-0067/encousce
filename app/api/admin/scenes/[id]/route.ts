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
    "title", "setting", "coreSituation", "emotionalHook", "openingMoment",
    "toneTags", "allowedType1", "allowedType2", "coverImage", "imagePrompt",
    "status", "tier",
  ];
  const data: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) data[key] = body[key] === "" ? null : body[key];
  }

  // allowedType2 empty string → null
  if ("allowedType2" in data && data.allowedType2 === "") data.allowedType2 = null;
  if ("coverImage" in data && data.coverImage === "") data.coverImage = null;
  if ("imagePrompt" in data && data.imagePrompt === "") data.imagePrompt = null;

  const scene = await db.scene.update({ where: { id }, data });
  return NextResponse.json(scene);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  await db.scene.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
