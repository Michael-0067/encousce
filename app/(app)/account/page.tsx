import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getUserBalance, formatPreciseBalance } from "@/lib/wallet";
import { db } from "@/lib/prisma";

const TYPE_LABELS: Record<string, string> = {
  PURCHASE: "Purchase",
  MESSAGE_SPEND: "Message",
  SPEND: "Spend",
  BONUS: "Bonus",
  ADJUSTMENT: "Adjustment",
  REFUND: "Refund",
  EARNED: "Earned",
};

async function getRecentTransactions(userId: string) {
  return db.ledgerEntry.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 15,
  });
}

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [preciseBalance, transactions] = await Promise.all([
    getUserBalance(session.user.id),
    getRecentTransactions(session.user.id),
  ]);

  // Spendable = floor of precise Decimal balance
  const spendable = preciseBalance.floor().toNumber();
  const user = session.user;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-serif text-3xl text-enc-cream mb-8">Account</h1>

      {/* Profile */}
      <div className="enc-card mb-5">
        <div className="text-enc-muted text-xs mb-4 uppercase tracking-wider">Profile</div>
        <div className="space-y-2.5">
          <div className="flex justify-between text-sm">
            <span className="text-enc-muted">Username</span>
            <span className="text-enc-cream">{user.username}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-enc-muted">Email</span>
            <span className="text-enc-cream">{user.email}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-enc-muted">Member since</span>
            <span className="text-enc-cream">
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
          {user.role === "ADMIN" && (
            <div className="flex justify-between text-sm">
              <span className="text-enc-muted">Role</span>
              <span className="text-enc-dim border border-enc-dim px-2 py-0.5 rounded text-xs">
                admin
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Hearts wallet */}
      <div className="enc-card mb-5">
        <div className="text-enc-muted text-xs mb-4 uppercase tracking-wider">Hearts Wallet</div>
        <div className="flex items-end justify-between mb-5">
          <div>
            <div className="font-serif text-5xl text-enc-rose leading-none mb-1">
              ♥ {spendable.toLocaleString()}
            </div>
            <div className="text-enc-dim text-xs">Spendable Hearts</div>
          </div>
          <div className="text-right">
            <div className="text-enc-muted font-mono text-sm">
              {formatPreciseBalance(preciseBalance)}
            </div>
            <div className="text-enc-dim text-xs mt-0.5">Precise balance</div>
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            href="/account/hearts"
            className="bg-enc-plum hover:bg-enc-plum-light text-enc-cream text-sm font-medium px-5 py-2 rounded-lg transition-colors"
          >
            Buy Hearts
          </Link>
          <button
            disabled
            title="Cash-out coming soon"
            className="text-enc-dim text-sm px-5 py-2 rounded-lg border border-enc-border cursor-not-allowed opacity-50"
          >
            Cash Out
          </button>
        </div>
      </div>

      {/* Transaction history */}
      {transactions.length > 0 ? (
        <div className="enc-card">
          <div className="text-enc-muted text-xs mb-4 uppercase tracking-wider">
            Recent Transactions
          </div>
          <div className="divide-y divide-enc-border">
            {transactions.map((entry) => {
              const amt = entry.amount.toNumber();
              const isCredit = amt >= 0;
              const display = Number.isInteger(amt)
                ? Math.abs(amt).toLocaleString()
                : entry.amount.abs().toFixed(3);

              return (
                <div
                  key={entry.id}
                  className="flex items-center justify-between py-3 text-sm"
                >
                  <div className="min-w-0">
                    <span className="text-enc-muted">
                      {TYPE_LABELS[entry.type] ?? entry.type}
                    </span>
                    {entry.note && (
                      <span className="text-enc-dim text-xs ml-2 truncate">
                        {entry.note}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className={isCredit ? "text-enc-rose font-medium" : "text-enc-dim"}>
                      {isCredit ? "+" : "−"}{display} ♥
                    </span>
                    <span className="text-enc-dim text-xs w-20 text-right">
                      {new Date(entry.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="enc-card text-center py-8">
          <p className="text-enc-muted text-sm">No transactions yet.</p>
          <Link href="/account/hearts" className="enc-link text-sm mt-2 inline-block">
            Buy your first Hearts →
          </Link>
        </div>
      )}
    </div>
  );
}
