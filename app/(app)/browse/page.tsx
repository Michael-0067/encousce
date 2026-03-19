import { getSession } from "@/lib/session";

export default async function BrowsePage() {
  const session = await getSession();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <h1 className="font-serif text-3xl text-enc-cream mb-2">
          Choose your scene
        </h1>
        <p className="text-enc-muted">
          Welcome, {session?.user.username}. Where would you like to begin?
        </p>
      </div>

      <div className="rounded-xl border border-enc-border bg-enc-surface p-12 text-center">
        <p className="text-enc-dim text-sm">Scenes coming in the next build.</p>
      </div>
    </div>
  );
}
