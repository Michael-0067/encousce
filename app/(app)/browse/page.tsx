import { db } from "@/lib/prisma";
import SceneBrowse from "@/components/browse/SceneBrowse";

async function getInitialScenes() {
  const scenes = await db.scene.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { clickCount: "desc" },
    include: { author: { select: { username: true } } },
  });

  const parse = (s: { toneTags: string; [key: string]: unknown }) => ({
    ...s,
    toneTags: (() => { try { return JSON.parse(s.toneTags); } catch { return []; } })(),
  });

  return {
    system: scenes.filter((s) => s.tier === "SYSTEM").map(parse),
    featured: scenes.filter((s) => s.tier === "FEATURED").map(parse),
    community: scenes.filter((s) => s.tier === "COMMUNITY").map(parse),
  };
}

export default async function BrowsePage() {
  const initial = await getInitialScenes();
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
