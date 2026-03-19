import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export default async function NewEncounterPage({
  searchParams,
}: {
  searchParams: Promise<{ sceneId?: string; characterId?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { sceneId, characterId } = await searchParams;

  if (!sceneId || !characterId) redirect("/browse");

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="enc-card max-w-md w-full text-center space-y-4">
        <div className="text-enc-rose text-3xl">♥</div>
        <h1 className="font-serif text-2xl text-enc-cream">Almost there</h1>
        <p className="text-enc-muted text-sm">
          The encounter engine is coming in the next build. Your scene and lead have been selected.
        </p>
        <Link
          href="/browse"
          className="enc-btn-ghost block"
        >
          ← Back to scenes
        </Link>
      </div>
    </div>
  );
}
