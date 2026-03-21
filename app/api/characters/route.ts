import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sceneId = searchParams.get("sceneId");
  const sort = searchParams.get("sort") || "popular";

  let typeFilter: object = {};

  if (sceneId) {
    const scene = await db.scene.findUnique({
      where: { id: sceneId },
      select: { allowedType1: true, allowedType2: true },
    });

    if (scene) {
      const types = [scene.allowedType1, scene.allowedType2].filter(Boolean) as string[];
      typeFilter = { primaryType: { in: types } };
    }
  }

  const where = { status: "PUBLISHED", ...typeFilter };
  const orderBy =
    sort === "recent"
      ? { createdAt: "desc" as const }
      : { selectionCount: "desc" as const };

  const characters = await db.character.findMany({ where, orderBy });

  const system    = characters.filter((c) => c.tier === "SYSTEM");
  const featured  = characters.filter((c) => c.tier === "FEATURED");
  const community = characters.filter((c) => c.tier === "COMMUNITY");

  return NextResponse.json({ system, featured, community });
}
