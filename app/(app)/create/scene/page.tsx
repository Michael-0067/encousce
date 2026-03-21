import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { getSpendableBalance } from "@/lib/wallet";
import SceneCreatorForm from "@/components/create/SceneCreatorForm";

export default async function CreateScenePage() {
  const session = await getSession();
  if (!session) redirect("/sign-in");

  const balance = await getSpendableBalance(session.user.id);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 text-enc-dim text-sm mb-8">
        <Link href="/browse" className="hover:text-enc-muted transition-colors">Browse</Link>
        <span>›</span>
        <span className="text-enc-cream-muted">Create Scene</span>
      </div>

      <h1 className="font-serif text-3xl text-enc-cream mb-2">Create a Scene</h1>
      <p className="text-enc-muted text-sm mb-10">
        Set the moment. Others will step into it.
      </p>

      <SceneCreatorForm balance={balance} />
    </div>
  );
}
