import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const setting = searchParams.get("setting");
  const sort = searchParams.get("sort") || "popular";

  const where = {
    status: "PUBLISHED",
    ...(setting && setting !== "ALL" ? { setting } : {}),
  };

  const orderBy =
    sort === "recent"
      ? { createdAt: "desc" as const }
      : { clickCount: "desc" as const };

  const scenes = await db.scene.findMany({
    where,
    orderBy,
    include: { author: { select: { username: true } } },
  });

  const parse = (s: { toneTags: string; [key: string]: unknown }) => ({
    ...s,
    toneTags: (() => { try { return JSON.parse(s.toneTags); } catch { return []; } })(),
  });

  const system = scenes.filter((s) => s.tier === "SYSTEM").map(parse);
  const featured = scenes.filter((s) => s.tier === "FEATURED").map(parse);
  const community = scenes.filter((s) => s.tier === "COMMUNITY").map(parse);

  return NextResponse.json({ system, featured, community });
}
