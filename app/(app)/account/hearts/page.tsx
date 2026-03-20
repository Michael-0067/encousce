import Link from "next/link";
import { getSession } from "@/lib/session";
import { getSpendableBalance } from "@/lib/wallet";
import BuyHeartsForm from "@/components/account/BuyHeartsForm";

export default async function HeartsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const session = await getSession();
  const balance = session ? await getSpendableBalance(session.user.id) : 0;
  const { success } = await searchParams;

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 text-enc-dim text-sm mb-8">
        <Link href="/account" className="hover:text-enc-muted transition-colors">
          Account
        </Link>
        <span>›</span>
        <span className="text-enc-muted">Buy Hearts</span>
      </div>

      <h1 className="font-serif text-3xl text-enc-cream mb-2">Buy Hearts</h1>
      <p className="text-enc-muted text-sm mb-8">
        Current balance: <span className="text-enc-rose font-medium">♥ {balance.toLocaleString()}</span>
      </p>

      {success && (
        <div className="mb-6 p-4 rounded-xl bg-enc-surface border border-enc-rose/30">
          <p className="text-enc-rose text-sm font-medium">Purchase confirmed.</p>
          <p className="text-enc-muted text-xs mt-1">
            Your Hearts have been added to your wallet. Enjoy your encounters.
          </p>
        </div>
      )}

      <div className="enc-card">
        <BuyHeartsForm />
      </div>
    </div>
  );
}
