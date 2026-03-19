import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const scene = await db.scene.findUnique({
    where: { id },
    include: { author: { select: { username: true } } },
  });

  if (!scene || scene.status !== "PUBLISHED") {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  await db.scene.update({ where: { id }, data: { clickCount: { increment: 1 } } }).catch(() => {});

  return NextResponse.json({
    ...scene,
    toneTags: (() => { try { return JSON.parse(scene.toneTags); } catch { return []; } })(),
  });
}
