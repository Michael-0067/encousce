import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const { id } = await params;

  const encounter = await db.encounter.findUnique({
    where: { id },
    include: {
      scene: true,
      character: true,
      messages: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!encounter || encounter.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  // Update lastAccessedAt
  await db.encounter.update({ where: { id }, data: { lastAccessedAt: new Date() } });

  return NextResponse.json({ encounter });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const { id } = await params;

  const encounter = await db.encounter.findUnique({ where: { id } });
  if (!encounter || encounter.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  // Messages cascade-delete via schema onDelete: Cascade
  await db.encounter.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
