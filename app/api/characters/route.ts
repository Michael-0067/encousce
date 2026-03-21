import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sceneId = searchParams.get("sceneId");
  const sort = searchParams.get("sort") || "popular";

  let settingFilter: object = {};

  if (sceneId) {
    const scene = await db.scene.findUnique({
      where: { id: sceneId },
      select: { setting: true },
    });
    if (scene) {
      settingFilter = { setting: scene.setting };
    }
  }

  const where = { status: "PUBLISHED", ...settingFilter };
  const orderBy =
    sort === "recent"
      ? { createdAt: "desc" as const }
      : { selectionCount: "desc" as const };

  const characters = await db.character.findMany({ where, orderBy });

  return NextResponse.json({
    system:    characters.filter((c) => c.tier === "SYSTEM"),
    featured:  characters.filter((c) => c.tier === "FEATURED"),
    community: characters.filter((c) => c.tier === "COMMUNITY"),
  });
}
