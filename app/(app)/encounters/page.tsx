import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { db } from "@/lib/prisma";

export default async function EncountersPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const mostRecent = await db.encounter.findFirst({
    where: { userId: session.user.id },
    orderBy: { lastAccessedAt: "desc" },
  });

  if (mostRecent) {
    redirect(`/encounter/${mostRecent.id}`);
  }

  // No encounters yet — show empty state
  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-24 text-center">
      <p className="font-serif text-2xl text-enc-cream mb-3">No encounters yet.</p>
      <p className="text-enc-muted text-sm mb-8">
        Choose a scene and a lead to begin your first moment.
      </p>
      <Link
        href="/browse"
        className="bg-enc-plum hover:bg-enc-plum-light text-enc-cream text-sm font-medium px-6 py-3 rounded-xl transition-colors"
      >
        Browse scenes
      </Link>
    </div>
  );
}
