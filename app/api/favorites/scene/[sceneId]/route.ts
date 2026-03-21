import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ sceneId: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const { sceneId } = await params;
  const userId = session.user.id;

  const existing = await db.favoriteScene.findUnique({
    where: { userId_sceneId: { userId, sceneId } },
  });

  if (existing) {
    await db.favoriteScene.delete({ where: { userId_sceneId: { userId, sceneId } } });
    return NextResponse.json({ favorited: false });
  } else {
    await db.favoriteScene.create({ data: { userId, sceneId } });
    return NextResponse.json({ favorited: true });
  }
}
