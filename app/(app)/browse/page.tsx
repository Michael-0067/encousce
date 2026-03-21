import { db } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import SceneBrowse from "@/components/browse/SceneBrowse";

function parseToneTags(raw: string): string[] {
  try { return JSON.parse(raw); } catch { return []; }
}

async function getInitialScenes(userId?: string) {
  const [scenes, yours, favRows] = await Promise.all([
    db.scene.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { clickCount: "desc" },
      include: { author: { select: { username: true } } },
    }),
    userId
      ? db.scene.findMany({
          where: { authorId: userId, status: { not: "REMOVED" } },
          orderBy: { createdAt: "desc" },
          include: { author: { select: { username: true } } },
        })
      : null,
    userId
      ? db.favoriteScene.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          include: { scene: { include: { author: { select: { username: true } } } } },
        })
      : null,
  ]);

  type SceneRow = typeof scenes[number];
  const parse = (s: SceneRow) => ({ ...s, toneTags: parseToneTags(s.toneTags) });

  return {
    yours: yours ? yours.map(parse) : null,
    favorites: favRows ? favRows.map((r) => parse(r.scene)) : null,
    system:    scenes.filter((s) => s.tier === "SYSTEM").map(parse),
    featured:  scenes.filter((s) => s.tier === "FEATURED").map(parse),
    community: scenes.filter((s) => s.tier === "COMMUNITY").map(parse),
  };
}

export default async function BrowsePage() {
  const session = await getSession();
  const initial = await getInitialScenes(session?.user.id);
  const total = initial.system.length + initial.featured.length + initial.community.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-enc-cream mb-1">Choose your scene</h1>
        <p className="text-enc-muted text-sm">
          {total === 0
            ? "No scenes published yet. Sign in and create one."
            : "Select a scene to begin your encounter."}
        </p>
      </div>
      <SceneBrowse initial={initial} />
    </div>
  );
}
