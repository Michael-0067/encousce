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
      typeFilter = {
        OR: [
          { primaryType: { in: types } },
          { secondaryType: { in: types } },
        ],
      };
    }
  }

  const where = { status: "PUBLISHED", ...typeFilter };
  const orderBy =
    sort === "recent"
      ? { createdAt: "desc" as const }
      : { selectionCount: "desc" as const };

  const characters = await db.character.findMany({
    where,
    orderBy,
    include: { author: { select: { username: true } } },
  });

  const parse = (c: { compatibleSettings: string; [key: string]: unknown }) => ({
    ...c,
    compatibleSettings: (() => { try { return JSON.parse(c.compatibleSettings); } catch { return []; } })(),
  });

  const system = characters.filter((c) => c.tier === "SYSTEM").map(parse);
  const featured = characters.filter((c) => c.tier === "FEATURED").map(parse);
  const community = characters.filter((c) => c.tier === "COMMUNITY").map(parse);

  return NextResponse.json({ system, featured, community });
}
