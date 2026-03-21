import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import LeadBrowse from "@/components/browse/LeadBrowse";
import { SETTING_LABELS } from "@/lib/constants";

async function getScene(id: string) {
  return db.scene.findUnique({
    where: { id, status: "PUBLISHED" },
    include: { author: { select: { username: true } } },
  });
}

async function getCompatibleCharacters(
  scene: { setting: string },
  userId?: string
) {
  const [characters, yours, favRows] = await Promise.all([
    db.character.findMany({
      where: { status: "PUBLISHED", setting: scene.setting },
      orderBy: { selectionCount: "desc" },
      include: { author: { select: { username: true } } },
    }),
    userId
      ? db.character.findMany({
          where: { authorId: userId, status: { not: "REMOVED" }, setting: scene.setting },
          orderBy: { createdAt: "desc" },
          include: { author: { select: { username: true } } },
        })
      : null,
    userId
      ? db.favoriteCharacter.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          include: { character: { include: { author: { select: { username: true } } } } },
        })
      : null,
  ]);

  const compatibleFavRows = favRows
    ? favRows.filter((r) => r.character.setting === scene.setting)
    : null;

  return {
    yours:     yours ?? null,
    favorites: compatibleFavRows ? compatibleFavRows.map((r) => r.character) : null,
    system:    characters.filter((c) => c.tier === "SYSTEM"),
    featured:  characters.filter((c) => c.tier === "FEATURED"),
    community: characters.filter((c) => c.tier === "COMMUNITY"),
  };
}

export default async function LeadsPage({
  params,
}: {
  params: Promise<{ sceneId: string }>;
}) {
  const { sceneId } = await params;
  const [scene, session] = await Promise.all([getScene(sceneId), getSession()]);
  if (!scene) notFound();

  const characters = await getCompatibleCharacters(scene, session?.user.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 text-enc-dim text-sm mb-8">
        <Link href="/browse" className="hover:text-enc-muted transition-colors">
          Scenes
        </Link>
        <span>›</span>
        <span className="text-enc-muted">{scene.title}</span>
        <span>›</span>
        <span className="text-enc-cream-muted">Choose your lead</span>
      </div>

      <div className="flex gap-4 items-start mb-8 p-4 rounded-xl bg-enc-surface border border-enc-border">
        {scene.coverImage && (
          <img
            src={scene.coverImage}
            alt={scene.title}
            className="w-14 h-20 object-cover rounded-lg shrink-0"
          />
        )}
        <div className="min-w-0">
          <div className="text-enc-muted text-xs mb-1">
            {SETTING_LABELS[scene.setting] ?? scene.setting}
            {scene.subLocation && ` · ${scene.subLocation}`}
          </div>
          <h2 className="font-serif text-xl text-enc-cream mb-1">{scene.title}</h2>
          <p className="text-enc-rose text-sm italic line-clamp-1">{scene.emotionalHook}</p>
        </div>
      </div>

      <div className="mb-6">
        <h1 className="font-serif text-2xl text-enc-cream mb-1">Choose your lead</h1>
        <p className="text-enc-muted text-sm">Who will you encounter in this scene?</p>
      </div>

      <LeadBrowse initial={characters} sceneId={sceneId} sceneTitle={scene.title} />
    </div>
  );
}
